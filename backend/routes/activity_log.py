from db import get_db_connection
from flask import request, session
import json
from datetime import datetime

class ActivityLogger:
    @staticmethod
    def log_activity(user_id, activity_type, description, category=None, metadata=None):
        """
        Log user activity to the database
        """
        try:
            conn = get_db_connection()
            if not conn:
                return False
                
            # Get request information safely
            try:
                ip_address = request.environ.get('HTTP_X_FORWARDED_FOR', request.environ.get('REMOTE_ADDR'))
                user_agent = request.headers.get('User-Agent', '')
                endpoint = request.endpoint if request else None
            except RuntimeError:
                # Handle case when called outside request context
                ip_address = None
                user_agent = None
                endpoint = None
            
            # Prepare metadata
            if metadata is None:
                metadata = {}
            
            metadata.update({
                'timestamp': datetime.now().isoformat(),
                'session_id': session.get('csrf_token', '') if session else '',
                'endpoint': endpoint
            })
            
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO activities 
                    (user_id, activity_type, activity_description, category, metadata, ip_address, user_agent)
                    VALUES (%s, %s, %s, %s, %s, %s, %s)
                """, (user_id, activity_type, description, category, json.dumps(metadata), ip_address, user_agent))
                
                conn.commit()
                return True
                
        except Exception as e:
            print(f"Activity logging error: {e}")
            return False
        finally:
            if conn:
                conn.close()
    
    @staticmethod
    def log_user_action(action_type, description, **kwargs):
        """
        Convenient method for logging user actions
        """
        user_id = session.get('user_id') if session else None
        if not user_id:
            return False
            
        return ActivityLogger.log_activity(
            user_id=user_id,
            activity_type=action_type,
            description=description,
            **kwargs
        )

# Convenience functions for common activities
def log_login(user_id, username):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type='login',
        description=f"User {username} logged in",
        category='authentication'
    )

def log_logout(user_id, username):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type='logout',
        description=f"User {username} logged out",
        category='authentication'
    )

def log_user_registration(username):
    return ActivityLogger.log_activity(
        user_id=None,  # No user_id for registration
        activity_type='registration',
        description=f"New user {username} registered",
        category='authentication'
    )

def log_image_upload(user_id, filename, image_count=1):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type='image_upload',
        description=f"Uploaded {image_count} image(s): {filename}",
        category='image_analysis',
        metadata={'filename': filename, 'count': image_count}
    )

def log_coral_info_action(user_id, action, coral_name):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type=f'coral_info_{action}',
        description=f"{action.title()} coral information: {coral_name}",
        category='coral_data',
        metadata={'coral_name': coral_name, 'action': action}
    )

def log_user_management(admin_id, action, target_user, details=None):
    return ActivityLogger.log_activity(
        user_id=admin_id,
        activity_type=f'user_{action}',
        description=f"{action.title()} user: {target_user}",
        category='user_management',
        metadata={'target_user': target_user, 'details': details}
    )

def log_report_generation(user_id, report_type, filters=None):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type='report_generated',
        description=f"Generated {report_type} report",
        category='reports',
        metadata={'report_type': report_type, 'filters': filters}
    )

def log_system_action(user_id, action, description, details=None):
    return ActivityLogger.log_activity(
        user_id=user_id,
        activity_type=action,
        description=description,
        category='system_admin',
        metadata={'details': details}
    )