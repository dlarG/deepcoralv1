from flask import Blueprint, jsonify, session
from utils.auth_utils import login_required
from db import get_db_connection
import os
from werkzeug.utils import secure_filename
from flask import current_app

coral_bp = Blueprint('coral', __name__)

@coral_bp.route('/coral_info', methods=['GET'])
@login_required
def get_coral_info():
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM coral_information")
        coral_info = cur.fetchall()
        coral_list = []

        for coral in coral_info:
            coral_list.append({
                'id': coral[0],
                'coral_type': coral[1],
                'coral_subtype': coral[2],
                'classification': coral[3],
                'scientific_name': coral[4],
                'common_name': coral[5],
                'identification': coral[6],
                'created_at': coral[7],
                'updated_at': coral[8],
                'image': coral[9] if len(coral) > 9 else None  # Include image
            })
        return jsonify({
            'status': 'success',
            'data': coral_list
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

