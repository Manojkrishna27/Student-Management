from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, create_access_token
from controllers.auth_controller import login_controller
from services.auth_service import AuthService
from db import db

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password required"
        }), 400
    
    resp, status = login_controller(email, password)
    if status == 200:
        # Create real JWT
        access_token = create_access_token(identity=email)
        resp['data']['access_token'] = access_token
    
    return jsonify(resp), status

@auth_bp.route('/setup-admin', methods=['POST'])
@jwt_required(optional=True)
def setup_admin():
    created = AuthService.create_admin_if_not_exists()
    if created:
        return jsonify({
            "success": True,
            "message": "Admin created: admin@example.com / password123"
        }), 201
    return jsonify({
        "success": True,
        "message": "Admin already exists"
    }), 200

