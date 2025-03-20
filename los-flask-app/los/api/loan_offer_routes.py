from flask import Blueprint, request, jsonify
from datetime import datetime
from los.models import db, LoanOffer, Product

loan_offer_bp = Blueprint("loan_offer", __name__, url_prefix="/api/loan_offers")

# Create a new loan offer
@loan_offer_bp.route("/", methods=["POST"])
def create_loan_offer():
    data = request.json

    # Validate required fields
    required_fields = ["ProductID", "InterestRate", "LoanTenure", "MaxAmount"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if product exists
    product = Product.query.get(data["ProductID"])
    if not product:
        return jsonify({"message": "Product not found"}), 404

    new_loan_offer = LoanOffer(
        ProductID=data["ProductID"],
        InterestRate=data["InterestRate"],
        LoanTenure=data["LoanTenure"],
        MaxAmount=data["MaxAmount"],
        OfferStatus=data.get("OfferStatus", "Active"),
        CreatedAt=datetime.utcnow()
    )

    db.session.add(new_loan_offer)
    db.session.commit()

    return jsonify({
        "message": "Loan Offer added successfully!",
        "loan_offer": {
            "OfferID": new_loan_offer.OfferID,
            "ProductID": new_loan_offer.ProductID,
            "InterestRate": str(new_loan_offer.InterestRate),
            "LoanTenure": new_loan_offer.LoanTenure,
            "MaxAmount": str(new_loan_offer.MaxAmount),
            "OfferStatus": new_loan_offer.OfferStatus,
            "CreatedAt": new_loan_offer.CreatedAt
        }
    }), 201


# Read all loan offers
@loan_offer_bp.route("/", methods=["GET"])
def get_loan_offers():
    loan_offers = LoanOffer.query.all()
    return jsonify([
        {
            "OfferID": lo.OfferID,
            "ProductID": lo.ProductID,
            "InterestRate": str(lo.InterestRate),
            "LoanTenure": lo.LoanTenure,
            "MaxAmount": str(lo.MaxAmount),
            "OfferStatus": lo.OfferStatus,
            "CreatedAt": lo.CreatedAt
        }
        for lo in loan_offers
    ])


# Read a single loan offer
@loan_offer_bp.route("/<int:offer_id>", methods=["GET"])
def get_loan_offer(offer_id):
    loan_offer = LoanOffer.query.get(offer_id)
    if not loan_offer:
        return jsonify({"message": "Loan Offer not found"}), 404

    return jsonify({
        "OfferID": loan_offer.OfferID,
        "ProductID": loan_offer.ProductID,
        "InterestRate": str(loan_offer.InterestRate),
        "LoanTenure": loan_offer.LoanTenure,
        "MaxAmount": str(loan_offer.MaxAmount),
        "OfferStatus": loan_offer.OfferStatus,
        "CreatedAt": loan_offer.CreatedAt
    })


# Update a loan offer
@loan_offer_bp.route("/<int:offer_id>", methods=["PUT"])
def update_loan_offer(offer_id):
    loan_offer = LoanOffer.query.get(offer_id)
    if not loan_offer:
        return jsonify({"message": "Loan Offer not found"}), 404

    data = request.json
    loan_offer.ProductID = data.get("ProductID", loan_offer.ProductID)
    loan_offer.InterestRate = data.get("InterestRate", loan_offer.InterestRate)
    loan_offer.LoanTenure = data.get("LoanTenure", loan_offer.LoanTenure)
    loan_offer.MaxAmount = data.get("MaxAmount", loan_offer.MaxAmount)
    loan_offer.OfferStatus = data.get("OfferStatus", loan_offer.OfferStatus)

    db.session.commit()

    return jsonify({"message": "Loan Offer updated successfully!"})


# Delete a loan offer
@loan_offer_bp.route("/<int:offer_id>", methods=["DELETE"])
def delete_loan_offer(offer_id):
    loan_offer = LoanOffer.query.get(offer_id)
    if not loan_offer:
        return jsonify({"message": "Loan Offer not found"}), 404

    db.session.delete(loan_offer)
    db.session.commit()
    return jsonify({"message": "Loan Offer deleted successfully!"})
