from los import create_app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # Import and register your blueprints here
    from los.routes import loan_application_bp  # Example
    app.register_blueprint(loan_application_bp)

    app.run(debug=True)
