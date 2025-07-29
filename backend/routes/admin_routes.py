from flask import Blueprint, jsonify, session, request
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import psycopg2
from utils.auth_utils import admin_required, login_required
import os
from werkzeug.utils import secure_filename
from flask import current_app

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
            cur.execute("SELECT id, username, firstname, lastname, roletype FROM users WHERE users.id != %s", (session.get('user_id'),))
            users = cur.fetchall()
            
            users_list = []
            for user in users:
                users_list.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4]
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
            
            # Insert new user
            cur.execute(
                """INSERT INTO users 
                (username, password, firstname, lastname, roletype) 
                VALUES (%s, %s, %s, %s, %s) 
                RETURNING id, username, firstname, lastname, roletype""",
                (data['username'], hashed_password, data['firstname'], 
                 data['lastname'], data['roletype'])
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
                    'roletype': new_user[4]
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
            
            # Execute update
            update_query = f"""
                UPDATE users 
                SET {', '.join(update_fields)} 
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype
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
                    'roletype': updated_user[4]
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