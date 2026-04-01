from werkzeug.security import generate_password_hash, check_password_hash
from models.admin import Admin
from db import db
from utils.validators import validate_email_format

class AuthService:
    @staticmethod
    def authenticate(email, password):
        admin = Admin.query.filter_by(email=email).first()
        if admin and check_password_hash(admin.password_hash, password):
            return admin
        return None

    @staticmethod
    def hash_password(password):
        return generate_password_hash(password, method='pbkdf2:sha256:600000')

    @staticmethod
    def create_admin_if_not_exists():
        admin_count = Admin.query.count()
        if admin_count == 0:
            from werkzeug.security import generate_password_hash
            hashed = generate_password_hash('password123', method='pbkdf2:sha256:600000')
            admin = Admin(email='admin@example.com', password_hash=hashed)
            db.session.add(admin)
            db.session.commit()
            return True
        return False

