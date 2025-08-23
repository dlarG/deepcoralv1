from .auth_routes import auth_bp
from .coral_routes import coral_bp
from .admin_routes import admin_bp
from .profile_routes import profile_bp
# from .upload_image import image_bp  # Comment out temporarily

def init_routes(app):
    # Register all blueprints
    app.register_blueprint(auth_bp)  # No prefix - routes like /login, /check-auth
    app.register_blueprint(admin_bp, url_prefix='/admin')
    app.register_blueprint(coral_bp, url_prefix='/coral')
    app.register_blueprint(profile_bp, url_prefix='/profile')
    # app.register_blueprint(image_bp, url_prefix='/image')