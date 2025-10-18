from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from db import get_db_connection
import json

gis_bp = Blueprint('gis', __name__)



@gis_bp.route('/locations', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def get_existing_locations():
    """Get all existing locations with their data"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    conn = None  # Initialize conn variable
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Get locations with aggregated data
            cur.execute("""
                SELECT 
                    ST_X(i.location) as longitude,
                    ST_Y(i.location) as latitude,
                    COUNT(DISTINCT i.id) as image_count,
                    COUNT(DISTINCT sr.id) as segmentation_count,
                    AVG(i.analysis_confidence) as avg_confidence,
                    ARRAY_AGG(DISTINCT cl.class_name) as coral_types,
                    MAX(i.uploaded_at) as last_update
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.location IS NOT NULL
                GROUP BY ST_X(i.location), ST_Y(i.location)
                ORDER BY last_update DESC
            """)
            
            locations = []
            for row in cur.fetchall():
                locations.append({
                    'longitude': float(row[0]),
                    'latitude': float(row[1]),
                    'image_count': row[2],
                    'segmentation_count': row[3],
                    'avg_confidence': float(row[4]) if row[4] else 0,
                    'coral_types': [ct for ct in row[5] if ct] if row[5] else [],
                    'last_update': row[6].isoformat() if row[6] else None
                })
            
            return jsonify({"locations": locations})
            
    except Exception as e:
        print(f"Error fetching locations: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@gis_bp.route('/save_with_location', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
def save_images_with_location():
    """Save processed images with location data"""
    if request.method == "OPTIONS":
        return jsonify({}), 200
    
    try:
        data = request.get_json()
        
        if not data or 'image_ids' not in data or 'location' not in data:
            return jsonify({"error": "Missing required data"}), 400
            
        image_ids = data['image_ids']
        location = data['location']
        
        if not isinstance(location, dict) or 'lat' not in location or 'lng' not in location:
            return jsonify({"error": "Invalid location format"}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        try:
            with conn.cursor() as cur:
                # Update images with location
                updated_count = 0
                for image_id in image_ids:
                    cur.execute("""
                        UPDATE images 
                        SET location = ST_SetSRID(ST_MakePoint(%s, %s), 4326)
                        WHERE id = %s
                    """, (location['lng'], location['lat'], image_id))
                    
                    if cur.rowcount > 0:
                        updated_count += 1
                
                conn.commit()
                
                return jsonify({
                    "success": True,
                    "updated_count": updated_count,
                    "message": f"Successfully saved {updated_count} images with location data"
                })
                
        except Exception as e:
            conn.rollback()
            raise e
            
    except Exception as e:
        print(f"Error saving location: {e}")
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
                        'coral_coverage': []
                    }
                
                if row[5]:  # Has coral data
                    images_data[image_id]['coral_coverage'].append({
                        'class_name': row[5],
                        'color': row[6],
                        'coverage_percent': float(row[7]) if row[7] else 0,
                        'area_px': row[8]
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
                nearby_locations.append({
                    'longitude': float(row[0]),
                    'latitude': float(row[1]),
                    'image_count': row[2],
                    'distance_m': round(float(row[3]), 2)
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