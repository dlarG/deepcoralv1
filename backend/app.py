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
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            csrf_token = session.get('csrf_token')
            if not csrf_token or csrf_token != request.headers.get('X-CSRF-Token'):
                return jsonify({'error': 'Invalid CSRF token'}), 403
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)