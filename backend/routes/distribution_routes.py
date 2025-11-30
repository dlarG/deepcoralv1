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
    """Get all locations with CORRECTED total coverage percentages for map display"""
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
                params.append(end_date + " 23:59:59")
            
            # FIXED: Use the working query from your test, but format it for the endpoint
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
                    STRING_AGG(DISTINCT i.processing_status, ', ') as processing_statuses,
                    -- FIXED: Use the exact same calculation that works in your test query
                    CASE 
                        WHEN SUM(i.total_pixels) > 0 AND SUM(sr.area_px) > 0 THEN
                            (SUM(sr.area_px)::FLOAT / SUM(i.total_pixels)::FLOAT) * 100
                        ELSE 0 
                    END as total_coverage_percent
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.location IS NOT NULL 
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                {date_condition}
                GROUP BY ST_X(i.location), ST_Y(i.location), i.municipality, i.barangay
                HAVING COUNT(DISTINCT i.id) > 0
                ORDER BY total_coverage_percent DESC
            """, params)
            
            locations = []
            for row in cur.fetchall():
                coverage_value = float(row[11]) if row[11] else 0
                
                # DEBUG: Print detailed info for first few locations
                if len(locations) < 3:
                    print(f"🔍 Location {len(locations)+1}:")
                    print(f"   Coordinates: {row[1]:.6f}, {row[0]:.6f}")
                    print(f"   Image count: {row[4]}")
                    print(f"   Coverage: {coverage_value:.2f}%")
                
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
                    'processing_statuses': row[10],
                    'total_coverage_percent': coverage_value  # This should now work correctly
                })
            
            print(f"🔍 Found {len(locations)} locations with coverage data")
            if locations:
                coverage_values = [loc['total_coverage_percent'] for loc in locations]
                non_zero_count = len([c for c in coverage_values if c > 0])
                print(f"   Coverage range: {min(coverage_values):.2f}% to {max(coverage_values):.2f}%")
                print(f"   Locations with coverage > 0: {non_zero_count}/{len(locations)}")
            
            return jsonify({"locations": locations})
            
    except Exception as e:
        print(f"Error fetching distribution locations: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@distribution_bp.route('/debug/location-data', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def debug_location_data():
    """Debug endpoint to see what coverage data we're actually getting"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Check if we have segmentation results with area_px data
            cur.execute("""
                SELECT 
                    COUNT(*) as total_segmentation_results,
                    COUNT(DISTINCT image_id) as images_with_segmentation,
                    AVG(area_px) as avg_area_px,
                    MAX(area_px) as max_area_px,
                    AVG(coverage_percent) as avg_coverage_percent,
                    MAX(coverage_percent) as max_coverage_percent
                FROM segmentation_results 
                WHERE area_px > 0
            """)
            
            seg_stats = cur.fetchone()
            
            # Check images with total_pixels
            cur.execute("""
                SELECT 
                    COUNT(*) as total_images,
                    COUNT(*) FILTER (WHERE total_pixels > 0) as images_with_pixels,
                    AVG(total_pixels) as avg_total_pixels,
                    MIN(total_pixels) as min_total_pixels,
                    MAX(total_pixels) as max_total_pixels
                FROM images 
                WHERE processing_status IN ('completed', 'manually_included_completed')
                AND location IS NOT NULL
            """)
            
            img_stats = cur.fetchone()
            
            # Test the coverage calculation on a few sample locations
            cur.execute("""
                SELECT 
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,
                    SUM(i.total_pixels) as sum_total_pixels,
                    SUM(sr.area_px) as sum_area_px,
                    CASE 
                        WHEN SUM(i.total_pixels) > 0 THEN
                            (SUM(sr.area_px)::FLOAT / SUM(i.total_pixels)::FLOAT) * 100
                        ELSE 0 
                    END as calculated_coverage
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE i.location IS NOT NULL 
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                GROUP BY ST_X(i.location), ST_Y(i.location)
                HAVING COUNT(DISTINCT i.id) > 0
                ORDER BY calculated_coverage DESC
                LIMIT 5
            """)
            
            sample_locations = cur.fetchall()
            
        conn.close()
        
        return jsonify({
            "segmentation_stats": {
                "total_results": seg_stats[0] or 0,
                "images_with_segmentation": seg_stats[1] or 0,
                "avg_area_px": float(seg_stats[2]) if seg_stats[2] else 0,
                "max_area_px": float(seg_stats[3]) if seg_stats[3] else 0,
                "avg_coverage_percent": float(seg_stats[4]) if seg_stats[4] else 0,
                "max_coverage_percent": float(seg_stats[5]) if seg_stats[5] else 0
            },
            "image_stats": {
                "total_images": img_stats[0] or 0,
                "images_with_pixels": img_stats[1] or 0,
                "avg_total_pixels": float(img_stats[2]) if img_stats[2] else 0,
                "min_total_pixels": img_stats[3] or 0,
                "max_total_pixels": img_stats[4] or 0
            },
            "sample_locations": [
                {
                    "longitude": float(loc[0]),
                    "latitude": float(loc[1]),
                    "image_count": loc[2],
                    "sum_total_pixels": loc[3],
                    "sum_area_px": loc[4],
                    "calculated_coverage": float(loc[5]) if loc[5] else 0
                }
                for loc in sample_locations
            ]
        })
        
    except Exception as e:
        print(f"Debug error: {e}")
        return jsonify({"error": str(e)}), 500

