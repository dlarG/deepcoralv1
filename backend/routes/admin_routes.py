from flask import Blueprint, jsonify, session, request, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from db import get_db_connection
import psycopg2
from utils.auth_utils import admin_required, login_required, biologist_required, roles_required
import os
from werkzeug.utils import secure_filename
from flask import current_app
from datetime import datetime
import json
import io
from io import BytesIO
from datetime import datetime
import psycopg2
import pandas as pd
from flask import send_file
import shutil
from flask_cors import cross_origin
from routes.activity_log import (
    log_user_management, log_coral_info_action, log_report_generation, 
    log_system_action, ActivityLogger
)
import uuid
from werkzeug.utils import secure_filename

from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image as ReportLabImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib.backends.backend_pdf import PdfPages
import base64
import tempfile


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
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, profile_image, created_at, status, last_login, email 
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
                    'profile_image': user[5],  
                    'created_at': user[6],     
                    'status': user[7],
                    'last_login': user[8],
                    'email': user[9],          
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
    
    required_fields = ['username', 'password', 'firstname', 'lastname', 'roletype', 'email']
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
            
            #check if email already exists
            cur.execute("SELECT id FROM users WHERE email = %s", (data['email'],))
            if cur.fetchone():
                return jsonify({"error": "Email already exists"}), 400

            # Hash password
            hashed_password = generate_password_hash(data['password'])
            
            # Insert new user and return profile_image field
            cur.execute(
                """INSERT INTO users 
                (username, password, firstname, lastname, roletype, status, email) 
                VALUES (%s, %s, %s, %s, %s, %s, %s) 
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status, email""",
                (data['username'], hashed_password, data['firstname'], 
                 data['lastname'], data['roletype'], status, data['email'])
            )
            
            new_user = cur.fetchone()
            conn.commit()

            log_user_management(
                admin_id=session.get('user_id'),
                action='created',
                target_user=f"{data['firstname']} {data['lastname']} (@{data['username']})",
                details={'role': data['roletype'], 'status': status}
            )
            
            
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
                    'status': new_user[7],           # Add status field,
                    'email': new_user[8]            # Add email field
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
            
            if 'email' in data:
                # Check if new email is available
                cur.execute("SELECT id FROM users WHERE email = %s AND id != %s", 
                          (data['email'], user_id))
                if cur.fetchone():
                    return jsonify({"error": "Email already taken"}), 400
                update_fields.append("email = %s")
                update_values.append(data['email'])
            
            if not update_fields:
                return jsonify({"error": "No valid fields to update"}), 400
            
            # Add user_id to values
            update_values.append(user_id)
            
            # Execute update and return profile_image field
            update_query = f"""
                UPDATE users 
                SET {', '.join(update_fields)} 
                WHERE id = %s
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status, email
            """
            
            cur.execute(update_query, update_values)
            updated_user = cur.fetchone()
            conn.commit()

            log_user_management(
                admin_id=session.get('user_id'),
                action='updated',
                target_user=f"{updated_user[1]} ({updated_user[2]} {updated_user[3]})",
                details={'updated_fields': list(data.keys())}
            )
            
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
                    'status': updated_user[7],           # Add status field
                    'email': updated_user[8]            # Add email field
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
            # Check if user exists and get user info for logging
            cur.execute("SELECT username, firstname, lastname FROM users WHERE id = %s", (user_id,))
            user_info = cur.fetchone()
            if not user_info:
                return jsonify({"error": "User not found"}), 404
            
            
            # Delete the user
            cur.execute("DELETE FROM users WHERE id = %s RETURNING id", (user_id,))
            deleted_id = cur.fetchone()[0]
            conn.commit()

            log_user_management(
                admin_id=session.get('user_id'),
                action='deleted',
                target_user=f"{user_info[1]} {user_info[2]} (@{user_info[0]})"
            )
            
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

