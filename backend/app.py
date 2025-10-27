from flask import Flask, request, session, jsonify
from flask_cors import CORS
from config import Config
from routes import init_routes
import secrets

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Set debug mode from config
    app.debug = Config.DEBUG
    
    # Initialize CORS - ONLY ONE CONFIGURATION
    CORS(app, 
         supports_credentials=True, 
         origins=Config.CORS_ORIGINS,
         allow_headers=['Content-Type', 'X-CSRF-Token', 'Authorization'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
    
    # REMOVE the after_request function - it's causing duplicates
    
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
        if request.method == 'OPTIONS':
            return
            
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            if request.endpoint in [
                'image.detect_custom', 
                'image.detect', 
                'image.detect_and_segment',
                'image.batch_analyze',
                'gis.get_existing_locations',
                'gis.save_images_with_location',
                'gis.get_location_details',
                'gis.find_nearby_locations',
                'distribution.delete_image',
                'admin.get_pending_users', 
                'validation.manage_image_uploads',
                'validation.delete_pending_images',
                'admin.manage_user_validation',
                'approved.analyze_approved_image',   
                'approved.batch_analyze_approved',   
                'approved.delete_guest_images',      
                'image.guest_upload_only', 
            ]:
                return
            
            csrf_token = session.get('csrf_token')
            request_csrf = request.headers.get('X-CSRF-Token') or request.form.get('csrf_token')
            
            if not csrf_token or csrf_token != request_csrf:
                return jsonify({'error': 'CSRF token missing or invalid'}), 403
    
    return app

if __name__ == '__main__':
    app = create_app()
    # Use debug setting from config
    app.run(debug=Config.DEBUG, host='0.0.0.0', port=5000)