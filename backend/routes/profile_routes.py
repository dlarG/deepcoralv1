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
                        'profile_uploads',
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
                    'profile_uploads'
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
        current_app.logger.error("Delete profile: No user_id in session")
        return jsonify({"error": "Unauthorized"}), 401
    
    try:
        data = request.get_json()
        current_app.logger.info(f"Delete profile request received for user {user_id}")
        
        if not data or 'password' not in data:
            current_app.logger.warning(f"Delete profile for {user_id}: Password not provided in request")
            return jsonify({"error": "Password is required"}), 400
    except Exception as e:
        current_app.logger.error(f"Delete profile for {user_id}: Error parsing JSON: {str(e)}")
        return jsonify({"error": "Invalid request format"}), 400
    
    conn = get_db_connection()
    if conn is None:
        current_app.logger.error(f"Delete profile for {user_id}: Database connection failed")
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Verify password
            cur.execute("SELECT password, roletype, profile_image FROM users WHERE id = %s", (user_id,))
            result = cur.fetchone()
            
            if not result:
                current_app.logger.error(f"Delete profile: User {user_id} not found in database")
                return jsonify({"error": "User not found"}), 404
            
            user_password, user_role, profile_image = result
            
            # Verify password
            if not check_password_hash(user_password, data['password']):
                current_app.logger.warning(f"Delete profile for {user_id}: Incorrect password provided")
                return jsonify({"error": "Incorrect password"}), 401
            
            # Prevent admin from deleting themselves if they're the only admin
            if user_role == 'admin':
                cur.execute("SELECT COUNT(*) FROM users WHERE roletype = 'admin'")
                admin_count = cur.fetchone()[0]
                if admin_count <= 1:
                    current_app.logger.warning(f"Delete profile for {user_id}: Cannot delete only admin")
                    return jsonify({"error": "Cannot delete the only admin account"}), 403
            
            current_app.logger.info(f"Delete profile for {user_id}: Password verified, proceeding with account deletion")
            
            # Get all images uploaded by this user for cleanup
            try:
                cur.execute("""
                    SELECT filename, quadrat_crop_path, original_image_path 
                    FROM images WHERE uploader_id = %s
                """, (user_id,))
                user_images = cur.fetchall()
                current_app.logger.info(f"Delete profile for {user_id}: Found {len(user_images)} images to clean up")
            except Exception as e:
                current_app.logger.warning(f"Delete profile for {user_id}: Error fetching images: {str(e)}")
                user_images = []
            
            # Get all segmentation mask paths for cleanup
            try:
                cur.execute("""
                    SELECT DISTINCT sr.mask_path 
                    FROM segmentation_results sr
                    INNER JOIN images i ON sr.image_id = i.id
                    WHERE i.uploader_id = %s AND sr.mask_path IS NOT NULL
                """, (user_id,))
                mask_paths = cur.fetchall()
                current_app.logger.info(f"Delete profile for {user_id}: Found {len(mask_paths)} mask files")
            except Exception as e:
                current_app.logger.warning(f"Delete profile for {user_id}: Error fetching mask paths: {str(e)}")
                mask_paths = []
            
            current_app.logger.info(f"Delete profile for {user_id}: Starting cascading deletion")
            
            # Initialize counters
            deleted_instances = 0
            deleted_results = 0
            deleted_images = 0
            
            # 1. Delete coral instances (child of segmentation_results) - safely handle if table doesn't exist
            try:
                cur.execute("""
                    DELETE FROM coral_instances 
                    WHERE segmentation_id IN (
                        SELECT sr.id FROM segmentation_results sr
                        INNER JOIN images i ON sr.image_id = i.id
                        WHERE i.uploader_id = %s
                    )
                """, (user_id,))
                deleted_instances = cur.rowcount
                current_app.logger.info(f"Delete profile for {user_id}: Deleted {deleted_instances} coral instances")
            except Exception as e:
                error_msg = str(e)
                if "coral_instances" in error_msg and "does not exist" in error_msg:
                    current_app.logger.warning(f"Delete profile for {user_id}: coral_instances table not found, skipping")
                else:
                    current_app.logger.warning(f"Delete profile for {user_id}: Error deleting coral_instances: {error_msg}")
            
            # 2. Delete segmentation results (child of images) - safely handle if table doesn't exist
            try:
                cur.execute("""
                    DELETE FROM segmentation_results 
                    WHERE image_id IN (
                        SELECT id FROM images WHERE uploader_id = %s
                    )
                """, (user_id,))
                deleted_results = cur.rowcount
                current_app.logger.info(f"Delete profile for {user_id}: Deleted {deleted_results} segmentation results")
            except Exception as e:
                error_msg = str(e)
                if "segmentation_results" in error_msg and "does not exist" in error_msg:
                    current_app.logger.warning(f"Delete profile for {user_id}: segmentation_results table not found, skipping")
                else:
                    current_app.logger.warning(f"Delete profile for {user_id}: Error deleting segmentation_results: {error_msg}")
            
            # 3. Delete images (parent of segmentation_results) - always safe since images table is core
            try:
                cur.execute("DELETE FROM images WHERE uploader_id = %s", (user_id,))
                deleted_images = cur.rowcount
                current_app.logger.info(f"Delete profile for {user_id}: Deleted {deleted_images} images")
            except Exception as e:
                current_app.logger.warning(f"Delete profile for {user_id}: Error deleting images: {str(e)}")
            
            # 4. Delete the user account
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            delete_result = cur.fetchone()
            
            if not delete_result:
                conn.rollback()
                current_app.logger.error(f"Delete profile for {user_id}: Failed to delete user from database")
                return jsonify({"error": "Failed to delete user account"}), 500
            
            deleted_user_id = delete_result[0]
            
            # Commit database changes
            conn.commit()
            current_app.logger.info(f"Delete profile: Successfully deleted user {deleted_user_id} from database")
            
            # Clean up physical files after successful database deletion
            try:
                files_deleted = cleanup_user_files(user_images, mask_paths, profile_image)
                current_app.logger.info(f"Delete profile for {user_id}: Cleaned up {files_deleted} physical files")
            except Exception as file_error:
                current_app.logger.warning(f"Delete profile for {user_id}: Error cleaning up files: {str(file_error)}")
                files_deleted = 0
            
            # Clear session
            session.clear()
            current_app.logger.info(f"Delete profile: Account deletion completed successfully for user {deleted_user_id}")
            
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
        current_app.logger.error(f"Delete profile for {user_id}: Integrity constraint error: {str(e)}", exc_info=True)
        return jsonify({"error": "Cannot delete account - data dependencies exist. Please contact support."}), 409
        
    except psycopg2.Error as e:
        conn.rollback()
        current_app.logger.error(f"Delete profile for {user_id}: Database error: {str(e)}", exc_info=True)
        return jsonify({"error": "Database error occurred. Please try again later."}), 500
        
    except Exception as e:
        conn.rollback()
        import traceback
        error_trace = traceback.format_exc()
        current_app.logger.error(f"Unexpected error during user deletion for {user_id}: {str(e)}\n{error_trace}")
        return jsonify({"error": "An unexpected error occurred. Please try again later."}), 500
        
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
                    try:
                        os.remove(crop_file_path)
                        files_deleted += 1
                        current_app.logger.info(f"Cleanup: Deleted crop file: {filename}")
                    except Exception as e:
                        current_app.logger.warning(f"Cleanup: Failed to delete crop file {filename}: {str(e)}")
                else:
                    current_app.logger.debug(f"Cleanup: Crop file not found: {crop_file_path}")
            
            # Delete quadrat crop file if different
            if crop_path and crop_path != filename:
                quadrat_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', crop_path
                )
                if os.path.exists(quadrat_file_path):
                    try:
                        os.remove(quadrat_file_path)
                        files_deleted += 1
                        current_app.logger.info(f"Cleanup: Deleted quadrat file: {crop_path}")
                    except Exception as e:
                        current_app.logger.warning(f"Cleanup: Failed to delete quadrat file {crop_path}: {str(e)}")
                else:
                    current_app.logger.debug(f"Cleanup: Quadrat file not found: {quadrat_file_path}")
            
            # Delete original image file
            if original_path:
                original_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', original_path
                )
                if os.path.exists(original_file_path):
                    try:
                        os.remove(original_file_path)
                        files_deleted += 1
                        current_app.logger.info(f"Cleanup: Deleted original file: {original_path}")
                    except Exception as e:
                        current_app.logger.warning(f"Cleanup: Failed to delete original file {original_path}: {str(e)}")
                else:
                    current_app.logger.debug(f"Cleanup: Original file not found: {original_file_path}")
        
        # Clean up segmentation mask files
        for mask_data in mask_paths:
            mask_path = mask_data[0]
            if mask_path:
                mask_file_path = os.path.join(
                    current_app.root_path, '..', 'frontend', 'public', mask_path
                )
                if os.path.exists(mask_file_path):
                    try:
                        os.remove(mask_file_path)
                        files_deleted += 1
                        current_app.logger.info(f"Cleanup: Deleted mask file: {mask_path}")
                    except Exception as e:
                        current_app.logger.warning(f"Cleanup: Failed to delete mask file {mask_path}: {str(e)}")
                else:
                    current_app.logger.debug(f"Cleanup: Mask file not found: {mask_file_path}")
        
        # Clean up profile image
        if profile_image:
            profile_file_path = os.path.join(
                current_app.root_path, 'profile_uploads', profile_image
            )
            if os.path.exists(profile_file_path):
                try:
                    os.remove(profile_file_path)
                    files_deleted += 1
                    current_app.logger.info(f"Cleanup: Deleted profile image: {profile_image}")
                except Exception as e:
                    current_app.logger.warning(f"Cleanup: Failed to delete profile image {profile_image}: {str(e)}")
            else:
                current_app.logger.debug(f"Cleanup: Profile image not found: {profile_file_path}")
        
        current_app.logger.info(f"Cleanup: Total files cleaned up: {files_deleted}")
        return files_deleted
        
    except Exception as e:
        current_app.logger.error(f"Critical error during file cleanup: {str(e)}")
        # Don't fail the whole operation if file cleanup fails
        return files_deleted

@profile_bp.route('/profile_uploads/<filename>')
def serve_profile_image(filename):
    """Serve uploaded profile images"""
    from flask import send_from_directory
    upload_path = os.path.join(current_app.root_path, 'profile_uploads')
    return send_from_directory(upload_path, filename)