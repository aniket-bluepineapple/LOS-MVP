from flask import Blueprint, request, jsonify
from datetime import datetime
import random
from los.models import db, LoanApplication, User, Product, LoanOffer

from flask_cors import CORS

loan_application_bp = Blueprint("loan_application", __name__, url_prefix="/api/loan_applications")

CORS(loan_application_bp)


def generate_unique_app_id():
    """Generate a six digit application ID that does not already exist."""
    while True:
        app_id = random.randint(100000, 999999)
        if not LoanApplication.query.get(app_id):
            return app_id

# Create a new loan application
@loan_application_bp.route("/", methods=["POST"])
def create_loan_application():
    data = request.json

    # Validate required fields
    required_fields = ["UserID", "ProductID", "LoanOfferID"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if User, Product, and Loan Offer exist
    user = User.query.get(data["UserID"])
    product = Product.query.get(data["ProductID"])
    loan_offer = LoanOffer.query.get(data["LoanOfferID"])

    if not user:
        return jsonify({"message": "User not found"}), 404
    if not product:
        return jsonify({"message": "Product not found"}), 404
    if not loan_offer:
        return jsonify({"message": "Loan Offer not found"}), 404

    new_loan_application = LoanApplication(
        ApplicationID=generate_unique_app_id(),
        UserID=data["UserID"],
        ProductID=data["ProductID"],
        LoanOfferID=data["LoanOfferID"],
        ApplicationStatus=data.get("ApplicationStatus", "Pending"),
        CreatedAt=datetime.utcnow(),
        UpdatedAt=datetime.utcnow(),
    )

    db.session.add(new_loan_application)
    db.session.commit()

    return jsonify({
        "message": "Loan Application submitted successfully!",
        "loan_application": {
            "ApplicationID": new_loan_application.ApplicationID,
            "UserID": new_loan_application.UserID,
            "ProductID": new_loan_application.ProductID,
            "LoanOfferID": new_loan_application.LoanOfferID,
            "ApplicationStatus": new_loan_application.ApplicationStatus,
            "CreatedAt": new_loan_application.CreatedAt,
            "UpdatedAt": new_loan_application.UpdatedAt
        }
    }), 201


# Read all loan applications
@loan_application_bp.route("/", methods=["GET"])
def get_loan_applications():
    loan_applications = LoanApplication.query.all()
    return jsonify([
        {
            "ApplicationID": la.ApplicationID,
            "UserID": la.UserID,
            "ProductID": la.ProductID,
            "LoanOfferID": la.LoanOfferID,
            "ApplicationStatus": la.ApplicationStatus,
            "CreatedAt": la.CreatedAt,
            "UpdatedAt": la.UpdatedAt
        }
        for la in loan_applications
    ])


# Read a single loan application
@loan_application_bp.route("/<int:application_id>", methods=["GET"])
def get_loan_application(application_id):
    loan_application = LoanApplication.query.get(application_id)
    if not loan_application:
        return jsonify({"message": "Loan Application not found"}), 404

    return jsonify({
        "ApplicationID": loan_application.ApplicationID,
        "UserID": loan_application.UserID,
        "ProductID": loan_application.ProductID,
        "LoanOfferID": loan_application.LoanOfferID,
        "ApplicationStatus": loan_application.ApplicationStatus,
        "CreatedAt": loan_application.CreatedAt,
        "UpdatedAt": loan_application.UpdatedAt
    })


# Update a loan application (e.g., change status)
@loan_application_bp.route("/<int:application_id>", methods=["PUT"])
def update_loan_application(application_id):
    loan_application = LoanApplication.query.get(application_id)
    if not loan_application:
        return jsonify({"message": "Loan Application not found"}), 404

    data = request.json
    loan_application.ApplicationStatus = data.get("ApplicationStatus", loan_application.ApplicationStatus)
    loan_application.UpdatedAt = datetime.utcnow()

    db.session.commit()

    return jsonify({"message": "Loan Application updated successfully!"})


# Delete a loan application
@loan_application_bp.route("/<int:application_id>", methods=["DELETE"])
def delete_loan_application(application_id):
    loan_application = LoanApplication.query.get(application_id)
    if not loan_application:
        return jsonify({"message": "Loan Application not found"}), 404

    db.session.delete(loan_application)
    db.session.commit()
    return jsonify({"message": "Loan Application deleted successfully!"})
