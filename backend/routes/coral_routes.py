from flask import Blueprint, jsonify, session
from utils.auth_utils import login_required
from db import get_db_connection

coral_bp = Blueprint('coral', __name__)

@coral_bp.route('/coral_info', methods=['GET'])
@login_required
def get_coral_info():
    print("Current user in session:", session.get('user_id'))
    conn = get_db_connection()
    if conn is None:
        return jsonify({'error': 'Database connection failed'}), 500
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM coral_information")
        print("Fetched rows:", cur.rowcount)
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
            })
        return jsonify({
            'status': 'success',
            'data': coral_list  # Instead of coral_info
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()