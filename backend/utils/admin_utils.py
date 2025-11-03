from db import get_db_connection

def get_admin_emails():
    """Get all admin email addresses for notifications"""
    conn = get_db_connection()
    if conn is None:
        return []
    
    try:
        with conn.cursor() as cur:
            cur.execute("""
                SELECT email FROM users 
                WHERE roletype = 'admin' 
                AND status = 'approved' 
                AND email IS NOT NULL 
                AND email != ''
            """)
            
            admin_emails = [row[0] for row in cur.fetchall()]
            return admin_emails
            
    except Exception as e:
        print(f"Error fetching admin emails: {str(e)}")
        return []
    finally:
        conn.close()