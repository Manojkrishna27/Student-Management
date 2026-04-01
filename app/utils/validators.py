import re
from email_validator import validate_email, EmailNotValidError

def validate_email_format(email):
    if not email:
        return False, "Email is required"
    try:
        validate_email(email, check_deliverability=False)
        return True, ""
    except EmailNotValidError:
        return False, "Invalid email format"

def validate_marks(marks):
    try:
        marks_float = float(marks)
        if not 0 <= marks_float <= 100:
            return False, "Marks must be between 0 and 100"
        return True, ""
    except (ValueError, TypeError):
        return False, "Marks must be a number"

def validate_required_fields(data, fields):
    for field in fields:
        if not data.get(field):
            return False, f"{field.capitalize()} is required"
    return True, ""

def validate_student_data(data):
    required = ['name', 'age', 'department', 'marks', 'email']
    is_valid, msg = validate_required_fields(data, required)
    if not is_valid:
        return False, msg
    
    is_valid_email, email_msg = validate_email_format(data['email'])
    if not is_valid_email:
        return False, email_msg
    
    is_valid_marks, marks_msg = validate_marks(data['marks'])
    if not is_valid_marks:
        return False, marks_msg
    
    if int(data['age']) <= 0:
        return False, "Age must be positive"
    
    return True, ""

