from services.auth_service import AuthService
from functools import wraps

def login_controller(email, password):
    admin = AuthService.authenticate(email, password)
    if not admin:
        return {
            "success": False,
            "message": "Invalid credentials"
        }, 401
    
    # In real: generate JWT here in route
    return {
        "success": True,
        "message": "Login successful",
        "data": {
            "access_token": "mock-jwt-for-now-real-in-route"  # Replace with jwt.encode
        }
    }, 200

