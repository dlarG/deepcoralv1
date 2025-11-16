from flask import jsonify, request, session, Blueprint
from utils.auth_utils import login_required
from db import get_db_connection
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
import psycopg2
import os
from flask import current_app
from utils.auth_utils import biologist_required
from flask_cors import cross_origin
from routes.activity_log import log_coral_info_action
import uuid
from datetime import datetime


biologist_bp = Blueprint("biologist", __name__)

@biologist_bp.route('/biologist/corals', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@biologist_required
@login_required
def add_coral():
    """Add new coral information - Biologist endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        # Handle file upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                # Create unique filename with timestamp
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
                unique_filename = f"coral_{timestamp}_{uuid.uuid4().hex[:8]}.{file_ext}"
                
                upload_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information'
                )
                
                os.makedirs(upload_path, exist_ok=True)
                
                # Save the file
                file_path = os.path.join(upload_path, unique_filename)
                file.save(file_path)
                image_filename = unique_filename

        # Get form data
        coral_data = {
            'coral_type': request.form.get('coral_type', '').strip(),
            'coral_subtype': request.form.get('coral_subtype', '').strip(),
            'classification': request.form.get('classification', '').strip(),
            'scientific_name': request.form.get('scientific_name', '').strip(),
            'common_name': request.form.get('common_name', '').strip(),
            'identification': request.form.get('identification', '').strip(),
            'image': image_filename
        }
        

        # Validate required fields
        required_fields = ['coral_type', 'coral_subtype', 'classification', 
                          'scientific_name', 'common_name', 'identification']
        missing_fields = [field for field in required_fields if not coral_data.get(field)]
        
        if missing_fields:
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Database connection
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            # Insert new coral
            insert_query = """
                INSERT INTO coral_information 
                (coral_type, coral_subtype, classification, scientific_name, 
                 common_name, identification, image) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """
            
            cur.execute(insert_query, (
                coral_data['coral_type'],
                coral_data['coral_subtype'], 
                coral_data['classification'],
                coral_data['scientific_name'],
                coral_data['common_name'],
                coral_data['identification'],
                coral_data['image']
            ))
            
            new_coral = cur.fetchone()
            conn.commit()
            

            # Log the activity
            try:
                log_coral_info_action(
                    user_id=session.get('user_id'),
                    action='created',
                    coral_name=f"{coral_data['common_name']} ({coral_data['scientific_name']})"
                )
            except Exception as log_error:
                print(f"Logging error (non-critical): {log_error}")
            
            # Prepare response
            coral_response = {
                'id': new_coral[0],
                'coral_type': new_coral[1],
                'coral_subtype': new_coral[2],
                'classification': new_coral[3],
                'scientific_name': new_coral[4],
                'common_name': new_coral[5],
                'identification': new_coral[6],
                'created_at': new_coral[7].isoformat() if new_coral[7] else None,
                'updated_at': new_coral[8].isoformat() if new_coral[8] else None,
                'image': new_coral[9]
            }
            
            
            return jsonify({
                'success': True,
                'message': 'Coral information added successfully',
                'coral': coral_response
            }), 201

    except psycopg2.Error as db_error:
        print(f"Database error: {db_error}")
        if 'conn' in locals():
            conn.rollback()
        return jsonify({'error': f'Database error: {str(db_error)}'}), 500
    except Exception as e:
        print(f"General error adding coral: {e}")
        import traceback
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

            
@biologist_bp.route('/biologist/corals/<int:coral_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@biologist_required
@login_required
def update_coral(coral_id):
    """Update coral information - Biologist endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        # Get current coral data
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM coral_information WHERE id = %s", (coral_id,))
            current_coral = cur.fetchone()
            
            if not current_coral:
                return jsonify({'error': 'Coral not found'}), 404

        # Handle file upload
        image_filename = current_coral[9]  # Keep existing image
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                # Delete old image if exists
                if current_coral[9]:
                    old_image_path = os.path.join(
                        current_app.root_path, 
                        '..', 'frontend', 'public', 'uploaded_coral_information',
                        current_coral[9]
                    )
                    if os.path.exists(old_image_path):
                        os.remove(old_image_path)

                # Save new image
                filename = secure_filename(file.filename)
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                
                upload_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information'
                )
                os.makedirs(upload_path, exist_ok=True)
                file.save(os.path.join(upload_path, unique_filename))
                image_filename = unique_filename

        # Update coral data
        with conn.cursor() as cur:
            cur.execute("""
                UPDATE coral_information 
                SET coral_type = %s, coral_subtype = %s, classification = %s,
                    scientific_name = %s, common_name = %s, identification = %s,
                    image = %s, updated_at = CURRENT_TIMESTAMP
                WHERE id = %s
                RETURNING *
            """, (
                request.form.get('coral_type'),
                request.form.get('coral_subtype'),
                request.form.get('classification'),
                request.form.get('scientific_name'),
                request.form.get('common_name'),
                request.form.get('identification'),
                image_filename,
                coral_id
            ))
            
            updated_coral = cur.fetchone()
            conn.commit()

            # Log the activity
            log_coral_info_action(
                user_id=session.get('user_id'),
                action='updated',
                coral_name=f"{updated_coral[5]} ({updated_coral[4]})"
            )
            
            coral_response = {
                'id': updated_coral[0],
                'coral_type': updated_coral[1],
                'coral_subtype': updated_coral[2],
                'classification': updated_coral[3],
                'scientific_name': updated_coral[4],
                'common_name': updated_coral[5],
                'identification': updated_coral[6],
                'created_at': updated_coral[7],
                'updated_at': updated_coral[8],
                'image': updated_coral[9]
            }
            
            return jsonify({
                'success': True,
                'message': 'Coral information updated successfully',
                'coral': coral_response
            }), 200

    except Exception as e:
        print(f"Error updating coral: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@biologist_bp.route('/biologist/corals/<int:coral_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@biologist_required
@login_required
def delete_coral(coral_id):
    """Delete coral information - Biologist endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            # Get coral data to delete image file and for logging
            cur.execute("SELECT common_name, scientific_name, image FROM coral_information WHERE id = %s", (coral_id,))
            coral_data = cur.fetchone()
            
            if not coral_data:
                return jsonify({'error': 'Coral not found'}), 404

            # Delete image file if exists
            if coral_data[2]:
                image_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information',
                    coral_data[2]
                )
                if os.path.exists(image_path):
                    try:
                        os.remove(image_path)
                    except:
                        pass

            # Delete coral record
            cur.execute("DELETE FROM coral_information WHERE id = %s", (coral_id,))
            conn.commit()

            # Log the activity
            log_coral_info_action(
                user_id=session.get('user_id'),
                action='deleted',
                coral_name=f"{coral_data[0]} ({coral_data[1]})"
            )
            
            return jsonify({
                'success': True,
                'message': 'Coral information deleted successfully'
            }), 200

    except Exception as e:
        print(f"Error deleting coral: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@biologist_bp.route('/biologist/users', methods=["GET"])
@biologist_required
@login_required
def get_alll_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Add profile_image to the SELECT query
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, profile_image, created_at, status 
                FROM users 
                WHERE users.id != %s AND status = 'approved' AND roletype != 'admin'
                ORDER BY created_at DESC
            """, (session.get('user_id'),))
            users = cur.fetchall()
            
            users_list = []
            for user in users:
                users_list.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'profile_image': user[5],  # Add this field
                    'created_at': user[6],      # Add this field for sorting
                    'status': user[7]           # Add status field
                })
            
            return jsonify({"users": users_list}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@biologist_bp.route('/biologist/users', methods=['POST'])
@biologist_required
@login_required
def create_user():
    data = request.get_json()
    status = 'approved'
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    required_fields = ['username', 'password', 'firstname', 'lastname', 'roletype']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if username already exists
            cur.execute("SELECT id FROM users WHERE username = %s", (data['username'],))
            if cur.fetchone():
                return jsonify({"error": "Username already exists"}), 400
            
            # Hash password
            hashed_password = generate_password_hash(data['password'])
            
            # Insert new user and return profile_image field
            cur.execute(
                """INSERT INTO users 
                (username, password, firstname, lastname, roletype, status) 
                VALUES (%s, %s, %s, %s, %s, %s) 
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status""",
                (data['username'], hashed_password, data['firstname'], 
                 data['lastname'], data['roletype'], status)
            )
            
            new_user = cur.fetchone()
            conn.commit()
            
            return jsonify({
                "message": "User created successfully",
                "user": {
                    'id': new_user[0],
                    'username': new_user[1],
                    'firstname': new_user[2],
                    'lastname': new_user[3],
                    'roletype': new_user[4],
                    'profile_image': new_user[5],  # Add this field
                    'created_at': new_user[6],      # Add this field
                }
            }), 201
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@biologist_bp.route('/biologist/users/<int:user_id>', methods=['PUT'])
@biologist_required
@login_required
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cur.fetchone():
                return jsonify({"error": "User not found"}), 404
            
            # Build update query based on provided fields
            update_fields = []
            update_values = []
            
            if 'username' in data:
                # Check if new username is available
                cur.execute("SELECT id FROM users WHERE username = %s AND id != %s", 
                          (data['username'], user_id))
                if cur.fetchone():
                    return jsonify({"error": "Username already taken"}), 400
                update_fields.append("username = %s")
                update_values.append(data['username'])
            
            if 'password' in data and data['password']:
                update_fields.append("password = %s")
                update_values.append(generate_password_hash(data['password']))
            
            if 'firstname' in data:
                update_fields.append("firstname = %s")
                update_values.append(data['firstname'])
            
            if 'lastname' in data:
                update_fields.append("lastname = %s")
                update_values.append(data['lastname'])
            
            if 'roletype' in data:
                update_fields.append("roletype = %s")
                update_values.append(data['roletype'])
            
            if not update_fields:
                return jsonify({"error": "No valid fields to update"}), 400
            
            # Add user_id to values
            update_values.append(user_id)
            
            # Execute update and return profile_image field
            update_query = f"""
                UPDATE users 
                SET {', '.join(update_fields)} 
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status
            """
            
            cur.execute(update_query, update_values)
            updated_user = cur.fetchone()
            conn.commit()
            
            return jsonify({
                "message": "User updated successfully",
                "user": {
                    'id': updated_user[0],
                    'username': updated_user[1],
                    'firstname': updated_user[2],
                    'lastname': updated_user[3],
                    'roletype': updated_user[4],
                    'profile_image': updated_user[5],  # Add this field
                    'created_at': updated_user[6],      # Add this field
                    'status': updated_user[7]           # Add status field
                }
            }), 200
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@biologist_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@biologist_required
@login_required
def delete_user(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT id FROM users WHERE id = %s", (user_id,))
            if not cur.fetchone():
                return jsonify({"error": "User not found"}), 404
            
            
            # Delete the user
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted_id = cur.fetchone()[0]
            conn.commit()
            
            return jsonify({
                "message": "User deleted successfully",
                "deleted_id": deleted_id
            }), 200
    except psycopg2.Error as e:
        conn.rollback()
        return jsonify({"error": "Database error: " + str(e)}), 500
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@biologist_bp.route('/biologist/users/<int:user_id>', methods=['GET'])
@biologist_required
@login_required
def get_user_profile(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, 
                       bio, profile_image, created_at, updated_at, last_login, institution, email
                FROM users WHERE id = %s
            """, (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
                
            return jsonify({
                'user': {
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'bio': user[5],
                    'profile_image': user[6],
                    'created_at': user[7],
                    'updated_at': user[8],
                    'last_login': user[9],
                    'institution': user[10],
                    'email': user[11],
                }
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()


# @biologist_bp.route('/biologist/dashboard/stats', methods=['GET', 'OPTIONS'])
# @cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
# @biologist_required
# @login_required
# def get_dashboard_stats():
#     """Get dashboard statistics for biologist"""
#     if request.method == 'OPTIONS':
#         return jsonify({}), 200
    
#     try:
#         conn = get_db_connection()
#         if conn is None:
#             return jsonify({'error': 'Database connection failed'}), 500

#         with conn.cursor() as cur:
#             # Get coral lifeform distribution
#             cur.execute("""
#                 SELECT 
#                     cl.class_name,
#                     cl.color_hex,
#                     COUNT(sr.id) as detection_count,
#                     SUM(sr.area_px) as total_area_px,
#                     AVG(sr.coverage_percent) as avg_coverage,
#                     COUNT(DISTINCT sr.image_id) as image_count
#                 FROM coral_lifeforms cl
#                 LEFT JOIN segmentation_results sr ON cl.id = sr.class_id
#                 LEFT JOIN images i ON sr.image_id = i.id
#                 WHERE (i.upload_status = 'approved' OR sr.id IS NULL)
#                 GROUP BY cl.id, cl.class_name, cl.color_hex
#                 HAVING COUNT(sr.id) > 0
#                 ORDER BY detection_count DESC
#                 LIMIT 10
#             """)
            
#             coral_distribution = []
#             total_detections = 0
            
#             rows = cur.fetchall()
#             print(f"Query returned {len(rows)} rows")  # Debug line
            
#             for row in rows:
#                 print(f"Row data: {row}")  # Debug line
#                 # Fixed: row[2] is detection_count (index 2), not row[1]
#                 detection_count = row[2] if row[2] is not None else 0
#                 total_detections += detection_count
                
#                 coral_distribution.append({
#                     'class_name': row[0],
#                     'color_hex': row[1] or '#6B7280',
#                     'detection_count': detection_count,
#                     'total_area_px': row[3] if row[3] is not None else 0,
#                     'avg_coverage': float(row[4]) if row[4] is not None else 0.0,
#                     'image_count': row[5] if row[5] is not None else 0
#                 })
            
#             # Calculate percentages
#             for item in coral_distribution:
#                 if total_detections > 0:
#                     item['percentage'] = (item['detection_count'] / total_detections) * 100
#                 else:
#                     item['percentage'] = 0
            
#             # Get recent analysis statistics
#             cur.execute("""
#                 SELECT 
#                     COUNT(DISTINCT i.id) as total_images,
#                     COUNT(DISTINCT sr.id) as total_detections,
#                     AVG(COALESCE(i.analysis_confidence, 0)) as avg_confidence,
#                     COUNT(DISTINCT i.uploader_id) as active_users
#                 FROM images i
#                 LEFT JOIN segmentation_results sr ON i.id = sr.image_id
#                 WHERE i.uploaded_at >= NOW() - INTERVAL '30 days'
#                 AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
#             """)
            
#             stats_row = cur.fetchone()
#             print(f"Stats row: {stats_row}")  # Debug line
            
#             recent_stats = {
#                 'total_images': stats_row[0] if stats_row[0] is not None else 0,
#                 'total_detections': stats_row[1] if stats_row[1] is not None else 0,
#                 'avg_confidence': float(stats_row[2]) if stats_row[2] is not None else 0.0,
#                 'active_users': stats_row[3] if stats_row[3] is not None else 0
#             }
            
#             print(f"Coral distribution: {len(coral_distribution)} items")  # Debug line
#             print(f"Recent stats: {recent_stats}")  # Debug line
            
#             return jsonify({
#                 'coral_distribution': coral_distribution,
#                 'recent_stats': recent_stats,
#                 'success': True
#             }), 200

#     except Exception as e:
#         print(f"Error fetching dashboard stats: {e}")
#         import traceback
#         traceback.print_exc()  # This will show the full error trace
#         return jsonify({'error': str(e)}), 500
#     finally:
#         if conn:
#             conn.close()

@biologist_bp.route('/biologist/dashboard/stats', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@biologist_required
@login_required
def get_dashboard_stats():
    """Get dashboard statistics for biologist"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        current_user_id = session.get('user_id')
        
        with conn.cursor() as cur:
            # Get GENERAL coral lifeform distribution (all users) for the dashboard card
            cur.execute("""
                SELECT 
                    cl.class_name,
                    cl.color_hex,
                    COUNT(sr.id) as detection_count,
                    SUM(sr.area_px) as total_area_px,
                    AVG(sr.coverage_percent) as avg_coverage,
                    COUNT(DISTINCT sr.image_id) as image_count
                FROM coral_lifeforms cl
                LEFT JOIN segmentation_results sr ON cl.id = sr.class_id
                LEFT JOIN images i ON sr.image_id = i.id
                WHERE (i.upload_status = 'approved' OR i.upload_status IS NULL)
                GROUP BY cl.id, cl.class_name, cl.color_hex
                HAVING COUNT(sr.id) > 0
                ORDER BY detection_count DESC
                LIMIT 10
            """)
            
            coral_distribution = []
            total_detections = 0
            
            rows = cur.fetchall()
            
            for row in rows:
                detection_count = int(row[2]) if row[2] is not None else 0
                total_detections += detection_count
                
                coral_distribution.append({
                    'class_name': row[0],
                    'color_hex': row[1] or '#6B7280',
                    'detection_count': detection_count,
                    'total_area_px': int(row[3]) if row[3] is not None else 0,
                    'avg_coverage': float(row[4]) if row[4] is not None else 0.0,
                    'image_count': int(row[5]) if row[5] is not None else 0
                })
            
            # Calculate percentages for general distribution
            for item in coral_distribution:
                if total_detections > 0:
                    item['percentage'] = (item['detection_count'] / total_detections) * 100
                else:
                    item['percentage'] = 0
            
            # Get PERSONAL analysis statistics for current biologist only (for stat cards)
            cur.execute("""
                SELECT 
                    COUNT(DISTINCT i.id) as total_images,
                    COUNT(DISTINCT sr.id) as total_detections,
                    AVG(COALESCE(i.analysis_confidence, 0)) * 100 as avg_confidence
                FROM images i
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE i.uploader_id = %s
                AND i.uploaded_at >= NOW() - INTERVAL '30 days'
                AND (i.upload_status = 'approved' OR i.upload_status IS NULL)
            """, (current_user_id,))
            
            personal_stats_row = cur.fetchone()
            
            # Get contributing researchers data (all active researchers)
            cur.execute("""
                SELECT 
                    u.id,
                    u.firstname,
                    u.lastname,
                    u.username,
                    u.profile_image,
                    u.institution,
                    COUNT(DISTINCT i.id) as images_contributed,
                    COUNT(DISTINCT sr.id) as detections_contributed,
                    MAX(i.uploaded_at) as last_contribution
                FROM users u
                LEFT JOIN images i ON u.id = i.uploader_id
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                WHERE u.roletype IN ('biologist', 'admin')
                AND u.status = 'approved'
                AND i.uploaded_at >= NOW() - INTERVAL '30 days'
                GROUP BY u.id, u.firstname, u.lastname, u.username, u.profile_image, u.institution
                HAVING COUNT(DISTINCT i.id) > 0
                ORDER BY images_contributed DESC
            """)
            
            contributing_researchers = []
            total_contributions = 0
            
            for researcher in cur.fetchall():
                contribution_count = int(researcher[6]) if researcher[6] else 0
                total_contributions += contribution_count
                
                contributing_researchers.append({
                    'id': researcher[0],
                    'name': f"{researcher[1]} {researcher[2]}",
                    'username': researcher[3],
                    'profile_image': researcher[4],
                    'institution': researcher[5] or 'Not specified',
                    'images_contributed': contribution_count,
                    'detections_contributed': int(researcher[7]) if researcher[7] else 0,
                    'last_contribution': researcher[8].isoformat() if researcher[8] else None
                })
            
            # Calculate contribution percentages
            for researcher in contributing_researchers:
                if total_contributions > 0:
                    researcher['contribution_percentage'] = (researcher['images_contributed'] / total_contributions) * 100
                else:
                    researcher['contribution_percentage'] = 0
            
            # Personal stats for the stat cards
            recent_stats = {
                'total_images': int(personal_stats_row[0]) if personal_stats_row[0] is not None else 0,
                'total_detections': int(personal_stats_row[1]) if personal_stats_row[1] is not None else 0,
                'avg_confidence': float(personal_stats_row[2]) if personal_stats_row[2] is not None else 0.0,
                'active_users': len(contributing_researchers)
            }
            
            
            return jsonify({
                'coral_distribution': coral_distribution,  # General distribution for dashboard card
                'recent_stats': recent_stats,              # Personal stats for stat cards
                'contributing_researchers': contributing_researchers,
                'success': True
            }), 200

    except Exception as e:
        print(f"Error fetching dashboard stats: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()