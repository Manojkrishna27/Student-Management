from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig
from db import db, init_db
from routes.auth_routes import auth_bp
from routes.student_routes import student_bp
from services.auth_service import AuthService

def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    
    # CORS for React frontend
    CORS(app, resources={
        r"/api/*": {
            "origins": ["http://localhost:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # JWT
    jwt = JWTManager(app)
    
    # DB
    init_db(app)
    
    # Create default admin if not exists (run once)
    with app.app_context():
        AuthService.create_admin_if_not_exists()
    
    # Blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(student_bp)
    
    @app.route('/health')
    def health():
        return {"success": True, "message": "Backend healthy"}, 200
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)

