from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from controllers.student_controller import (
    get_students, get_student, create_student, update_student, delete_student
)
from services.auth_service import AuthService

student_bp = Blueprint('students', __name__, url_prefix='/api/students')

@student_bp.route('', methods=['GET'])
@student_bp.route('/', methods=['GET'])
@jwt_required()
def list_students():
    page = request.args.get('page', 1, type=int)
    search = request.args.get('search')
    sort = request.args.get('sort')
    resp, status = get_students(page, search, sort)
    return jsonify(resp), status

@student_bp.route('/<int:student_id>', methods=['GET'])
@jwt_required()
def view_student(student_id):
    resp, status = get_student(student_id)
    return jsonify(resp), status

@student_bp.route('', methods=['POST'])
@student_bp.route('/', methods=['POST'])
@jwt_required()
def add_student():
    data = request.get_json()
    resp, status = create_student(data)
    return jsonify(resp), status

@student_bp.route('/<int:student_id>', methods=['PUT'])
@jwt_required()
def edit_student(student_id):
    data = request.get_json()
    resp, status = update_student(student_id, data)
    return jsonify(resp), status

@student_bp.route('/<int:student_id>', methods=['DELETE'])
@jwt_required()
def remove_student(student_id):
    resp, status = delete_student(student_id)
    return jsonify(resp), status

