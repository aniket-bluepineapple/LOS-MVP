from flask import Blueprint, request, jsonify
from los.models import db, User

from flask_cors import CORS

user_bp = Blueprint("user", __name__, url_prefix="/api/users")
CORS(user_bp)

# Create a new user
@user_bp.route("/", methods=["POST"])
def create_user():
    data = request.json

    # Validate required fields
    required_fields = ["Name", "Email", "AadharNo", "PAN", "RoleID"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    new_user = User(
        Name=data["Name"],
        Email=data["Email"],
        Phone=data.get("Phone"),
        DOB=data.get("DOB"),
        AadharNo=data["AadharNo"],
        PAN=data["PAN"],
        AadharUploadDoc=data.get("AadharUploadDoc"),
        PANUploadDoc=data.get("PANUploadDoc"),
        AadharVerified=data.get("AadharVerified", False),
        PANVerified=data.get("PANVerified", False),
        MonthlyIncome=data.get("MonthlyIncome"),
        MaritalStatus=data.get("MaritalStatus"),
        NoOfDependents=data.get("NoOfDependents"),
        RoleID=data["RoleID"]
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User created successfully!",
        "user": {
            "UserID": new_user.UserID,
            "Name": new_user.Name,
            "Email": new_user.Email,
            "Phone": new_user.Phone,
            "DOB": new_user.DOB,
            "AadharNo": new_user.AadharNo,
            "PAN": new_user.PAN,
            "AadharUploadDoc": new_user.AadharUploadDoc,
            "PANUploadDoc": new_user.PANUploadDoc,
            "AadharVerified": new_user.AadharVerified,
            "PANVerified": new_user.PANVerified,
            "MonthlyIncome": new_user.MonthlyIncome,
            "MaritalStatus": new_user.MaritalStatus,
            "NoOfDependents": new_user.NoOfDependents,
            "RoleID": new_user.RoleID,
            "CreatedAt": new_user.CreatedAt
        }
    }), 201


# Read all users
@user_bp.route("/", methods=["GET"])
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "UserID": u.UserID,
            "Name": u.Name,
            "Email": u.Email,
            "Phone": u.Phone,
            "DOB": u.DOB,
            "AadharNo": u.AadharNo,
            "PAN": u.PAN,
            "AadharUploadDoc": u.AadharUploadDoc,
            "PANUploadDoc": u.PANUploadDoc,
            "AadharVerified": u.AadharVerified,
            "PANVerified": u.PANVerified,
            "MonthlyIncome": u.MonthlyIncome,
            "MaritalStatus": u.MaritalStatus,
            "NoOfDependents": u.NoOfDependents,
            "RoleID": u.RoleID,
            "CreatedAt": u.CreatedAt
        }
        for u in users
    ])


# Read a single user
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "UserID": user.UserID,
        "Name": user.Name,
        "Email": user.Email,
        "Phone": user.Phone,
        "DOB": user.DOB,
        "AadharNo": user.AadharNo,
        "PAN": user.PAN,
        "AadharUploadDoc": user.AadharUploadDoc,
        "PANUploadDoc": user.PANUploadDoc,
        "AadharVerified": user.AadharVerified,
        "PANVerified": user.PANVerified,
        "MonthlyIncome": user.MonthlyIncome,
        "MaritalStatus": user.MaritalStatus,
        "NoOfDependents": user.NoOfDependents,
        "RoleID": user.RoleID,
        "CreatedAt": user.CreatedAt
    })


# Update a user
@user_bp.route("/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.Name = data.get("Name", user.Name)
    user.Email = data.get("Email", user.Email)
    user.Phone = data.get("Phone", user.Phone)
    user.DOB = data.get("DOB", user.DOB)
    user.AadharNo = data.get("AadharNo", user.AadharNo)
    user.PAN = data.get("PAN", user.PAN)
    user.AadharUploadDoc = data.get("AadharUploadDoc", user.AadharUploadDoc)
    user.PANUploadDoc = data.get("PANUploadDoc", user.PANUploadDoc)
    user.AadharVerified = data.get("AadharVerified", user.AadharVerified)
    user.PANVerified = data.get("PANVerified", user.PANVerified)
    user.MonthlyIncome = data.get("MonthlyIncome", user.MonthlyIncome)
    user.MaritalStatus = data.get("MaritalStatus", user.MaritalStatus)
    user.NoOfDependents = data.get("NoOfDependents", user.NoOfDependents)
    user.RoleID = data.get("RoleID", user.RoleID)

    db.session.commit()

    return jsonify({"message": "User updated successfully!"})


# Delete a user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully!"})
