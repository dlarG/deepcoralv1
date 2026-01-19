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
            cur.execute("SELECT id, username, firstname, lastname, roletype, bio, profile_image, created_at, email FROM users WHERE id = %s", (session['user_id'],))
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
                    'created_at': user[7],
                    'email': user[8],
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
            cur.execute("SELECT id, username, password, firstname, lastname, roletype, bio, profile_image, created_at, status, email FROM users WHERE id = %s", (user_id,))
            current_user = cur.fetchone()
            
            if not current_user:
                return jsonify({'error': 'User not found'}), 404

        # Handle file upload
        profile_image_filename = current_user[7] if len(current_user) > 7 else None  # Keep existing image
        if 'profile_image' in request.files:
            file = request.files['profile_image']
            if file and file.filename != '':
                # Validate file type
                allowed_extensions = {'png', 'jpg', 'jpeg', 'gif'}
                file_extension = file.filename.rsplit('.', 1)[1].lower() if '.' in file.filename else ''
                
                if file_extension not in allowed_extensions:
                    return jsonify({'error': 'Invalid file type. Only PNG, JPG, JPEG, and GIF are allowed'}), 400
                
                # Delete old image if exists
                if current_user[7]:  # profile_image column
                    old_image_path = os.path.join(
                        current_app.root_path, 
                        '..', 'frontend', 'public', 'profile_uploads',
                        current_user[7]
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
        new_email = request.form.get('email')  # Get email from form

        # Validate required fields
        if not all([username, firstname, lastname, new_email]):
            return jsonify({'error': 'Username, first name, last name, and email are required'}), 400

        # Validate email format
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, new_email):
            return jsonify({'error': 'Please enter a valid email address'}), 400

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
                return jsonify({'error': 'Username already taken'}), 409
        
        # Check if email is taken by another user
        with conn.cursor() as cur:
            cur.execute("SELECT id FROM users WHERE email = %s AND id != %s", (new_email, user_id))
            if cur.fetchone():
                return jsonify({'error': 'Email address already in use by another account'}), 409

        # Update user profile
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE users 
                SET username = %s, password = %s, firstname = %s, lastname = %s, 
                    bio = %s, profile_image = %s, email = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype, bio, profile_image, created_at, email, status, last_login
            """, (
                username, password_hash, firstname, lastname, 
                bio, profile_image_filename, new_email, user_id
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
                'created_at': updated_user[7].isoformat() if updated_user[7] else None,
                'email': updated_user[8],
                'status': updated_user[9],
                'last_login': updated_user[10].isoformat() if updated_user[10] else None
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
            cur.execute("SELECT password, roletype, profile_image FROM users WHERE id = %s", (user_id,))
            result = cur.fetchone()
            if not result or not check_password_hash(result[0], data['password']):
                return jsonify({"error": "Incorrect password"}), 401
            
            user_password, user_role, profile_image = result
            
            # Prevent admin from deleting themselves if they're the only admin
            if user_role == 'admin':
                cur.execute("SELECT COUNT(*) FROM users WHERE roletype = 'admin'")
                admin_count = cur.fetchone()[0]
                if admin_count <= 1:
                    return jsonify({"error": "Cannot delete the only admin account"}), 403
            
            # Get all images uploaded by this user for cleanup
            cur.execute("""
                SELECT filename, quadrat_crop_path, original_image_path 
                FROM images WHERE uploader_id = %s
            """, (user_id,))
            user_images = cur.fetchall()
            
            # Get all segmentation mask paths for cleanup
            cur.execute("""
                SELECT DISTINCT sr.mask_path 
                FROM segmentation_results sr
                INNER JOIN images i ON sr.image_id = i.id
                WHERE i.uploader_id = %s AND sr.mask_path IS NOT NULL
            """, (user_id,))
            mask_paths = cur.fetchall()
            
            # Start cascading deletion in correct order
            print(f"Deleting account for user {user_id}...")
            
            # 1. Delete coral instances (child of segmentation_results)
            cur.execute("""
                DELETE FROM coral_instances 
                WHERE segmentation_id IN (
                    SELECT sr.id FROM segmentation_results sr
                    INNER JOIN images i ON sr.image_id = i.id
                    WHERE i.uploader_id = %s
                )
            """, (user_id,))
            deleted_instances = cur.rowcount
            print(f"Deleted {deleted_instances} coral instances")
            
            # 2. Delete segmentation results (child of images)
            cur.execute("""
                DELETE FROM segmentation_results 
                WHERE image_id IN (
                    SELECT id FROM images WHERE uploader_id = %s
                )
            """, (user_id,))
            deleted_results = cur.rowcount
            print(f"Deleted {deleted_results} segmentation results")
            
            # 3. Delete images (parent of segmentation_results)
            cur.execute("DELETE FROM images WHERE uploader_id = %s", (user_id,))
            deleted_images = cur.rowcount
            print(f"Deleted {deleted_images} images")
            
            # 4. Delete the user account
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted_user_id = cur.fetchone()[0]
            
            # Commit database changes
            conn.commit()
            print(f"Successfully deleted user {deleted_user_id}")
            
            # Clean up physical files after successful database deletion
            files_deleted = cleanup_user_files(user_images, mask_paths, profile_image)
            
            # Clear session
            session.clear()
            
            return jsonify({
                "message": "Account deleted successfully",
                "deleted_user_id": deleted_user_id,
                "cleanup_stats": {
                    "images_deleted": deleted_images,
                    "segmentation_results_deleted": deleted_results,
                    "coral_instances_deleted": deleted_instances,
                    "files_cleaned": files_deleted
                }
            }), 200
            
    except psycopg2.IntegrityError as e:
        conn.rollback()
        current_app.logger.error(f"Integrity constraint error during user deletion: {str(e)}")
        return jsonify({"error": "Cannot delete account due to data dependencies. Please contact support."}), 409
        
    except psycopg2.Error as e:
        conn.rollback()
        current_app.logger.error(f"Database error during user deletion: {str(e)}")
        return jsonify({"error": f"Database error: {str(e)}"}), 500
        
    except Exception as e:
        conn.rollback()
        current_app.logger.error(f"Unexpected error during user deletion: {str(e)}")
        return jsonify({"error": f"Account deletion failed: {str(e)}"}), 500
        
    finally:
        if conn:
            conn.close()


def cleanup_user_files(user_images, mask_paths, profile_image):
    """Clean up physical files associated with the deleted user"""
    files_deleted = 0
    
    try:
        # Clean up image files
        for image_data in user_images:
            filename, crop_path, original_path = image_data
            
            # Delete crop file
            if filename:
                crop_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', 'crops', filename
                )
                if os.path.exists(crop_file_path):
                    os.remove(crop_file_path)
                    files_deleted += 1
                    print(f"Deleted crop file: {filename}")
            
            # Delete quadrat crop file if different
            if crop_path and crop_path != filename:
                quadrat_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', crop_path
                )
                if os.path.exists(quadrat_file_path):
                    os.remove(quadrat_file_path)
                    files_deleted += 1
                    print(f"Deleted quadrat file: {crop_path}")
            
            # Delete original image file
            if original_path:
                original_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', original_path
                )
                if os.path.exists(original_file_path):
                    os.remove(original_file_path)
                    files_deleted += 1
                    print(f"Deleted original file: {original_path}")
        
        # Clean up segmentation mask files
        for mask_data in mask_paths:
            mask_path = mask_data[0]
            if mask_path:
                mask_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', mask_path
                )
                if os.path.exists(mask_file_path):
                    os.remove(mask_file_path)
                    files_deleted += 1
                    print(f"Deleted mask file: {mask_path}")
        
        # Clean up profile image
        if profile_image:
            profile_file_path = os.path.join(
                current_app.root_path, '..', 'frontend', 'public', 'profile_uploads', profile_image
            )
            if os.path.exists(profile_file_path):
                os.remove(profile_file_path)
                files_deleted += 1
                print(f"Deleted profile image: {profile_image}")
        
        print(f"Total files cleaned up: {files_deleted}")
        return files_deleted
        
    except Exception as e:
        current_app.logger.error(f"Error during file cleanup: {str(e)}")
        # Don't fail the whole operation if file cleanup fails
        return files_deleted