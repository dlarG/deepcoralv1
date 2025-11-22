from flask import Blueprint, request, jsonify, session
from flask_cors import cross_origin
from db import get_db_connection
from utils.auth_utils import login_required
from routes.activity_log import log_system_action, ActivityLogger
from datetime import datetime
import os

validation_bp = Blueprint('validation', __name__)



@validation_bp.route('/admin/manage-image-uploads', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def manage_image_uploads():
    """Approve or reject specific images"""
    try:
        data = request.get_json()
        image_ids = data.get('image_ids', [])
        action = data.get('action')  # 'approve' or 'reject'
        
        if not image_ids or action not in ['approve', 'reject']:
            return jsonify({"error": "Invalid request data"}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        admin_id = session.get('user_id')
        
        with conn.cursor() as cur:
            # Check admin privileges
            cur.execute("SELECT roletype FROM users WHERE id = %s", (admin_id,))
            user_result = cur.fetchone()
            
            if not user_result or user_result[0].lower() != 'admin':
                return jsonify({"error": "Admin access required"}), 403
            
            new_status = 'pending_approved' if action == 'approve' else 'rejected'
            
            # Get image details before updating for logging
            placeholders = ','.join(['%s'] * len(image_ids))
            cur.execute(f"""
                SELECT i.id, i.filename, i.uploader_id, u.username, u.firstname, u.lastname
                FROM images i
                JOIN users u ON i.uploader_id = u.id
                WHERE i.id IN ({placeholders})
            """, image_ids)
            
            image_details = cur.fetchall()
            
            # Update status
            cur.execute(f"""
                UPDATE images 
                SET upload_status = %s, updated_at = NOW()
                WHERE id IN ({placeholders})
                AND upload_status = 'pending'
            """, [new_status] + image_ids)
            
            affected_rows = cur.rowcount
            conn.commit()
            
            # Log the action
            for image in image_details:
                ActivityLogger.log_activity(
                    user_id=admin_id,
                    activity_type=f'image_{action}',
                    description=f"{action.capitalize()}d image '{image[1]}' from user {image[4]} {image[5]}",
                    category='user_management',
                    metadata={
                        'image_id': image[0],
                        'filename': image[1],
                        'uploader_id': image[2],
                        'uploader_username': image[3],
                        'new_status': new_status,
                        'action_by_admin': admin_id
                    }
                )
            
            # If approved, trigger reanalysis (we'll implement this later)
            if action == 'approve':
                log_system_action(
                    user_id=admin_id,
                    action='images_approved_for_analysis',
                    description=f"Approved {affected_rows} images for analysis",
                    details={'image_ids': image_ids, 'affected_count': affected_rows}
                )
            
            return jsonify({
                "success": True,
                "message": f"Successfully {action}d {affected_rows} image(s)",
                "affected_count": affected_rows,
                "new_status": new_status
            })
            
    except Exception as e:
        print(f"Error managing image uploads: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@validation_bp.route('/admin/delete-pending-images', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def delete_pending_images():
    """Delete specific pending images"""
    try:
        data = request.get_json()
        image_ids = data.get('image_ids', [])
        
        if not image_ids:
            return jsonify({"error": "No image IDs provided"}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        admin_id = session.get('user_id')
        
        with conn.cursor() as cur:
            # Check admin privileges
            cur.execute("SELECT roletype FROM users WHERE id = %s", (admin_id,))
            user_result = cur.fetchone()
            
            if not user_result or user_result[0].lower() != 'admin':
                return jsonify({"error": "Admin access required"}), 403
            
            # Get image details and file paths before deletion
            placeholders = ','.join(['%s'] * len(image_ids))
            cur.execute(f"""
                SELECT i.id, i.filename, i.uploader_id, u.username, u.firstname, u.lastname
                FROM images i
                JOIN users u ON i.uploader_id = u.id
                WHERE i.id IN ({placeholders})
                AND i.upload_status = 'pending'
            """, image_ids)
            
            image_details = cur.fetchall()
            
            if not image_details:
                return jsonify({"error": "No pending images found with provided IDs"}), 404
            
            # Delete from database (segmentation_results will be deleted automatically due to CASCADE)
            cur.execute(f"""
                DELETE FROM images 
                WHERE id IN ({placeholders})
                AND upload_status = 'pending'
            """, image_ids)
            
            deleted_count = cur.rowcount
            conn.commit()
            
            # Delete physical files (optional - you might want to keep them)
            uploads_folder = os.path.join(os.path.dirname(__file__), '..', 'coral_uploads', 'outputs')
            masks_folder = os.path.join(os.path.dirname(__file__), '..', 'coral_uploads', 'masks')
            
            for image in image_details:
                filename = image[1]
                # Try to delete crop file
                crop_path = os.path.join(uploads_folder, filename)
                if os.path.exists(crop_path):
                    try:
                        os.remove(crop_path)
                    except:
                        pass
                
                # Try to delete mask file
                mask_filename = f"visualization_{filename}" if not filename.startswith('batch_viz_') else filename
                mask_path = os.path.join(masks_folder, mask_filename)
                if os.path.exists(mask_path):
                    try:
                        os.remove(mask_path)
                    except:
                        pass
                
                # Log deletion
                ActivityLogger.log_activity(
                    user_id=admin_id,
                    activity_type='image_deleted',
                    description=f"Deleted pending image '{filename}' from user {image[4]} {image[5]}",
                    category='user_management',
                    metadata={
                        'image_id': image[0],
                        'filename': filename,
                        'uploader_id': image[2],
                        'uploader_username': image[3],
                        'deleted_by_admin': admin_id
                    }
                )
            
            return jsonify({
                "success": True,
                "message": f"Successfully deleted {deleted_count} image(s)",
                "deleted_count": deleted_count
            })
            
    except Exception as e:
        print(f"Error deleting images: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@validation_bp.route('/user/upload-status/<int:user_id>', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def get_user_upload_status(user_id):
    """Get upload status for a specific user"""
    try:
        # Users can only check their own status unless they're admin
        current_user_id = session.get('user_id')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Check permissions
            cur.execute("SELECT roletype FROM users WHERE id = %s", (current_user_id,))
            user_result = cur.fetchone()
            
            is_admin = user_result and user_result[0].lower() == 'admin'
            
            if not is_admin and current_user_id != user_id:
                return jsonify({"error": "Access denied"}), 403
            
            # Get upload status counts
            cur.execute("""
                SELECT 
                    upload_status,
                    COUNT(*) as count,
                    MAX(uploaded_at) as last_upload
                FROM images 
                WHERE uploader_id = %s
                GROUP BY upload_status
            """, (user_id,))
            
            status_counts = {}
            for row in cur.fetchall():
                status_counts[row[0]] = {
                    'count': row[1],
                    'last_upload': row[2].isoformat() if row[2] else None
                }
            
            return jsonify({
                "user_id": user_id,
                "upload_status": status_counts,
                "has_pending": 'pending' in status_counts and status_counts['pending']['count'] > 0
            })
            
    except Exception as e:
        print(f"Error fetching upload status: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

