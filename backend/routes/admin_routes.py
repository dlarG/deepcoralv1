from flask import Blueprint, jsonify, session, request
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import psycopg2
from utils.auth_utils import admin_required, login_required
import os
from werkzeug.utils import secure_filename
from flask import current_app
from datetime import datetime
import json
from io import BytesIO
import pandas as pd
from flask import send_file

admin_bp = Blueprint('admin', __name__)



@admin_bp.route('/admin/users', methods=['GET'])
@admin_required
@login_required
def get_all_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Add profile_image to the SELECT query
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, profile_image, created_at, status 
                FROM users 
                WHERE users.id != %s AND status = 'approved' 
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

@admin_bp.route('/admin/users', methods=['POST'])
@admin_required
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

@admin_bp.route('/admin/users/<int:user_id>', methods=['PUT'])
@admin_required
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
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at
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
                    'created_at': updated_user[6]      # Add this field
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

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@admin_required
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

@admin_bp.route('/admin/corals', methods=['POST'])
@admin_required
@login_required
def add_coral():
    try:
        # Handle file upload
        image_filename = None
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename != '':
                filename = secure_filename(file.filename)
                # Create unique filename
                import uuid
                unique_filename = f"{uuid.uuid4().hex}_{filename}"
                
                # Save to public/uploaded_coral_information
                upload_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information'
                )
                os.makedirs(upload_path, exist_ok=True)
                file.save(os.path.join(upload_path, unique_filename))
                image_filename = unique_filename

        # Get form data
        coral_data = {
            'coral_type': request.form.get('coral_type'),
            'coral_subtype': request.form.get('coral_subtype'),
            'classification': request.form.get('classification'),
            'scientific_name': request.form.get('scientific_name'),
            'common_name': request.form.get('common_name'),
            'identification': request.form.get('identification'),
            'image': image_filename
        }

        # Validate required fields
        required_fields = ['coral_type', 'coral_subtype', 'classification', 
                          'scientific_name', 'common_name', 'identification']
        if not all(coral_data.get(field) for field in required_fields):
            return jsonify({'error': 'All fields except image are required'}), 400

        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO coral_information 
                (coral_type, coral_subtype, classification, scientific_name, 
                 common_name, identification, image) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                RETURNING *
            """, (
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
            
            coral_response = {
                'id': new_coral[0],
                'coral_type': new_coral[1],
                'coral_subtype': new_coral[2],
                'classification': new_coral[3],
                'scientific_name': new_coral[4],
                'common_name': new_coral[5],
                'identification': new_coral[6],
                'created_at': new_coral[7],
                'updated_at': new_coral[8],
                'image': new_coral[9]
            }
            
            return jsonify({
                'message': 'Coral added successfully',
                'coral': coral_response
            }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@admin_bp.route('/admin/corals/<int:coral_id>', methods=['PUT'])
@admin_required
@login_required
def update_coral(coral_id):
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
                import uuid
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
                'message': 'Coral updated successfully',
                'coral': coral_response
            }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@admin_bp.route('/admin/corals/<int:coral_id>', methods=['DELETE'])
@admin_required
@login_required
def delete_coral(coral_id):
    try:
        conn = get_db_connection()
        if conn is None:
            return jsonify({'error': 'Database connection failed'}), 500

        with conn.cursor() as cur:
            # Get coral data to delete image file
            cur.execute("SELECT image FROM coral_information WHERE id = %s", (coral_id,))
            coral_data = cur.fetchone()
            
            if not coral_data:
                return jsonify({'error': 'Coral not found'}), 404

            # Delete image file if exists
            if coral_data[0]:
                image_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information',
                    coral_data[0]
                )
                if os.path.exists(image_path):
                    os.remove(image_path)

            # Delete coral record
            cur.execute("DELETE FROM coral_information WHERE id = %s", (coral_id,))
            conn.commit()
            
            return jsonify({'message': 'Coral deleted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if 'conn' in locals():
            conn.close()

@admin_bp.route('/admin/users/<int:user_id>', methods=['GET'])
@login_required
@admin_required
def get_user_profile(user_id):
    conn = get_db_connection()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, 
                       bio, profile_image, created_at, updated_at 
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
                    'updated_at': user[8]
                }
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/pending-users', methods=['GET'])
@admin_required
@login_required
def get_pending_users():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, profile_image, created_at, status 
                FROM users 
                WHERE status = 'pending' 
                ORDER BY created_at ASC
            """)
            users = cur.fetchall()
            
            pending_users = []
            for user in users:
                pending_users.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'profile_image': user[5],
                    'created_at': user[6],
                    'status': user[7]
                })
            
            return jsonify({"pending_users": pending_users}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


@admin_bp.route('/admin/users/<int:user_id>/approve', methods=['PUT'])
@admin_required
@login_required
def approve_user(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if user exists and is pending
            cur.execute("SELECT id, status FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if user[1] != 'pending':
                return jsonify({"error": "User is not pending approval"}), 400
            
            # Update user status to approved
            cur.execute("""
                UPDATE users 
                SET status = 'approved', updated_at = CURRENT_TIMESTAMP 
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status
            """, (user_id,))
            
            updated_user = cur.fetchone()
            conn.commit()
            
            return jsonify({
                "message": "User approved successfully",
                "user": {
                    'id': updated_user[0],
                    'username': updated_user[1],
                    'firstname': updated_user[2],
                    'lastname': updated_user[3],
                    'roletype': updated_user[4],
                    'profile_image': updated_user[5],
                    'created_at': updated_user[6],
                    'status': updated_user[7]
                }
            }), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/users/<int:user_id>/reject', methods=['DELETE'])
@admin_required
@login_required
def reject_user(user_id):
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if user exists and is pending
            cur.execute("SELECT id, status, profile_image FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if user[1] != 'pending':
                return jsonify({"error": "User is not pending approval"}), 400
            
            # Delete profile image if exists
            if user[2]:
                profile_image_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'profile_uploads',
                    user[2]
                )
                if os.path.exists(profile_image_path):
                    os.remove(profile_image_path)
            
            # Delete the user (reject)
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted_id = cur.fetchone()[0]
            conn.commit()
            
            return jsonify({
                "message": "User rejected and removed successfully",
                "deleted_id": deleted_id
            }), 200
    except Exception as e:
        conn.rollback()
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


#Report Generation Routes
@admin_bp.route('/admin/reports/users', methods=['GET'])
@admin_required
@login_required
def get_users_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    role_filter = request.args.get('role')
    status_filter = request.args.get('status')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Build dynamic query
            query = """
                SELECT id, username, firstname, lastname, roletype, status, created_at,
                       CASE WHEN profile_image IS NOT NULL THEN 'Yes' ELSE 'No' END as has_profile_image
                FROM users 
                WHERE 1=1
            """
            params = []
            
            if start_date:
                query += " AND created_at >= %s::timestamp"
                params.append(start_date)
                
            if end_date:
                query += " AND created_at <= %s::timestamp"
                params.append(end_date + ' 23:59:59')
                
            if role_filter and role_filter != 'all':
                query += " AND roletype = %s"
                params.append(role_filter)
                
            if status_filter and status_filter != 'all':
                query += " AND status = %s"
                params.append(status_filter)
                
            query += " ORDER BY created_at DESC"
            
            cur.execute(query, params)
            users = cur.fetchall()
            
            # Get summary statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_users,
                    COUNT(CASE WHEN roletype = 'admin' THEN 1 END) as admin_count,
                    COUNT(CASE WHEN roletype = 'guest' THEN 1 END) as guest_count,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_count,
                    COUNT(CASE WHEN profile_image IS NOT NULL THEN 1 END) as users_with_photos
                FROM users
                WHERE created_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
            """, (start_date, (end_date + ' 23:59:59') if end_date else None))
            
            stats = cur.fetchone()
            
            users_data = []
            for user in users:
                users_data.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'status': user[5],
                    'created_at': user[6],
                    'has_profile_image': user[7]
                })
            
            return jsonify({
                "users": users_data,
                "summary": {
                    'total_users': stats[0],
                    'admin_count': stats[1],
                    'guest_count': stats[2],
                    'approved_count': stats[3],
                    'pending_count': stats[4],
                    'users_with_photos': stats[5]
                }
            }), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/reports/corals', methods=['GET'])
@admin_required
@login_required
def get_corals_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    coral_type = request.args.get('coral_type')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Build dynamic query
            query = """
                SELECT id, coral_type, coral_subtype, classification, scientific_name, 
                       common_name, created_at,
                       CASE WHEN image IS NOT NULL THEN 'Yes' ELSE 'No' END as has_image
                FROM coral_information 
                WHERE 1=1
            """
            params = []
            
            if start_date:
                query += " AND created_at >= %s::timestamp"
                params.append(start_date)
                
            if end_date:
                query += " AND created_at <= %s::timestamp"
                params.append(end_date + ' 23:59:59')
                
            if coral_type and coral_type != 'all':
                query += " AND coral_type = %s"
                params.append(coral_type)
                
            query += " ORDER BY created_at DESC"
            
            cur.execute(query, params)
            corals = cur.fetchall()
            
            # Get summary statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_corals,
                    COUNT(DISTINCT coral_type) as unique_types,
                    COUNT(DISTINCT coral_subtype) as unique_subtypes,
                    COUNT(CASE WHEN image IS NOT NULL THEN 1 END) as corals_with_images
                FROM coral_information
                WHERE created_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
            """, (start_date, (end_date + ' 23:59:59') if end_date else None))
            
            stats = cur.fetchone()
            
            # Get coral types distribution
            cur.execute("""
                SELECT coral_type, COUNT(*) as count
                FROM coral_information
                WHERE created_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
                GROUP BY coral_type
                ORDER BY count DESC
            """, (start_date, (end_date + ' 23:59:59') if end_date else None))
            
            coral_types_stats = cur.fetchall()
            
            corals_data = []
            for coral in corals:
                corals_data.append({
                    'id': coral[0],
                    'coral_type': coral[1],
                    'coral_subtype': coral[2],
                    'classification': coral[3],
                    'scientific_name': coral[4],
                    'common_name': coral[5],
                    'created_at': coral[6],
                    'has_image': coral[7]
                })
            
            return jsonify({
                "corals": corals_data,
                "summary": {
                    'total_corals': stats[0],
                    'unique_types': stats[1],
                    'unique_subtypes': stats[2],
                    'corals_with_images': stats[3]
                },
                "coral_types_distribution": [
                    {'type': item[0], 'count': item[1]} for item in coral_types_stats
                ]
            }), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/reports/activities', methods=['GET'])
@admin_required
@login_required
def get_activities_report():
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    activity_type = request.args.get('activity_type')
    user_id = request.args.get('user_id')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Build dynamic query
            query = """
                SELECT a.id, a.activity_type, a.activity_description, a.created_at,
                       u.username, u.firstname, u.lastname, a.ip_address
                FROM activities a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1
            """
            params = []
            
            if start_date:
                query += " AND a.created_at >= %s::timestamp"
                params.append(start_date)
                
            if end_date:
                query += " AND a.created_at <= %s::timestamp"
                params.append(end_date + ' 23:59:59')
                
            if activity_type and activity_type != 'all':
                query += " AND a.activity_type = %s"
                params.append(activity_type)
                
            if user_id and user_id != 'all':
                query += " AND a.user_id = %s"
                params.append(user_id)
                
            query += " ORDER BY a.created_at DESC LIMIT 1000"
            
            cur.execute(query, params)
            activities = cur.fetchall()
            
            # Get summary statistics
            cur.execute("""
                SELECT 
                    COUNT(*) as total_activities,
                    COUNT(DISTINCT user_id) as unique_users,
                    COUNT(DISTINCT activity_type) as unique_activity_types
                FROM activities
                WHERE created_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
            """, (start_date, (end_date + ' 23:59:59') if end_date else None))
            
            stats = cur.fetchone()
            
            activities_data = []
            for activity in activities:
                activities_data.append({
                    'id': activity[0],
                    'activity_type': activity[1],
                    'activity_description': activity[2],
                    'created_at': activity[3],
                    'username': activity[4],
                    'user_fullname': f"{activity[5]} {activity[6]}" if activity[5] else "Unknown User",
                    'ip_address': str(activity[7]) if activity[7] else "N/A"
                })
            
            return jsonify({
                "activities": activities_data,
                "summary": {
                    'total_activities': stats[0],
                    'unique_users': stats[1],
                    'unique_activity_types': stats[2]
                }
            }), 200
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/reports/export/<report_type>', methods=['POST'])
@admin_required
@login_required
def export_report(report_type):
    data = request.get_json()
    export_format = data.get('format', 'excel')  # excel, csv, pdf
    filters = data.get('filters', {})
    
    try:
        # Get data based on report type
        if report_type == 'users':
            # Call users report endpoint logic
            pass
        elif report_type == 'corals':
            # Call corals report endpoint logic
            pass
        elif report_type == 'activities':
            # Call activities report endpoint logic
            pass
        
        # For now, return success message
        # We ca implement actual file generation here
        return jsonify({
            "message": f"Report exported successfully as {export_format}",
            "download_url": f"/downloads/report_{report_type}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.{export_format}"
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500