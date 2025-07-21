"""
This module contains the database connection and table creation logic.
Create a PostgreSQL database on pgAdmin4 named 'deep_coral' before running this script.
"""



#First is to create the enum for role_type
"""
CREATE TYPE user_role AS ENUM ('admin', 'guest', 'biologist'); 
"""

# Then next is the users table creation
"""
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    middlename VARCHAR(100),
    lastname VARCHAR(100) NOT NULL,
    profile_picture TEXT,
    roletype user_role NOT NULL DEFAULT 'guest',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
	deleted_at TIMESTAMP
);
"""

import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from .env file

def get_db_connection():
    """
    Establishes a connection to the PostgreSQL database.
    Returns:
        conn: A connection object to the PostgreSQL database.
    """
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_TABLE"),
            user=os.getenv("DB_USER"),  
            password=os.getenv('DB_PASSWORD'), 
            host=os.getenv("DB_HOST"), 
            port=os.getenv("DB_PORT")  
        )
        return conn
    except Exception as e:
        print(f"Error connecting to the database: {e}")
        return None

