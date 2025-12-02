import boto3
import json
import os
from botocore.exceptions import ClientError


def get_secret(secret_name=None, region_name=None):
    """
    Retrieve database credentials from AWS Secrets Manager.
    
    Args:
        secret_name: Secret name or ARN (defaults to EC2 RDS: prod/mydb/postgres, Hostinger: rds!db-5261b6a8-95e9-42c9-b930-1fdc3d12f992)
        region_name: AWS region (defaults to ap-southeast-2 for EC2, us-east-1 for Hostinger)
    
    Returns:
        dict: Database credentials (host, port, username, password, dbname)
    """
    # Default to EC2 RDS secret if not specified
    if not secret_name:
        secret_name = os.getenv('DB_SECRET_NAME', 'prod/mydb/postgres')
    if not region_name:
        region_name = os.getenv('DB_SECRET_REGION', 'ap-southeast-2')

    # Create a Secrets Manager client
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=region_name
    )

    try:
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
    except ClientError as e:
        # For a list of exceptions thrown, see
        # https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        print(f"Error retrieving secret: {e}")
        raise e

    # Parse the secret string
    secret = get_secret_value_response['SecretString']
    secret_dict = json.loads(secret)
    
    return secret_dict


# Cache the secrets to avoid multiple AWS API calls
_cached_db_secret = None
_cached_sendgrid_secret = None

def get_db_credentials():
    """
    Get database credentials, using cache if available.
    Falls back to environment variables if Secrets Manager fails.
    
    Returns:
        dict: Database credentials
    """
    global _cached_db_secret
    
    # If running locally (development), use environment variables
    if os.getenv('FLASK_ENV') != 'production' or os.getenv('USE_ENV_DB', 'False').lower() == 'true':
        return {
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'username': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'dbname': os.getenv('DB_NAME')
        }
    
    # Use cached secret if available
    if _cached_db_secret:
        return _cached_db_secret
    
    # Try to get from Secrets Manager
    try:
        _cached_db_secret = get_secret()
        return _cached_db_secret
    except Exception as e:
        print(f"Failed to retrieve DB from Secrets Manager, falling back to env vars: {e}")
        # Fallback to environment variables
        return {
            'host': os.getenv('DB_HOST'),
            'port': os.getenv('DB_PORT'),
            'username': os.getenv('DB_USER'),
            'password': os.getenv('DB_PASSWORD'),
            'dbname': os.getenv('DB_NAME')
        }


def get_sendgrid_api_key():
    """
    Get SendGrid API key from AWS Secrets Manager.
    Falls back to environment variable if Secrets Manager fails.
    
    Returns:
        str: SendGrid API key
    """
    global _cached_sendgrid_secret
    
    # If running locally (development), use environment variable
    if os.getenv('FLASK_ENV') != 'production' or os.getenv('USE_ENV_SENDGRID', 'False').lower() == 'true':
        return os.getenv('SENDGRID_API_KEY')
    
    # Use cached secret if available
    if _cached_sendgrid_secret:
        return _cached_sendgrid_secret
    
    # Try to get from Secrets Manager
    secret_name = "prod/sendgrid/apikey"
    region_name = "ap-southeast-2"
    
    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name
        )
        
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        
        secret = get_secret_value_response['SecretString']
        secret_dict = json.loads(secret)
        
        # Cache and return the API key
        _cached_sendgrid_secret = secret_dict.get('api_key')
        return _cached_sendgrid_secret
        
    except Exception as e:
        print(f"Failed to retrieve SendGrid from Secrets Manager, falling back to env var: {e}")
        # Fallback to environment variable
        return os.getenv('SENDGRID_API_KEY')


# Cache for reCAPTCHA secret
_cached_recaptcha_secret = None

def get_recaptcha_secret():
    """
    Get reCAPTCHA secret key from AWS Secrets Manager.
    Falls back to environment variable if Secrets Manager fails.
    
    Returns:
        str: reCAPTCHA secret key
    """
    global _cached_recaptcha_secret
    
    # If running locally (development), use environment variable
    if os.getenv('FLASK_ENV') != 'production' or os.getenv('USE_ENV_RECAPTCHA', 'False').lower() == 'true':
        return os.getenv('RECAPTCHA_SECRET')
    
    # Use cached secret if available
    if _cached_recaptcha_secret:
        return _cached_recaptcha_secret
    
    # Try to get from Secrets Manager
    secret_name = "prod/recaptcha/secret"
    region_name = "ap-southeast-2"
    
    try:
        session = boto3.session.Session()
        client = session.client(
            service_name='secretsmanager',
            region_name=region_name
        )
        
        get_secret_value_response = client.get_secret_value(
            SecretId=secret_name
        )
        
        secret = get_secret_value_response['SecretString']
        secret_dict = json.loads(secret)
        
        # Cache and return the secret key
        _cached_recaptcha_secret = secret_dict.get('secret_key')
        return _cached_recaptcha_secret
        
    except Exception as e:
        print(f"Failed to retrieve reCAPTCHA from Secrets Manager, falling back to env var: {e}")
        # Fallback to environment variable
        return os.getenv('RECAPTCHA_SECRET')
