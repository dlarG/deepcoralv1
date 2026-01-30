import psycopg2
import os
from config import Config
from aws_secrets import get_db_credentials

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL database.
    Uses AWS Secrets Manager in production, falls back to env vars in development.
    Returns:
        conn: A connection object to the PostgreSQL database.
    """
    try:
        # Get credentials from AWS Secrets Manager or env vars
        creds = get_db_credentials()
        
        # Determine SSL mode based on host (localhost doesn't need SSL)
        # Fallback to Config if creds values are None
        db_host = creds.get('host') if creds.get('host') else Config.DB_HOST
        db_port = creds.get('port') if creds.get('port') else Config.DB_PORT
        db_name = creds.get('dbname') if creds.get('dbname') else Config.DB_NAME
        db_user = creds.get('username') if creds.get('username') else Config.DB_USER
        db_password = creds.get('password') if creds.get('password') else Config.DB_PASSWORD
        
        ssl_mode = 'disable' if db_host in ['localhost', '127.0.0.1', '::1'] else 'require'
        
        print(f"🔍 Connecting to database: host={db_host}, port={db_port}, dbname={db_name}, ssl={ssl_mode}")
        
        conn = psycopg2.connect(
            dbname=db_name,  
            user=db_user,  
            password=db_password, 
            host=db_host, 
            port=db_port,
            sslmode=ssl_mode
        )
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

if __name__ == "__main__":
    conn = get_db_connection()
    if conn:
        print("Database connection successful!")
        conn.close()
    else:
        print("Database connection failed.")