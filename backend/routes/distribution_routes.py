from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import get_db_connection
import psycopg2.extras
from datetime import datetime, timedelta

distribution_bp = Blueprint('distribution', __name__)

@distribution_bp.route('/locations', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_locations_with_images():
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        where_conditions = [
            "location IS NOT NULL",
            # FIXED: Include both processing statuses
            "processing_status IN ('completed', 'manually_included_completed')"
        ]
        params = []
        
        if start_date:
            where_conditions.append("uploaded_at >= %s")
            params.append(start_date)
            
        if end_date:
            where_conditions.append("uploaded_at <= %s")
            params.append(end_date + ' 23:59:59')
        
        where_clause = " AND ".join(where_conditions)
            
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(f"""
                SELECT 
                    ST_X(location) as longitude,
                    ST_Y(location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,
                    MIN(uploaded_at) as earliest_date,
                    MAX(uploaded_at) as latest_date,
                    COUNT(DISTINCT uploader_id) as contributor_count,
                    COALESCE(MIN(municipality), '') as municipality,
                    COALESCE(MIN(barangay), '') as barangay,
                    ARRAY_AGG(DISTINCT i.transect) FILTER (WHERE i.transect IS NOT NULL) as transects,
                    ARRAY_AGG(DISTINCT cl.class_name) FILTER (WHERE cl.class_name IS NOT NULL) as coral_types,
                    COUNT(DISTINCT CASE WHEN i.processing_status = 'manually_included_completed' THEN i.id END) as manually_included_count,
                    STRING_AGG(DISTINCT i.processing_status, ', ') as processing_statuses
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY location
                HAVING COUNT(DISTINCT i.id) > 0
                ORDER BY image_count DESC
            """, params)
            
            locations = cur.fetchall()
            
            result = []
            for index, loc in enumerate(locations):
                def generate_location_id(municipality, barangay, index):
                    if municipality and barangay:
                        return f"{municipality} - {barangay}"
                    elif municipality:
                        return municipality
                    elif barangay:
                        return barangay
                    else:
                        return f"Location {index + 1}"
                
                location_id = generate_location_id(loc['municipality'], loc['barangay'], index)
                
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
                    'image_count': loc['image_count'],
                    'earliest_date': loc['earliest_date'].isoformat() if loc['earliest_date'] else None,
                    'latest_date': loc['latest_date'].isoformat() if loc['latest_date'] else None,
                    'date_range': date_range,
                    'contributor_count': loc['contributor_count'],
                    'coral_types': loc['coral_types'] or [],
                    'municipality': loc['municipality'] or '',
                    'barangay': loc['barangay'] or '',
                    'transects': sorted(loc['transects']) if loc['transects'] else [],
                    'manually_included_count': loc['manually_included_count'] or 0,  # Debug info
                    'processing_statuses': loc['processing_statuses']  # Debug info
                })
            
        conn.close()
        
        print(f"🔍 Distribution locations query returned {len(result)} locations")
        if result:
            total_images = sum(loc['image_count'] for loc in result)
            total_manual = sum(loc['manually_included_count'] for loc in result)
            print(f"   Total images: {total_images} (manually included: {total_manual})")
        
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

