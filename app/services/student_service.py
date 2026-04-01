from models.student import Student
from db import db
from utils.validators import validate_student_data
from sqlalchemy import or_, desc, asc, text
from sqlalchemy.orm import load_only

class StudentService:
    @staticmethod
    def get_all(page=1, per_page=10, search=None, sort=None):
        query = Student.query

        if search:
            query = query.filter(
                or_(
                    Student.name.like(f'%{search}%'),
                    Student.email.like(f'%{search}%'),
                    Student.department.like(f'%{search}%')
                )
            )

        # Parse sort: field:dir (safe)
        if sort:
            try:
                if ':' in sort:
                    field, direction = sort.split(':', 1)
                else:
                    field, direction = sort, 'asc'
                field_map = {
                    'name': Student.name,
                    'age': Student.age,
                    'department': Student.department,
                    'marks': Student.marks,
                    'email': Student.email
                }
                column = field_map.get(field)
                if column:
                    if direction.lower() == 'desc':
                        query = query.order_by(desc(column))
                    else:
                        query = query.order_by(asc(column))
                    # If no column or invalid, fallthrough to default
            except (ValueError, AttributeError):
                pass  # Invalid sort → default
        # Default sort
        query = query.order_by(asc(Student.name))

        # Pagination
        total = query.count()
        students = query.offset((page - 1) * per_page).limit(per_page).all()

        return {
            'students': students,
            'total': total,
            'page': page,
            'per_page': per_page,
            'total_pages': (total + per_page - 1) // per_page
        }

    @staticmethod
    def get_by_id(student_id):
        return Student.query.get(student_id)

    @staticmethod
    def create(data):
        is_valid, msg = validate_student_data(data)
        if not is_valid:
            return False, msg
        
        # Check duplicate email
        if Student.query.filter_by(email=data['email']).first():
            return False, "Email already exists"
        
        student = Student(**data)
        db.session.add(student)
        db.session.commit()
        return True, student

    @staticmethod
    def update(student_id, data):
        student = StudentService.get_by_id(student_id)
        if not student:
            return False, "Student not found"
        
        is_valid, msg = validate_student_data(data)
        if not is_valid:
            return False, msg
        
        # Check duplicate email on update (if changed)
        if 'email' in data and data['email'] != student.email:
            if Student.query.filter_by(email=data['email']).first():
                return False, "Email already exists"
        
        for key, value in data.items():
            setattr(student, key, value)
        
        db.session.commit()
        return True, student

    @staticmethod
    def delete(student_id):
        student = StudentService.get_by_id(student_id)
        if not student:
            return False, "Student not found"
        
        db.session.delete(student)
        db.session.commit()
        return True, "Student deleted successfully"

