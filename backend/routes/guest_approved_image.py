from flask import Blueprint, jsonify, request, session
from flask_cors import cross_origin
from db import get_db_connection
from utils.auth_utils import login_required
from routes.activity_log import log_system_action, ActivityLogger
from datetime import datetime
import os
import warnings
warnings.filterwarnings("ignore")

approved_bp = Blueprint('approved', __name__)

# Import segmentation functionality from upload_image.py (already working)
try:
    from routes.upload_image import (
        SEGMENTATION_AVAILABLE,
        segmentation_model, 
        CORAL_CLASSES, 
        segment_coral_lifeforms,
        save_segmentation_results, 
        MASKS_FOLDER, 
        OUTPUT_FOLDER,
        COLOR_MAP
    )
    print(f"✅ Successfully imported segmentation functions from upload_image.py")
    print(f"🔬 Segmentation available: {SEGMENTATION_AVAILABLE}")
except ImportError as e:
    print(f"❌ Failed to import segmentation functions: {e}")
    SEGMENTATION_AVAILABLE = False

@approved_bp.route('/guest/pending-approved-images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def get_pending_approved_images():
    """Get pending_approved images for the current guest user"""
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
            
            # Get pending_approved images (ready for analysis)
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
                AND i.upload_status = 'pending_approved'
                ORDER BY i.uploaded_at DESC
            """, (user_id,))
            
            pending_approved_results = cur.fetchall()
            
            # Process results
            pending_approved_images = []
            for row in pending_approved_results:
                filename = row[1]
                is_cropped = 'crop' in filename.lower() or 'guest' in filename.lower()
                image_url = f"crops/{filename}" if is_cropped else f"uploads/{filename}"
                
                pending_approved_images.append({
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
                    'is_cropped': is_cropped,
                    'ready_for_analysis': not bool(row[8])  # Can analyze if no segmentation yet
                })
            
            return jsonify({
                "success": True,
                "user_info": {
                    "name": f"{firstname} {lastname}".strip() or "Guest User",
                    "role": user_role
                },
                "pending_approved_images": pending_approved_images,
                "summary": {
                    "total_pending_approved": len(pending_approved_images),
                    "ready_for_analysis": len([img for img in pending_approved_images if not img['has_segmentation']])
                },
                "segmentation_available": SEGMENTATION_AVAILABLE
            })
            
    except Exception as e:
        print(f"❌ Error in get_pending_approved_images: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@approved_bp.route('/guest/analyze-pending-approved/<int:image_id>', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def analyze_pending_approved_image(image_id):
    """Analyze a pending_approved cropped quadrat image for coral segmentation"""
    try:
        user_id = session.get('user_id')
        
        if not SEGMENTATION_AVAILABLE:
            return jsonify({
                "error": "Segmentation model not available", 
                "details": "The coral segmentation model is not loaded. Please check server configuration."
            }), 503
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Verify the image belongs to the user and is pending_approved
            cur.execute("""
                SELECT i.filename, i.upload_status, i.uploader_id, i.total_pixels, i.original_image_path
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE i.id = %s AND i.uploader_id = %s AND i.upload_status = 'pending_approved'
                AND sr.image_id IS NULL
            """, (image_id, user_id))
            
            result = cur.fetchone()
            
            if not result:
                return jsonify({"error": "Image not found, not pending_approved, or already analyzed"}), 404
            
            filename, upload_status, uploader_id, total_pixels, original_filename = result
            
            # Get the cropped image path (it's already saved in OUTPUT_FOLDER)
            image_path = os.path.join(OUTPUT_FOLDER, filename)
            
            print(f"🔍 Looking for image at: {image_path}")
            print(f"📁 File exists: {os.path.exists(image_path)}")
            
            if not os.path.exists(image_path):
                return jsonify({
                    "error": f"Image file not found on disk: {filename}",
                    "details": f"Expected path: {image_path}"
                }), 404
            
            print(f"🔬 Starting segmentation analysis for {filename}...")
            
            # Use the imported segmentation function (same as biologist upload)
            coverage_data, class_masks, overlay_image, mask_image, analyzed_pixels = segment_coral_lifeforms(image_path)
            
            print(f"📊 Analysis results: {len(coverage_data)} coral types found, {analyzed_pixels} pixels analyzed")
            
            if analyzed_pixels == 0:
                return jsonify({
                    "error": "Failed to analyze image - no pixels processed",
                    "details": f"The segmentation process returned 0 pixels for {filename}"
                }), 500
            
            # Save visualization mask
            viz_filename = f"guest_analyzed_{filename}"
            viz_path = os.path.join(MASKS_FOLDER, viz_filename)
            
            if overlay_image is not None:
                print(f"💾 Saving visualization to: {viz_path}")
                # Convert RGB to BGR for OpenCV
                import cv2
                cv2.imwrite(viz_path, cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR))
                print(f"✅ Visualization saved successfully")
            else:
                print("⚠️ No overlay image generated")
            
            # Save segmentation results to database using the imported function
            if coverage_data:
                save_success = save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")
                print(f"💾 Database save result: {save_success}")
            else:
                print("ℹ️ No coral coverage data to save")
                save_success = True  # No error, just no coral found
            
            if not save_success:
                return jsonify({"error": "Failed to save analysis results to database"}), 500
            
            # Update image processing status to indicate analysis is complete
            cur.execute("""
                UPDATE images 
                SET processing_status = 'completed', updated_at = NOW(), upload_status = 'approved'
                WHERE id = %s
            """, (image_id,))
            
            conn.commit()
            
            print(f"✅ Analysis completed and saved for image {filename}")
            
            # Log the analysis
            try:
                ActivityLogger.log_activity(
                    user_id=user_id,
                    activity_type='pending_approved_segmentation',
                    description=f"Analyzed pending_approved image {filename} - found {len(coverage_data)} coral types",
                    category='image_analysis',
                    metadata={
                        'image_id': image_id,
                        'filename': filename,
                        'original_filename': original_filename or filename,
                        'coral_types_found': len(coverage_data),
                        'total_pixels_analyzed': analyzed_pixels,
                        'coral_classes': [coral['class_name'] for coral in coverage_data] if coverage_data else []
                    }
                )
            except Exception as log_error:
                print(f"⚠️ Activity logging failed: {log_error}")
                # Don't fail the request if logging fails
            
            return jsonify({
                "success": True,
                "message": "Analysis completed successfully",
                "analysis_results": {
                    'image_id': image_id,
                    'filename': filename,
                    'original_filename': original_filename or filename,
                    'coverage_data': coverage_data,
                    'total_pixels': analyzed_pixels,
                    'visualization_url': f"masks/{viz_filename}",
                    'coral_types_count': len(coverage_data),
                    'has_coral_data': len(coverage_data) > 0
                }
            })
            
    except Exception as e:
        print(f"❌ Error in analyze_pending_approved_image: {str(e)}")
        import traceback
        traceback.print_exc()
        
        try:
            log_system_action(
                user_id=session.get('user_id'),
                action='pending_approved_analysis_error',
                description=f"Error analyzing pending_approved image {image_id}",
                details={'error': str(e), 'image_id': image_id}
            )
        except:
            pass  # Don't fail if logging fails
            
        return jsonify({
            "error": f"Analysis failed: {str(e)}",
            "details": "Please check server logs for more information"
        }), 500
    finally:
        if conn:
            conn.close()

@approved_bp.route('/guest/batch-analyze-pending-approved', methods=['POST'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def batch_analyze_pending_approved():
    """Batch analyze multiple pending_approved images"""
    try:
        if not SEGMENTATION_AVAILABLE:
            return jsonify({
                "error": "Segmentation model not available",
                "details": "The coral segmentation model is not loaded. Please check server configuration."
            }), 503
            
        data = request.get_json()
        image_ids = data.get('image_ids', [])
        
        if not image_ids:
            return jsonify({"error": "No image IDs provided"}), 400
        
        user_id = session.get('user_id')
        results = []
        all_coral_data = {}
        total_pixels_analyzed = 0
        successful_analyses = 0
        
        print(f"🚀 Starting batch analysis of {len(image_ids)} images...")
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        try:
            with conn.cursor() as cur:
                for idx, image_id in enumerate(image_ids):
                    print(f"📊 Processing image {idx + 1}/{len(image_ids)}: ID {image_id}")
                    
                    try:
                        # Get image info
                        cur.execute("""
                            SELECT filename, total_pixels, original_image_path FROM images 
                            WHERE id = %s AND uploader_id = %s AND upload_status = 'pending_approved'
                        """, (image_id, user_id))
                        
                        result = cur.fetchone()
                        if not result:
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'Image not found or not pending_approved'
                            })
                            continue
                        
                        filename, image_pixels, original_filename = result
                        image_path = os.path.join(OUTPUT_FOLDER, filename)
                        
                        if not os.path.exists(image_path):
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'Image file not found'
                            })
                            continue
                        
                        # Perform analysis using imported function
                        coverage_data, class_masks, overlay_image, mask_image, analyzed_pixels = segment_coral_lifeforms(image_path)
                        
                        if analyzed_pixels == 0:
                            results.append({
                                'image_id': image_id,
                                'success': False,
                                'error': 'No pixels analyzed'
                            })
                            continue
                        
                        # Save results
                        viz_filename = f"guest_batch_{idx}_{filename}"
                        viz_path = os.path.join(MASKS_FOLDER, viz_filename)
                        
                        if overlay_image is not None:
                            import cv2
                            cv2.imwrite(viz_path, cv2.cvtColor(overlay_image, cv2.COLOR_RGB2BGR))
                        
                        # Save to database
                        if coverage_data:
                            save_segmentation_results(image_id, coverage_data, f"masks/{viz_filename}")
                        
                        # Update processing status
                        cur.execute("""
                            UPDATE images 
                            SET processing_status = 'completed', updated_at = NOW(), upload_status = 'approved'
                            WHERE id = %s
                        """, (image_id,))
                        
                        # Aggregate coral data
                        if coverage_data:
                            for coral in coverage_data:
                                class_name = coral['class_name']
                                if class_name not in all_coral_data:
                                    all_coral_data[class_name] = {
                                        'class_name': class_name,
                                        'total_pixels': 0,
                                        'image_count': 0,
                                        'color': coral.get('color', '#3B82F6'),
                                        'category': coral.get('category', 'unknown')
                                    }
                                
                                all_coral_data[class_name]['total_pixels'] += coral['pixel_count']
                                all_coral_data[class_name]['image_count'] += 1
                        
                        total_pixels_analyzed += analyzed_pixels
                        successful_analyses += 1
                        
                        results.append({
                            'image_id': image_id,
                            'success': True,
                            'data': {
                                'filename': filename,
                                'original_filename': original_filename or filename,
                                'coverage_data': coverage_data,
                                'total_pixels': analyzed_pixels,
                                'visualization_url': f"masks/{viz_filename}",
                                'has_coral_data': len(coverage_data) > 0
                            }
                        })
                        
                        print(f"✅ Successfully analyzed {filename}: {len(coverage_data)} coral types")
                        
                    except Exception as e:
                        print(f"❌ Error processing image {image_id}: {str(e)}")
                        results.append({
                            'image_id': image_id,
                            'success': False,
                            'error': str(e)
                        })
                
                conn.commit()
                print(f"🎉 Batch analysis completed: {successful_analyses}/{len(image_ids)} successful")
        
        finally:
            conn.close()
        
        # Calculate aggregated statistics
        aggregated_coral_data = []
        for class_name, data in all_coral_data.items():
            avg_coverage_percent = (data['total_pixels'] / total_pixels_analyzed * 100) if total_pixels_analyzed > 0 else 0
            
            aggregated_coral_data.append({
                'class_name': class_name,
                'total_pixels': data['total_pixels'],
                'avg_coverage_percent': round(avg_coverage_percent, 2),
                'found_in_images': data['image_count'],
                'color': data['color'],
                'category': data['category']
            })
        
        # Sort by coverage percentage
        aggregated_coral_data.sort(key=lambda x: x['avg_coverage_percent'], reverse=True)
        
        # Log batch analysis
        try:
            ActivityLogger.log_activity(
                user_id=user_id,
                activity_type='batch_pending_approved_analysis',
                description=f"Batch analyzed {len(image_ids)} pending_approved images - {successful_analyses} successful",
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
        except Exception as log_error:
            print(f"⚠️ Batch analysis logging failed: {log_error}")
        
        return jsonify({
            "success": True,
            "message": f"Batch analysis completed: {successful_analyses}/{len(image_ids)} successful",
            "results": results,
            "batch_statistics": {
                "total_images_processed": successful_analyses,
                "total_images_rejected": len(image_ids) - successful_analyses,
                "total_pixels": total_pixels_analyzed,
                "coverage_summary": aggregated_coral_data
            },
            "aggregated_results": {
                "total_images_analyzed": successful_analyses,
                "total_pixels_analyzed": total_pixels_analyzed,
                "coral_types_found": len(aggregated_coral_data),
                "coral_coverage_data": aggregated_coral_data
            }
        })
        
    except Exception as e:
        print(f"❌ Error in batch_analyze_pending_approved: {str(e)}")
        import traceback
        traceback.print_exc()
        
        try:
            log_system_action(
                user_id=session.get('user_id'),
                action='batch_pending_approved_error',
                description="Error in batch analysis of pending_approved images",
                details={'error': str(e)}
            )
        except:
            pass
            
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
                            'class_name', sr.class_name,
                            'category', 'hard_coral',
                            'color_hex', sr.color_hex,
                            'area_px', sr.area_px,
                            'coverage_percent', sr.coverage_percent
                        ) ORDER BY sr.coverage_percent DESC
                    ) as segmentation_data
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
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
                        SELECT filename 
                        FROM images 
                        WHERE id = %s AND uploader_id = %s
                    """, (image_id, user_id))
                    
                    result = cur.fetchone()
                    if not result:
                        continue
                    
                    filename = result[0]
                    
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
                            mask_file_path = os.path.join(MASKS_FOLDER, f"guest_analyzed_{filename}")
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
            try:
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
            except Exception as log_error:
                print(f"⚠️ Delete logging failed: {log_error}")
            
            return jsonify({
                "success": True,
                "message": f"Successfully deleted {deleted_count} image(s)",
                "deleted_count": deleted_count
            })
            
    except Exception as e:
        print(f"❌ Error in delete_guest_images: {str(e)}")
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
            
            return jsonify({
                "success": True,
                "user_id": user_id,
                "user_result": user_result,
                "image_count": image_count,
                "segmentation_available": SEGMENTATION_AVAILABLE
            })
            
    except Exception as e:
        print(f"❌ Test connection error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()