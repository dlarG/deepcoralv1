import os
from dotenv import load_dotenv
import secrets

# Determine environment and load appropriate .env file
env = os.getenv('FLASK_ENV', 'development')
if env == 'production':
    load_dotenv('.env.production')
else:
    load_dotenv('.env.development')

class Config:
    # App configuration
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(32))
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = os.getenv('SESSION_COOKIE_SECURE', 'False').lower() == 'true'
    SESSION_COOKIE_SAMESITE = 'Lax'
    
    # Database configuration
    DB_HOST = os.getenv('DB_HOST') 
    DB_PORT = os.getenv('DB_PORT')     
    DB_USER = os.getenv('DB_USER')
    DB_PASSWORD = os.getenv('DB_PASSWORD')
    DB_NAME = os.getenv('DB_NAME') 
    
    # reCAPTCHA
    RECAPTCHA_SECRET = os.getenv('RECAPTCHA_SECRET')
    
    # CORS - Make sure this is a list
    cors_origins_str = os.getenv('CORS_ORIGINS', 'http://localhost:3000')
    CORS_ORIGINS = [origin.strip() for origin in cors_origins_str.split(',')]
    
    # Debug mode
    DEBUG = os.getenv('DEBUG', 'False').lower() == 'true'