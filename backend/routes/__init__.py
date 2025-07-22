from .auth_routes import auth_bp
from .coral_routes import coral_bp
from .admin_routes import admin_bp
from .profile_routes import profile_bp

def init_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(coral_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(profile_bp)