from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import get_db_connection
import json

gis_bp = Blueprint('gis', __name__)

@gis_bp.route('/locations', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_existing_locations():
    """Get all existing locations with their data including manually included images"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    conn = None
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # UPDATED: Include both processing statuses
            cur.execute("""
                SELECT 
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT sr.id) as segmentation_count,
                    AVG(i.analysis_confidence) as avg_confidence,
                    ARRAY_AGG(DISTINCT cl.class_name) FILTER (WHERE cl.class_name IS NOT NULL) as coral_types,
                    MAX(i.uploaded_at) as last_update,
                    COALESCE(MIN(i.municipality), '') as municipality,
                    COALESCE(MIN(i.barangay), '') as barangay,
                    ARRAY_AGG(DISTINCT i.transect) FILTER (WHERE i.transect IS NOT NULL) as transects,
                    COUNT(DISTINCT CASE WHEN i.manually_included = true THEN i.id END) as manually_included_count,
                    STRING_AGG(DISTINCT i.processing_status, ', ') as processing_statuses
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.location IS NOT NULL
                AND i.processing_status IN ('completed', 'manually_included_completed')
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
                GROUP BY ST_X(i.location), ST_Y(i.location)
                ORDER BY last_update DESC
            """)
            
            locations = []
            for row in cur.fetchall():
                # Filter out None values from transects array
                transects = [t for t in row[9] if t is not None] if row[9] else []
                
                locations.append({
                    'longitude': float(row[0]),
                    'latitude': float(row[1]),
                    'image_count': row[2],
                    'segmentation_count': row[3],
                    'avg_confidence': float(row[4]) if row[4] else 0,
                    'coral_types': [ct for ct in row[5] if ct] if row[5] else [],
                    'last_update': row[6].isoformat() if row[6] else None,
                    'municipality': row[7] if len(row) > 7 else None,
                    'barangay': row[8] if len(row) > 8 else None,
                    'transects': sorted(list(set(transects))) if transects else [],
                    'manually_included_count': row[10] if len(row) > 10 else 0,
                    'processing_statuses': row[11] if len(row) > 11 else None  # Debug info
                })
            
            print(f"🔍 Existing locations query returned {len(locations)} locations")
            if locations:
                total_images = sum(loc['image_count'] for loc in locations)
                total_manual = sum(loc['manually_included_count'] for loc in locations)
                print(f"   Total images: {total_images} (manually included: {total_manual})")
            
            return jsonify({"locations": locations})
            
    except Exception as e:
        print(f"Error fetching locations: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


@gis_bp.route('/save_with_location', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def save_images_with_location():
    """Save processed images with location data including transect"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        data = request.get_json()
        
        if not data or 'image_ids' not in data or 'location' not in data:
            return jsonify({"error": "Missing required data"}), 400
            
        image_ids = data['image_ids']
        location = data['location']
        transect = data.get('transect')
        municipality = data.get('municipality', '').strip()
        barangay = data.get('barangay', '').strip()
        
        """Logs the saving of images with location data including transect"""
        print(f"   Saving images with location:")
        print(f"   Image IDs: {len(image_ids)} images")
        print(f"   Location: {location}")
        print(f"   Municipality from request: '{municipality}'")
        print(f"   Barangay from request: '{barangay}'")
        print(f"   Transect: {transect}")
        
        # Validate location format
        if not isinstance(location, dict) or 'lat' not in location or 'lng' not in location:
            return jsonify({"error": "Invalid location format"}), 400
        
        # Validate transect
        if not transect or not isinstance(transect, int) or transect < 1 or transect > 5:
            return jsonify({"error": "Invalid transect number. Must be between 1 and 5."}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        try:
            with conn.cursor() as cur:
              
                if not municipality or not barangay:
                    print(f"🔍 Municipality/Barangay not provided, checking existing location data...")
                    
                    tolerance = 0.0001  
                    cur.execute("""
                        SELECT 
                            municipality, 
                            barangay,
                            COUNT(*) as image_count
                        FROM images 
                        WHERE ST_DWithin(
                            location,
                            ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                            %s
                        )
                        AND municipality IS NOT NULL 
                        AND municipality != ''
                        AND barangay IS NOT NULL 
                        AND barangay != ''
                        GROUP BY municipality, barangay
                        ORDER BY image_count DESC
                        LIMIT 1
                    """, (location['lng'], location['lat'], tolerance))
                    
                    existing_location = cur.fetchone()
                    
                    if existing_location:
                        # Use existing location's municipality/barangay if not provided
                        if not municipality:
                            municipality = existing_location[0]
                            print(f"    Using existing municipality: '{municipality}'")
                        if not barangay:
                            barangay = existing_location[1]
                            print(f"    Using existing barangay: '{barangay}'")
                    else:
                        print(f"    No existing municipality/barangay found at this location")
                
                print(f"   Final municipality: '{municipality}'")
                print(f"   Final barangay: '{barangay}'")
                
                updated_count = 0
                failed_updates = []
                
                for image_id in image_ids:
                    try:
                       
                        set_clauses = [
                            "location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)",
                            "transect = %s"
                        ]
                        params = [location['lng'], location['lat'], transect]
                        
                        # FIXED: Always update municipality and barangay when we have values
                        # (either from request or from existing location)
                        if municipality:
                            set_clauses.append("municipality = %s")
                            params.append(municipality)
                        
                        if barangay:
                            set_clauses.append("barangay = %s")
                            params.append(barangay)
                        
                        # Add the WHERE clause parameter
                        params.append(image_id)
                        
                        # Build the complete query
                        query = f"""
                            UPDATE images 
                            SET {', '.join(set_clauses)}
                            WHERE id = %s
                        """
                        
                        print(f"   Updating image {image_id}:")
                        print(f"     Query: {query}")
                        print(f"     Params: {params}")
                        
                        cur.execute(query, params)
                        
                        if cur.rowcount > 0:
                            updated_count += 1
                            print(f"    Successfully updated image {image_id}")
                        else:
                            failed_updates.append(image_id)
                            print(f"    Failed to update image {image_id} - no rows affected")
                            
                    except Exception as img_error:
                        print(f"    Error updating image {image_id}: {img_error}")
                        failed_updates.append(image_id)
                        continue
                
                conn.commit()
                print(f" Update complete: {updated_count} images updated successfully")
                
                if updated_count > 0:
                    sample_ids = image_ids[:3]  # Check first 3 images
                    cur.execute("""
                        SELECT id, municipality, barangay, transect, 
                               ST_X(location) as lng, ST_Y(location) as lat
                        FROM images 
                        WHERE id = ANY(%s)
                    """, (sample_ids,))
                    
                    verification_results = cur.fetchall()
                    print(f" Verification of updated records:")
                    for row in verification_results:
                        print(f"   ID {row[0]}: municipality='{row[1]}', barangay='{row[2]}', transect={row[3]}, coords=({row[5]:.6f},{row[4]:.6f})")
                
                response_data = {
                    "success": True,
                    "updated_count": updated_count,
                    "transect": transect,
                    "message": f"Successfully saved {updated_count} images with location data and transect {transect}"
                }
                
                # Include the final municipality and barangay values in response
                if municipality:
                    response_data["municipality"] = municipality
                if barangay:
                    response_data["barangay"] = barangay
                    
                # Include failed updates info if any
                if failed_updates:
                    response_data["failed_updates"] = failed_updates
                    response_data["message"] += f". Failed to update {len(failed_updates)} images."
                    response_data["warning"] = f"Some images could not be updated. IDs: {failed_updates}"
                
                return jsonify(response_data)
                
        except Exception as e:
            conn.rollback()
            raise e
            
    except Exception as e:
        print(f" Error saving location: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@gis_bp.route('/location/<float:lat>/<float:lng>', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_location_details(lat, lng):
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        # Use a small radius to find nearby images (0.001 degrees ≈ 100m)
        tolerance = 0.001
        
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    i.id,
                    i.filename,
                    i.uploaded_at,
                    i.analysis_confidence,
                    i.total_pixels,
                    i.transect,
                    cl.class_name,
                    cl.color_hex,
                    sr.coverage_percent,
                    sr.area_px
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE ST_DWithin(
                    i.location,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                    %s
                )
                ORDER BY i.uploaded_at DESC
            """, (lng, lat, tolerance))
            
            results = cur.fetchall()
            
            if not results:
                return jsonify({"error": "No data found for this location"}), 404
                
            # Process results
            images_data = {}
            for row in results:
                image_id = row[0]
                if image_id not in images_data:
                    images_data[image_id] = {
                        'id': image_id,
                        'filename': row[1],
                        'uploaded_at': row[2].isoformat() if row[2] else None,
                        'analysis_confidence': float(row[3]) if row[3] else 0,
                        'total_pixels': row[4],
                        'transect': row[5],
                        'coral_coverage': []
                    }
                
                if row[6]:  # Has coral data
                    images_data[image_id]['coral_coverage'].append({
                        'class_name': row[6],
                        'color': row[7],
                        'coverage_percent': float(row[8]) if row[8] else 0,
                        'area_px': row[9]
                    })
            
            return jsonify({
                "location": {"lat": lat, "lng": lng},
                "images": list(images_data.values()),
                "total_images": len(images_data)
            })
            
    except Exception as e:
        print(f"Error fetching location details: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@gis_bp.route('/nearby_locations', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def find_nearby_locations():
    """Find locations near a given point"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        data = request.get_json()
        
        if not data or 'lat' not in data or 'lng' not in data:
            return jsonify({"error": "Missing coordinates"}), 400
            
        lat = data['lat']
        lng = data['lng']
        radius_km = data.get('radius_km', 1)  # Default 1km radius
        
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Convert km to degrees (rough approximation: 1 degree ≈ 111km)
            radius_deg = radius_km / 111.0
            
            cur.execute("""
                SELECT 
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,
                    ARRAY_AGG(DISTINCT i.transect) as transects,
                    ST_Distance(
                        i.location,
                        ST_SetSRID(ST_MakePoint(%s, %s), 4326)
                    ) * 111000 as distance_m
                FROM images i
                WHERE ST_DWithin(
                    i.location,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                    %s
                ) AND i.location IS NOT NULL
                GROUP BY i.location
                ORDER BY distance_m ASC
            """, (lng, lat, lng, lat, radius_deg))
            
            nearby_locations = []
            for row in cur.fetchall():
                # Filter out None values from transects array
                transects = [t for t in row[3] if t is not None] if row[3] else []
                
                nearby_locations.append({
                    'longitude': float(row[0]),
                    'latitude': float(row[1]),
                    'image_count': row[2],
                    'transects': sorted(list(set(transects))) if transects else [],
                    'distance_m': round(float(row[4]), 2)
                })
            
            return jsonify({
                "search_location": {"lat": lat, "lng": lng},
                "radius_km": radius_km,
                "nearby_locations": nearby_locations
            })
            
    except Exception as e:
        print(f"Error finding nearby locations: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()