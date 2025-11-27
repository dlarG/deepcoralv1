import psycopg2
import os
from config import Config

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL database.
    Returns:
        conn: A connection object to the PostgreSQL database.
    """
    try:
        conn = psycopg2.connect(
            dbname=Config.DB_NAME,  
            user=Config.DB_USER,  
            password=Config.DB_PASSWORD, 
            host=Config.DB_HOST, 
            port=Config.DB_PORT,
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