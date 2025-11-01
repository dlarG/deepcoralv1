from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
from utils.auth_utils import login_required, rate_limit
import requests
from config import Config
from flask_cors import cross_origin
import secrets
from routes.activity_log import (
    log_login, log_logout, log_user_registration, log_system_action, ActivityLogger
)
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register_user():
    data = request.get_json()
    secret = Config.RECAPTCHA_SECRET
    if not data:
        return jsonify({"error": "No data provided"}), 400
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    roletype = 'guest'  # Default role type
    status = 'pending'
    captcha_response = data.get('captcha')
    
    # Validate reCAPTCHA
    if not captcha_response:
        return jsonify({"error": "Captcha verification failed"}), 400
    # Validate password strength
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    
    if not all([username, password, firstname, lastname]):
        return jsonify({"error": "Missing all fields are required"}), 400
    
    # Verify reCAPTCHA
    captcha_verify_url = "https://www.google.com/recaptcha/api/siteverify"
    response = requests.post(
        captcha_verify_url,
        data={
            "secret": secret,
            "response": captcha_response
        }
    )
    result = response.json()
    if not result.get("success"):
        return jsonify({"error": "Failed captcha verification"}), 400

    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cur = conn.cursor()
        password_hashed = generate_password_hash(password)
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            return jsonify({"error": "Username already exists"}), 400
        
        cur.execute(
            "INSERT INTO users (username, password, firstname, lastname, roletype, status) VALUES (%s, %s, %s, %s, %s, %s)",
            (username, password_hashed, firstname, lastname, roletype, status)
        )
        conn.commit()

        log_user_registration(username)
        log_system_action(
            user_id=None,  # No user_id yet
            action='user_registration_attempt',
            description=f"New user registration: {firstname} {lastname} (@{username})",
            details={
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'roletype': roletype,
                'status': status,
                'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
            }
        )

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        conn.rollback()
        log_system_action(
            user_id=None,
            action='registration_failed',
            description=f"Registration failed for username: {username}",
            details={'error': str(e), 'username': username}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cur' in locals():
            cur.close()
        # if conn:
            conn.close()


@auth_bp.route('/logout', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def logout():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    user_id = session.get('user_id')
    username = session.get('username', 'Unknown')
    roletype = session.get('roletype', 'Unknown')
    
    try:
        if user_id and username:
            log_logout(user_id, username)
            
            log_system_action(
                user_id=user_id,
                action='successful_logout',
                description=f"User {username} logged out",
                details={
                    'username': username,
                    'roletype': roletype,
                    'session_duration': None,
                    'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR')),
                    'user_agent': request.headers.get('User-Agent', '')
                }
            )
        
        new_csrf = secrets.token_hex(32)
        
        session.clear()
        session['csrf_token'] = new_csrf
        
        response = jsonify({
            'message': 'Logout successful',
            'csrf_token': new_csrf
        })
        
        response.set_cookie(
            'session', 
            '', 
            expires=0,
            httponly=True,
            secure=current_app.config.get('SESSION_COOKIE_SECURE', False),
            samesite='Lax'
        )
        
        return response, 200
        
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='logout_error',
            description=f"Error during logout for user: {username}",
            details={
                'error': str(e),
                'username': username,
                'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
            }
        )
        
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500
    

