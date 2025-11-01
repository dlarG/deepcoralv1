from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from db import get_db_connection
from utils.auth_utils import login_required
from routes.activity_log import log_system_action, ActivityLogger
from datetime import datetime
import os
import cv2
import numpy as np
import torch
import segmentation_models_pytorch as smp
import albumentations as A
from albumentations.pytorch import ToTensorV2
from pathlib import Path

approved_bp = Blueprint('approved', __name__)

# Import segmentation model and functions from upload_image.py
from routes.upload_image import (
    segmentation_model, CORAL_CLASSES, segment_coral_lifeforms,
    save_segmentation_results, MASKS_FOLDER, OUTPUT_FOLDER
)

@approved_bp.route('/guest/approved-images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def get_approved_images():
    """Get approved and rejected images for the current guest user"""
    try:
        user_id = session.get('user_id')
        
        if not user_id:
            return jsonify({"error": "User not authenticated"}), 401
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get user info
            cur.execute("""
                SELECT roletype, 
                       COALESCE(firstname, '') as firstname, 
                       COALESCE(lastname, '') as lastname 
                FROM users 
                WHERE id = %s
            """, (user_id,))
            
            user_result = cur.fetchone()
            
            if not user_result:
                return jsonify({"error": "User not found"}), 404
            
            user_role, firstname, lastname = user_result
            
            # Simplified query for approved images
            cur.execute("""
                SELECT 
                    i.id, 
                    i.filename, 
                    i.uploaded_at, 
                    i.upload_status,
                    COALESCE(i.total_pixels, 0) as total_pixels,
                    COALESCE(i.analysis_confidence, 0.0) as analysis_confidence,
                    COALESCE(i.processing_status, 'pending') as processing_status,
                    COALESCE(i.original_image_path, '') as original_image_path,
                    EXISTS(SELECT 1 FROM segmentation_results sr WHERE sr.image_id = i.id) as has_segmentation
                FROM images i
                WHERE i.uploader_id = %s 
                AND i.upload_status = 'approved'
                ORDER BY i.uploaded_at DESC
            """, (user_id,))
            
            approved_results = cur.fetchall()
            
            # Simplified query for rejected images
            cur.execute("""
                SELECT 
                    i.id, 
                    i.filename, 
                    i.uploaded_at, 
                    i.upload_status,
                    COALESCE(i.total_pixels, 0) as total_pixels,
                    COALESCE(i.analysis_confidence, 0.0) as analysis_confidence,
                    COALESCE(i.processing_status, 'pending') as processing_status,
                    COALESCE(i.original_image_path, '') as original_image_path,
                    false as has_segmentation
                FROM images i
                WHERE i.uploader_id = %s 
                AND i.upload_status = 'rejected'
                ORDER BY i.uploaded_at DESC
            """, (user_id,))
            
            rejected_results = cur.fetchall()
            
            # Process results
            approved_images = []
            for row in approved_results:
                filename = row[1]
                is_cropped = 'crop' in filename.lower() or 'guest' in filename.lower()
                image_url = f"crops/{filename}" if is_cropped else f"uploads/{filename}"
                
                approved_images.append({
                    'id': row[0],
                    'filename': filename,
                    'uploaded_at': row[2].isoformat() if row[2] else None,
                    'upload_status': row[3],
                    'total_pixels': int(row[4]),
                    'analysis_confidence': float(row[5]),
                    'processing_status': row[6],
                    'original_filename': row[7],
                    'has_segmentation': bool(row[8]),
                    'image_url': image_url,
                    'is_cropped': is_cropped
                })
            
            rejected_images = []
            for row in rejected_results:
                filename = row[1]
                is_cropped = 'crop' in filename.lower() or 'guest' in filename.lower()
                image_url = f"crops/{filename}" if is_cropped else f"uploads/{filename}"
                
                rejected_images.append({
                    'id': row[0],
                    'filename': filename,
                    'uploaded_at': row[2].isoformat() if row[2] else None,
                    'upload_status': row[3],
                    'total_pixels': int(row[4]),
                    'analysis_confidence': float(row[5]),
                    'processing_status': row[6],
                    'original_filename': row[7],
                    'has_segmentation': bool(row[8]),
                    'image_url': image_url,
                    'is_cropped': is_cropped
                })
            
            return jsonify({
                "success": True,
                "user_info": {
                    "name": f"{firstname} {lastname}".strip() or "Guest User",
                    "role": user_role
                },
                "approved_images": approved_images,
                "rejected_images": rejected_images,
                "summary": {
                    "total_approved": len(approved_images),
                    "total_rejected": len(rejected_images),
                    "ready_for_analysis": len([img for img in approved_images if not img['has_segmentation']])
                }
            })
            
    except Exception as e:
        print(f"Error in get_approved_images: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@approved_bp.route('/guest/analyze-approved-image/<int:image_id>', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def analyze_approved_image(image_id):
    """Analyze an approved cropped quadrat image for coral segmentation"""
    try:
        user_id = session.get('user_id')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Verify the cropped image belongs to the user and is approved
            cur.execute("""
                SELECT i.filename, i.upload_status, i.uploader_id, i.total_pixels, i.original_image_path
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE i.id = %s AND i.uploader_id = %s AND i.upload_status = 'approved'
                AND i.processing_status LIKE '%cropped%'
                AND sr.image_id IS NULL
            """, (image_id, user_id))
            
            result = cur.fetchone()
            
            if not result:
                return jsonify({"error": "Cropped quadrat image not found, not approved, or already analyzed"}), 404
            
            filename, upload_status, uploader_id, total_pixels, original_filename = result
            
            # Get the cropped image path (it's already saved in OUTPUT_FOLDER)
            image_path = os.path.join(OUTPUT_FOLDER, filename)
            
            if not os.path.exists(image_path):
                return jsonify({"error": "Cropped image file not found on disk"}), 404
            
            # Perform segmentation analysis on the cropped quadrat
            coverage_data, class_masks, visualization_mask, analyzed_pixels = segment_coral_lifeforms(image_path)
            
            if not coverage_data:
                return jsonify({"error": "Segmentation analysis failed"}), 500
            
            # Save visualization mask
            viz_filename = f"analyzed_{filename}"
            viz_path = os.path.join(MASKS_FOLDER, viz_filename)
            
            if visualization_mask is not None:
                cv2.imwrite(viz_path, cv2.cvtColor(visualization_mask, cv2.COLOR_RGB2BGR))
            
            # Save segmentation results to database
            success = save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")
            
            if not success:
                return jsonify({"error": "Failed to save analysis results"}), 500
            
            # Update image processing status
            cur.execute("""
                UPDATE images 
                SET processing_status = 'cropped_and_segmented', updated_at = NOW()
                WHERE id = %s
            """, (image_id,))
            
            conn.commit()
            
            # Log the analysis
            ActivityLogger.log_activity(
                user_id=user_id,
                activity_type='cropped_quadrat_segmentation',
                description=f"Analyzed cropped quadrat {filename} from {original_filename} - found {len(coverage_data)} coral types",
                category='image_analysis',
                metadata={
                    'image_id': image_id,
                    'cropped_filename': filename,
                    'original_filename': original_filename,
                    'coral_types_found': len(coverage_data),
                    'total_pixels_analyzed': analyzed_pixels,
                    'coral_classes': [coral['class_name'] for coral in coverage_data]
                }
            )
            
            return jsonify({
                "success": True,
                "message": "Cropped quadrat analysis completed successfully",
                "analysis_results": {
                    'image_id': image_id,
                    'cropped_filename': filename,
                    'original_filename': original_filename,
                    'coverage_data': coverage_data,
                    'total_pixels': analyzed_pixels,
                    'visualization_url': f"masks/{viz_filename}",
                    'coral_types_count': len(coverage_data),
                    'image_type': 'cropped_quadrat'
                }
            })
            
    except Exception as e:
        log_system_action(
            user_id=session.get('user_id'),
            action='cropped_image_analysis_error',
            description=f"Error analyzing approved cropped image {image_id}",
            details={'error': str(e), 'image_id': image_id}
        )
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

            
@approved_bp.route('/guest/batch-analyze-approved', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def batch_analyze_approved():
    """Batch analyze multiple approved images with aggregated results"""
    try:
        data = request.get_json()
        image_ids = data.get('image_ids', [])
        
        if not image_ids:
            return jsonify({"error": "No image IDs provided"}), 400
        
        user_id = session.get('user_id')
        results = []
        all_coral_data = {}  # Aggregate coral data across all images
        total_pixels_analyzed = 0
        successful_analyses = 0
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        try:
            with conn.cursor() as cur:
                for image_id in image_ids:
                    try:
                        # Get image info
                        cur.execute("""
                            SELECT filename, total_pixels FROM images 
                            WHERE id = %s AND uploader_id = %s AND upload_status = 'approved'
                        """, (image_id, user_id))
                        
                        result = cur.fetchone()
                        if not result:
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'Image not found or not approved'
                            })
                            continue
                        
                        filename, image_pixels = result
                        image_path = os.path.join(OUTPUT_FOLDER, filename)
                        
                        if not os.path.exists(image_path):
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'Image file not found'
                            })
                            continue
                        
                        # Perform analysis
                        coverage_data, class_masks, visualization_mask, analyzed_pixels = segment_coral_lifeforms(image_path)
                        
                        if coverage_data:
                            # Save results
                            viz_filename = f"batch_analyzed_{filename}"
                            viz_path = os.path.join(MASKS_FOLDER, viz_filename)
                            
                            if visualization_mask is not None:
                                cv2.imwrite(viz_path, cv2.cvtColor(visualization_mask, cv2.COLOR_RGB2BGR))
                            
                            save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")
                            
                            cur.execute("""
                                UPDATE images 
                                SET processing_status = 'cropped_and_segmented', updated_at = NOW()
                                WHERE id = %s
                            """, (image_id,))
                            
                            # Aggregate coral data
                            for coral in coverage_data:
                                class_name = coral['class_name']
                                if class_name not in all_coral_data:
                                    all_coral_data[class_name] = {
                                        'class_name': class_name,
                                        'total_pixels': 0,
                                        'image_count': 0,
                                        'color': coral.get('color', '#3B82F6')
                                    }
                                
                                all_coral_data[class_name]['total_pixels'] += coral['area_px']
                                all_coral_data[class_name]['image_count'] += 1
                            
                            total_pixels_analyzed += analyzed_pixels
                            successful_analyses += 1
                            
                            results.append({
                                'image_id': image_id,
                                'success': True,
                                'data': {
                                    'filename': filename,
                                    'coverage_data': coverage_data,
                                    'total_pixels': analyzed_pixels,
                                    'visualization_url': f"masks/{viz_filename}"
                                }
                            })
                        else:
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'Segmentation failed'
                            })
                            
                    except Exception as e:
                        results.append({
                            'image_id': image_id,
                            'success': False,
                            'error': str(e)
                        })
                
                conn.commit()
        
        finally:
            conn.close()
        
        # Calculate aggregated statistics
        aggregated_coral_data = []
        for class_name, data in all_coral_data.items():
            # Calculate average coverage percentage across all analyzed images
            avg_coverage_percent = (data['total_pixels'] / total_pixels_analyzed * 100) if total_pixels_analyzed > 0 else 0
            
            aggregated_coral_data.append({
                'class_name': class_name,
                'total_pixels': data['total_pixels'],
                'avg_coverage_percent': round(avg_coverage_percent, 2),
                'found_in_images': data['image_count'],
                'color': data['color']
            })
        
        # Sort by coverage percentage
        aggregated_coral_data.sort(key=lambda x: x['avg_coverage_percent'], reverse=True)
        
        # Log batch analysis
        ActivityLogger.log_activity(
            user_id=user_id,
            activity_type='batch_coral_analysis',
            description=f"Batch analyzed {len(image_ids)} approved images - {successful_analyses} successful",
            category='image_analysis',
            metadata={
                'total_images': len(image_ids),
                'successful_analyses': successful_analyses,
                'failed_analyses': len(image_ids) - successful_analyses,
                'total_pixels_analyzed': total_pixels_analyzed,
                'coral_types_found': len(aggregated_coral_data),
                'image_ids': image_ids
            }
        )
        
        return jsonify({
            "success": True,
            "message": f"Batch analysis completed: {successful_analyses}/{len(image_ids)} successful",
            "results": results,
            "aggregated_results": {
                "total_images_analyzed": successful_analyses,
                "total_pixels_analyzed": total_pixels_analyzed,
                "coral_types_found": len(aggregated_coral_data),
                "coral_coverage_data": aggregated_coral_data
            },
            "summary": {
                "total_processed": len(image_ids),
                "successful": successful_analyses,
                "failed": len(image_ids) - successful_analyses
            }
        })
        
    except Exception as e:
        log_system_action(
            user_id=session.get('user_id'),
            action='batch_analysis_error',
            description="Error in batch analysis of approved images",
            details={'error': str(e)}
        )
        return jsonify({"error": str(e)}), 500

