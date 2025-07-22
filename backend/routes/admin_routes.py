from flask import Blueprint, jsonify
from db import get_db_connection
from utils.auth_utils import admin_required, login_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
@login_required
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

@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
@login_required
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

