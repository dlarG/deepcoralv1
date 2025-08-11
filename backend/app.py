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
    
    # CSRF token endpoint
    @app.route('/csrf-token', methods=['GET'])
    def get_csrf_token():
        if 'csrf_token' not in session:
            session['csrf_token'] = secrets.token_hex(16)
        return jsonify({'csrf_token': session['csrf_token']})
    
    # CSRF protection middleware
    @app.before_request
    def csrf_protect():
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            # Skip CSRF for file upload endpoints (you can be more specific)
            if request.endpoint in ['image.detect_custom', 'image.detect']:
                return
            
            csrf_token = session.get('csrf_token')
            request_csrf = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
            
            if not csrf_token or csrf_token != request_csrf:
                return jsonify({'error': 'CSRF token missing or invalid'}), 403
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)