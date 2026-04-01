from flask_sqlalchemy import SQLAlchemy
from config import DevelopmentConfig

db = SQLAlchemy()

def init_db(app):
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    with app.app_context():
        db.create_all()

