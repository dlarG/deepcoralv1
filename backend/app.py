from flask import Flask, app, request, session, jsonify
from flask_cors import CORS
from config import Config
from routes import init_routes
import secrets

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Set debug mode from config
    app.debug = Config.DEBUG
    
    # Simple CORS configuration
    CORS(app,
         origins=['https://deepcoral.site', 'https://www.deepcoral.site'],
         supports_credentials=True,
         allow_headers=['Content-Type', 'Authorization', 'X-CSRF-Token', 'x-csrf-token'],
         expose_headers=['Set-Cookie'],
         methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
         max_age=3600)
    
    # Backup CORS handler in case Flask-CORS doesn't work
    @app.after_request
    def after_request_cors(response):
        origin = request.headers.get('Origin')
        if origin in ['https://deepcoral.site', 'https://www.deepcoral.site']:
            response.headers['Access-Control-Allow-Origin'] = origin
            response.headers['Access-Control-Allow-Credentials'] = 'true'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-CSRF-Token, x-csrf-token'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response.headers['Access-Control-Expose-Headers'] = 'Set-Cookie'
        return response
    
    # Initialize routes
    init_routes(app)

    
    
    @app.route('/profile_uploads/<path:filename>')
    def serve_profile_image(filename):
        from flask import send_from_directory
        import os
        profile_uploads_path = os.path.join(app.root_path, 'profile_uploads')
        # Ensure directory exists
        os.makedirs(profile_uploads_path, exist_ok=True)
        return send_from_directory(profile_uploads_path, filename)
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
                'approved.analyze_pending_approved_image',  
                'approved.batch_analyze_pending_approved',  
                'image.guest_upload_only',
                'philippine_locations.get_regions',
                'philippine_locations.get_provinces',
                'philippine_locations.get_municipalities',
                'philippine_locations.get_barangays',
                'philippine_locations.populate_sample_data',
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