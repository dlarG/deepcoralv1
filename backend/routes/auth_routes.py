from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
from utils.auth_utils import login_required, rate_limit
import requests
from config import Config
from flask_cors import cross_origin
import secrets
import random
import string
from datetime import datetime, timedelta
from utils.email_service import email_service
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
    email = data.get('email')  # Add this
    roletype = 'guest'
    status = 'pending'
    captcha_response = data.get('captcha')
    
    # Validate reCAPTCHA
    if not captcha_response:
        return jsonify({"error": "Captcha verification failed"}), 400
    
    # Validate password strength
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    
    # Update validation to include email
    if not all([username, password, firstname, lastname, email]):
        return jsonify({"error": "All fields are required"}), 400
    
    # Validate email format
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({"error": "Please enter a valid email address"}), 400
    
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
        
        # Check for existing username
        cur.execute("SELECT * FROM users WHERE username = %s", (username,))
        if cur.fetchone():
            return jsonify({"error": "Username already exists"}), 400
        
        # Check for existing email
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            return jsonify({"error": "Email address already registered"}), 400
        
        # Insert new user with email
        cur.execute(
            "INSERT INTO users (username, password, firstname, lastname, email, roletype, status) VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (username, password_hashed, firstname, lastname, email, roletype, status)
        )
        
        new_user_id = cur.fetchone()[0]
        conn.commit()

        # Log user registration
        log_user_registration(username)
        log_system_action(
            user_id=None,
            action='user_registration_attempt',
            description=f"New user registration: {firstname} {lastname} (@{username})",
            details={
                'username': username,
                'firstname': firstname,
                'lastname': lastname,
                'email': email,
                'roletype': roletype,
                'status': status,
                'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
            }
        )

        # Send email notification to admins
        try:
            from utils.email_service import email_service
            from utils.admin_utils import get_admin_emails
            
            admin_emails = get_admin_emails()
            
            # If no admin emails in database, use fallback from environment
            if not admin_emails:
                fallback_email = current_app.config.get('ADMIN_NOTIFICATION_EMAIL')
                if fallback_email:
                    admin_emails = [fallback_email]
            
            if admin_emails:
                user_data = {
                    'firstname': firstname,
                    'lastname': lastname,
                    'username': username,
                    'email': email,
                    'roletype': roletype,
                    'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                }
                
                email_sent = email_service.send_new_user_registration_notification(user_data, admin_emails)
                
                log_system_action(
                    user_id=new_user_id,
                    action='admin_notification_sent' if email_sent else 'admin_notification_failed',
                    description=f"Admin notification email {'sent' if email_sent else 'failed'} for new user registration",
                    details={
                        'admin_emails': admin_emails,
                        'user_data': user_data,
                        'email_sent': email_sent
                    }
                )
            else:
                log_system_action(
                    user_id=new_user_id,
                    action='admin_notification_skipped',
                    description="No admin emails configured for notification",
                    details={'reason': 'no_admin_emails'}
                )
                
        except Exception as email_error:
            log_system_action(
                user_id=new_user_id,
                action='admin_notification_error',
                description=f"Error sending admin notification email",
                details={'error': str(email_error)}
            )
            current_app.logger.error(f"Email notification error: {str(email_error)}")
            # Don't fail the registration if email fails

        return jsonify({"message": "User registered successfully! Please wait for admin approval."}), 201
        
    except Exception as e:
        conn.rollback()
        log_system_action(
            user_id=None,
            action='registration_failed',
            description=f"Registration failed for username: {username}",
            details={'error': str(e), 'username': username, 'email': email}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cur' in locals():
            cur.close()
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
                SELECT id, username, firstname, lastname, roletype, bio, profile_image, created_at, status, last_login, institution, email, phone 
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
                    'last_login': user[9].isoformat() if user[9] else None,
                    'institution': user[10],
                    'email': user[11],  # Make sure email is included here
                    'phone': user[12]
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
            # Add email to the SELECT query
            cur.execute("""
                SELECT id, username, password, firstname, lastname, roletype, bio, profile_image, created_at, status, last_login, email
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
            
            if user[9] == 'pending':  # status is now at index 9
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

            if user[9] == 'rejected':  # status is now at index 9
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
                'email': user[11],  # Add email here
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

@auth_bp.route('/forgot-password', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@rate_limit(3)  # Limit to 3 attempts per minute
def forgot_password():
    """Initiate password reset process"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    email = data.get('email', '').lower().strip()
    
    if not email:
        return jsonify({'error': 'Email address is required'}), 400
        
    # Validate email format
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        return jsonify({'error': 'Please enter a valid email address'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("""
                SELECT id, username, firstname, lastname, email, status 
                FROM users WHERE email = %s
            """, (email,))
            user = cur.fetchone()
            
            if not user:
                # Log failed attempt but don't reveal if email exists
                log_system_action(
                    user_id=None,
                    action='password_reset_failed',
                    description=f"Password reset attempted for non-existent email",
                    details={
                        'email': email,
                        'reason': 'email_not_found',
                        'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                    }
                )
                # Return success message to prevent email enumeration
                return jsonify({
                    'message': 'If an account with this email exists, you will receive a password reset code shortly.'
                }), 200
            
            # Check account status
            if user[5] != 'approved':
                log_system_action(
                    user_id=user[0],
                    action='password_reset_blocked',
                    description=f"Password reset blocked for non-approved account",
                    details={
                        'email': email,
                        'username': user[1],
                        'status': user[5],
                        'reason': 'account_not_approved'
                    }
                )
                return jsonify({
                    'error': 'Password reset is not available for pending or rejected accounts. Please contact support.'
                }), 403
            
            # Check for existing recent reset requests
            cur.execute("""
                SELECT COUNT(*) FROM password_reset_tokens 
                WHERE user_id = %s 
                AND created_at > NOW() - INTERVAL '5 minutes' 
                AND is_used = FALSE
            """, (user[0],))
            
            recent_requests = cur.fetchone()[0]
            if recent_requests > 0:
                log_system_action(
                    user_id=user[0],
                    action='password_reset_rate_limited',
                    description=f"Password reset rate limited",
                    details={
                        'email': email,
                        'username': user[1],
                        'recent_requests': recent_requests
                    }
                )
                return jsonify({
                    'error': 'A password reset code was already sent recently. Please wait 5 minutes before requesting another.'
                }), 429
            
            # Generate OTP and token
            otp_code = ''.join(random.choices(string.digits, k=6))
            reset_token = secrets.token_urlsafe(32)
            expires_at = datetime.now() + timedelta(minutes=15)
            
            # Store reset request in database
            cur.execute("""
                INSERT INTO password_reset_tokens (user_id, email, otp_code, token, expires_at)
                VALUES (%s, %s, %s, %s, %s)
            """, (user[0], email, otp_code, reset_token, expires_at))
            
            conn.commit()
            
            # Prepare user data for email
            user_data = {
                'id': user[0],
                'username': user[1],
                'firstname': user[2],
                'lastname': user[3],
                'email': user[4],
                'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
            }
            
            # Send password reset email
            try:
                email_sent = email_service.send_password_reset_otp(user_data, otp_code, reset_token)
                
                if email_sent:
                    log_system_action(
                        user_id=user[0],
                        action='password_reset_initiated',
                        description=f"Password reset OTP sent successfully",
                        details={
                            'email': email,
                            'username': user[1],
                            'reset_token': reset_token,
                            'expires_at': expires_at.isoformat(),
                            'ip_address': user_data['ip_address']
                        }
                    )
                    
                    return jsonify({
                        'message': 'Password reset code sent successfully! Please check your email.',
                        'reset_token': reset_token  # Frontend will need this for the next step
                    }), 200
                else:
                    log_system_action(
                        user_id=user[0],
                        action='password_reset_email_failed',
                        description=f"Failed to send password reset email",
                        details={'email': email, 'username': user[1]}
                    )
                    return jsonify({'error': 'Failed to send reset email. Please try again later.'}), 500
                    
            except Exception as email_error:
                log_system_action(
                    user_id=user[0],
                    action='password_reset_email_error',
                    description=f"Error sending password reset email",
                    details={'error': str(email_error), 'email': email}
                )
                return jsonify({'error': 'Failed to send reset email. Please try again later.'}), 500
            
    except Exception as e:
        log_system_action(
            user_id=None,
            action='password_reset_system_error',
            description=f"System error during password reset request",
            details={'error': str(e), 'email': email}
        )
        current_app.logger.error(f"Password reset error: {str(e)}")
        return jsonify({'error': 'An error occurred. Please try again later.'}), 500
        
    finally:
        if conn:
            conn.close()


@auth_bp.route('/verify-reset-otp', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@rate_limit(5)  # Allow 5 attempts per minute for OTP verification
def verify_reset_otp():
    """Verify the OTP code for password reset"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    reset_token = data.get('reset_token')
    otp_code = data.get('otp_code', '').strip()
    
    if not all([reset_token, otp_code]):
        return jsonify({'error': 'Reset token and OTP code are required'}), 400
        
    if len(otp_code) != 6 or not otp_code.isdigit():
        return jsonify({'error': 'OTP code must be 6 digits'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Find the reset request
            cur.execute("""
                SELECT prt.id, prt.user_id, prt.email, prt.otp_code, prt.expires_at, 
                       prt.is_used, prt.attempts, u.username, u.firstname, u.lastname
                FROM password_reset_tokens prt
                JOIN users u ON prt.user_id = u.id
                WHERE prt.token = %s AND prt.is_used = FALSE
            """, (reset_token,))
            
            reset_request = cur.fetchone()
            
            if not reset_request:
                log_system_action(
                    user_id=None,
                    action='password_reset_otp_invalid_token',
                    description=f"Invalid or expired reset token used",
                    details={'reset_token': reset_token}
                )
                return jsonify({'error': 'Invalid or expired reset token'}), 400
            
            # Check if expired
            if datetime.now() > reset_request[4]:
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_otp_expired',
                    description=f"Expired OTP verification attempted",
                    details={
                        'reset_token': reset_token,
                        'expired_at': reset_request[4].isoformat()
                    }
                )
                return jsonify({'error': 'Reset code has expired. Please request a new one.'}), 400
            
            # Check attempt limit
            if reset_request[6] >= 3:
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_otp_max_attempts',
                    description=f"Maximum OTP attempts exceeded",
                    details={'reset_token': reset_token, 'attempts': reset_request[6]}
                )
                return jsonify({'error': 'Maximum attempts exceeded. Please request a new reset code.'}), 429
            
            # Verify OTP
            if otp_code == reset_request[3]:
                # Mark as verified (but not used yet)
                cur.execute("""
                    UPDATE password_reset_tokens 
                    SET attempts = attempts + 1
                    WHERE id = %s
                """, (reset_request[0],))
                conn.commit()
                
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_otp_verified',
                    description=f"OTP verification successful",
                    details={
                        'reset_token': reset_token,
                        'username': reset_request[7],
                        'email': reset_request[2]
                    }
                )
                
                return jsonify({
                    'message': 'OTP verified successfully! You can now reset your password.',
                    'verified': True
                }), 200
            else:
                # Increment attempts
                cur.execute("""
                    UPDATE password_reset_tokens 
                    SET attempts = attempts + 1
                    WHERE id = %s
                """, (reset_request[0],))
                conn.commit()
                
                remaining_attempts = 3 - (reset_request[6] + 1)
                
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_otp_failed',
                    description=f"Incorrect OTP entered",
                    details={
                        'reset_token': reset_token,
                        'attempts': reset_request[6] + 1,
                        'remaining_attempts': remaining_attempts
                    }
                )
                
                if remaining_attempts > 0:
                    return jsonify({
                        'error': f'Incorrect OTP code. You have {remaining_attempts} attempt(s) remaining.'
                    }), 400
                else:
                    return jsonify({
                        'error': 'Maximum attempts exceeded. Please request a new reset code.'
                    }), 429
            
    except Exception as e:
        log_system_action(
            user_id=None,
            action='password_reset_otp_system_error',
            description=f"System error during OTP verification",
            details={'error': str(e), 'reset_token': reset_token}
        )
        current_app.logger.error(f"OTP verification error: {str(e)}")
        return jsonify({'error': 'An error occurred. Please try again later.'}), 500
        
    finally:
        if conn:
            conn.close()


@auth_bp.route('/reset-password', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@rate_limit(3)
def reset_password():
    """Complete the password reset process"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
        
    data = request.get_json()
    if not data:
        return jsonify({'error': 'No data provided'}), 400
        
    reset_token = data.get('reset_token')
    new_password = data.get('new_password')
    confirm_password = data.get('confirm_password')
    
    if not all([reset_token, new_password, confirm_password]):
        return jsonify({'error': 'All fields are required'}), 400
    
    if new_password != confirm_password:
        return jsonify({'error': 'Passwords do not match'}), 400
        
    if len(new_password) < 8:
        return jsonify({'error': 'Password must be at least 8 characters long'}), 400
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Verify the reset token is still valid and OTP was verified
            cur.execute("""
                SELECT prt.id, prt.user_id, prt.email, prt.expires_at, prt.is_used, 
                       prt.attempts, u.username, u.firstname, u.lastname
                FROM password_reset_tokens prt
                JOIN users u ON prt.user_id = u.id
                WHERE prt.token = %s AND prt.is_used = FALSE AND prt.attempts > 0
            """, (reset_token,))
            
            reset_request = cur.fetchone()
            
            if not reset_request:
                log_system_action(
                    user_id=None,
                    action='password_reset_invalid_token',
                    description=f"Invalid reset token for password reset",
                    details={'reset_token': reset_token}
                )
                return jsonify({'error': 'Invalid or expired reset token'}), 400
            
            # Check if expired
            if datetime.now() > reset_request[3]:
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_expired',
                    description=f"Expired token used for password reset",
                    details={
                        'reset_token': reset_token,
                        'expired_at': reset_request[3].isoformat()
                    }
                )
                return jsonify({'error': 'Reset code has expired. Please request a new one.'}), 400
            
            # Update user password
            password_hash = generate_password_hash(new_password)
            cur.execute("""
                UPDATE users 
                SET password = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (password_hash, reset_request[1]))
            
            # Mark reset token as used
            cur.execute("""
                UPDATE password_reset_tokens 
                SET is_used = TRUE, used_at = CURRENT_TIMESTAMP
                WHERE id = %s
            """, (reset_request[0],))
            
            conn.commit()
            
            # Prepare user data for email
            user_data = {
                'id': reset_request[1],
                'username': reset_request[6],
                'firstname': reset_request[7],
                'lastname': reset_request[8],
                'email': reset_request[2]
            }
            
            # Send success notification email
            try:
                email_service.send_password_reset_success(user_data)
            except Exception as email_error:
                log_system_action(
                    user_id=reset_request[1],
                    action='password_reset_success_email_failed',
                    description=f"Failed to send password reset success email",
                    details={'error': str(email_error)}
                )
            
            log_system_action(
                user_id=reset_request[1],
                action='password_reset_completed',
                description=f"Password successfully reset",
                details={
                    'username': reset_request[6],
                    'email': reset_request[2],
                    'reset_token': reset_token,
                    'ip_address': request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                }
            )
            
            return jsonify({
                'message': 'Password reset successful! You can now log in with your new password.'
            }), 200
            
    except Exception as e:
        log_system_action(
            user_id=None,
            action='password_reset_system_error',
            description=f"System error during password reset completion",
            details={'error': str(e), 'reset_token': reset_token}
        )
        current_app.logger.error(f"Password reset completion error: {str(e)}")
        return jsonify({'error': 'An error occurred. Please try again later.'}), 500
        
    finally:
        if conn:
            conn.close()

