from functools import wraps
from flask import jsonify, session
import time

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        from db import get_db_connection
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT roletype FROM users WHERE id = %s", (session['user_id'],))
                user = cur.fetchone()
                if not user or user[0].lower() != 'admin':
                    return jsonify({'error': 'Admin access required'}), 403
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
        return f(*args, **kwargs)
    return decorated_function

def biologist_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        from db import get_db_connection
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT roletype FROM users WHERE id = %s", (session['user_id'],))
                user = cur.fetchone()
                if not user or user[0].lower() != 'biologist':
                    return jsonify({'error': 'Biologist access required'}), 403
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            if conn:
                conn.close()
                
        return f(*args, **kwargs)
    return decorated_function


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

def roles_required(*allowed_roles):
    """
    Decorator that allows multiple roles to access a route
    Usage: @roles_required('admin', 'biologist')
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if 'user_id' not in session:
                return jsonify({'error': 'Unauthorized'}), 401
            
            from db import get_db_connection
            conn = get_db_connection()
            try:
                with conn.cursor() as cur:
                    cur.execute("SELECT roletype FROM users WHERE id = %s", (session['user_id'],))
                    user = cur.fetchone()
                    if not user:
                        return jsonify({'error': 'User not found'}), 401
                    
                    user_role = user[0].lower()
                    allowed_roles_lower = [role.lower() for role in allowed_roles]
                    
                    if user_role not in allowed_roles_lower:
                        return jsonify({
                            'error': f'Access denied. Required roles: {", ".join(allowed_roles)}'
                        }), 403
                        
            except Exception as e:
                return jsonify({'error': str(e)}), 500
            finally:
                if conn:
                    conn.close()
                    
            return f(*args, **kwargs)
        return decorated_function
    return decorator