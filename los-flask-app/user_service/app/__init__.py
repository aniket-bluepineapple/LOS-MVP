from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import db

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    db.init_app(app)

    from app.routes.user_routes import user_bp
    from app.routes.login_routes import login_bp

    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(login_bp, url_prefix="/login")
    

    return app
