import os
from dotenv import load_dotenv
import secrets

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', secrets.token_hex(32))
    
    # Database
    DB_HOST = os.environ.get('DB_HOST', 'localhost')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'deep_coral_ai')
    DB_USER = os.environ.get('DB_USER', 'postgres')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'postgres')
    DB_TABLE = os.environ.get('DB_TABLE', 'deep_coral_ai')
    
    # reCAPTCHA
    RECAPTCHA_SECRET = os.environ.get('RECAPTCHA_SECRET')
    
    # CORS
    CORS_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Session configuration for Docker
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_DOMAIN = None  # Important for Docker
    PERMANENT_SESSION_LIFETIME = 3600  # 1 hour