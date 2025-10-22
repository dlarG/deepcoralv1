from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import get_db_connection
import psycopg2.extras
from datetime import datetime, timedelta

distribution_bp = Blueprint('distribution', __name__)

@distribution_bp.route('/locations', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_locations_with_images():
    """Get all locations with image counts and date ranges"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        # Build WHERE clause for date filtering
        where_conditions = [
            "location IS NOT NULL",
            "processing_status = 'completed'"
        ]
        params = []
        
        if start_date:
            where_conditions.append("uploaded_at >= %s")
            params.append(start_date)
            
        if end_date:
            where_conditions.append("uploaded_at <= %s")
            params.append(end_date + ' 23:59:59')  # Include entire end date
        
        where_clause = " AND ".join(where_conditions)
            
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Fixed query - count DISTINCT images, not segmentation results
            cur.execute(f"""
                SELECT 
                    ST_X(location) as longitude,
                    ST_Y(location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,  -- Count DISTINCT images only
                    MIN(uploaded_at) as earliest_date,
                    MAX(uploaded_at) as latest_date,
                    COUNT(DISTINCT uploader_id) as contributor_count,
                    -- Get coral types from segmentation results (optional)
                    ARRAY_AGG(DISTINCT cl.class_name) FILTER (WHERE cl.class_name IS NOT NULL) as coral_types
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY location  -- Group by exact location coordinates
                HAVING COUNT(DISTINCT i.id) > 0  -- Only locations with images
                ORDER BY image_count DESC
            """, params)
            
            locations = cur.fetchall()
            
            # Convert to JSON-serializable format
            result = []
            for index, loc in enumerate(locations):
                # Create a more readable location_id
                location_id = f"LOC-{index + 1}"
                
                # Format date range string
                if loc['earliest_date'] and loc['latest_date']:
                    if loc['earliest_date'].date() == loc['latest_date'].date():
                        date_range = loc['earliest_date'].strftime('%Y-%m-%d')
                    else:
                        date_range = f"{loc['earliest_date'].strftime('%Y-%m-%d')} to {loc['latest_date'].strftime('%Y-%m-%d')}"
                else:
                    date_range = "Unknown"
                
                result.append({
                    'location_id': location_id,
                    'latitude': float(loc['latitude']),
                    'longitude': float(loc['longitude']),
                    'image_count': loc['image_count'],  # This should now be accurate
                    'earliest_date': loc['earliest_date'].isoformat() if loc['earliest_date'] else None,
                    'latest_date': loc['latest_date'].isoformat() if loc['latest_date'] else None,
                    'date_range': date_range,
                    'contributor_count': loc['contributor_count'],
                    'coral_types': loc['coral_types'] or []
                })
            
        conn.close()
        return jsonify({
            "locations": result,
            "total_locations": len(result),
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date
            }
        })
        
    except Exception as e:
        print(f"Error fetching locations: {str(e)}")
        return jsonify({"error": f"Failed to fetch locations: {str(e)}"}), 500

@distribution_bp.route('/location/<float:lat>/<float:lng>/images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_images(lat, lng):
    """Get images for a specific location with optional date filtering"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Use a small tolerance for location matching (about 10 meters)
        tolerance = 0.0001
        
        # Build WHERE clause
        where_conditions = [
            "ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)",
            "i.processing_status = 'completed'"
        ]
        params = [lng, lat, tolerance]
        
        if start_date:
            where_conditions.append("i.uploaded_at >= %s")
            params.append(start_date)
            
        if end_date:
            where_conditions.append("i.uploaded_at <= %s")
            params.append(end_date + ' 23:59:59')
        
        where_clause = " AND ".join(where_conditions)
        
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Simplified query - get images first, then join segmentation data
            cur.execute(f"""
                SELECT 
                    i.id,
                    i.filename,
                    i.uploaded_at,
                    i.total_pixels,
                    i.analyzed_area_px,
                    i.analysis_confidence,
                    COALESCE(u.firstname || ' ' || u.lastname, u.username, 'Unknown') as uploader_name,
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude
                FROM images i
                LEFT JOIN users u ON i.uploader_id = u.id
                WHERE {where_clause}
                ORDER BY i.uploaded_at DESC
            """, params)
            
            images = cur.fetchall()
            
            # Convert to JSON-serializable format
            result = []
            for img in images:
                result.append({
                    'id': img['id'],
                    'filename': img['filename'],
                    'uploaded_at': img['uploaded_at'].isoformat(),
                    'total_pixels': img['total_pixels'],
                    'analyzed_area_px': img['analyzed_area_px'],
                    'analysis_confidence': float(img['analysis_confidence']) if img['analysis_confidence'] else 0,
                    'uploader_name': img['uploader_name'],
                    'longitude': float(img['longitude']),
                    'latitude': float(img['latitude'])
                })
        
        conn.close()
        return jsonify({
            "images": result,
            "location": {"lat": lat, "lng": lng},
            "total_count": len(result),
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date
            }
        })
        
    except Exception as e:
        print(f"Error fetching location images: {str(e)}")
        return jsonify({"error": f"Failed to fetch images: {str(e)}"}), 500

@distribution_bp.route('/location/<float:lat>/<float:lng>/analytics', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_analytics(lat, lng):
    """Get aggregated coral analytics for a specific location and date range"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        tolerance = 0.0001
        
        # Build WHERE clause
        where_conditions = [
            "ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)",
            "i.processing_status = 'completed'"
        ]
        params = [lng, lat, tolerance]
        
        if start_date:
            where_conditions.append("i.uploaded_at >= %s")
            params.append(start_date)
            
        if end_date:
            where_conditions.append("i.uploaded_at <= %s")
            params.append(end_date + ' 23:59:59')
        
        where_clause = " AND ".join(where_conditions)
        
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Get coral analytics with proper date filtering
            cur.execute(f"""
                SELECT 
                    cl.class_name,
                    cl.scientific_name,
                    cl.category,
                    cl.color_hex,
                    COUNT(sr.id) as occurrence_count,
                    SUM(sr.area_px) as total_area_px,
                    AVG(sr.coverage_percent) as avg_coverage_percent,
                    AVG(sr.avg_confidence) as avg_confidence,
                    COUNT(DISTINCT i.id) as image_count
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY cl.id, cl.class_name, cl.scientific_name, cl.category, cl.color_hex
                HAVING AVG(sr.coverage_percent) > 0
                ORDER BY avg_coverage_percent DESC
            """, params)
            
            coral_analytics = cur.fetchall()
            
            # Get time series data for trends
            cur.execute(f"""
                SELECT 
                    DATE(i.uploaded_at) as date,
                    cl.class_name,
                    AVG(sr.coverage_percent) as avg_coverage,
                    COUNT(sr.id) as detection_count
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY DATE(i.uploaded_at), cl.class_name
                ORDER BY date ASC, cl.class_name
            """, params)
            
            trend_data = cur.fetchall()
            
            # Get overall statistics
            cur.execute(f"""
                SELECT 
                    COUNT(DISTINCT i.id) as total_images,
                    COUNT(DISTINCT i.uploader_id) as total_contributors,
                    SUM(i.total_pixels) as total_pixels_analyzed,
                    AVG(i.analysis_confidence) as avg_confidence,
                    COUNT(DISTINCT cl.class_name) as unique_coral_types
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
            """, params)
            
            stats = cur.fetchone()
        
        conn.close()
        
        # Format results
        analytics_result = []
        for coral in coral_analytics:
            analytics_result.append({
                'class_name': coral['class_name'],
                'scientific_name': coral['scientific_name'],
                'category': coral['category'],
                'color_hex': coral['color_hex'],
                'occurrence_count': coral['occurrence_count'],
                'total_area_px': coral['total_area_px'],
                'avg_coverage_percent': float(coral['avg_coverage_percent']) if coral['avg_coverage_percent'] else 0,
                'avg_confidence': float(coral['avg_confidence']) if coral['avg_confidence'] else 0,
                'image_count': coral['image_count']
            })
        
        trend_result = []
        for trend in trend_data:
            trend_result.append({
                'date': trend['date'].isoformat(),
                'class_name': trend['class_name'],
                'avg_coverage': float(trend['avg_coverage']) if trend['avg_coverage'] else 0,
                'detection_count': trend['detection_count']
            })
        
        return jsonify({
            "coral_analytics": analytics_result,
            "trend_data": trend_result,
            "statistics": {
                'total_images': stats['total_images'] or 0,
                'total_contributors': stats['total_contributors'] or 0,
                'total_pixels_analyzed': stats['total_pixels_analyzed'] or 0,
                'avg_confidence': float(stats['avg_confidence']) if stats['avg_confidence'] else 0,
                'unique_coral_types': stats['unique_coral_types'] or 0
            },
            "location": {"lat": lat, "lng": lng},
            "date_range": {
                "start_date": start_date,
                "end_date": end_date
            }
        })
        
    except Exception as e:
        print(f"Error fetching location analytics: {str(e)}")
        return jsonify({"error": f"Failed to fetch analytics: {str(e)}"}), 500

@distribution_bp.route('/date-range', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_date_range():
    """Get the overall date range of available data"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    MIN(uploaded_at)::date as min_date,
                    MAX(uploaded_at)::date as max_date,
                    COUNT(DISTINCT id) as total_images,
                    COUNT(DISTINCT DATE(uploaded_at)) as total_days,
                    COUNT(DISTINCT location) as total_locations
                FROM images 
                WHERE location IS NOT NULL 
                  AND processing_status = 'completed'
            """)
            
            result = cur.fetchone()
            
        conn.close()
        
        return jsonify({
            "min_date": result[0].isoformat() if result[0] else None,
            "max_date": result[1].isoformat() if result[1] else None,
            "total_images": result[2] or 0,
            "total_days": result[3] or 0,
            "total_locations": result[4] or 0
        })
        
    except Exception as e:
        print(f"Error fetching date range: {str(e)}")
        return jsonify({"error": f"Failed to fetch date range: {str(e)}"}), 500
    
@distribution_bp.route('/images/<int:image_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def delete_image(image_id):
    """Delete an image and all its associated data"""
    
    # Handle OPTIONS preflight request
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # First check if image exists and get filename
            cur.execute("SELECT filename FROM images WHERE id = %s", (image_id,))
            image = cur.fetchone()
            
            if not image:
                return jsonify({"error": "Image not found"}), 404
                
            filename = image[0]
            
            # Delete cascade: coral_instances -> segmentation_results -> images
            # Delete coral instances first (if any exist)
            cur.execute("""
                DELETE FROM coral_instances 
                WHERE segmentation_id IN (
                    SELECT id FROM segmentation_results WHERE image_id = %s
                )
            """, (image_id,))
            
            # Delete segmentation results
            cur.execute("DELETE FROM segmentation_results WHERE image_id = %s", (image_id,))
            
            # Delete the image record
            cur.execute("DELETE FROM images WHERE id = %s", (image_id,))
            
            # Try to delete the physical files
            try:
                import os
                from flask import current_app
                
                # Delete crop file
                crops_path = os.path.join(current_app.root_path, '..', 'frontend', 'public', 'crops', filename)
                if os.path.exists(crops_path):
                    os.remove(crops_path)
                    print(f"Deleted crop file: {filename}")
                
                # Delete mask files if they exist
                mask_base = filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '')
                masks_dir = os.path.join(current_app.root_path, '..', 'frontend', 'public', 'masks')
                if os.path.exists(masks_dir):
                    for mask_file in os.listdir(masks_dir):
                        if mask_base in mask_file:
                            mask_path = os.path.join(masks_dir, mask_file)
                            os.remove(mask_path)
                            print(f"Deleted mask file: {mask_file}")
                            
            except Exception as file_error:
                print(f"Could not delete file {filename}: {str(file_error)}")
                # Continue anyway, database cleanup is more important
            
            conn.commit()
            
        conn.close()
        return jsonify({
            "message": "Image deleted successfully",
            "deleted_image_id": image_id
        }), 200
        
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        print(f"Error deleting image: {str(e)}")
        return jsonify({"error": f"Failed to delete image: {str(e)}"}), 500