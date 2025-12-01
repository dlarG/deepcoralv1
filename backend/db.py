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
        
        conn = psycopg2.connect(
            dbname=creds.get('dbname') or Config.DB_NAME,  
            user=creds.get('username') or Config.DB_USER,  
            password=creds.get('password') or Config.DB_PASSWORD, 
            host=creds.get('host') or Config.DB_HOST, 
            port=creds.get('port') or Config.DB_PORT,
            sslmode='require'  # Required for AWS RDS
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