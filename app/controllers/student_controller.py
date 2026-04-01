from services.student_service import StudentService
import copy

def get_students(page=1, search=None, sort=None):
    try:
        per_page = 10
        result = StudentService.get_all(page, per_page, search, sort)
        # Fix JSON serialization - remove SQLAlchemy state
        clean_students = []
        for s in result['students']:
            clean_data = copy.deepcopy(s.__dict__)
            clean_data.pop('_sa_instance_state', None)
            clean_students.append(clean_data)
        result['students'] = clean_students
        return {
            "success": True,
            "message": "Students fetched successfully",
            "data": result
        }, 200
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }, 500

def get_student(student_id):
    student = StudentService.get_by_id(student_id)
    if not student:
        return {
            "success": False,
            "message": "Student not found"
        }, 404
    
    clean_data = copy.deepcopy(student.__dict__)
    clean_data.pop('_sa_instance_state', None)
    return {
        "success": True,
        "message": "Student fetched successfully",
        "data": clean_data
    }, 200

def create_student(data):
    success, result = StudentService.create(data)
    if not success:
        return {
            "success": False,
            "message": result
        }, 400
    
    clean_data = copy.deepcopy(result.__dict__)
    clean_data.pop('_sa_instance_state', None)
    return {
        "success": True,
        "message": "Student created successfully",
        "data": clean_data
    }, 201

def update_student(student_id, data):
    success, result = StudentService.update(student_id, data)
    if not success:
        return {
            "success": False,
            "message": result
        }, 400 if "not found" not in result.lower() else 404
    
    clean_data = copy.deepcopy(result.__dict__)
    clean_data.pop('_sa_instance_state', None)
    return {
        "success": True,
        "message": "Student updated successfully",
        "data": clean_data
    }, 200

def delete_student(student_id):
    success, result = StudentService.delete(student_id)
    if not success:
        return {
            "success": False,
            "message": result
        }, 404
    
    return {
        "success": True,
        "message": result
    }, 200

