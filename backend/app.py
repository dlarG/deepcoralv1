from flask import Flask, request, jsonify, session
from flask_cors import CORS
from db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps
import time
from flask import abort
import secrets

app = Flask(__name__)
app.config['SECRET_KEY'] = secrets.token_hex(32)  # Important for session and CSRF
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SECURE'] = True  # Enable in production with HTTPS
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'  # Helps prevent CSRF

CORS(app, supports_credentials=True, origins=['http://localhost:3000'])  # Adjust origin as needed

# CSRF Protection Middleware
@app.before_request
def csrf_protect():
    if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
        csrf_token = session.get('csrf_token')
        if not csrf_token or csrf_token != request.headers.get('X-CSRF-Token'):
            return jsonify({'error': 'Invalid CSRF token'}), 403

# Generate and store CSRF token in session
@app.route('/csrf-token', methods=['GET'])
def get_csrf_token():
    if 'csrf_token' not in session:
        session['csrf_token'] = secrets.token_hex(32)
    return jsonify({'csrf_token': session['csrf_token']})

# Route for register with a POST method
@app.route('/register', methods=["POST"])
def register_user():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    roletype = 'guest'  # Default role type
    
    # Validate password strength
    if len(password) < 8:
        return jsonify({"error": "Password must be at least 8 characters"}), 400
    
    if not all([username, password, firstname, lastname]):
        return jsonify({"error": "Missing all fields are required"}), 400
    
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
            "INSERT INTO users (username, password, firstname, lastname, roletype) VALUES (%s, %s, %s, %s, %s)",
            (username, password_hashed, firstname, lastname, roletype)
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

def rate_limit(max_per_minute):
    def decorator(f):
        calls = []
        
        @wraps(f)
        def wrapper(*args, **kwargs):
            now = time.time()
            calls.append(now)
            
            # Remove calls older than 1 minute
            while calls and calls[0] < now - 60:
                calls.pop(0)
                
            if len(calls) > max_per_minute:
                return jsonify({'error': 'Too many requests. Please try again later'}), 429
            return f(*args, **kwargs)
        return wrapper
    return decorator

@app.route('/login', methods=["POST"])
@rate_limit(5) # Limit to 5 requests per minute
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
            cur.execute("SELECT * FROM users WHERE username = %s", (username,))
            user = cur.fetchone()
            
            if not user or not check_password_hash(user[2], password):
                return jsonify({'error': 'Invalid credentials'}), 401
                
            # Generate new CSRF token on login
            session['csrf_token'] = secrets.token_hex(32)
            
            user_data = {
                'username': user[1],
                'firstname': user[3],
                'lastname': user[5],
                'roletype': user[7]
            }
            
            return jsonify({
                'message': 'Login successful',
                'user': user_data,
                'csrf_token': session['csrf_token']
            }), 200
            
    except Exception as e:
        app.logger.error(f"Login error: {str(e)}")
        return jsonify({'error': 'Login failed'}), 500
        
    finally:
        if 'conn' in locals():
            conn.close()

@app.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200

@app.route('/admin/users', methods=['GET'])
def get_all_users():
    # Check if user is admin (you'll need to implement proper authentication)
    # Example: if not current_user.is_authenticated or current_user.roletype != 'admin':
    #     abort(403)
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, firstname, lastname, roletype FROM users")
            users = cur.fetchall()
            
            # Convert to list of dictionaries
            users_list = []
            for user in users:
                users_list.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4]
                })
            
            return jsonify({"users": users_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# Add this route to delete a user (admin only)
@app.route('/admin/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    # Check admin privileges here
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # First check if user exists
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cur.fetchone():
                return jsonify({"error": "User not found"}), 404
            
            # Delete the user
            cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
            conn.commit()
            
            return jsonify({"message": "User deleted successfully"}), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    app.run(debug=True)