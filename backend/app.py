from flask import Flask, request, session, jsonify
from flask_cors import CORS
from config import Config
from routes import init_routes
import secrets

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize CORS
    CORS(app, supports_credentials=True, origins=Config.CORS_ORIGINS)
    
    # Initialize routes
    init_routes(app)
    
    # CSRF protection middleware
    @app.before_request
    def csrf_protect():
        # Skip CSRF for GET requests and token endpoint
        if request.method == 'GET':
            return
            
        # Skip CSRF for specific endpoints
        if request.endpoint in ['auth.get_csrf_token', 'image.detect_custom', 'image.detect']:
            return
        
        # Skip CSRF for OPTIONS requests
        if request.method == 'OPTIONS':
            return
            
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            csrf_token = session.get('csrf_token')
            request_csrf = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
            
            if not csrf_token or csrf_token != request_csrf:
                return jsonify({'error': 'CSRF token missing or invalid'}), 403
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000, debug=True)