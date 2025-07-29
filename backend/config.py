import os
from dotenv import load_dotenv
import secrets
load_dotenv()

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
    DB_TABLE = os.getenv('DB_TABLE')
    
    # reCAPTCHA
    RECAPTCHA_SECRET = os.getenv('RECAPTCHA_SECRET')
    
    # CORS
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')