@auth_bp.route('/csrf-token', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_csrf_token():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(32)
    
    return jsonify({'csrf_token': session['csrf_token']})


@auth_bp.route('/check-auth', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def check_auth():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    if 'user_id' not in session:
        return jsonify({'authenticated': False}), 200
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, bio, profile_image, created_at, status, last_login 
                FROM users WHERE id = %s
            """, (session['user_id'],))
            user = cur.fetchone()
            
            if not user:
                log_system_action(
                    user_id=session.get('user_id'),
                    action='invalid_session_check',
                    description=f"Auth check failed - user not found for session user_id: {session.get('user_id')}",
                    details={'session_user_id': session.get('user_id')}
                )
                return jsonify({'authenticated': False}), 200
                
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'bio': user[5] if user[5] else "",
                    'profile_image': user[6],
                    'created_at': user[7].isoformat() if user[7] else None,
                    'status': user[8],
                    'last_login': user[9].isoformat() if user[9] else None
                }
            }), 200
            
    except Exception as e:
        log_system_action(
            user_id=session.get('user_id'),
            action='auth_check_error',
            description=f"Error during authentication check",
            details={
                'error': str(e),
                'session_user_id': session.get('user_id')
            }
        )
        
        current_app.logger.error(f"Check auth error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()


@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@rate_limit(6)
def login_user():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    username = data.get('username')
    password = data.get('password')
    
    if not all([username, password]):
        return jsonify({'error': 'Username and password are required'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:  
            cur.execute("""
                SELECT id, username, password, firstname, lastname, roletype, bio, profile_image, created_at, status, last_login 
                FROM users WHERE username = %s
            """, (username,))
            user = cur.fetchone()
            
            if not user:
                log_system_action(
                    user_id=None,
                    action='login_failed',
                    description=f"Login attempt with non-existent username: {username}",
                    details={
                        'username': username,
                        'reason': 'user_not_found',
                        'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                    }
                )
                return jsonify({'error': 'Invalid credentials'}), 401
            
            if not check_password_hash(user[2], password):
                log_system_action(
                    user_id=user[0],
                    action='login_failed',
                    description=f"Failed login attempt for user: {username}",
                    details={
                        'username': username,
                        'reason': 'invalid_password',
                        'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                    }
                )
                return jsonify({'error': 'Invalid credentials'}), 401
            
            if user[9] == 'pending':
                log_system_action(
                    user_id=user[0],
                    action='login_attempt_pending',
                    description=f"Login attempt by pending user: {username}",
                    details={
                        'username': username,
                        'status': 'pending',
                        'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                    }
                )
                return jsonify({'error': 'Account is pending approval. Wait for the admin to validate your joining request.'}), 403

            if user[9] == 'rejected':
                log_system_action(
                    user_id=user[0],
                    action='login_attempt_rejected',
                    description=f"Login attempt by rejected user: {username}",
                    details={
                        'username': username,
                        'status': 'rejected',
                        'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                    }
                )
                return jsonify({'error': 'Account has been rejected. Please contact administrator.'}), 403

            current_time = datetime.now()
            cur.execute("""
                UPDATE users 
                SET last_login = %s 
                WHERE id = %s
            """, (current_time, user[0]))
            conn.commit()

            session['csrf_token'] = secrets.token_hex(32)
            session['user_id'] = user[0]
            session['roletype'] = user[5]
            session['username'] = user[1]
            
            log_login(user[0], username)
            
            log_system_action(
                user_id=user[0],
                action='successful_login',
                description=f"User {username} successfully logged in",
                details={
                    'username': username,
                    'roletype': user[5],
                    'previous_login': user[10].isoformat() if user[10] else None,
                    'current_login': current_time.isoformat(),
                    'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR')),
                    'user_agent': request.headers.get('User-Agent', '')
                }
            )
            
            user_data = {
                'id': user[0],
                'username': user[1],
                'firstname': user[3],
                'lastname': user[4],
                'roletype': user[5],
                'bio': user[6] if user[6] else "",
                'profile_image': user[7],
                'created_at': user[8].isoformat() if user[8] else None,
                'status': user[9],
                'last_login': current_time.isoformat(),
                'redirect_to': f'/{user[5].lower()}-dashboard'
            }
            
            return jsonify({
                'message': 'Login successful',
                'user': user_data,
                'csrf_token': session['csrf_token'],
                'redirect_to': user_data['redirect_to']
            }), 200
            
    except Exception as e:
        log_system_action(
            user_id=session.get('user_id', None),
            action='login_system_error',
            description=f"System error during login attempt for: {username}",
            details={
                'error': str(e),
                'username': username,
                'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
            }
        )
        
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
        
    finally:
        if 'conn' in locals():
            conn.close()

@auth_bp.route('/auth/login-stats', methods=['GET'])
@login_required
def get_login_stats():
    """Get login statistics for the current user"""
    user_id = session.get('user_id')
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get user's login activity
            cur.execute("""
                SELECT 
                    COUNT(*) FILTER (WHERE activity_type = 'login') as total_logins,
                    COUNT(*) FILTER (WHERE activity_type = 'login' AND created_at >= NOW() - INTERVAL '30 days') as logins_last_30_days,
                    COUNT(*) FILTER (WHERE activity_type = 'login_failed') as failed_attempts,
                    MAX(created_at) FILTER (WHERE activity_type = 'login') as last_successful_login
                FROM activities 
                WHERE user_id = %s AND category = 'authentication'
            """, (user_id,))
            
            stats = cur.fetchone()
            
            # Get user's current last_login from users table
            cur.execute("SELECT last_login FROM users WHERE id = %s", (user_id,))
            user_data = cur.fetchone()
            
            # Log the stats request
            log_system_action(
                user_id=user_id,
                action='login_stats_viewed',
                description="User viewed their login statistics",
                details={'stats_requested': True}
            )
            
            return jsonify({
                "login_stats": {
                    'total_logins': stats[0] or 0,
                    'logins_last_30_days': stats[1] or 0,
                    'failed_attempts': stats[2] or 0,
                    'last_successful_login': stats[3].isoformat() if stats[3] else None,
                    'current_last_login': user_data[0].isoformat() if user_data[0] else None
                }
            })
            
    except Exception as e:
        log_system_action(
            user_id=user_id,
            action='login_stats_error',
            description="Error retrieving login statistics",
            details={'error': str(e)}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()