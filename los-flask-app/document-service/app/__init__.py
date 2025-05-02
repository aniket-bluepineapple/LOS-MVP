from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# Initialize db
db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")  # Make sure you have the correct config

    # Initialize the db with the app
    db.init_app(app)

    # Register the document blueprint (for example)
    from app.routes.document_routes import document_bp
    app.register_blueprint(document_bp, url_prefix='/documents')

    return app
