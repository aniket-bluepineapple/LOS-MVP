from flask import Blueprint

# Create a root blueprint
api_bp = Blueprint("api", __name__, url_prefix="/api")