@admin_bp.route('/admin/corals', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@admin_required
@login_required
def add_coral():
    """Add new coral information - Admin endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        print("Admin adding coral - Starting process...")  # Debug log
        print(f"Session user ID: {session.get('user_id')}")  # Debug log
        print(f"Form data: {request.form}")  # Debug log
        print(f"Files: {request.files}")  # Debug log
        
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
                
                # Save to frontend/public/uploaded_coral_information
                upload_path = os.path.join(
                    current_app.root_path, 
                    '..', 'frontend', 'public', 'uploaded_coral_information'
                )
                
                # Create directory if it doesn't exist
                os.makedirs(upload_path, exist_ok=True)
                
                # Save the file
                file_path = os.path.join(upload_path, unique_filename)
                file.save(file_path)
                image_filename = unique_filename
                print(f"Image saved as: {image_filename}")  # Debug log

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
        
        print(f"Processed coral data: {coral_data}")  # Debug log

        # Validate required fields
        required_fields = ['coral_type', 'coral_subtype', 'classification', 
                          'scientific_name', 'common_name', 'identification']
        missing_fields = [field for field in required_fields if not coral_data.get(field)]
        
        if missing_fields:
            print(f"Missing fields: {missing_fields}")  # Debug log
            return jsonify({
                'error': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400

        # Database connection
        conn = get_db_connection()
        if conn is None:
            print("Database connection failed")  # Debug log
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
            
            print(f"Coral inserted with ID: {new_coral[0]}")  # Debug log

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
            
            print(f"Returning coral response: {coral_response}")  # Debug log
            
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
        traceback.print_exc()  # Print full stack trace
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@admin_bp.route('/admin/corals/<int:coral_id>', methods=['PUT', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@admin_required
@login_required
def update_coral(coral_id):
    """Update coral information - Admin endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        print(f"Admin updating coral ID: {coral_id}")  # Debug log
        print(f"Session user ID: {session.get('user_id')}")  # Debug log
        
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
                        try:
                            os.remove(old_image_path)
                        except:
                            pass

                # Save new image
                filename = secure_filename(file.filename)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                file_ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else 'jpg'
                unique_filename = f"coral_{timestamp}_{uuid.uuid4().hex[:8]}.{file_ext}"
                
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
            try:
                log_coral_info_action(
                    user_id=session.get('user_id'),
                    action='updated',
                    coral_name=f"{updated_coral[5]} ({updated_coral[4]})"
                )
            except Exception as log_error:
                print(f"Logging error (non-critical): {log_error}")
            
            coral_response = {
                'id': updated_coral[0],
                'coral_type': updated_coral[1],
                'coral_subtype': updated_coral[2],
                'classification': updated_coral[3],
                'scientific_name': updated_coral[4],
                'common_name': updated_coral[5],
                'identification': updated_coral[6],
                'created_at': updated_coral[7].isoformat() if updated_coral[7] else None,
                'updated_at': updated_coral[8].isoformat() if updated_coral[8] else None,
                'image': updated_coral[9]
            }
            
            return jsonify({
                'success': True,
                'message': 'Coral information updated successfully',
                'coral': coral_response
            }), 200

    except psycopg2.Error as db_error:
        print(f"Database error: {db_error}")
        if 'conn' in locals():
            conn.rollback()
        return jsonify({'error': f'Database error: {str(db_error)}'}), 500
    except Exception as e:
        print(f"Error updating coral: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
            conn.close()

@admin_bp.route('/admin/corals/<int:coral_id>', methods=['DELETE', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@admin_required
@login_required
def delete_coral(coral_id):
    """Delete coral information - Admin endpoint"""
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        print(f"Admin deleting coral ID: {coral_id}")  # Debug log
        print(f"Session user ID: {session.get('user_id')}")  # Debug log
        
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
            try:
                log_coral_info_action(
                    user_id=session.get('user_id'),
                    action='deleted',
                    coral_name=f"{coral_data[0]} ({coral_data[1]})"
                )
            except Exception as log_error:
                print(f"Logging error (non-critical): {log_error}")
            
            return jsonify({
                'success': True,
                'message': 'Coral information deleted successfully'
            }), 200

    except psycopg2.Error as db_error:
        print(f"Database error: {db_error}")
        if 'conn' in locals():
            conn.rollback()
        return jsonify({'error': f'Database error: {str(db_error)}'}), 500
    except Exception as e:
        print(f"Error deleting coral: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': f'Internal server error: {str(e)}'}), 500
    finally:
        if 'conn' in locals() and conn:
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
                       bio, profile_image, created_at, updated_at, last_login 
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
                    'last_login': user[9]
                }
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
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
            # Check if user exists and is pending - GET EMAIL TOO
            cur.execute("SELECT id, status, firstname, lastname, username, email FROM users WHERE id = %s", (user_id,))
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
                RETURNING id, username, firstname, lastname, roletype, profile_image, created_at, status, email
            """, (user_id,))
            
            updated_user = cur.fetchone()
            conn.commit()

            # Log the approval
            log_user_management(
                admin_id=session.get('user_id'),
                action='approved',
                target_user=f"{updated_user[2]} ({updated_user[3]} {updated_user[4]})"
            )
            
            # Send approval email to user
            try:
                from utils.email_service import email_service
                
                user_data = {
                    'firstname': updated_user[2],
                    'lastname': updated_user[3],
                    'username': updated_user[1],
                    'email': updated_user[8],  # Email from the query
                    'roletype': updated_user[4]
                }
                
                email_sent = email_service.send_user_approval_notification(user_data)
                
                # Log email activity
                log_system_action(
                    user_id=updated_user[0],
                    action='approval_email_sent' if email_sent else 'approval_email_failed',
                    description=f"Approval notification email {'sent' if email_sent else 'failed'} to user",
                    details={
                        'user_email': updated_user[8],
                        'email_sent': email_sent
                    }
                )
                
                if email_sent:
                    print(f"✅ Approval email sent to {updated_user[8]}")
                else:
                    print(f"❌ Failed to send approval email to {updated_user[8]}")
                    
            except Exception as email_error:
                print(f"❌ Error sending approval email: {str(email_error)}")
                log_system_action(
                    user_id=updated_user[0],
                    action='approval_email_error',
                    description=f"Error sending approval notification email",
                    details={'error': str(email_error)}
                )
                # Don't fail the approval if email fails
            
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
            cur.execute("SELECT id, status, profile_image, firstname, lastname, username, email, roletype FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            if user[1] != 'pending':
                return jsonify({"error": "User is not pending approval"}), 400
            
            user_data = {
                'firstname': user[3],
                'lastname': user[4],
                'username': user[5],
                'email': user[6],
                'roletype': user[7]
            }
            
            try:
                from utils.email_service import email_service
                
                rejection_reason = request.get_json().get('reason') if request.get_json() else None
                email_sent = email_service.send_user_rejection_notification(user_data, rejection_reason)
                
                if email_sent:
                    print(f"✅ Rejection email sent to {user[6]}")
                else:
                    print(f"❌ Failed to send rejection email to {user[6]}")
                    
            except Exception as email_error:
                print(f"❌ Error sending rejection email: {str(email_error)}")
                # Continue with deletion even if email fails
            
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

            # Log the rejection
            log_user_management(
                admin_id=session.get('user_id'),
                action='rejected',
                target_user=f"{user[3]} {user[4]} (@{user[5]})"
            )
            
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

@admin_bp.route('/admin/users/<int:user_id>/activities', methods=['GET'])
@admin_required
@login_required
def get_user_activities(user_id):
    """Get activities for a specific user"""
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 20))
    activity_type = request.args.get('activity_type')
    category = request.args.get('category')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Check if user exists
            cur.execute("SELECT id, username, firstname, lastname FROM users WHERE id = %s", (user_id,))
            user = cur.fetchone()
            
            if not user:
                return jsonify({"error": "User not found"}), 404
            
            # Build dynamic query
            base_query = """
                FROM activities a
                WHERE a.user_id = %s
            """
            params = [user_id]
            
            if activity_type and activity_type != 'all':
                base_query += " AND a.activity_type = %s"
                params.append(activity_type)
                
            if category and category != 'all':
                base_query += " AND a.category = %s"
                params.append(category)
            
            # Get total count
            count_query = "SELECT COUNT(*) " + base_query
            cur.execute(count_query, params)
            total_count = cur.fetchone()[0]
            
            # Get paginated data
            data_query = """
                SELECT a.id, a.activity_type, a.activity_description, a.created_at,
                       a.category, a.ip_address, a.metadata
                """ + base_query + """
                ORDER BY a.created_at DESC 
                LIMIT %s OFFSET %s
            """
            
            offset = (page - 1) * per_page
            cur.execute(data_query, params + [per_page, offset])
            activities = cur.fetchall()
            
            # Get activity summary for this user
            summary_query = """
                SELECT 
                    COUNT(*) as total_activities,
                    COUNT(DISTINCT a.activity_type) as unique_activity_types,
                    COUNT(DISTINCT a.category) as unique_categories,
                    MAX(a.created_at) as last_activity
                FROM activities a
                WHERE a.user_id = %s
            """
            
            cur.execute(summary_query, [user_id])
            stats = cur.fetchone()
            
            activities_data = []
            for activity in activities:
                activities_data.append({
                    'id': activity[0],
                    'activity_type': activity[1],
                    'activity_description': activity[2],
                    'created_at': activity[3].isoformat() if activity[3] else None,
                    'category': activity[4],
                    'ip_address': str(activity[5]) if activity[5] else "N/A",
                    'metadata': activity[6] if activity[6] else {}
                })
            
            return jsonify({
                "activities": activities_data,
                "user_info": {
                    "id": user[0],
                    "username": user[1],
                    "fullname": f"{user[2]} {user[3]}"
                },
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_count": total_count,
                    "total_pages": (total_count + per_page - 1) // per_page
                },
                "summary": {
                    'total_activities': stats[0] or 0,
                    'unique_activity_types': stats[1] or 0,
                    'unique_categories': stats[2] or 0,
                    'last_activity': stats[3].isoformat() if stats[3] else None
                }
            }), 200
            
    except Exception as e:
        print(f"Error in user activities: {str(e)}")
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
            # Build dynamic query for images with coral analysis results
            query = """
                SELECT DISTINCT i.id, i.filename, i.uploaded_at, i.region, i.province, 
                       i.municipality, i.barangay, i.site_name, i.analysis_confidence,
                       u.username, u.firstname, u.lastname,
                       COALESCE(total_coverage.total_coverage, 0) as total_coverage,
                       coral_details.coral_breakdown
                FROM images i
                LEFT JOIN users u ON i.uploader_id = u.id
                LEFT JOIN (
                    SELECT sr.image_id, 
                           SUM(sr.coverage_percent) as total_coverage
                    FROM segmentation_results sr
                    JOIN coral_lifeforms cl ON sr.class_id = cl.id
                    WHERE cl.category LIKE '%coral%'
                    GROUP BY sr.image_id
                ) total_coverage ON i.id = total_coverage.image_id
                LEFT JOIN (
                    SELECT sr.image_id,
                           JSON_AGG(
                               JSON_BUILD_OBJECT(
                                   'class_name', cl.class_name,
                                   'coverage_percent', sr.coverage_percent,
                                   'instance_count', sr.instance_count,
                                   'confidence', sr.avg_confidence
                               )
                           ) as coral_breakdown
                    FROM segmentation_results sr
                    JOIN coral_lifeforms cl ON sr.class_id = cl.id
                    WHERE cl.category LIKE '%coral%'
                    GROUP BY sr.image_id
                ) coral_details ON i.id = coral_details.image_id
                WHERE i.processing_status = 'completed'
                AND EXISTS (
                    SELECT 1 FROM segmentation_results sr2 
                    JOIN coral_lifeforms cl2 ON sr2.class_id = cl2.id 
                    WHERE sr2.image_id = i.id AND cl2.category LIKE '%coral%'
                )
            """
            params = []
            
            if start_date:
                query += " AND i.uploaded_at >= %s::timestamp"
                params.append(start_date)
                
            if end_date:
                query += " AND i.uploaded_at <= %s::timestamp"
                params.append(end_date + ' 23:59:59')
                
            if coral_type and coral_type != 'all':
                if coral_type == 'hard_coral':
                    query += """ AND EXISTS (
                        SELECT 1 FROM segmentation_results sr3 
                        JOIN coral_lifeforms cl3 ON sr3.class_id = cl3.id 
                        WHERE sr3.image_id = i.id AND cl3.category = 'hard_coral'
                    )"""
                elif coral_type == 'soft_coral':
                    query += """ AND EXISTS (
                        SELECT 1 FROM segmentation_results sr3 
                        JOIN coral_lifeforms cl3 ON sr3.class_id = cl3.id 
                        WHERE sr3.image_id = i.id AND cl3.category = 'soft_coral'
                    )"""
                
            query += " ORDER BY i.uploaded_at DESC"
            
            cur.execute(query, params)
            coral_images = cur.fetchall()
            
            # Get summary statistics
            summary_query = """
                SELECT 
                    COUNT(DISTINCT i.id) as total_analyzed_images,
                    COUNT(DISTINCT i.uploader_id) as unique_uploaders,
                    AVG(total_coverage.total_coverage) as avg_coral_coverage,
                    COUNT(DISTINCT cl.class_name) as unique_coral_species,
                    COUNT(DISTINCT CONCAT(i.region, '-', i.province)) as unique_locations
                FROM images i
                LEFT JOIN (
                    SELECT sr.image_id, SUM(sr.coverage_percent) as total_coverage
                    FROM segmentation_results sr
                    JOIN coral_lifeforms cl ON sr.class_id = cl.id
                    WHERE cl.category LIKE '%coral%'
                    GROUP BY sr.image_id
                ) total_coverage ON i.id = total_coverage.image_id
                LEFT JOIN segmentation_results sr ON i.id = sr.image_id
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                WHERE i.processing_status = 'completed'
                AND i.uploaded_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) 
                AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
            """
            
            cur.execute(summary_query, (start_date, (end_date + ' 23:59:59') if end_date else None))
            stats = cur.fetchone()
            
            # Get coral species distribution
            species_query = """
                SELECT cl.class_name, cl.category,
                       COUNT(DISTINCT sr.image_id) as image_count,
                       AVG(sr.coverage_percent) as avg_coverage,
                       SUM(sr.instance_count) as total_instances
                FROM segmentation_results sr
                JOIN coral_lifeforms cl ON sr.class_id = cl.id
                JOIN images i ON sr.image_id = i.id
                WHERE cl.category LIKE '%coral%'
                AND i.uploaded_at BETWEEN COALESCE(%s::timestamp, '1900-01-01'::timestamp) 
                AND COALESCE(%s::timestamp, '2100-12-31'::timestamp)
                GROUP BY cl.class_name, cl.category
                ORDER BY avg_coverage DESC
            """
            
            cur.execute(species_query, (start_date, (end_date + ' 23:59:59') if end_date else None))
            species_stats = cur.fetchall()
            
            corals_data = []
            for image in coral_images:
                corals_data.append({
                    'id': image[0],
                    'filename': image[1],
                    'uploaded_at': image[2],
                    'location': {
                        'region': image[3],
                        'province': image[4],
                        'municipality': image[5],
                        'barangay': image[6],
                        'site_name': image[7]
                    },
                    'analysis_confidence': float(image[8]) if image[8] else 0,
                    'uploader': {
                        'username': image[9],
                        'fullname': f"{image[10]} {image[11]}" if image[10] else "Unknown"
                    },
                    'total_coral_coverage': float(image[12]) if image[12] else 0,
                    'coral_breakdown': image[13] if image[13] else []
                })
            
            return jsonify({
                "coral_images": corals_data,
                "summary": {
                    'total_analyzed_images': stats[0] or 0,
                    'unique_uploaders': stats[1] or 0,
                    'avg_coral_coverage': float(stats[2]) if stats[2] else 0,
                    'unique_coral_species': stats[3] or 0,
                    'unique_locations': stats[4] or 0
                },
                "species_distribution": [
                    {
                        'species': item[0], 
                        'category': item[1],
                        'image_count': item[2],
                        'avg_coverage': float(item[3]) if item[3] else 0,
                        'total_instances': item[4]
                    } for item in species_stats
                ]
            }), 200
            
    except Exception as e:
        print(f"Error in coral report: {str(e)}")
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
    category = request.args.get('category')
    page = int(request.args.get('page', 1))
    per_page = int(request.args.get('per_page', 50))
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Build dynamic query with pagination
            base_query = """
                FROM activities a
                LEFT JOIN users u ON a.user_id = u.id
                WHERE 1=1
            """
            params = []
            
            if start_date:
                base_query += " AND a.created_at >= %s::timestamp"
                params.append(start_date)
                
            if end_date:
                base_query += " AND a.created_at <= %s::timestamp"
                params.append(end_date + ' 23:59:59')
                
            if activity_type and activity_type != 'all':
                base_query += " AND a.activity_type = %s"
                params.append(activity_type)
                
            if user_id and user_id != 'all':
                base_query += " AND a.user_id = %s"
                params.append(user_id)
                
            if category and category != 'all':
                base_query += " AND a.category = %s"
                params.append(category)
            
            # Get total count
            count_query = "SELECT COUNT(*) " + base_query
            cur.execute(count_query, params)
            total_count = cur.fetchone()[0]
            
            # Get paginated data
            data_query = """
                SELECT a.id, a.activity_type, a.activity_description, a.created_at,
                       a.category, u.username, u.firstname, u.lastname, a.ip_address,
                       a.metadata
                """ + base_query + """
                ORDER BY a.created_at DESC 
                LIMIT %s OFFSET %s
            """
            
            offset = (page - 1) * per_page
            cur.execute(data_query, params + [per_page, offset])
            activities = cur.fetchall()
            
            # Get summary statistics - FIXED VERSION
            summary_params = []
            summary_where = "WHERE 1=1"
            
            # Add date range for summary
            if start_date:
                summary_where += " AND a.created_at >= %s::timestamp"
                summary_params.append(start_date)
            else:
                summary_where += " AND a.created_at >= %s::timestamp"
                summary_params.append('1900-01-01')
                
            if end_date:
                summary_where += " AND a.created_at <= %s::timestamp"
                summary_params.append(end_date + ' 23:59:59')
            else:
                summary_where += " AND a.created_at <= %s::timestamp"
                summary_params.append('2100-12-31')
            
            # Add other filters to summary if they exist
            if activity_type and activity_type != 'all':
                summary_where += " AND a.activity_type = %s"
                summary_params.append(activity_type)
                
            if user_id and user_id != 'all':
                summary_where += " AND a.user_id = %s"
                summary_params.append(user_id)
                
            if category and category != 'all':
                summary_where += " AND a.category = %s"
                summary_params.append(category)
            
            summary_query = """
                SELECT 
                    COUNT(*) as total_activities,
                    COUNT(DISTINCT a.user_id) as unique_users,
                    COUNT(DISTINCT a.activity_type) as unique_activity_types,
                    COUNT(DISTINCT a.category) as unique_categories
                FROM activities a
                LEFT JOIN users u ON a.user_id = u.id
                """ + summary_where
            
            cur.execute(summary_query, summary_params)
            stats = cur.fetchone()
            
            activities_data = []
            for activity in activities:
                activities_data.append({
                    'id': activity[0],
                    'activity_type': activity[1],
                    'activity_description': activity[2],
                    'created_at': activity[3],
                    'category': activity[4],
                    'username': activity[5],
                    'user_fullname': f"{activity[6]} {activity[7]}" if activity[6] else "System",
                    'ip_address': str(activity[8]) if activity[8] else "N/A",
                    'metadata': activity[9] if activity[9] else {}
                })
            
            return jsonify({
                "activities": activities_data,
                "pagination": {
                    "current_page": page,
                    "per_page": per_page,
                    "total_count": total_count,
                    "total_pages": (total_count + per_page - 1) // per_page
                },
                "summary": {
                    'total_activities': stats[0] or 0,
                    'unique_users': stats[1] or 0,
                    'unique_activity_types': stats[2] or 0,
                    'unique_categories': stats[3] or 0
                }
            }), 200
            
    except Exception as e:
        print(f"Error in activities report: {str(e)}")
        import traceback
        traceback.print_exc()  # This will help us see the full error
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
    

@admin_bp.route('/admin/dashboard/stats', methods=['GET'])
@admin_required
@login_required
def get_dashboard_stats():
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Initialize default values
            stats = {
                "approved_users": 0,
                "total_images": 0,
                "coral_species": 0,
                "analysis_sessions": 0,
                "recent_activities": 0
            }
            
            # Get approved users count
            try:
                cur.execute("SELECT COUNT(*) FROM users WHERE status = 'approved'")
                result = cur.fetchone()
                stats["approved_users"] = result[0] if result else 0
            except Exception as e:
                print(f"Error getting approved users: {e}")
            
            # Get total images count
            try:
                cur.execute("SELECT COUNT(*) FROM images")
                result = cur.fetchone()
                stats["total_images"] = result[0] if result else 0
            except Exception as e:
                print(f"Error getting total images: {e}")
                # If images table doesn't exist, keep default 0
            
            # Get distinct coral species count
            try:
                cur.execute("SELECT COUNT(DISTINCT class_name) FROM coral_lifeforms")
                result = cur.fetchone()
                stats["coral_species"] = result[0] if result else 0
            except Exception as e:
                print(f"Error getting coral species: {e}")
                # If table doesn't exist, keep default 0
            
            # Get analysis sessions count (using segmentation_results as proxy)
            try:
                cur.execute("SELECT COUNT(DISTINCT image_id) FROM segmentation_results")
                result = cur.fetchone()
                stats["analysis_sessions"] = result[0] if result else 0
            except Exception as e:
                print(f"Error getting analysis sessions: {e}")
                # If table doesn't exist, keep default 0
            
            # Get recent activity count (last 7 days)
            try:
                cur.execute("""
                    SELECT COUNT(*) FROM activities 
                    WHERE created_at >= NOW() - INTERVAL '7 days'
                """)
                result = cur.fetchone()
                stats["recent_activities"] = result[0] if result else 0
            except Exception as e:
                print(f"Error getting recent activities: {e}")
                # If table doesn't exist, keep default 0
            
            return jsonify({"stats": stats}), 200
            
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/dashboard/recent-users', methods=['GET'])
@admin_required
@login_required
def get_recent_users():
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            # Get 6 most recent approved users (excluding current user)
            try:
                cur.execute("""
                    SELECT id, username, firstname, lastname, roletype, 
                           profile_image, created_at, last_login, institution
                    FROM users 
                    WHERE status = 'approved' AND id != %s
                    ORDER BY created_at DESC 
                    LIMIT 6
                """, (session.get('user_id'),))
                
                users = cur.fetchall()
                
                recent_users = []
                for user in users:
                    recent_users.append({
                        'id': user[0],
                        'username': user[1],
                        'firstname': user[2],
                        'lastname': user[3],
                        'roletype': user[4],
                        'profile_picture': user[5],  # Note: using profile_picture to match frontend
                        'created_at': user[6].isoformat() if user[6] else None,
                        'last_login': user[7].isoformat() if user[7] else None,
                        'institution': user[8] or 'Not specified'
                    })
                
                return jsonify({"recent_users": recent_users}), 200
                
            except Exception as e:
                # Return empty list if there's an issue
                return jsonify({"recent_users": []}), 200
            
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/dashboard/recent-activities', methods=['GET'])
@admin_required
@login_required
def get_recent_activities():
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            try:
                cur.execute("""
                    SELECT a.id, a.activity_type, a.activity_description, 
                           a.created_at, a.category, u.firstname, u.lastname, 
                           u.profile_image
                    FROM activities a
                    LEFT JOIN users u ON a.user_id = u.id
                    ORDER BY a.created_at DESC 
                    LIMIT 10
                """)
                activities = cur.fetchall()
                
                recent_activities = []
                for activity in activities:
                    recent_activities.append({
                        'id': activity[0],
                        'activity_type': activity[1],
                        'activity_description': activity[2],
                        'created_at': activity[3].isoformat() if activity[3] else None,
                        'category': activity[4],  # Add category
                        'user_name': f"{activity[5]} {activity[6]}" if activity[5] else "System",
                        'user_avatar': activity[7]
                    })
                
                return jsonify({"recent_activities": recent_activities}), 200
                
            except Exception as e:
                return jsonify({"recent_activities": []}), 200
            
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/dashboard/chart-data', methods=['GET'])
@admin_required
@login_required
def get_chart_data():
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            chart_data = {
                "user_trend": [],
                "image_trend": [],
                "role_distribution": []
            }
            
            # User registration trend (last 7 days)
            try:
                cur.execute("""
                    SELECT DATE(created_at) as date, COUNT(*) as count
                    FROM users 
                    WHERE created_at >= NOW() - INTERVAL '7 days'
                      AND status = 'approved'
                    GROUP BY DATE(created_at)
                    ORDER BY date
                """)
                user_trend_data = cur.fetchall()
                chart_data["user_trend"] = [
                    {'date': row[0].strftime('%Y-%m-%d'), 'count': row[1]} 
                    for row in user_trend_data
                ]
            except Exception as e:
                print(f"User trend error: {e}")
            
            # Image upload trend (last 7 days)
            try:
                cur.execute("""
                    SELECT DATE(uploaded_at) as date, COUNT(*) as count
                    FROM images 
                    WHERE uploaded_at >= NOW() - INTERVAL '7 days'
                    GROUP BY DATE(uploaded_at)
                    ORDER BY date
                """)
                image_trend_data = cur.fetchall()
                chart_data["image_trend"] = [
                    {'date': row[0].strftime('%Y-%m-%d'), 'count': row[1]} 
                    for row in image_trend_data
                ]
            except Exception as e:
                print(f"Image trend error: {e}")
            
            # Role distribution
            try:
                cur.execute("""
                    SELECT roletype, COUNT(*) as count
                    FROM users 
                    WHERE status = 'approved'
                    GROUP BY roletype
                """)
                role_data = cur.fetchall()
                chart_data["role_distribution"] = [
                    {'role': row[0], 'count': row[1]} 
                    for row in role_data
                ]
            except Exception as e:
                print(f"Role distribution error: {e}")
            
            return jsonify({"chart_data": chart_data}), 200
            
    except Exception as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()


@admin_bp.route('/notifications', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
@admin_required
def get_admin_notifications():
    """Get notification counts for admin dashboard"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            # Count pending users
            cur.execute("""
                SELECT COUNT(*) 
                FROM users 
                WHERE status = 'pending' 
                AND deleted_at IS NULL
            """)
            pending_users = cur.fetchone()[0]
            
            # Count pending images (if you want to add image approval later)
            cur.execute("""
                SELECT COUNT(*) 
                FROM images 
                WHERE upload_status = 'pending'
            """)
            pending_images = cur.fetchone()[0]
            
            # You can add more notification types here
            # For example: pending coral submissions, flagged content, etc.
            
            return jsonify({
                "pending_users": pending_users,
                "pending_images": pending_images,
                "total_notifications": pending_users + pending_images
            })
            
    except Exception as e:
        print(f"Error fetching admin notifications: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

# You can add more specific notification endpoints
@admin_bp.route('/notifications/users/pending', methods=['GET'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
@admin_required
def get_pending_users_details():
    """Get detailed list of pending users for notifications"""
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, email, created_at
                FROM users 
                WHERE status = 'pending' 
                AND deleted_at IS NULL
                ORDER BY created_at ASC
                LIMIT 10
            """)
            
            pending_users = []
            for row in cur.fetchall():
                pending_users.append({
                    'id': row[0],
                    'username': row[1],
                    'firstname': row[2],
                    'lastname': row[3],
                    'email': row[4],
                    'created_at': row[5].isoformat() if row[5] else None
                })
            
            return jsonify({
                "pending_users": pending_users,
                "count": len(pending_users)
            })
            
    except Exception as e:
        print(f"Error fetching pending users: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/models/current', methods=['GET'])
@admin_required
@login_required
def get_current_models():
    """Get information about currently installed models"""
    try:
        models_dir = os.path.join(current_app.root_path, '..', 'models')
        
        models_info = {
            'autocrop': get_model_info(models_dir, 'autocrop'),
            'unet': get_model_info(models_dir, 'unet_segmentation')
        }
        
        return jsonify({"models": models_info}), 200
        
    except Exception as e:
        print(f"Error getting current models: {str(e)}")
        return jsonify({"error": str(e)}), 500

def get_model_info(models_dir, model_type):
    """Helper function to get model file information"""
    try:
        model_extensions = ['.h5', '.pkl', '.pt', '.pth', '.onnx']
        model_files = []
        
        if not os.path.exists(models_dir):
            os.makedirs(models_dir, exist_ok=True)
            
        print(f"🔍 Searching for {model_type} models in: {models_dir}")
        print(f"📁 Directory contents: {os.listdir(models_dir) if os.path.exists(models_dir) else 'Directory not found'}")
        
        # Define more flexible patterns for each model type
        if model_type == 'autocrop':
            # More flexible patterns for autocrop models
            patterns = [
                'autocrop', 'auto_crop', 'auto-crop',
                'crop', 'object_detection', 'detection',
                'yolo', 'ssd', 'rcnn', 'bbox', 'od'  # Common object detection model names
            ]
        else:  # unet_segmentation
            patterns = [
                'unet', 'u_net', 'u-net', 'segmentation',
                'seg', 'coral_unet', 'coral-unet'
            ]
        
        # Find model files with any of the patterns
        for file in os.listdir(models_dir):
            print(f"📄 Checking file: {file}")
            
            # Check if file has valid extension
            if any(file.lower().endswith(ext) for ext in model_extensions):
                print(f"✓ Valid extension found: {file}")
                
                # For autocrop, be more flexible with pattern matching
                if model_type == 'autocrop':
                    # Check if any pattern matches (case insensitive)
                    if any(pattern.lower() in file.lower() for pattern in patterns):
                        print(f"✓ Pattern match found for autocrop: {file}")
                        model_files.append(file)
                    # Also include any .pt files that might be object detection models
                    elif file.lower().endswith(('.pt', '.pth')):
                        print(f"✓ Adding .pt/.pth file as potential autocrop model: {file}")
                        model_files.append(file)
                else:  # unet
                    # For unet, use existing logic but more flexible
                    if any(pattern.lower() in file.lower() for pattern in patterns):
                        print(f"✓ Pattern match found for unet: {file}")
                        model_files.append(file)
        
        print(f"📋 Found {model_type} model files: {model_files}")
        
        if model_files:
            # Get the most recent model file
            latest_file = max(model_files, key=lambda f: os.path.getmtime(os.path.join(models_dir, f)))
            file_path = os.path.join(models_dir, latest_file)
            file_size = os.path.getsize(file_path)
            last_modified = datetime.fromtimestamp(os.path.getmtime(file_path))
            
            print(f"✅ Latest {model_type} model: {latest_file}")
            
            return {
                'name': latest_file,
                'size': f"{file_size / (1024*1024):.2f} MB",
                'lastModified': last_modified.strftime("%Y-%m-%d %H:%M:%S")
            }
        else:
            print(f"❌ No {model_type} model found")
            return {
                'name': 'No model selected',
                'size': '0 MB',
                'lastModified': 'Never'
            }
            
    except Exception as e:
        print(f"❌ Error getting model info for {model_type}: {str(e)}")
        return {
            'name': 'Error loading model info',
            'size': '0 MB',
            'lastModified': 'Unknown'
        }

@admin_bp.route('/admin/models/debug', methods=['GET'])
@admin_required
@login_required
def debug_models_directory():
    """Debug endpoint to check what's in the models directory"""
    try:
        models_dir = os.path.join(current_app.root_path, '..', 'models')
        
        debug_info = {
            'models_dir_path': models_dir,
            'models_dir_exists': os.path.exists(models_dir),
            'files_found': [],
            'model_extensions': ['.h5', '.pkl', '.pt', '.pth', '.onnx']
        }
        
        if os.path.exists(models_dir):
            all_files = os.listdir(models_dir)
            debug_info['all_files'] = all_files
            
            # Categorize files
            for file in all_files:
                file_path = os.path.join(models_dir, file)
                if os.path.isfile(file_path):
                    file_size = os.path.getsize(file_path)
                    last_modified = datetime.fromtimestamp(os.path.getmtime(file_path))
                    
                    file_info = {
                        'name': file,
                        'size_mb': f"{file_size / (1024*1024):.2f}",
                        'last_modified': last_modified.strftime("%Y-%m-%d %H:%M:%S"),
                        'extension': file.lower()[file.rfind('.'):] if '.' in file else 'no_extension',
                        'is_model_file': any(file.lower().endswith(ext) for ext in debug_info['model_extensions']),
                        'could_be_autocrop': any(pattern in file.lower() for pattern in [
                            'autocrop', 'auto_crop', 'auto-crop', 'crop', 'object_detection', 
                            'detection', 'yolo', 'ssd', 'rcnn', 'bbox', 'od'
                        ]) or file.lower().endswith(('.pt', '.pth')),
                        'could_be_unet': any(pattern in file.lower() for pattern in [
                            'unet', 'u_net', 'u-net', 'segmentation', 'seg', 'coral_unet', 'coral-unet'
                        ])
                    }
                    
                    debug_info['files_found'].append(file_info)
        
        return jsonify(debug_info), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/models/upload', methods=['POST'])
@admin_required
@login_required
def upload_single_model():
    """Upload a single model file"""
    try:
        if 'model' not in request.files:
            return jsonify({"error": "No model file provided"}), 400
            
        file = request.files['model']
        model_type = request.form.get('model_type')
        
        if not file or file.filename == '':
            return jsonify({"error": "No file selected"}), 400
            
        if model_type not in ['autocrop', 'unet']:
            return jsonify({"error": "Invalid model type"}), 400
        
        # Validate file extension
        allowed_extensions = ['.h5', '.pkl', '.pt', '.pth', '.onnx']
        filename = secure_filename(file.filename)
        file_ext = filename.lower()[filename.rfind('.'):]
        
        if file_ext not in allowed_extensions:
            return jsonify({"error": "Invalid file type. Allowed: .h5, .pkl, .pt, .pth, .onnx"}), 400
        
        # Create models directory
        models_dir = os.path.join(current_app.root_path, '..', 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        if model_type == 'autocrop':
            new_filename = f"autocrop_model_{timestamp}{file_ext}"
        else:
            new_filename = f"unet_segmentation_model_{timestamp}{file_ext}"
        
        # Save file
        file_path = os.path.join(models_dir, new_filename)
        file.save(file_path)
        
        # Remove old model files of the same type
        cleanup_old_models(models_dir, model_type, new_filename)
        
        # Log activity
        log_activity(
            session.get('user_id'),
            'model_upload',
            f"Uploaded {model_type} model: {new_filename}"
        )
        
        return jsonify({
            "message": f"Model uploaded successfully",
            "filename": new_filename
        }), 200
        
    except Exception as e:
        print(f"Error uploading model: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/models/upload-both', methods=['POST'])
@admin_required
@login_required
def upload_both_models():
    """Upload both autocrop and unet models simultaneously"""
    try:
        if 'autocrop_model' not in request.files or 'unet_model' not in request.files:
            return jsonify({"error": "Both model files are required"}), 400
            
        autocrop_file = request.files['autocrop_model']
        unet_file = request.files['unet_model']
        
        if not autocrop_file or autocrop_file.filename == '' or not unet_file or unet_file.filename == '':
            return jsonify({"error": "Both files must be selected"}), 400
        
        # Validate file extensions
        allowed_extensions = ['.h5', '.pkl', '.pt', '.pth', '.onnx']
        
        for file, file_type in [(autocrop_file, 'autocrop'), (unet_file, 'unet')]:
            filename = secure_filename(file.filename)
            file_ext = filename.lower()[filename.rfind('.'):]
            
            if file_ext not in allowed_extensions:
                return jsonify({"error": f"Invalid {file_type} file type. Allowed: .h5, .pkl, .pt, .pth, .onnx"}), 400
        
        # Create models directory
        models_dir = os.path.join(current_app.root_path, '..', 'models')
        os.makedirs(models_dir, exist_ok=True)
        
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        uploaded_files = []
        
        # Upload autocrop model
        autocrop_filename = secure_filename(autocrop_file.filename)
        autocrop_ext = autocrop_filename.lower()[autocrop_filename.rfind('.'):]
        autocrop_new_name = f"autocrop_model_{timestamp}{autocrop_ext}"
        autocrop_path = os.path.join(models_dir, autocrop_new_name)
        autocrop_file.save(autocrop_path)
        uploaded_files.append(('autocrop', autocrop_new_name))
        
        # Upload unet model
        unet_filename = secure_filename(unet_file.filename)
        unet_ext = unet_filename.lower()[unet_filename.rfind('.'):]
        unet_new_name = f"unet_segmentation_model_{timestamp}{unet_ext}"
        unet_path = os.path.join(models_dir, unet_new_name)
        unet_file.save(unet_path)
        uploaded_files.append(('unet', unet_new_name))
        
        # Cleanup old models
        cleanup_old_models(models_dir, 'autocrop', autocrop_new_name)
        cleanup_old_models(models_dir, 'unet', unet_new_name)
        
        # Log activity
        log_activity(
            session.get('user_id'),
            'model_upload',
            f"Uploaded both models: {autocrop_new_name}, {unet_new_name}"
        )
        
        return jsonify({
            "message": "Both models uploaded successfully",
            "files": uploaded_files
        }), 200
        
    except Exception as e:
        print(f"Error uploading both models: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/models/<model_type>', methods=['DELETE'])
@admin_required
@login_required
def delete_model(model_type):
    """Delete a model file"""
    try:
        if model_type not in ['autocrop', 'unet']:
            return jsonify({"error": "Invalid model type"}), 400
        
        models_dir = os.path.join(current_app.root_path, '..', 'models')
        
        if not os.path.exists(models_dir):
            return jsonify({"error": "Models directory not found"}), 404
        
        # Find and delete model files
        deleted_files = []
        pattern = 'autocrop' if model_type == 'autocrop' else 'unet'
        
        for file in os.listdir(models_dir):
            if pattern.lower() in file.lower() and any(file.lower().endswith(ext) for ext in ['.h5', '.pkl', '.pt', '.pth', '.onnx']):
                file_path = os.path.join(models_dir, file)
                os.remove(file_path)
                deleted_files.append(file)
        
        if not deleted_files:
            return jsonify({"error": f"No {model_type} model found to delete"}), 404
        
        # Log activity
        log_activity(
            session.get('user_id'),
            'model_delete',
            f"Deleted {model_type} model files: {', '.join(deleted_files)}"
        )
        
        return jsonify({
            "message": f"{model_type} model deleted successfully",
            "deleted_files": deleted_files
        }), 200
        
    except Exception as e:
        print(f"Error deleting model: {str(e)}")
        return jsonify({"error": str(e)}), 500

def cleanup_old_models(models_dir, model_type, keep_filename):
    """Remove old model files of the same type"""
    try:
        pattern = 'autocrop' if model_type == 'autocrop' else 'unet'
        
        for file in os.listdir(models_dir):
            if (file != keep_filename and 
                pattern.lower() in file.lower() and 
                any(file.lower().endswith(ext) for ext in ['.h5', '.pkl', '.pt', '.pth', '.onnx'])):
                old_file_path = os.path.join(models_dir, file)
                if os.path.exists(old_file_path):
                    os.remove(old_file_path)
                    print(f"Removed old {model_type} model: {file}")
                    
    except Exception as e:
        print(f"Error cleaning up old models: {str(e)}")

@admin_bp.route('/admin/system/settings', methods=['GET'])
@admin_required
@login_required
def get_system_settings():
    """Get current system settings"""
    try:
        # For now, return default settings
        # You can store these in database or config file
        default_settings = {
            'maxImageSize': '10',
            'allowedFormats': ['jpg', 'jpeg', 'png'],
            'autoBackup': True,
            'analysisTimeout': '300',
            'maxConcurrentAnalysis': '5'
        }
        
        return jsonify({"settings": default_settings}), 200
        
    except Exception as e:
        print(f"Error getting system settings: {str(e)}")
        return jsonify({"error": str(e)}), 500

@admin_bp.route('/admin/system/settings', methods=['PUT'])
@admin_required
@login_required
def update_system_settings():
    """Update system settings"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate settings
        if 'maxImageSize' in data:
            try:
                max_size = int(data['maxImageSize'])
                if max_size < 1 or max_size > 100:
                    return jsonify({"error": "Max image size must be between 1 and 100 MB"}), 400
            except ValueError:
                return jsonify({"error": "Invalid max image size"}), 400
        
        if 'analysisTimeout' in data:
            try:
                timeout = int(data['analysisTimeout'])
                if timeout < 60 or timeout > 3600:
                    return jsonify({"error": "Analysis timeout must be between 60 and 3600 seconds"}), 400
            except ValueError:
                return jsonify({"error": "Invalid analysis timeout"}), 400
        
        # Here we will save the settings to database or config file
        # For now, we'll just return success
        
        # Log activity
        log_activity(
            session.get('user_id'),
            'system_settings_update',
            f"Updated system settings"
        )
        
        return jsonify({"message": "System settings updated successfully"}), 200
        
    except Exception as e:
        print(f"Error updating system settings: {str(e)}")
        return jsonify({"error": str(e)}), 500

def log_activity(user_id, activity_type, description):
    try:
        # Use the new ActivityLogger
        ActivityLogger.log_activity(
            user_id=user_id,
            activity_type=activity_type,
            description=description,
            category='system_admin'  # Default category
        )
    except Exception as e:
        print(f"Error logging activity: {str(e)}")

@admin_bp.route('/admin/test', methods=['GET'])
def test_admin_route():
    """Simple test to verify admin routes are working"""
    return jsonify({
        "message": "Admin routes are working!",
        "timestamp": datetime.now().isoformat(),
        "session_user_id": session.get('user_id'),
        "is_authenticated": 'user_id' in session
    }), 200

@admin_bp.route('/admin/pending-image-uploads', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@login_required
def get_pending_image_uploads():
    """Get pending image uploads grouped by user"""
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-CSRF-Token')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    try:
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        with conn.cursor() as cur:
            cur.execute("""
                SELECT 
                    i.uploader_id,
                    u.username,
                    u.firstname, 
                    u.lastname,
                    u.roletype,
                    COUNT(i.id) as pending_count,
                    MAX(i.uploaded_at) as last_upload,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', i.id,
                            'filename', i.filename,
                            'uploaded_at', i.uploaded_at,
                            'processing_status', i.processing_status,
                            'analysis_confidence', i.analysis_confidence
                        ) ORDER BY i.uploaded_at DESC
                    ) as images
                FROM images i
                JOIN users u ON i.uploader_id = u.id
                WHERE i.upload_status = 'pending'
                GROUP BY i.uploader_id, u.username, u.firstname, u.lastname, u.roletype
                ORDER BY last_upload DESC
            """)
            
            results = cur.fetchall()
            
            pending_uploads = []
            for row in results:
                pending_uploads.append({
                    'uploader_id': row[0],
                    'username': row[1],
                    'firstname': row[2],
                    'lastname': row[3],
                    'roletype': row[4],
                    'pending_count': row[5],
                    'last_upload': row[6].isoformat() if row[6] else None,
                    'images': row[7] if row[7] else []
                })
            
            return jsonify({
                "success": True,
                "pending_uploads": pending_uploads
            })
            
    except Exception as e:
        print(f"Error fetching pending uploads: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/manage-user-validation', methods=['POST', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@admin_required
@login_required
def manage_user_validation():
    """Approve or reject pending users"""
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-CSRF-Token')
        response.headers.add('Access-Control-Allow-Methods', 'POST,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    try:
        data = request.get_json()
        user_ids = data.get('user_ids', [])
        action = data.get('action')  # 'approve' or 'reject'
        rejection_reason = data.get('reason')  # Optional rejection reason
        
        if not user_ids or action not in ['approve', 'reject']:
            return jsonify({"error": "Invalid request data"}), 400
            
        conn = get_db_connection()
        if not conn:
            return jsonify({"error": "Database connection failed"}), 500
            
        admin_id = session.get('user_id')
        
        with conn.cursor() as cur:
            # Check admin privileges
            cur.execute("SELECT roletype FROM users WHERE id = %s", (admin_id,))
            user_result = cur.fetchone()
            
            if not user_result or user_result[0].lower() != 'admin':
                return jsonify({"error": "Admin access required"}), 403
            
            if action == 'approve':
                # Get user details for email before update
                placeholders = ','.join(['%s'] * len(user_ids))
                cur.execute(f"""
                    SELECT id, firstname, lastname, username, email, roletype
                    FROM users 
                    WHERE id IN ({placeholders}) AND status = 'pending'
                """, user_ids)
                
                user_details = cur.fetchall()
                
                # Update user status to approved
                cur.execute(f"""
                    UPDATE users 
                    SET status = 'approved', updated_at = NOW()
                    WHERE id IN ({placeholders}) AND status = 'pending'
                """, user_ids)
                
                affected_rows = cur.rowcount
                conn.commit()
                
                # Send approval emails
                try:
                    from utils.email_service import email_service
                    
                    for user in user_details:
                        user_data = {
                            'firstname': user[1],
                            'lastname': user[2],
                            'username': user[3],
                            'email': user[4],
                            'roletype': user[5]
                        }
                        
                        email_sent = email_service.send_user_approval_notification(user_data)
                        
                        # Log email activity
                        log_system_action(
                            user_id=user[0],
                            action='bulk_approval_email_sent' if email_sent else 'bulk_approval_email_failed',
                            description=f"Bulk approval notification email {'sent' if email_sent else 'failed'}",
                            details={
                                'user_email': user[4],
                                'email_sent': email_sent,
                                'admin_id': admin_id
                            }
                        )
                        
                except Exception as email_error:
                    print(f"❌ Error sending bulk approval emails: {str(email_error)}")
                
                message = f"Successfully approved {affected_rows} user(s)"
                
            else:  # reject
                # Get user details before deletion for email
                placeholders = ','.join(['%s'] * len(user_ids))
                cur.execute(f"""
                    SELECT id, firstname, lastname, username, email, roletype
                    FROM users 
                    WHERE id IN ({placeholders}) AND status = 'pending'
                """, user_ids)
                
                user_details = cur.fetchall()
                
                # Send rejection emails BEFORE deletion
                try:
                    from utils.email_service import email_service
                    
                    for user in user_details:
                        user_data = {
                            'firstname': user[1],
                            'lastname': user[2],
                            'username': user[3],
                            'email': user[4],
                            'roletype': user[5]
                        }
                        
                        email_sent = email_service.send_user_rejection_notification(user_data, rejection_reason)
                        
                        if email_sent:
                            print(f"✅ Rejection email sent to {user[4]}")
                        else:
                            print(f"❌ Failed to send rejection email to {user[4]}")
                        
                except Exception as email_error:
                    print(f"❌ Error sending bulk rejection emails: {str(email_error)}")
                
                # Delete rejected users
                cur.execute(f"""
                    DELETE FROM users 
                    WHERE id IN ({placeholders}) AND status = 'pending'
                """, user_ids)
                
                affected_rows = cur.rowcount
                conn.commit()
                
                message = f"Successfully rejected {affected_rows} user(s)"
                
                # Log rejections
                for user in user_details:
                    log_user_management(
                        admin_id=admin_id,
                        action='bulk_rejected',
                        target_user=f"{user[1]} {user[2]} (@{user[3]})"
                    )
            
            return jsonify({
                "success": True,
                "message": message,
                "affected_count": affected_rows
            })
            
    except Exception as e:
        print(f"Error managing user validation: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/pending-users', methods=['GET', 'OPTIONS'])
@cross_origin(origins=['http://localhost:3000'], supports_credentials=True)
@admin_required
@login_required
def get_pending_users():
    """Get all pending user registrations"""
    if request.method == 'OPTIONS':
        response = jsonify()
        response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-CSRF-Token')
        response.headers.add('Access-Control-Allow-Methods', 'GET,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT id, username, firstname, lastname, roletype, profile_image, created_at, status 
                FROM users 
                WHERE status = 'pending'
                ORDER BY created_at DESC
            """)
            users = cur.fetchall()
            
            users_list = []
            for user in users:
                users_list.append({
                    'id': user[0],
                    'username': user[1],
                    'firstname': user[2],
                    'lastname': user[3],
                    'roletype': user[4],
                    'profile_image': user[5],
                    'created_at': user[6].isoformat() if user[6] else None,
                    'status': user[7]
                })
            
            return jsonify({
                "success": True,
                "pending_users": users_list
            })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()

@admin_bp.route('/admin/analytics/<tab_name>', methods=['GET'])
@admin_required
@login_required
def get_analytics_data(tab_name):
    time_range = request.args.get('timeRange', '30days')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        # Calculate date range
        if time_range == '7days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '7 days'"
        elif time_range == '30days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '30 days'"
        elif time_range == '90days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '90 days'"
        elif time_range == '365days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '365 days'"
        else:
            date_filter = ""
        
        if tab_name == 'overview':
            return get_overview_analytics(conn, date_filter)
        elif tab_name == 'user-activity':
            return get_user_activity_analytics(conn, date_filter)
        elif tab_name == 'performance':
            return get_performance_analytics(conn, date_filter)
        else:
            return jsonify({"error": "Invalid analytics tab"}), 400
            
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if conn:
            conn.close()


def get_overview_analytics(conn, date_filter):
    with conn.cursor() as cur:
        try:
            # Image Upload Trends
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    COUNT(*) as uploads,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as analysisCompleted
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 10
            """)
            
            image_upload_results = cur.fetchall()
            imageUploadTrend = []
            for row in image_upload_results:
                imageUploadTrend.append({
                    'date': row[0].strftime("%Y-%m-%d"),
                    'uploads': row[1],
                    'analysisCompleted': row[2]
                })
            
            # User Growth Trends
            cur.execute(f"""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as newRegistrations,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approvals,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejections
                FROM users
                {date_filter.replace('created_at', 'users.created_at') if date_filter else ''}
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 10
            """)
            
            user_growth_results = cur.fetchall()
            userGrowthTrend = []
            for row in user_growth_results:
                userGrowthTrend.append({
                    'date': row[0].strftime("%Y-%m-%d"),
                    'newRegistrations': row[1],
                    'approvals': row[2],
                    'rejections': row[3]
                })

            
            # Engagement metrics from activities table - FIXED COLUMN NAME
            cur.execute("""
                SELECT 
                    COUNT(DISTINCT user_id) as daily_active_users,
                    COUNT(*) as total_activities
                FROM activities
                WHERE created_at >= NOW() - INTERVAL '1 day'
            """)
            engagement_result = cur.fetchone()
            
            # Content distribution from segmentation results
            cur.execute("""
                SELECT 
                    COALESCE(cl.category, 'Unknown') as category,
                    COUNT(sr.id) as count
                FROM segmentation_results sr
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                GROUP BY cl.category
                ORDER BY count DESC
                LIMIT 5
            """)
            
            content_results = cur.fetchall()
            colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']
            contentDistribution = []
            
            if content_results and len(content_results) > 0:
                total_count = sum(row[1] for row in content_results)
                for i, row in enumerate(content_results):
                    if total_count > 0:
                        percentage = (row[1] / total_count) * 100
                        contentDistribution.append({
                            'name': (row[0] or 'Unknown').replace('_', ' ').title(),
                            'value': row[1],
                            'percentage': round(percentage, 1),
                            'color': colors[i % len(colors)]
                        })
            
            # If no segmentation data, use basic image/user distribution
            if not contentDistribution:
                cur.execute("SELECT COUNT(*) FROM images")
                image_count = cur.fetchone()[0] or 0
                
                cur.execute("SELECT COUNT(*) FROM users WHERE status = 'approved'")
                user_count = cur.fetchone()[0] or 0
                
                total = image_count + user_count
                if total > 0:
                    contentDistribution = [
                        {
                            'name': 'Images Analyzed',
                            'value': image_count,
                            'percentage': round((image_count / total) * 100, 1),
                            'color': colors[0]
                        },
                        {
                            'name': 'Active Users',
                            'value': user_count,
                            'percentage': round((user_count / total) * 100, 1),
                            'color': colors[1]
                        }
                    ]
            
            # Analysis Quality Trend
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    AVG(analysis_confidence) as avgConfidence,
                    COUNT(CASE WHEN analysis_confidence >= 90 THEN 1 END) as highQuality,
                    COUNT(CASE WHEN upload_status = 'pending' THEN 1 END) as needsReview
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                AND analysis_confidence IS NOT NULL
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 10
            """)
            
            quality_results = cur.fetchall()
            qualityTrend = []
            for row in quality_results:
                qualityTrend.append({
                    'date': row[0].strftime("%Y-%m-%d"),
                    'avgConfidence': round(row[1] or 0, 1),
                    'highQuality': row[2] or 0,
                    'needsReview': row[3] or 0
                })
            
            # User Activity Patterns (by hour) - FIXED COLUMN NAME
            cur.execute("""
                SELECT 
                    EXTRACT(HOUR FROM created_at) as hour,
                    COUNT(CASE WHEN activity_type LIKE '%upload%' THEN 1 END) as uploads,
                    COUNT(CASE WHEN activity_type LIKE '%login%' THEN 1 END) as logins
                FROM activities
                WHERE created_at >= NOW() - INTERVAL '7 days'
                GROUP BY EXTRACT(HOUR FROM created_at)
                ORDER BY hour
            """)
            
            activity_results = cur.fetchall()
            engagementPatterns = []
            for row in activity_results:
                engagementPatterns.append({
                    'hour': f"{int(row[0]):02d}",
                    'uploads': row[1] or 0,
                    'logins': row[2] or 0
                })
            
            # Processing Metrics
            cur.execute("""
                SELECT 
                    AVG(CASE WHEN processing_status = 'completed' 
                        THEN EXTRACT(EPOCH FROM (updated_at - uploaded_at)) END) as avgProcessingTime,
                    COUNT(*) as totalProcessed,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as successRate,
                    COUNT(CASE WHEN processing_status = 'error' THEN 1 END) * 100.0 / COUNT(*) as errorRate,
                    COUNT(CASE WHEN processing_status = 'pending' THEN 1 END) as queueLength
                FROM images
                WHERE uploaded_at >= NOW() - INTERVAL '30 days'
            """)
            
            processing_result = cur.fetchone()
            processingMetrics = {
                'avgProcessingTime': round(processing_result[0] or 0, 1),
                'totalProcessed': processing_result[1] or 0,
                'successRate': round(processing_result[2] or 0, 1),
                'errorRate': round(processing_result[3] or 0, 1),
                'queueLength': processing_result[4] or 0
            }
            
            return jsonify({
                'imageUploadTrend': imageUploadTrend,
                'userGrowthTrend': userGrowthTrend,
                'contentDistribution': contentDistribution,
                'qualityTrend': qualityTrend,
                'engagementPatterns': engagementPatterns,
                'processingMetrics': processingMetrics
            })
            
        except Exception as e:
            print(f"Error in overview analytics: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Return minimal fallback data with proper structure
            return jsonify({
                'imageUploadTrend': [],
                'userGrowthTrend': [],
                'engagement': {
                    'dailyActiveUsers': 0,
                    'totalActivities': 0,
                    'avgSessionTime': '0 min',
                    'retentionRate': 0,
                    'bounceRate': 0
                },
                'contentDistribution': [],
                'qualityTrend': [],
                'engagementPatterns': [],
                'processingMetrics': {
                    'avgProcessingTime': 0,
                    'totalProcessed': 0,
                    'successRate': 0,
                    'errorRate': 0,
                    'queueLength': 0
                }
            })
       
def get_user_activity_analytics(conn, date_filter):
    with conn.cursor() as cur:
        try:
            # 24-hour activity timeline - FIXED COLUMN NAME
            cur.execute("""
                SELECT 
                    EXTRACT(HOUR FROM created_at) as hour,
                    COUNT(DISTINCT user_id) as activeUsers,
                    COUNT(CASE WHEN activity_type LIKE '%upload%' THEN 1 END) as uploads,
                    COUNT(CASE WHEN activity_type LIKE '%login%' THEN 1 END) as logins
                FROM activities
                WHERE created_at >= NOW() - INTERVAL '24 hours'
                GROUP BY EXTRACT(HOUR FROM created_at)
                ORDER BY hour
            """)
            
            activity_results = cur.fetchall()
            activityTimeline = []
            for row in activity_results:
                activityTimeline.append({
                    'hour': f"{int(row[0]):02d}:00",
                    'activeUsers': row[1] or 0,
                    'uploads': row[2] or 0,
                    'logins': row[3] or 0
                })
            
            # Registration trends
            cur.execute(f"""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as newUsers,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approvedUsers,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pendingUsers,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejectedUsers
                FROM users
                {date_filter.replace('created_at', 'users.created_at') if date_filter else ''}
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 10
            """)
            
            reg_results = cur.fetchall()
            registrationTrends = []
            for row in reg_results:
                registrationTrends.append({
                    'date': row[0].strftime("%Y-%m-%d"),
                    'newUsers': row[1],
                    'approvedUsers': row[2],
                    'pendingUsers': row[3],
                    'rejectedUsers': row[4]
                })
            
            # Role distribution
            cur.execute("""
                SELECT 
                    roletype as name,
                    COUNT(*) as count
                FROM users
                WHERE status = 'approved'
                GROUP BY roletype
                ORDER BY count DESC
            """)
            
            role_results = cur.fetchall()
            colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']
            roleDistribution = []
            
            for i, row in enumerate(role_results):
                roleDistribution.append({
                    'name': row[0].title() + 's',
                    'count': row[1],
                    'color': colors[i % len(colors)],
                    'growth': '+12%'  # Could be calculated
                })
            
            # User retention - ADD MISSING LOGIC
            cur.execute("""
                SELECT 
                    DATE_TRUNC('week', created_at) as week,
                    COUNT(DISTINCT id) as new_users,
                    COUNT(DISTINCT CASE WHEN last_login > created_at + INTERVAL '1 week' THEN id END) as retained_users
                FROM users
                WHERE status = 'approved' 
                AND created_at >= NOW() - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', created_at)
                ORDER BY week DESC
                LIMIT 8
            """)
            
            retention_results = cur.fetchall()
            userRetention = []
            for row in retention_results:
                new_users = row[1] or 0
                retained_users = row[2] or 0
                retention_rate = (retained_users / new_users * 100) if new_users > 0 else 0
                
                userRetention.append({
                    'week': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'newUsers': new_users,
                    'retainedUsers': retained_users,
                    'retentionRate': round(retention_rate, 1)
                })
            
            # Top users by activity - FIXED COLUMN NAME
            cur.execute("""
                SELECT 
                    u.firstname || ' ' || u.lastname as name,
                    u.username,
                    u.roletype as role,
                    COUNT(CASE WHEN a.activity_type LIKE '%upload%' THEN 1 END) as uploads,
                    COUNT(CASE WHEN a.activity_type LIKE '%login%' THEN 1 END) as logins,
                    COUNT(a.id) as total_activities
                FROM users u
                LEFT JOIN activities a ON u.id = a.user_id
                WHERE u.status = 'approved'
                AND (a.created_at >= NOW() - INTERVAL '30 days' OR a.created_at IS NULL)
                GROUP BY u.id, u.firstname, u.lastname, u.username, u.roletype
                HAVING COUNT(a.id) > 0
                ORDER BY total_activities DESC, uploads DESC, logins DESC
                LIMIT 10
            """)

            top_users_results = cur.fetchall()
            topUsers = []
            for row in top_users_results:
                topUsers.append({
                    'name': row[0],
                    'username': row[1], 
                    'role': row[2].title(),
                    'uploads': row[1] or 0,
                    'logins': row[4] or 0,
                    'total_activities': row[5] or 0
                })
            
            return jsonify({
                'activityTimeline': activityTimeline,
                'registrationTrends': registrationTrends,
                'roleDistribution': roleDistribution,
                'userRetention': userRetention,
                'topUsers': topUsers
            })
            
        except Exception as e:
            print(f"Error in user activity analytics: {str(e)}")
            import traceback
            traceback.print_exc()
            
            # Return empty data structure instead of error
            return jsonify({
                'activityTimeline': [],
                'registrationTrends': [],
                'roleDistribution': [],
                'userRetention': [],
                'topUsers': []
            })


def get_performance_analytics(conn, date_filter):
    with conn.cursor() as cur:
        try:
            # Processing trends
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    AVG(CASE WHEN processing_status = 'completed' 
                        THEN EXTRACT(EPOCH FROM (updated_at - uploaded_at)) ELSE NULL END) as avgProcessingTime,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as successRate,
                    COUNT(*) as throughput
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 10
            """)
            
            processing_results = cur.fetchall()
            processingTrends = []
            for row in processing_results:
                processingTrends.append({
                    'date': row[0].strftime("%Y-%m-%d"),
                    'avgProcessingTime': round(row[1] or 0, 1),
                    'successRate': round(row[2] or 0, 1),
                    'throughput': row[3] or 0
                })
            

            return jsonify({
                'processingTrends': processingTrends,
            })
            
        except Exception as e:
            print(f"Error in performance analytics: {str(e)}")
            return jsonify({
                'processingTrends': [],
                'systemMetrics': {},
                'errorDistribution': [],
                'responseTimeDistribution': []
            })


@admin_bp.route('/admin/analytics/export-pdf', methods=['GET'])
@admin_required
@login_required
def export_analytics_pdf():
    """Export analytics data as PDF"""
    tab_name = request.args.get('tab', 'overview')
    time_range = request.args.get('timeRange', '30days')
    
    conn = get_db_connection()
    if conn is None:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        print(f"🔄 Starting PDF export: tab={tab_name}, range={time_range}")
        
        # Calculate date range
        if time_range == '7days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '7 days'"
            range_label = "Last 7 Days"
        elif time_range == '30days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '30 days'"
            range_label = "Last 30 Days"
        elif time_range == '90days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '90 days'"
            range_label = "Last 3 Months"
        elif time_range == '365days':
            date_filter = "WHERE created_at >= NOW() - INTERVAL '365 days'"
            range_label = "Last Year"
        else:
            date_filter = ""
            range_label = "All Time"
        
        # Get the export data based on tab
        if tab_name == 'overview':
            export_data = get_overview_export_data(conn, date_filter, time_range)
            tab_title = "Overview Analytics"
        elif tab_name == 'user-activity':
            export_data = get_user_activity_export_data(conn, date_filter, time_range)
            tab_title = "User Activity Analytics"
        elif tab_name == 'performance':
            export_data = get_performance_export_data(conn, date_filter, time_range)
            tab_title = "Performance Analytics"
        else:
            return jsonify({"error": "Invalid tab"}), 400
        
        print(f"✅ Export data collected: {len(export_data)} datasets")
        
        # Generate PDF
        pdf_buffer = generate_analytics_pdf(export_data, tab_title, range_label, tab_name)
        
        # Create response
        response = make_response(pdf_buffer.getvalue())
        response.headers['Content-Type'] = 'application/pdf'
        response.headers['Content-Disposition'] = f'attachment; filename="analytics_{tab_name}_{time_range}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.pdf"'
        
        print(f"✅ PDF export ready")
        return response
            
    except Exception as e:
        print(f"❌ PDF export error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"PDF export failed: {str(e)}"}), 500
    finally:
        if conn:
            conn.close()

def generate_analytics_pdf(export_data, tab_title, range_label, tab_name):
    """Generate PDF report from analytics data"""
    buffer = io.BytesIO()
    
    # Create PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Get styles
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=24,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#1f2937')
    )
    
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=16,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.HexColor('#374151')
    )
    
    subheading_style = ParagraphStyle(
        'CustomSubHeading',
        parent=styles['Heading3'],
        fontSize=14,
        spaceAfter=8,
        spaceBefore=12,
        textColor=colors.HexColor('#4b5563')
    )
    
    # Story elements
    story = []
    
    # Title page
    story.append(Paragraph("DeepCoral AI Analytics Report", title_style))
    story.append(Spacer(1, 20))
    
    # Report info
    info_data = [
        ['Report Type:', tab_title],
        ['Time Range:', range_label],
        ['Generated:', datetime.now().strftime('%B %d, %Y at %I:%M %p')],
        ['Total Datasets:', str(len(export_data))]
    ]
    
    info_table = Table(info_data, colWidths=[2*inch, 4*inch])
    info_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
    ]))
    
    story.append(info_table)
    story.append(Spacer(1, 30))
    
    # Generate charts and add content based on tab
    if tab_name == 'overview':
        story.extend(generate_overview_pdf_content(export_data, styles, heading_style, subheading_style))
    elif tab_name == 'user-activity':
        story.extend(generate_user_activity_pdf_content(export_data, styles, heading_style, subheading_style))
    elif tab_name == 'performance':
        story.extend(generate_performance_pdf_content(export_data, styles, heading_style, subheading_style))
    
    # Build PDF
    doc.build(story)
    buffer.seek(0)
    
    return buffer

def generate_overview_pdf_content(export_data, styles, heading_style, subheading_style):
    """Generate PDF content for overview analytics"""
    story = []
    
    story.append(Paragraph("📊 Platform Overview", heading_style))
    story.append(Paragraph("This section provides a comprehensive overview of platform metrics including image uploads, user growth, and content analysis.", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Image Upload Trends
    if export_data.get('Image_Upload_Trends'):
        story.append(Paragraph("📈 Image Upload Trends", subheading_style))
        
        data = export_data['Image_Upload_Trends']
        table_data = [['Date', 'Total Uploads', 'Analysis Completed', 'Avg Confidence']]
        
        for item in data[:10]:  # Limit to 10 rows
            table_data.append([
                item.get('Date', 'N/A'),
                str(item.get('Total_Uploads', 0)),
                str(item.get('Analysis_Completed', 0)),
                f"{item.get('Avg_Confidence', 0):.2f}%"
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[1.5*inch, 1.2*inch, 1.5*inch, 1.2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 15))
        
        # Generate chart for image uploads
        chart_image = generate_line_chart(
            data, 
            'Date', 
            ['Total_Uploads', 'Analysis_Completed'],
            'Image Upload Trends',
            ['Total Uploads', 'Analysis Completed']
        )
        if chart_image:
            story.append(chart_image)
            story.append(Spacer(1, 20))
    
    # User Growth Trends
    if export_data.get('User_Growth_Trends'):
        story.append(Paragraph("👥 User Growth Trends", subheading_style))
        
        data = export_data['User_Growth_Trends']
        table_data = [['Date', 'New Registrations', 'Approvals', 'Rejections', 'Pending']]
        
        for item in data[:10]:
            table_data.append([
                item.get('Date', 'N/A'),
                str(item.get('New_Registrations', 0)),
                str(item.get('Approvals', 0)),
                str(item.get('Rejections', 0)),
                str(item.get('Pending', 0))
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[1.2*inch, 1.2*inch, 1*inch, 1*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 15))
    
    # Content Distribution
    if export_data.get('Content_Distribution'):
        story.append(Paragraph("🪸 Content Analysis Distribution", subheading_style))
        
        data = export_data['Content_Distribution']
        table_data = [['Category', 'Count', 'Percentage']]
        
        for item in data:
            table_data.append([
                item.get('Category', 'Unknown'),
                str(item.get('Count', 0)),
                f"{item.get('Percentage', 0):.1f}%"
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[2*inch, 1.5*inch, 1.5*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 20))
    
    return story

def generate_user_activity_pdf_content(export_data, styles, heading_style, subheading_style):
    """Generate PDF content for user activity analytics"""
    story = []
    
    story.append(Paragraph("👥 User Activity Analysis", heading_style))
    story.append(Paragraph("Detailed analysis of user behavior, registrations, and platform engagement patterns.", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Activity Timeline
    if export_data.get('Activity_Timeline_24h'):
        story.append(Paragraph("⏰ 24-Hour Activity Timeline", subheading_style))
        
        data = export_data['Activity_Timeline_24h']
        table_data = [['Hour', 'Active Users', 'Uploads', 'Logins']]
        
        for item in data:
            table_data.append([
                item.get('Hour', 'N/A'),
                str(item.get('Active_Users', 0)),
                str(item.get('Uploads', 0)),
                str(item.get('Logins', 0))
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[1.2*inch, 1.2*inch, 1.2*inch, 1.2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 10),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 15))
    
    # Top Users
    if export_data.get('Top_Users_by_Activity'):
        story.append(Paragraph("🏆 Top Contributors", subheading_style))
        
        data = export_data['Top_Users_by_Activity']
        table_data = [['Name', 'Username', 'Role', 'Uploads', 'Logins', 'Total Activities']]
        
        for item in data:
            table_data.append([
                item.get('Name', 'Unknown'),
                item.get('Username', 'N/A'),
                item.get('Role', 'Unknown'),
                str(item.get('Uploads', 0)),
                str(item.get('Logins', 0)),
                str(item.get('Total_Activities', 0))
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[1.5*inch, 1*inch, 0.8*inch, 0.8*inch, 0.8*inch, 1*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 20))
    
    return story

def generate_performance_pdf_content(export_data, styles, heading_style, subheading_style):
    """Generate PDF content for performance analytics"""
    story = []
    
    story.append(Paragraph("⚡ Performance Analytics", heading_style))
    story.append(Paragraph("System performance metrics including processing times, success rates, and error analysis.", styles['Normal']))
    story.append(Spacer(1, 20))
    
    # Processing Trends
    if export_data.get('Processing_Trends'):
        story.append(Paragraph("📈 Processing Performance Trends", subheading_style))
        
        data = export_data['Processing_Trends']
        table_data = [['Date', 'Total Images', 'Completed', 'Errors', 'Avg Time (s)', 'Success Rate (%)']]
        
        for item in data[:10]:
            table_data.append([
                item.get('Date', 'N/A'),
                str(item.get('Total_Images', 0)),
                str(item.get('Completed', 0)),
                str(item.get('Errors', 0)),
                f"{item.get('Avg_Processing_Time_seconds', 0):.1f}",
                f"{item.get('Success_Rate_percent', 0):.1f}%"
            ])
        
        if len(table_data) > 1:
            table = Table(table_data, colWidths=[1*inch, 1*inch, 1*inch, 0.8*inch, 1*inch, 1.2*inch])
            table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#f3f4f6')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#1f2937')),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 9),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
                ('BACKGROUND', (0, 1), (-1, -1), colors.white),
                ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#e5e7eb')),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 8),
            ]))
            
            story.append(table)
            story.append(Spacer(1, 20))
    
    return story

def generate_line_chart(data, x_field, y_fields, title, labels):
    """Generate a line chart for the PDF"""
    try:
        if not data or len(data) < 2:
            return None
        
        # Create temporary file for the chart
        temp_file = tempfile.NamedTemporaryFile(suffix='.png', delete=False)
        
        # Prepare data
        x_values = [item.get(x_field, '') for item in data]
        
        # Create the plot
        plt.figure(figsize=(8, 5))
        
        colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']
        
        for i, y_field in enumerate(y_fields):
            y_values = [item.get(y_field, 0) for item in data]
            plt.plot(x_values, y_values, marker='o', linewidth=2, 
                    color=colors[i % len(colors)], label=labels[i] if i < len(labels) else y_field)
        
        plt.title(title, fontsize=14, fontweight='bold', pad=20)
        plt.xlabel(x_field, fontsize=12)
        plt.ylabel('Count', fontsize=12)
        plt.legend()
        plt.grid(True, alpha=0.3)
        plt.xticks(rotation=45)
        plt.tight_layout()
        
        # Save the chart
        plt.savefig(temp_file.name, dpi=150, bbox_inches='tight')
        plt.close()
        
        # Create ReportLab Image
        chart_image = ReportLabImage(temp_file.name, width=6*inch, height=3.75*inch)
        
        # Clean up
        os.unlink(temp_file.name)
        
        return chart_image
        
    except Exception as e:
        print(f"Error generating chart: {str(e)}")
        return None


def get_overview_export_data(conn, date_filter, time_range):
    """Get overview analytics data for export"""
    export_data = {}
    
    with conn.cursor() as cur:
        try:
            # Image Upload Trends
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    COUNT(*) as total_uploads,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as analysis_completed,
                    AVG(analysis_confidence) as avg_confidence
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            results = cur.fetchall()
            export_data['Image_Upload_Trends'] = []
            for row in results:
                export_data['Image_Upload_Trends'].append({
                    'Date': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'Total_Uploads': row[1] or 0,
                    'Analysis_Completed': row[2] or 0,
                    'Avg_Confidence': float(row[3]) if row[3] else 0
                })
            
            # User Growth Trends
            cur.execute(f"""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as new_registrations,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approvals,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejections,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending
                FROM users
                {date_filter.replace('created_at', 'users.created_at') if date_filter else ''}
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            results = cur.fetchall()
            export_data['User_Growth_Trends'] = []
            for row in results:
                export_data['User_Growth_Trends'].append({
                    'Date': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'New_Registrations': row[1] or 0,
                    'Approvals': row[2] or 0,
                    'Rejections': row[3] or 0,
                    'Pending': row[4] or 0
                })
            
            # Content Distribution
            cur.execute("""
                SELECT 
                    COALESCE(cl.category, 'Unknown') as category,
                    COUNT(sr.id) as count
                FROM segmentation_results sr
                LEFT JOIN coral_lifeforms cl ON sr.class_id = cl.id
                GROUP BY cl.category
                ORDER BY count DESC
                LIMIT 10
            """)
            
            results = cur.fetchall()
            export_data['Content_Distribution'] = []
            total_count = sum(row[1] for row in results) if results else 0
            
            for row in results:
                percentage = (row[1] / total_count * 100) if total_count > 0 else 0
                export_data['Content_Distribution'].append({
                    'Category': (row[0] or 'Unknown').replace('_', ' ').title(),
                    'Count': row[1] or 0,
                    'Percentage': round(percentage, 1)
                })
            
            # Quality Trends
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    AVG(analysis_confidence) as avg_confidence,
                    COUNT(CASE WHEN analysis_confidence >= 90 THEN 1 END) as high_quality,
                    COUNT(CASE WHEN upload_status = 'pending' THEN 1 END) as needs_review
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                AND analysis_confidence IS NOT NULL
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            results = cur.fetchall()
            export_data['Quality_Trends'] = []
            for row in results:
                export_data['Quality_Trends'].append({
                    'Date': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'Avg_Confidence': round(float(row[1]), 1) if row[1] else 0,
                    'High_Quality': row[2] or 0,
                    'Needs_Review': row[3] or 0
                })
            
        except Exception as e:
            print(f"Error getting overview export data: {str(e)}")
    
    return export_data

def get_user_activity_export_data(conn, date_filter, time_range):
    """Get user activity analytics data for export"""
    export_data = {}
    
    with conn.cursor() as cur:
        try:
            # 24-hour activity timeline
            cur.execute("""
                SELECT 
                    EXTRACT(HOUR FROM created_at) as hour,
                    COUNT(DISTINCT user_id) as active_users,
                    COUNT(CASE WHEN activity_type LIKE '%upload%' THEN 1 END) as uploads,
                    COUNT(CASE WHEN activity_type LIKE '%login%' THEN 1 END) as logins
                FROM activities
                WHERE created_at >= NOW() - INTERVAL '24 hours'
                GROUP BY EXTRACT(HOUR FROM created_at)
                ORDER BY hour
            """)
            
            results = cur.fetchall()
            export_data['Activity_Timeline_24h'] = []
            for row in results:
                export_data['Activity_Timeline_24h'].append({
                    'Hour': f"{int(row[0]):02d}:00" if row[0] is not None else '00:00',
                    'Active_Users': row[1] or 0,
                    'Uploads': row[2] or 0,
                    'Logins': row[3] or 0
                })
            
            # Registration trends
            cur.execute(f"""
                SELECT 
                    DATE(created_at) as date,
                    COUNT(*) as new_users,
                    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_users,
                    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_users,
                    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_users
                FROM users
                {date_filter.replace('created_at', 'users.created_at') if date_filter else ''}
                GROUP BY DATE(created_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            results = cur.fetchall()
            export_data['Registration_Trends'] = []
            for row in results:
                export_data['Registration_Trends'].append({
                    'Date': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'New_Users': row[1] or 0,
                    'Approved_Users': row[2] or 0,
                    'Pending_Users': row[3] or 0,
                    'Rejected_Users': row[4] or 0
                })
            
            # Role distribution
            cur.execute("""
                SELECT 
                    roletype as name,
                    COUNT(*) as count
                FROM users
                WHERE status = 'approved'
                GROUP BY roletype
                ORDER BY count DESC
            """)
            
            results = cur.fetchall()
            export_data['Role_Distribution'] = []
            for row in results:
                export_data['Role_Distribution'].append({
                    'Role': row[0].title() if row[0] else 'Unknown',
                    'Count': row[1] or 0
                })
            
            # Top users by activity
            cur.execute("""
                SELECT 
                    u.firstname || ' ' || u.lastname as name,
                    u.username,
                    u.roletype as role,
                    COUNT(CASE WHEN a.activity_type LIKE '%upload%' THEN 1 END) as uploads,
                    COUNT(CASE WHEN a.activity_type LIKE '%login%' THEN 1 END) as logins,
                    COUNT(a.id) as total_activities
                FROM users u
                LEFT JOIN activities a ON u.id = a.user_id
                WHERE u.status = 'approved'
                AND (a.created_at >= NOW() - INTERVAL '30 days' OR a.created_at IS NULL)
                GROUP BY u.id, u.firstname, u.lastname, u.username, u.roletype
                HAVING COUNT(a.id) > 0
                ORDER BY uploads DESC, total_activities DESC
                LIMIT 10
            """)
            
            results = cur.fetchall()
            export_data['Top_Users_by_Activity'] = []
            for row in results:
                export_data['Top_Users_by_Activity'].append({
                    'Name': row[0] or 'Unknown User',
                    'Username': row[1] or 'N/A',
                    'Role': row[2].title() if row[2] else 'Unknown',
                    'Uploads': row[3] or 0,
                    'Logins': row[4] or 0,
                    'Total_Activities': row[5] or 0
                })
            
            # User retention
            cur.execute("""
                SELECT 
                    DATE_TRUNC('week', created_at) as week,
                    COUNT(DISTINCT id) as new_users,
                    COUNT(DISTINCT CASE WHEN last_login > created_at + INTERVAL '1 week' THEN id END) as retained_users
                FROM users
                WHERE status = 'approved' 
                AND created_at >= NOW() - INTERVAL '8 weeks'
                GROUP BY DATE_TRUNC('week', created_at)
                ORDER BY week DESC
                LIMIT 8
            """)
            
            results = cur.fetchall()
            export_data['User_Retention'] = []
            for row in results:
                new_users = row[1] or 0
                retained_users = row[2] or 0
                retention_rate = (retained_users / new_users * 100) if new_users > 0 else 0
                
                export_data['User_Retention'].append({
                    'Week': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'New_Users': new_users,
                    'Retained_Users': retained_users,
                    'Retention_Rate': round(retention_rate, 1)
                })
            
        except Exception as e:
            print(f"Error getting user activity export data: {str(e)}")
    
    return export_data

def get_performance_export_data(conn, date_filter, time_range):
    """Get performance analytics data for export"""
    export_data = {}
    
    with conn.cursor() as cur:
        try:
            # Processing trends
            cur.execute(f"""
                SELECT 
                    DATE(uploaded_at) as date,
                    COUNT(*) as total_images,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) as completed,
                    COUNT(CASE WHEN processing_status = 'error' THEN 1 END) as errors,
                    AVG(CASE WHEN processing_status = 'completed' 
                        THEN EXTRACT(EPOCH FROM (updated_at - uploaded_at)) ELSE NULL END) as avg_processing_time_seconds,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as success_rate_percent
                FROM images
                {date_filter.replace('created_at', 'uploaded_at') if date_filter else ''}
                GROUP BY DATE(uploaded_at)
                ORDER BY date DESC
                LIMIT 30
            """)
            
            results = cur.fetchall()
            export_data['Processing_Trends'] = []
            for row in results:
                export_data['Processing_Trends'].append({
                    'Date': row[0].strftime("%Y-%m-%d") if row[0] else '',
                    'Total_Images': row[1] or 0,
                    'Completed': row[2] or 0,
                    'Errors': row[3] or 0,
                    'Avg_Processing_Time_seconds': round(float(row[4]), 1) if row[4] else 0,
                    'Success_Rate_percent': round(float(row[5]), 1) if row[5] else 0
                })
            
            # System performance metrics
            cur.execute("""
                SELECT 
                    AVG(CASE WHEN processing_status = 'completed' 
                        THEN EXTRACT(EPOCH FROM (updated_at - uploaded_at)) END) as avg_processing_time,
                    COUNT(*) as total_processed,
                    COUNT(CASE WHEN processing_status = 'completed' THEN 1 END) * 100.0 / COUNT(*) as success_rate,
                    COUNT(CASE WHEN processing_status = 'error' THEN 1 END) * 100.0 / COUNT(*) as error_rate,
                    COUNT(CASE WHEN processing_status = 'pending' THEN 1 END) as queue_length
                FROM images
                WHERE uploaded_at >= NOW() - INTERVAL '30 days'
            """)
            
            result = cur.fetchone()
            export_data['System_Metrics'] = [{
                'Metric': 'Average Processing Time (seconds)',
                'Value': round(float(result[0]), 1) if result[0] else 0
            }, {
                'Metric': 'Total Images Processed',
                'Value': result[1] or 0
            }, {
                'Metric': 'Success Rate (%)',
                'Value': round(float(result[2]), 1) if result[2] else 0
            }, {
                'Metric': 'Error Rate (%)',
                'Value': round(float(result[3]), 1) if result[3] else 0
            }, {
                'Metric': 'Current Queue Length',
                'Value': result[4] or 0
            }]
            
            # Error distribution
            cur.execute(f"""
                SELECT 
                    COALESCE(error_message, 'Unknown Error') as error_type,
                    COUNT(*) as count
                FROM images
                WHERE processing_status = 'error'
                {('AND ' + date_filter.replace('created_at', 'uploaded_at')) if date_filter else ''}
                GROUP BY error_message
                ORDER BY count DESC
                LIMIT 10
            """)
            
            results = cur.fetchall()
            export_data['Error_Distribution'] = []
            for row in results:
                export_data['Error_Distribution'].append({
                    'Error_Type': row[0] or 'Unknown Error',
                    'Count': row[1] or 0
                })
            
        except Exception as e:
            print(f"Error getting performance export data: {str(e)}")
    
    return export_data