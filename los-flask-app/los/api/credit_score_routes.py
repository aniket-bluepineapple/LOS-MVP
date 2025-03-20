from flask import Blueprint, request, jsonify
from datetime import datetime
from los.models import db, CreditScore, User

credit_score_bp = Blueprint("credit_score", __name__, url_prefix="/api/credit_scores")


# Create or Update a Credit Score
@credit_score_bp.route("/", methods=["POST"])
def create_or_update_credit_score():
    data = request.json

    # Validate required fields
    if "UserID" not in data or "Score" not in data:
        return jsonify({"message": "Missing required fields"}), 400

    # Check if User exists
    user = User.query.get(data["UserID"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if Credit Score already exists
    credit_score = CreditScore.query.filter_by(UserID=data["UserID"]).first()
    if credit_score:
        # Update existing Credit Score
        credit_score.Score = data["Score"]
        credit_score.Timestamp = datetime.utcnow()
        message = "Credit Score updated successfully!"
    else:
        # Create new Credit Score
        credit_score = CreditScore(
            UserID=data["UserID"],
            Score=data["Score"],
            Timestamp=datetime.utcnow()
        )
        db.session.add(credit_score)
        message = "Credit Score added successfully!"

    db.session.commit()

    return jsonify({
        "message": message,
        "credit_score": {
            "CreditID": credit_score.CreditID,
            "UserID": credit_score.UserID,
            "Score": credit_score.Score,
            "Timestamp": credit_score.Timestamp
        }
    }), 201


# Get all Credit Scores
@credit_score_bp.route("/", methods=["GET"])
def get_credit_scores():
    credit_scores = CreditScore.query.all()
    return jsonify([
        {
            "CreditID": cs.CreditID,
            "UserID": cs.UserID,
            "Score": cs.Score,
            "Timestamp": cs.Timestamp
        }
        for cs in credit_scores
    ])


# Get a single Credit Score by UserID
@credit_score_bp.route("/<int:user_id>", methods=["GET"])
def get_credit_score(user_id):
    credit_score = CreditScore.query.filter_by(UserID=user_id).first()
    if not credit_score:
        return jsonify({"message": "Credit Score not found"}), 404

    return jsonify({
        "CreditID": credit_score.CreditID,
        "UserID": credit_score.UserID,
        "Score": credit_score.Score,
        "Timestamp": credit_score.Timestamp
    })


# Delete a Credit Score
@credit_score_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_credit_score(user_id):
    credit_score = CreditScore.query.filter_by(UserID=user_id).first()
    if not credit_score:
        return jsonify({"message": "Credit Score not found"}), 404

    db.session.delete(credit_score)
    db.session.commit()
    return jsonify({"message": "Credit Score deleted successfully!"})
