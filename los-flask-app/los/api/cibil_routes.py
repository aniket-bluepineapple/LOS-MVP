from flask import Blueprint, request, jsonify
from flask_cors import CORS

from ..services.cibil_service import get_or_create_by_pan

cibil_bp = Blueprint("cibil", __name__, url_prefix="/api/cibil")
CORS(cibil_bp)


@cibil_bp.route("/", methods=["POST"])
def calculate_cibil():
    data = request.json or {}
    required = [
        "pan",
        "salary",
        "age",
        "existingEmis",
        "monthlyHomeRent",
        "dependents",
        "residenceType",
    ]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    result = get_or_create_by_pan(data["pan"], data)
    return jsonify(
        {
            "pan": result.pan,
            "score": result.score,
            "maxLoanAllowed": result.maxLoanAllowed,
        }
    )
