from flask import Blueprint, jsonify, request, session
from db import get_db_connection
from werkzeug.security import generate_password_hash, check_password_hash
from utils.auth_utils import login_required
import psycopg2
import os
from werkzeug.utils import secure_filename
from flask import current_app

profile_bp = Blueprint('profile', __name__)

@profile_bp.route('/profile', methods=['GET'])
@login_required
def get_profile():
    if 'user_id' not in session:
        return jsonify({'authenticated': False}), 200
    
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("SELECT id, username, firstname, lastname, roletype, bio, profile_image, created_at FROM users WHERE id = %s", (session['user_id'],))
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
                    'bio': user[5],
                    'profile_image': user[6],
                    'created_at': user[7]
                }
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()


@profile_bp.route('/profile', methods=['PUT'])
@login_required
def update_profile():
    try:
        user_id = session.get('user_id')
        if not user_id:
            return jsonify({'error': 'User not authenticated'}), 401

        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        # Get current user data
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            current_user = cur.fetchone()
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404

        # Handle file upload
        profile_image_filename = current_user[6] if len(current_user) > 6 else None  # Keep existing image
        if 'profile_image' in request.files:
            file = request.files['profile_image']
            if file and file.filename != '':
                # Validate file type
                allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
                file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
                
                if file_extension not in allowed_extensions:
                    return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed'}), 400
                
                # Delete old image if exists
                if current_user[6]:  # profile_image column
                    old_image_path = os.path.join(
                        current_app.root_path, 
                        '..', 'frontend', 'public', 'profile_uploads',
                        current_user[6]
                    )
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)

                # Save new image
                filename = secure_filename(file.filename)
                import uuid
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                
                upload_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'profile_uploads'
                )
                os.makedirs(upload_path, exist_ok=True)
                file.save(os.path.join(upload_path, unique_filename))
                profile_image_filename = unique_filename

        # Get form data
        username = request.form.get('username')
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        bio = request.form.get('bio', '')
        current_password = request.form.get('current_password')
        new_password = request.form.get('new_password')

        # Validate required fields
        if not all([username, firstname, lastname]):
            return jsonify({'error': 'Username, first name, and last name are required'}), 400

        # Validate password change if requested
        password_hash = current_user[2]  # Keep existing password
        if new_password:
            if not current_password:
                return jsonify({'error': 'Current password is required to change password'}), 400
            
            if not check_password_hash(current_user[2], current_password):
                return jsonify({'error': 'Current password is incorrect'}), 400
            
            if len(new_password) < 8:
                return jsonify({'error': 'New password must be at least 8 characters'}), 400
            
            password_hash = generate_password_hash(new_password)

        # Check if username is taken by another user
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE username = %s AND id != %s", (username, user_id))
            if cur.fetchone():
                return jsonify({'error': 'Username already taken'}), 400

        # Update user profile
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE users 
                SET username = %s, password = %s, firstname = %s, lastname = %s, 
                    bio = %s, profile_image = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype, bio, profile_image, created_at
            """, (
                username, password_hash, firstname, lastname, 
                bio, profile_image_filename, user_id
            ))
            
            updated_user = cur.fetchone()
            conn.commit()
            
            user_response = {
                'id': updated_user[0],
                'username': updated_user[1],
                'firstname': updated_user[2],
                'lastname': updated_user[3],
                'roletype': updated_user[4],
                'bio': updated_user[5],
                'profile_image': updated_user[6],
                'created_at': updated_user[7]
            }
            
            return jsonify({
                'message': 'Profile updated successfully',
                'user': user_response
            }), 200

    except Exception as e:
        current_app.logger.error(f"Profile update error: {str(e)}")
        return jsonify({'error': 'Profile update failed'}), 500
    finally:
        if 'conn' in locals():
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