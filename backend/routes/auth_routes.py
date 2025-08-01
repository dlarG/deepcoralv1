from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
from utils.auth_utils import login_required, rate_limit
import requests
from config import Config
import secrets

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
        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if 'cur' in locals():
            cur.close()
        if conn:
            conn.close()


@auth_bp.route('/logout', methods=['POST'])
@login_required
def logout():
    try:
        # Generate new CSRF token FIRST (before clearing session)
        new_csrf = secrets.token_hex(32)
        
        # Clear the Flask session
        session.clear()
        session['csrf_token'] = new_csrf  # Set new token for next request
        
        # Create response
        response = jsonify({
            'message': 'Logout successful',
            'csrf_token': new_csrf  # Send new token to client
        })
        
        # Expire the session cookie
        response.set_cookie(
            'session', 
            '', 
            expires=0,
            httponly=True,
            secure=current_app.config.get('SESSION_COOKIE_SECURE', False),
            samesite='Lax'
        )
        
        # CORS headers
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, X-CSRF-Token')
        
        return response, 200
        
    except Exception as e:
        current_app.logger.error(f"Logout error: {str(e)}")
        return jsonify({'error': 'Logout failed'}), 500
    

@auth_bp.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(32)
    return jsonify({'csrf_token': session['csrf_token']})


@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    if 'user_id' not in session:
        return jsonify({'authenticated': False}), 200
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            # Include all necessary columns including profile_image
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, bio, profile_image, created_at 
                FROM users WHERE id = %s
            """, (session['user_id'],))
            user = cur.fetchone()
            
            if not user:
                return jsonify({'authenticated': False}), 200
                
            return jsonify({
                'authenticated': True,
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'bio': user[5] if user[5] else "",  # Correct index for bio
                    'profile_image': user[6],  # Correct index for profile_image
                    'created_at': user[7]
                }
            }), 200
    except Exception as e:
        current_app.logger.error(f"Check auth error: {str(e)}")
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@auth_bp.route('/login', methods=['POST'])
@rate_limit(5)
def login_user():
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
            # Include all necessary columns including profile_image
            cur.execute("""
                SELECT id, username, password, firstname, lastname, roletype, bio, profile_image, created_at 
                FROM users WHERE username = %s
            """, (username,))
            user = cur.fetchone()
            
            if not user or not check_password_hash(user[2], password):
                return jsonify({'error': 'Invalid credentials'}), 401
                
            # Generate new CSRF token on login
            session['csrf_token'] = secrets.token_hex(32)
            session['user_id'] = user[0]
            session['roletype'] = user[5]  # roletype is at index 5
            
            user_data = {
                'id': user[0],
                'username': user[1],
                'firstname': user[3],
                'lastname': user[4],
                'roletype': user[5],
                'bio': user[6] if user[6] else "",
                'profile_image': user[7],  # profile_image is at index 7
                'created_at': user[8],
                'redirect_to': f'/{user[5].lower()}-dashboard'
            }
            
            return jsonify({
                'message': 'Login successful',
                'user': user_data,
                'csrf_token': session['csrf_token'],
                'redirect_to': user_data['redirect_to']
            }), 200
            
    except Exception as e:
        current_app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
        
    finally:
        if 'conn' in locals():
            conn.close()