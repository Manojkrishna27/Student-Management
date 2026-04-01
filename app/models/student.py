from db import db
from datetime import datetime

class Student(db.Model):
    __tablename__ = 'students'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    department = db.Column(db.String(255))
    marks = db.Column(db.DECIMAL(5,2))
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, server_default=db.text('CURRENT_TIMESTAMP'))
    updated_at = db.Column(db.DateTime, server_default=db.text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'), onupdate=datetime.utcnow)

