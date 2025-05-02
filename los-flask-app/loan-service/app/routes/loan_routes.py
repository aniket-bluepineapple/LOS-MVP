from flask import Blueprint, request, jsonify
from app.models import LoanOffer, LoanApplication, db

loan_bp = Blueprint("loan_bp", __name__)

# Route to create a loan offer
@loan_bp.route("/offer", methods=["POST"])
def create_loan_offer():
    data = request.json
    product_id = data.get("product_id")
    interest_rate = data.get("interest_rate")
    loan_tenure = data.get("loan_tenure")
    max_amount = data.get("max_amount")
    offer_status = data.get("offer_status", "Active")

    new_offer = LoanOffer(
        ProductID=product_id,
        InterestRate=interest_rate,
        LoanTenure=loan_tenure,
        MaxAmount=max_amount,
        OfferStatus=offer_status
    )
    
    db.session.add(new_offer)
    db.session.commit()

    return jsonify({"message": "Loan offer created", "offer_id": new_offer.OfferID}), 201


# Route to create a loan application
@loan_bp.route("/application", methods=["POST"])
def create_loan_application():
    data = request.json
    user_id = data.get("user_id")
    product_id = data.get("product_id")
    loan_offer_id = data.get("loan_offer_id")
    application_status = data.get("application_status", "Pending")

    new_application = LoanApplication(
        UserID=user_id,
        ProductID=product_id,
        LoanOfferID=loan_offer_id,
        ApplicationStatus=application_status
    )

    db.session.add(new_application)
    db.session.commit()

    return jsonify({"message": "Loan application created", "application_id": new_application.ApplicationID}), 201


# Route to get all loan applications
@loan_bp.route("/applications", methods=["GET"])
def get_all_loan_applications():
    loan_applications = LoanApplication.query.all()
    applications_list = [
        {
            "application_id": app.ApplicationID,
            "user_id": app.UserID,
            "product_id": app.ProductID,
            "loan_offer_id": app.LoanOfferID,
            "status": app.ApplicationStatus,
            "created_at": app.CreatedAt
        }
        for app in loan_applications
    ]
    return jsonify({"loan_applications": applications_list})
