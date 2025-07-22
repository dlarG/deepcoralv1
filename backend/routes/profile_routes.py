from flask import Blueprint, jsonify, request, session
from db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from utils.auth_utils import login_required
import psycopg2

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype 
                FROM users 
                WHERE id = %s
            """, (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            return jsonify({
                "user": {
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4]
                }
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@profile_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Verify current password if changing password
            if 'new_password' in data:
                if 'current_password' not in data:
                    return jsonify({"error": "Current password is required"}), 400
                
                cur.execute("SELECT password FROM users WHERE id = %s", (user_id,))
                result = cur.fetchone()
                if not result or not check_password_hash(result[0], data['current_password']):
                    return jsonify({"error": "Current password is incorrect"}), 401
            
            # Build update query
            update_fields = []
            update_values = []
            
            if 'username' in data:
                # Check if username is available
                cur.execute("SELECT id FROM users WHERE username = %s AND id != %s", 
                          (data['username'], user_id))
                if cur.fetchone():
                    return jsonify({"error": "Username already taken"}), 400
                update_fields.append("username = %s")
                update_values.append(data['username'])
            
            if 'new_password' in data:
                update_fields.append("password = %s")
                update_values.append(generate_password_hash(data['new_password']))
            
            if 'firstname' in data:
                update_fields.append("firstname = %s")
                update_values.append(data['firstname'])
            
            if 'lastname' in data:
                update_fields.append("lastname = %s")
                update_values.append(data['lastname'])
            
            if not update_fields:
                return jsonify({"error": "No valid fields to update"}), 400
            
            # Add user_id to values
            update_values.append(user_id)
            
            # Execute update
            update_query = f"""
                UPDATE users 
                SET {', '.join(update_fields)} 
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype
            """
            
            cur.execute(update_query, update_values)
            updated_user = cur.fetchone()
            conn.commit()
            
            return jsonify({
                "message": "Profile updated successfully",
                "user": {
                    'id': updated_user[0],
                    'username': updated_user[1],
                    'firstname': updated_user[2],
                    'lastname': updated_user[3],
                    'roletype': updated_user[4]
                }
            }), 200
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@profile_bp.route('/profile', methods=['DELETE'])
@login_required
def delete_profile():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Unauthorized"}), 401
    
    data = request.get_json()
    if not data or 'password' not in data:
        return jsonify({"error": "Password is required"}), 400
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Verify password
            cur.execute("SELECT password, roletype FROM users WHERE id = %s", (user_id,))
            result = cur.fetchone()
            if not result or not check_password_hash(result[0], data['password']):
                return jsonify({"error": "Incorrect password"}), 401
            
            # Prevent admin from deleting themselves if they're the only admin
            if result[1] == 'admin':
                cur.execute("SELECT COUNT(*) FROM users WHERE roletype = 'admin'")
                admin_count = cur.fetchone()[0]
                if admin_count <= 1:
                    return jsonify({"error": "Cannot delete the only admin account"}), 403
            
            # Delete the user
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted_id = cur.fetchone()[0]
            conn.commit()
            
            # Clear session
            session.clear()
            
            return jsonify({
                "message": "Account deleted successfully",
                "deleted_id": deleted_id
            }), 200
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()