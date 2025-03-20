from flask import Flask
from los.config import Config
from los.models import db
from los.api.role_routes import role_bp
from los.api.user_routes import user_bp
from los.api.login_routes import login_bp
from los.api.address_routes import address_bp  # Import Address routes
from los.api.document_routes import document_bp  # Import Document routes
from los.api.product_routes import product_bp  # Import Product routes
from los.api.loan_offer_routes import loan_offer_bp
from los.api.loan_application_routes import loan_application_bp
from los.api.credit_score_routes import credit_score_bp
from los.api.system_notification_routes import system_notification_bp



def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    db.init_app(app)
    
    # Register Blueprints
    app.register_blueprint(role_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(address_bp)
    app.register_blueprint(document_bp)  # Register Document routes
    app.register_blueprint(product_bp)  # Register Product routes
    app.register_blueprint(loan_offer_bp)
    app.register_blueprint(loan_application_bp)
    app.register_blueprint(credit_score_bp)
    app.register_blueprint(system_notification_bp)

    return app