@distribution_bp.route('/debug/coverage-data', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def debug_coverage_data():
    """Debug endpoint to check coverage data"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Check raw segmentation results
            cur.execute("""
                SELECT 
                    COUNT(*) as total_segmentation_results,
                    AVG(coverage_percent) as avg_coverage,
                    MIN(coverage_percent) as min_coverage,
                    MAX(coverage_percent) as max_coverage,
                    COUNT(DISTINCT image_id) as images_with_results
                FROM segmentation_results
                WHERE coverage_percent > 0
            """)
            
            seg_stats = cur.fetchone()
            
            # Check images with results
            cur.execute("""
                SELECT 
                    i.id,
                    i.filename,
                    ST_X(i.location) as lng,
                    ST_Y(i.location) as lat,
                    i.processing_status,
                    COUNT(sr.id) as segment_count,
                    AVG(sr.coverage_percent) as avg_coverage,
                    SUM(sr.coverage_percent) as total_coverage
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE i.location IS NOT NULL 
                AND i.processing_status IN ('completed', 'manually_included_completed')
                GROUP BY i.id, i.filename, i.location, i.processing_status
                HAVING COUNT(sr.id) > 0
                ORDER BY total_coverage DESC
                LIMIT 10
            """)
            
            sample_images = cur.fetchall()
            
            # Check coral lifeforms
            cur.execute("""
                SELECT COUNT(*) as coral_types_count
                FROM coral_lifeforms
            """)
            
            coral_count = cur.fetchone()
            
        conn.close()
        
        return jsonify({
            "segmentation_stats": {
                "total_results": seg_stats[0],
                "avg_coverage": float(seg_stats[1]) if seg_stats[1] else 0,
                "min_coverage": float(seg_stats[2]) if seg_stats[2] else 0,
                "max_coverage": float(seg_stats[3]) if seg_stats[3] else 0,
                "images_with_results": seg_stats[4]
            },
            "sample_images": [
                {
                    "id": img[0],
                    "filename": img[1],
                    "lng": float(img[2]) if img[2] else 0,
                    "lat": float(img[3]) if img[3] else 0,
                    "status": img[4],
                    "segment_count": img[5],
                    "avg_coverage": float(img[6]) if img[6] else 0,
                    "total_coverage": float(img[7]) if img[7] else 0
                }
                for img in sample_images
            ],
            "coral_types_count": coral_count[0]
        })
        
    except Exception as e:
        print(f"Debug error: {e}")
        return jsonify({"error": str(e)}), 500

@distribution_bp.route('/compare', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def compare_locations():
    """Compare coral coverage across multiple locations"""
    try:
        locations_param = request.args.get('locations')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        if not locations_param:
            return jsonify({"error": "Locations parameter is required"}), 400
        
        # Parse location coordinates
        location_coords = []
        for loc_str in locations_param.split(';'):
            try:
                lat, lng = map(float, loc_str.split(','))
                location_coords.append((lat, lng))
            except ValueError:
                return jsonify({"error": f"Invalid location format: {loc_str}"}), 400
        
        if len(location_coords) < 2:
            return jsonify({"error": "At least 2 locations required for comparison"}), 400
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
        
        tolerance = 0.0001
        comparison_results = []
        all_coral_types = set()
        
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            for lat, lng in location_coords:
                # Build date filter
                date_conditions = []
                params = [lng, lat, tolerance]
                
                if start_date:
                    date_conditions.append(" AND i.uploaded_at >= %s")
                    params.append(start_date)
                
                if end_date:
                    date_conditions.append(" AND i.uploaded_at <= %s")
                    params.append(end_date + ' 23:59:59')
                
                date_clause = ''.join(date_conditions)
                
                # Get location info and coral coverage
                cur.execute(f"""
                    SELECT 
                        ST_X(i.location) as longitude,
                        ST_Y(i.location) as latitude,
                        COALESCE(i.municipality, '') as municipality,
                        COALESCE(i.barangay, '') as barangay,
                        COUNT(DISTINCT i.id) as image_count,
                        COUNT(DISTINCT cl.class_name) as species_count,
                        AVG(sr.coverage_percent) as avg_coverage,
                        -- Calculate Shannon diversity index
                        -SUM(
                            (sr.coverage_percent / 100.0) * 
                            LN(NULLIF(sr.coverage_percent / 100.0, 0))
                        ) as shannon_index,
                        -- Get coral coverage by type
                        JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'class_name', cl.class_name,
                                'coverage_percent', sr.coverage_percent,
                                'color_hex', cl.color_hex
                            )
                        ) as coral_coverage
                    FROM images i
                    INNER JOIN segmentation_results sr ON i.id = sr.image_id
                    INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                    WHERE ST_DWithin(
                        i.location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s
                    )
                    AND i.processing_status IN ('completed', 'manually_included_completed')
                    {date_clause}
                    GROUP BY ST_X(i.location), ST_Y(i.location), i.municipality, i.barangay
                """, params)
                
                location_data = cur.fetchone()
                
                if location_data:
                    # Extract coral types for this location
                    coral_coverage = location_data['coral_coverage'] or []
                    for coral in coral_coverage:
                        if coral and coral.get('class_name'):
                            all_coral_types.add(coral['class_name'])
                    
                    # Generate location display name
                    if location_data['municipality'] and location_data['barangay']:
                        location_name = f"{location_data['municipality']} - {location_data['barangay']}"
                    elif location_data['municipality']:
                        location_name = location_data['municipality']
                    elif location_data['barangay']:
                        location_name = location_data['barangay']
                    else:
                        location_name = f"Location ({lat:.4f}, {lng:.4f})"
                    
                    comparison_results.append({
                        'location_name': location_name,
                        'latitude': float(location_data['latitude']),
                        'longitude': float(location_data['longitude']),
                        'municipality': location_data['municipality'],
                        'barangay': location_data['barangay'],
                        'image_count': location_data['image_count'],
                        'species_count': location_data['species_count'],
                        'avg_coverage': float(location_data['avg_coverage']) if location_data['avg_coverage'] else 0,
                        'shannon_index': float(location_data['shannon_index']) if location_data['shannon_index'] else 0,
                        'coral_coverage': coral_coverage
                    })
                else:
                    # No data found for this location
                    comparison_results.append({
                        'location_name': f"Location ({lat:.4f}, {lng:.4f})",
                        'latitude': lat,
                        'longitude': lng,
                        'municipality': '',
                        'barangay': '',
                        'image_count': 0,
                        'species_count': 0,
                        'avg_coverage': 0,
                        'shannon_index': 0,
                        'coral_coverage': []
                    })
        
        conn.close()
        
        # Sort coral types for consistent ordering
        sorted_coral_types = sorted(list(all_coral_types))
        
        return jsonify({
            "locations": comparison_results,
            "coral_types": sorted_coral_types,
            "comparison_summary": {
                "total_locations": len(comparison_results),
                "locations_with_data": len([loc for loc in comparison_results if loc['image_count'] > 0]),
                "total_coral_types": len(sorted_coral_types),
                "total_images": sum(loc['image_count'] for loc in comparison_results),
                "avg_coverage_across_locations": sum(loc['avg_coverage'] for loc in comparison_results) / len(comparison_results) if comparison_results else 0
            },
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date,
                "location_coordinates": location_coords
            }
        })
        
    except Exception as e:
        print(f"Error in location comparison: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@distribution_bp.route('/location/<float:lat>/<float:lng>/images', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_images(lat, lng):
    """Get all images for a specific location with proper transect filtering"""
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
            # STEP 1: Determine the search scope
            location_condition = ""
            params = []
            municipality = None
            
            if scope == 'municipality':
                # Get municipality from the clicked location first
                cur.execute("""
                    SELECT DISTINCT municipality 
                    FROM images 
                    WHERE ST_DWithin(
                        location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s
                    ) 
                    AND municipality IS NOT NULL
                    AND processing_status IN ('completed', 'manually_included_completed')
                    LIMIT 1
                """, (lng, lat, tolerance))
                
                municipality_result = cur.fetchone()
                if municipality_result and municipality_result[0]:
                    municipality = municipality_result[0]
                    location_condition = "i.municipality = %s"
                    params = [municipality]
                    print(f"🔍 Municipality scope: fetching from '{municipality}' municipality")
                else:
                    # Fallback to location-based if no municipality found
                    location_condition = """ST_DWithin(
                        i.location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                        %s
                    )"""
                    params = [lng, lat, tolerance]
                    print(f"⚠️ No municipality found, falling back to location-based search")
            else:
                # Location scope - only images from this specific location
                location_condition = """ST_DWithin(
                    i.location,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                    %s
                )"""
                params = [lng, lat, tolerance]
                print(f"🔍 Location scope: fetching from coordinates ({lat}, {lng})")
            
            # Store base params for available transects query
            base_params = params.copy()
            base_condition = location_condition
            
            # STEP 2: Add transect filter - FIXED
            transect_applied = False
            if transect and transect != 'all' and transect.strip():
                try:
                    transect_int = int(transect)
                    location_condition += " AND i.transect = %s"
                    params.append(transect_int)
                    transect_applied = True
                    print(f"🔍 Applying transect filter: T{transect_int}")
                except ValueError:
                    print(f"⚠️ Invalid transect filter value: {transect}")
            
            # STEP 3: Add date filters
            if start_date and start_date.strip():
                location_condition += " AND i.uploaded_at >= %s"
                params.append(start_date)
                base_condition += " AND i.uploaded_at >= %s"
                base_params.append(start_date)
            
            if end_date and end_date.strip():
                location_condition += " AND i.uploaded_at <= %s"
                params.append(end_date + " 23:59:59")
                base_condition += " AND i.uploaded_at <= %s"
                base_params.append(end_date + " 23:59:59")
            
            print(f"   Final conditions: {location_condition}")
            print(f"   Parameters: {params}")
            
            # STEP 4: Execute the main query
            query = f"""
                SELECT DISTINCT
                    i.id,
                    i.filename,
                    i.uploaded_at,
                    i.analysis_confidence,
                    i.total_pixels,
                    i.transect,
                    i.processing_status,
                    i.municipality,
                    i.barangay,
                    CONCAT(u.firstname, ' ', u.lastname) as uploader_name,
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude
                FROM images i
                LEFT JOIN users u ON i.uploader_id = u.id
                WHERE i.location IS NOT NULL
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                AND {location_condition}
                ORDER BY i.uploaded_at DESC
            """
            
            cur.execute(query, params)
            
            images = []
            transects_found = set()
            
            for row in cur.fetchall():
                if row[5]:  # transect field
                    transects_found.add(row[5])
                    
                images.append({
                    'id': row[0],
                    'filename': row[1],
                    'uploaded_at': row[2].isoformat() if row[2] else None,
                    'analysis_confidence': float(row[3]) if row[3] else 0,
                    'total_pixels': row[4],
                    'transect': row[5],
                    'processing_status': row[6],
                    'municipality': row[7],
                    'barangay': row[8],
                    'manually_included': row[6] == 'manually_included_completed',
                    'uploader_name': row[9] or 'Unknown',
                    'longitude': float(row[10]) if row[10] else lng,
                    'latitude': float(row[11]) if row[11] else lat
                })
            
            # STEP 5: Get available transects for this scope (for UI) - FIXED
            available_transects_query = f"""
                SELECT DISTINCT i.transect
                FROM images i
                WHERE i.location IS NOT NULL
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                AND {base_condition}
                AND i.transect IS NOT NULL
                ORDER BY i.transect
            """
            
            print(f"🔍 Available transects query: {available_transects_query}")
            print(f"🔍 Available transects params: {base_params}")
            
            try:
                cur.execute(available_transects_query, base_params)
                available_transects = [row[0] for row in cur.fetchall()]
            except Exception as transect_error:
                print(f"⚠️ Error getting available transects: {transect_error}")
                available_transects = []
            
            print(f"🔍 Query returned {len(images)} images")
            print(f"   Transects found in results: {sorted(transects_found)}")
            print(f"   Available transects for scope: {sorted(available_transects)}")
            
            return jsonify({
                "images": images,
                "available_transects": sorted(available_transects),
                "filters": {
                    "scope": scope,
                    "transect": transect,
                    "start_date": start_date,
                    "end_date": end_date,
                    "municipality": municipality
                },
                "debug_info": {
                    "total_images": len(images),
                    "transects_in_results": sorted(transects_found),
                    "available_transects": sorted(available_transects),
                    "scope_applied": scope,
                    "municipality_filter": municipality,
                    "transect_filter_applied": transect if transect != 'all' else None
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
    """Get aggregated coral analytics with proper transect and scope filtering"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        transect_filter = request.args.get('transect')
        scope = request.args.get('scope', 'location')
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        tolerance = 0.0001
        
        with conn.cursor() as cur:
            # Build WHERE conditions based on scope
            where_conditions = []
            params = []
            municipality = None
            
            if scope == 'municipality':
                # Get municipality for this location
                cur.execute("""
                    SELECT municipality 
                    FROM images 
                    WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)
                    AND municipality IS NOT NULL 
                    LIMIT 1
                """, (lng, lat, tolerance))
                
                result = cur.fetchone()
                if result and result[0]:
                    municipality = result[0]
                    where_conditions.append("i.municipality = %s")
                    params.append(municipality)
                    print(f"🔍 Analytics municipality scope: {municipality}")
                else:
                    # Fallback to location scope
                    where_conditions.append("ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)")
                    params.extend([lng, lat, tolerance])
            else:
                # Location scope
                where_conditions.append("ST_DWithin(i.location, ST_SetSRID(ST_MakePoint(%s, %s), 4326), %s)")
                params.extend([lng, lat, tolerance])
            
            # Always add processing status filter
            where_conditions.append("i.processing_status IN ('completed', 'manually_included_completed')")
            
            # Add transect filter - FIXED
            if transect_filter and transect_filter != 'all' and transect_filter.strip():
                try:
                    transect_int = int(transect_filter)
                    where_conditions.append("i.transect = %s")
                    params.append(transect_int)
                    print(f"🔍 Analytics transect filter: T{transect_int}")
                except ValueError:
                    print(f"⚠️ Invalid transect filter value: {transect_filter}")
            
            # Add date filters
            if start_date and start_date.strip():
                where_conditions.append("i.uploaded_at >= %s")
                params.append(start_date)
                
            if end_date and end_date.strip():
                where_conditions.append("i.uploaded_at <= %s")
                params.append(end_date + ' 23:59:59')
            
            where_clause = " AND ".join(where_conditions)
            print(f"🔍 Analytics where clause: {where_clause}")
            print(f"🔍 Analytics params: {params}")
        
            # Get coral analytics with filtering
            cur.execute(f"""
                SELECT 
                    cl.class_name,
                    cl.class_code,
                    cl.scientific_name,
                    cl.category,
                    cl.color_hex,
                    COUNT(sr.id) as occurrence_count,
                    SUM(sr.area_px) as total_area_px,
                    AVG(sr.coverage_percent) as avg_coverage_percent,
                    CASE 
                        WHEN SUM(i.total_pixels) > 0 THEN
                            (SUM(sr.area_px)::FLOAT / SUM(i.total_pixels)::FLOAT) * 100
                        ELSE 0 
                    END as location_coverage_percent,
                    AVG(sr.avg_confidence) as avg_confidence,
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT i.transect) as transect_count
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                INNER JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE {where_clause}
                GROUP BY cl.id, cl.class_name, cl.class_code, cl.scientific_name, cl.category, cl.color_hex
                HAVING SUM(sr.area_px) > 0
                ORDER BY location_coverage_percent DESC
            """, params)
            
            coral_analytics = cur.fetchall()
            
            # Get time series data for trends with same filters
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
            
            # Get transect-specific statistics (only if not filtering by specific transect)
            if not transect_filter or transect_filter == 'all':
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
            else:
                # If filtering by specific transect, show that transect's stats
                transect_stats = []
            
            # Overall coverage statistics
            cur.execute(f"""
                SELECT 
                    CASE 
                        WHEN SUM(i.total_pixels) > 0 THEN
                            (SUM(sr.area_px)::FLOAT / SUM(i.total_pixels)::FLOAT) * 100
                        ELSE 0 
                    END as total_coral_coverage,
                    COUNT(DISTINCT i.id) as total_images_analyzed,
                    SUM(i.total_pixels) as total_pixels_analyzed,
                    SUM(sr.area_px) as total_coral_area_px
                FROM images i
                INNER JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE {where_clause}
            """, params)
            
            coverage_stats = cur.fetchone()
            
            # Overall statistics
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
                'class_name': coral[0],
                'class_code': coral[1],
                'scientific_name': coral[2],
                'category': coral[3],
                'color_hex': coral[4],
                'occurrence_count': coral[5],
                'total_area_px': coral[6],
                'avg_coverage_percent': float(coral[8]) if coral[8] else 0,  # Use location_coverage_percent
                'individual_avg_coverage': float(coral[7]) if coral[7] else 0,
                'avg_confidence': float(coral[9]) if coral[9] else 0,
                'image_count': coral[10],
                'transect_count': coral[11]
            })
        
        trend_result = []
        for trend in trend_data:
            trend_result.append({
                'date': trend[0].isoformat(),
                'class_name': trend[1],
                'avg_coverage': float(trend[2]) if trend[2] else 0,
                'detection_count': trend[3],
                'transects_on_date': trend[4]
            })
            
        transect_result = []
        for transect in transect_stats:
            transect_result.append({
                'transect': transect[0],
                'image_count': transect[1],
                'coral_types': transect[2],
                'avg_coverage': float(transect[3]) if transect[3] else 0,
                'avg_confidence': float(transect[4]) if transect[4] else 0
            })
        
        print(f"🔍 Analytics results: {len(analytics_result)} coral types, {len(trend_result)} trend points")
        
        return jsonify({
            "coral_analytics": analytics_result,
            "trend_data": trend_result,
            "transect_statistics": transect_result,
            "coverage_statistics": {
                'total_coral_coverage': float(coverage_stats[0]) if coverage_stats[0] else 0,
                'total_images_analyzed': coverage_stats[1] or 0,
                'total_pixels_analyzed': coverage_stats[2] or 0,
                'total_coral_area_px': coverage_stats[3] or 0
            },
            "statistics": {
                'total_images': stats[0] or 0,
                'total_contributors': stats[1] or 0,
                'total_pixels_analyzed': stats[2] or 0,
                'avg_confidence': float(stats[3]) if stats[3] else 0,
                'unique_coral_types': stats[4] or 0,
                'unique_transects': stats[5] or 0,
                'unique_municipalities': stats[6] or 0,
                'manually_included_count': stats[7] or 0
            },
            "location": {"lat": lat, "lng": lng},
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date,
                "transect": transect_filter,
                "scope": scope,
                "municipality": municipality
            }
        })
        
    except Exception as e:
        print(f"Error fetching location analytics: {str(e)}")
        import traceback
        traceback.print_exc()
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
            
            # Check what tables exist and delete accordingly
            deleted_items = {}
            
            # Check if coral_instances table exists
            cur.execute("""
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'coral_instances'
                );
            """)
            
            coral_instances_exists = cur.fetchone()[0]
            
            if coral_instances_exists:
                # Delete coral instances if table exists
                cur.execute("""
                    DELETE FROM coral_instances 
                    WHERE segmentation_id IN (
                        SELECT id FROM segmentation_results WHERE image_id = %s
                    )
                """, (image_id,))
                deleted_items['coral_instances'] = cur.rowcount
                print(f"✅ Deleted {cur.rowcount} coral instances")
            
            # Delete segmentation results
            cur.execute("DELETE FROM segmentation_results WHERE image_id = %s", (image_id,))
            deleted_items['segmentation_results'] = cur.rowcount
            print(f"✅ Deleted {cur.rowcount} segmentation results")
            
            # Delete the image record
            cur.execute("DELETE FROM images WHERE id = %s", (image_id,))
            deleted_items['images'] = cur.rowcount
            
            if deleted_items['images'] == 0:
                return jsonify({"error": "Image not found or already deleted"}), 404
            
            # Try to delete the physical files (same as before)
            files_deleted = []
            try:
                import os
                from flask import current_app
                
                # Delete crop file
                crops_path = os.path.join(current_app.root_path, '..', 'frontend', 'public', 'crops', filename)
                if os.path.exists(crops_path):
                    os.remove(crops_path)
                    files_deleted.append(f"crop: {filename}")
                
                # Delete mask files
                mask_base = filename.replace('.jpg', '').replace('.jpeg', '').replace('.png', '').replace('.JPG', '').replace('.JPEG', '').replace('.PNG', '')
                
                possible_dirs = [
                    ('masks', os.path.join(current_app.root_path, '..', 'frontend', 'public', 'masks')),
                    ('overlays', os.path.join(current_app.root_path, '..', 'frontend', 'public', 'overlays')),
                    ('segmentation', os.path.join(current_app.root_path, '..', 'frontend', 'public', 'segmentation'))
                ]
                
                for dir_name, masks_dir in possible_dirs:
                    if os.path.exists(masks_dir):
                        for mask_file in os.listdir(masks_dir):
                            if mask_base in mask_file:
                                mask_path = os.path.join(masks_dir, mask_file)
                                os.remove(mask_path)
                                files_deleted.append(f"{dir_name}: {mask_file}")
                                
            except Exception as file_error:
                print(f"⚠️ File deletion warning: {str(file_error)}")
            
            conn.commit()
            
            print(f"✅ Successfully deleted image {image_id} ({filename})")
            
        conn.close()
        return jsonify({
            "message": "Image deleted successfully",
            "deleted_image_id": image_id,
            "deleted_filename": filename,
            "database_deletions": deleted_items,
            "files_deleted": files_deleted
        }), 200
        
    except Exception as e:
        if conn:
            conn.rollback()
            conn.close()
        print(f"❌ Error deleting image {image_id}: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Failed to delete image: {str(e)}"}), 500