@approved_bp.route('/guest/analyzed-images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def get_analyzed_images():
    """Get images that have been analyzed (have segmentation results)"""
    try:
        user_id = session.get('user_id')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get analyzed images with their segmentation results
            cur.execute("""
                SELECT DISTINCT
                    i.id,
                    i.filename,
                    i.uploaded_at,
                    i.upload_status,
                    i.total_pixels,
                    i.location,
                    COUNT(sr.id) as coral_types_found,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'class_name', cl.class_name,
                            'category', cl.category,
                            'color_hex', cl.color_hex,
                            'area_px', sr.area_px,
                            'coverage_percent', sr.coverage_percent
                        ) ORDER BY sr.coverage_percent DESC
                    ) as segmentation_data
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.uploader_id = %s
                GROUP BY i.id, i.filename, i.uploaded_at, i.upload_status, i.total_pixels, i.location
                ORDER BY i.uploaded_at DESC
            """, (user_id,))
            
            analyzed_images = []
            for row in cur.fetchall():
                analyzed_images.append({
                    'id': row[0],
                    'filename': row[1],
                    'uploaded_at': row[2].isoformat() if row[2] else None,
                    'upload_status': row[3],
                    'total_pixels': row[4],
                    'location': {
                        'lat': row[5].x if row[5] else None,
                        'lng': row[5].y if row[5] else None
                    } if row[5] else None,
                    'coral_types_found': row[6],
                    'segmentation_data': row[7],
                    'image_url': f"crops/{row[1]}",
                    'has_location': row[5] is not None
                })
            
            return jsonify({
                "success": True,
                "analyzed_images": analyzed_images,
                "total_analyzed": len(analyzed_images)
            })
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@approved_bp.route('/guest/delete-images', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def delete_guest_images():
    """Delete selected images and their associated data"""
    try:
        user_id = session.get('user_id')
        data = request.get_json()
        image_ids = data.get('image_ids', [])
        
        if not image_ids:
            return jsonify({"error": "No image IDs provided"}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        deleted_count = 0
        deleted_files = []
        
        with conn.cursor() as cur:
            for image_id in image_ids:
                try:
                    # Verify ownership
                    cur.execute("""
                        SELECT filename, quadrat_crop_path 
                        FROM images 
                        WHERE id = %s AND uploader_id = %s
                    """, (image_id, user_id))
                    
                    result = cur.fetchone()
                    if not result:
                        continue
                    
                    filename, crop_path = result
                    
                    # Delete segmentation results first (foreign key constraint)
                    cur.execute("DELETE FROM segmentation_results WHERE image_id = %s", (image_id,))
                    
                    # Delete the image record
                    cur.execute("DELETE FROM images WHERE id = %s", (image_id,))
                    
                    if cur.rowcount > 0:
                        deleted_count += 1
                        
                        # Delete physical files
                        try:
                            # Delete cropped image
                            crop_file_path = os.path.join(OUTPUT_FOLDER, filename)
                            if os.path.exists(crop_file_path):
                                os.remove(crop_file_path)
                                deleted_files.append(crop_file_path)
                            
                            # Delete visualization mask if exists
                            mask_file_path = os.path.join(MASKS_FOLDER, f"analyzed_{filename}")
                            if os.path.exists(mask_file_path):
                                os.remove(mask_file_path)
                                deleted_files.append(mask_file_path)
                                
                        except Exception as file_error:
                            print(f"Error deleting files for image {image_id}: {file_error}")
                            
                except Exception as e:
                    print(f"Error deleting image {image_id}: {e}")
                    continue
            
            conn.commit()
            
            # Log the deletion
            ActivityLogger.log_activity(
                user_id=user_id,
                activity_type='guest_images_deleted',
                description=f"Deleted {deleted_count} images",
                category='image_management',
                metadata={
                    'deleted_count': deleted_count,
                    'deleted_image_ids': image_ids[:deleted_count],
                    'deleted_files': deleted_files
                }
            )
            
            return jsonify({
                "success": True,
                "message": f"Successfully deleted {deleted_count} image(s)",
                "deleted_count": deleted_count
            })
            
    except Exception as e:
        print(f"Error in delete_guest_images: {str(e)}")
        return jsonify({"error": f"Delete failed: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@approved_bp.route('/guest/test-connection', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def test_connection():
    """Test endpoint to debug database connection and basic queries"""
    try:
        user_id = session.get('user_id')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Test basic user query
            cur.execute("SELECT id, roletype, firstname, lastname FROM users WHERE id = %s", (user_id,))
            user_result = cur.fetchone()
            
            # Test basic images query
            cur.execute("SELECT COUNT(*) FROM images WHERE uploader_id = %s", (user_id,))
            image_count = cur.fetchone()[0]
            
            # Test images table structure
            cur.execute("""
                SELECT column_name, data_type, is_nullable 
                FROM information_schema.columns 
                WHERE table_name = 'images' 
                ORDER BY ordinal_position
            """)
            columns = cur.fetchall()
            
            return jsonify({
                "success": True,
                "user_id": user_id,
                "user_result": user_result,
                "image_count": image_count,
                "table_columns": columns
            })
            
    except Exception as e:
        print(f"Test connection error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()