@distribution_bp.route('/distribution/locations', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_distribution_locations():
    """Get all locations with image counts including manually included images"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Get date range filters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        with conn.cursor() as cur:
            # Build the date filter condition
            date_condition = ""
            params = []
            
            if start_date:
                date_condition += " AND i.uploaded_at >= %s"
                params.append(start_date)
            
            if end_date:
                date_condition += " AND i.uploaded_at <= %s"
                params.append(end_date + " 23:59:59")  # Include entire end date
            
            # UPDATED: Include both 'completed' and 'manually_included_completed' processing statuses
            cur.execute(f"""
                SELECT 
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude,
                    COALESCE(i.municipality, '') as municipality,
                    COALESCE(i.barangay, '') as barangay,
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT i.uploader_id) as contributor_count,
                    MIN(i.uploaded_at) as earliest_date,
                    MAX(i.uploaded_at) as latest_date,
                    ARRAY_AGG(DISTINCT cl.class_name ORDER BY cl.class_name) FILTER (WHERE cl.class_name IS NOT NULL) as coral_types,
                    CONCAT(
                        COALESCE(i.municipality, ''),
                        CASE WHEN i.municipality IS NOT NULL AND i.barangay IS NOT NULL THEN ' - ' ELSE '' END,
                        COALESCE(i.barangay, ''),
                        CASE WHEN i.municipality IS NULL AND i.barangay IS NULL THEN 
                            CONCAT('Location_', ROUND(ST_X(i.location)::numeric, 4), '_', ROUND(ST_Y(i.location)::numeric, 4))
                        ELSE '' END
                    ) as location_id,
                    STRING_AGG(DISTINCT i.processing_status, ', ') as processing_statuses
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.location IS NOT NULL 
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                {date_condition}
                GROUP BY ST_X(i.location), ST_Y(i.location), i.municipality, i.barangay
                HAVING COUNT(DISTINCT i.id) > 0
                ORDER BY latest_date DESC
            """, params)
            
            locations = []
            for row in cur.fetchall():
                locations.append({
                    'longitude': float(row[0]),
                    'latitude': float(row[1]),
                    'municipality': row[2] if row[2] else None,
                    'barangay': row[3] if row[3] else None,
                    'image_count': row[4],
                    'contributor_count': row[5],
                    'date_range': f"{row[6].strftime('%Y-%m-%d')} to {row[7].strftime('%Y-%m-%d')}" if row[6] and row[7] else '',
                    'coral_types': row[8] if row[8] else [],
                    'location_id': row[9],
                    'processing_statuses': row[10]  # Debug info to see what statuses are included
                })
            
            return jsonify({"locations": locations})
            
    except Exception as e:
        print(f"Error fetching distribution locations: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@distribution_bp.route('/location/<float:lat>/<float:lng>/images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_images(lat, lng):
    """Get all images for a specific location including manually included images"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Get filters from query parameters
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        scope = request.args.get('scope', 'location')  # location or municipality
        transect = request.args.get('transect', 'all')
        
        # Use a small tolerance for location matching
        tolerance = 0.0001
        
        with conn.cursor() as cur:
            # Build the base query conditions
            location_condition = ""
            params = [lng, lat, tolerance]
            
            if scope == 'municipality':
                # Get municipality from the clicked location first
                cur.execute("""
                    SELECT DISTINCT municipality 
                    FROM images 
                    WHERE ST_DWithin(
                        location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s
                    ) AND municipality IS NOT NULL
                    LIMIT 1
                """, (lng, lat, tolerance))
                
                municipality_result = cur.fetchone()
                if municipality_result and municipality_result[0]:
                    location_condition = "AND i.municipality = %s"
                    params = [municipality_result[0]]
                else:
                    # Fallback to location-based if no municipality found
                    location_condition = """AND ST_DWithin(
                        i.location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s
                    )"""
                    params = [lng, lat, tolerance]
            else:
                location_condition = """AND ST_DWithin(
                    i.location,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                    %s
                )"""
                params = [lng, lat, tolerance]
            
            # Add date filters
            if start_date:
                location_condition += " AND i.uploaded_at >= %s"
                params.append(start_date)
            
            if end_date:
                location_condition += " AND i.uploaded_at <= %s"
                params.append(end_date + " 23:59:59")
            
            # Add transect filter
            if transect != 'all':
                location_condition += " AND i.transect = %s"
                params.append(int(transect))
            
            # UPDATED: Include both processing statuses and add processing_status to the SELECT
            cur.execute(f"""
                SELECT DISTINCT
                    i.id,
                    i.filename,
                    i.uploaded_at,
                    i.analysis_confidence,
                    i.total_pixels,
                    i.transect,
                    i.processing_status,
                    CONCAT(u.firstname, ' ', u.lastname) as uploader_name,
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude
                FROM images i
                LEFT JOIN users u ON i.uploader_id = u.id
                WHERE i.location IS NOT NULL
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                {location_condition}
                ORDER BY i.uploaded_at DESC
            """, params)
            
            images = []
            for row in cur.fetchall():
                images.append({
                    'id': row[0],
                    'filename': row[1],
                    'uploaded_at': row[2].isoformat() if row[2] else None,
                    'analysis_confidence': float(row[3]) if row[3] else 0,
                    'total_pixels': row[4],
                    'transect': row[5],
                    'processing_status': row[6],  # Include for debugging
                    'manually_included': row[6] == 'manually_included_completed',  # Derived from processing_status
                    'uploader_name': row[7] or 'Unknown',
                    'longitude': float(row[8]) if row[8] else lng,
                    'latitude': float(row[9]) if row[9] else lat
                })
            
            print(f"🔍 Location images query returned {len(images)} images")
            if images:
                processing_statuses = [img['processing_status'] for img in images]
                print(f"   Processing statuses: {set(processing_statuses)}")
                manually_included_count = sum(1 for img in images if img.get('manually_included', False))
                print(f"   Manually included count: {manually_included_count}")
            
            return jsonify({
                "images": images,
                "filters": {
                    "scope": scope,
                    "transect": transect,
                    "start_date": start_date,
                    "end_date": end_date
                },
                "debug_info": {
                    "total_images": len(images),
                    "processing_statuses": list(set([img['processing_status'] for img in images])),
                    "manually_included_count": sum(1 for img in images if img.get('manually_included', False))
                }
            })
            
    except Exception as e:
        print(f"Error fetching location images: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@distribution_bp.route('/location/<float:lat>/<float:lng>/analytics', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_analytics(lat, lng):
    """Get aggregated coral analytics with transect and scope filtering"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        transect_filter = request.args.get('transect')
        scope = request.args.get('scope', 'location')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        tolerance = 0.0001
        
        # Build WHERE conditions based on scope
        if scope == 'municipality':
            # Get municipality for this location
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT municipality 
                    FROM images 
                    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)
                    AND municipality IS NOT NULL 
                    LIMIT 1
                """, (lng, lat, tolerance))
                
                result = cur.fetchone()
                if not result or not result[0]:
                    return jsonify({"error": "No municipality found for this location"}), 404
                    
                municipality = result[0]
            
            where_conditions = [
                "i.municipality = %s",
                # FIXED: Include both processing statuses
                "i.processing_status IN ('completed', 'manually_included_completed')"
            ]
            params = [municipality]
        else:
            # Default: location scope
            where_conditions = [
                "ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)",
                # FIXED: Include both processing statuses
                "i.processing_status IN ('completed', 'manually_included_completed')"
            ]
            params = [lng, lat, tolerance]
        
        if start_date:
            where_conditions.append("i.uploaded_at >= %s")
            params.append(start_date)
            
        if end_date:
            where_conditions.append("i.uploaded_at <= %s")
            params.append(end_date + ' 23:59:59')
            
        if transect_filter and transect_filter != 'all':
            where_conditions.append("i.transect = %s")
            params.append(int(transect_filter))
        
        where_clause = " AND ".join(where_conditions)
        
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            # Get coral analytics with filtering
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
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT i.transect) as transect_count
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
                    COUNT(sr.id) as detection_count,
                    COUNT(DISTINCT i.transect) as transects_on_date
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY DATE(i.uploaded_at), cl.class_name
                ORDER BY date ASC, cl.class_name
            """, params)
            
            trend_data = cur.fetchall()
            
            # Get transect-specific statistics
            cur.execute(f"""
                SELECT 
                    i.transect,
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT sr.class_id) as coral_types,
                    AVG(sr.coverage_percent) as avg_coverage,
                    AVG(i.analysis_confidence) as avg_confidence
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE {where_clause}
                AND i.transect IS NOT NULL
                GROUP BY i.transect
                ORDER BY i.transect
            """, params)
            
            transect_stats = cur.fetchall()
            
            # Get overall statistics
            cur.execute(f"""
                SELECT 
                    COUNT(DISTINCT i.id) as total_images,
                    COUNT(DISTINCT i.uploader_id) as total_contributors,
                    SUM(i.total_pixels) as total_pixels_analyzed,
                    AVG(i.analysis_confidence) as avg_confidence,
                    COUNT(DISTINCT cl.class_name) as unique_coral_types,
                    COUNT(DISTINCT i.transect) as unique_transects,
                    COUNT(DISTINCT i.municipality) as unique_municipalities,
                    COUNT(DISTINCT CASE WHEN i.processing_status = 'manually_included_completed' THEN i.id END) as manually_included_count
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
                'image_count': coral['image_count'],
                'transect_count': coral['transect_count']
            })
        
        trend_result = []
        for trend in trend_data:
            trend_result.append({
                'date': trend['date'].isoformat(),
                'class_name': trend['class_name'],
                'avg_coverage': float(trend['avg_coverage']) if trend['avg_coverage'] else 0,
                'detection_count': trend['detection_count'],
                'transects_on_date': trend['transects_on_date']
            })
            
        transect_result = []
        for transect in transect_stats:
            transect_result.append({
                'transect': transect['transect'],
                'image_count': transect['image_count'],
                'coral_types': transect['coral_types'],
                'avg_coverage': float(transect['avg_coverage']) if transect['avg_coverage'] else 0,
                'avg_confidence': float(transect['avg_confidence']) if transect['avg_confidence'] else 0
            })
        
        return jsonify({
            "coral_analytics": analytics_result,
            "trend_data": trend_result,
            "transect_statistics": transect_result,
            "statistics": {
                'total_images': stats['total_images'] or 0,
                'total_contributors': stats['total_contributors'] or 0,
                'total_pixels_analyzed': stats['total_pixels_analyzed'] or 0,
                'avg_confidence': float(stats['avg_confidence']) if stats['avg_confidence'] else 0,
                'unique_coral_types': stats['unique_coral_types'] or 0,
                'unique_transects': stats['unique_transects'] or 0,
                'unique_municipalities': stats['unique_municipalities'] or 0,
                'manually_included_count': stats['manually_included_count'] or 0  # Add this
            },
            "location": {"lat": lat, "lng": lng},
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date,
                "transect": transect_filter,
                "scope": scope
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
            # FIXED: Include both processing statuses and use processing_status for manual count
            cur.execute("""
                SELECT 
                    MIN(uploaded_at)::date as min_date,
                    MAX(uploaded_at)::date as max_date,
                    COUNT(DISTINCT id) as total_images,
                    COUNT(DISTINCT DATE(uploaded_at)) as total_days,
                    COUNT(DISTINCT location) as total_locations,
                    COUNT(DISTINCT transect) as total_transects,
                    COUNT(DISTINCT municipality) as total_municipalities,
                    COUNT(DISTINCT CASE WHEN processing_status = 'manually_included_completed' THEN id END) as manually_included_count,
                    STRING_AGG(DISTINCT processing_status, ', ') as processing_statuses
                FROM images 
                WHERE location IS NOT NULL 
                  AND processing_status IN ('completed', 'manually_included_completed')
            """)
            
            result = cur.fetchone()
            
        conn.close()
        
        print(f"🔍 Date range query results:")
        print(f"   Total images: {result[2] or 0}")
        print(f"   Manually included: {result[7] or 0}")
        print(f"   Processing statuses: {result[8]}")
        
        return jsonify({
            "min_date": result[0].isoformat() if result[0] else None,
            "max_date": result[1].isoformat() if result[1] else None,
            "total_images": result[2] or 0,
            "total_days": result[3] or 0,
            "total_locations": result[4] or 0,
            "total_transects": result[5] or 0,
            "total_municipalities": result[6] or 0,
            "manually_included_count": result[7] or 0,
            "processing_statuses": result[8]
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