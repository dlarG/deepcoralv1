#!/usr/bin/env python3
"""Migration script to add email column to users table"""

from db import get_db_connection

def add_email_column():
    conn = get_db_connection()
    if not conn:
        print("❌ Failed to connect to database")
        return False
    
    try:
        cur = conn.cursor()
        
        # Add email column if it doesn't exist
        print("Adding email column to users table...")
        cur.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS email VARCHAR(255) UNIQUE;
        """)
        
        conn.commit()
        print("✅ Email column added successfully!")
        
        cur.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error adding email column: {e}")
        conn.rollback()
        conn.close()
        return False

if __name__ == "__main__":
    add_email_column()
