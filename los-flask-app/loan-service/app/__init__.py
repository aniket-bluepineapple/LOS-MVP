from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.models import db


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")
    db.init_app(app)

    from app.routes.loan_routes import loan_bp
    app.register_blueprint(loan_bp, url_prefix='/loans')

    return app
