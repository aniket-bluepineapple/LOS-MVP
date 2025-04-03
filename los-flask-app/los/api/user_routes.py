from flask import Blueprint, request, jsonify, current_app
from los.models import db, User
from flask_cors import CORS, cross_origin
import os
import uuid

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

user_bp = Blueprint("user", __name__, url_prefix="/api/users")
CORS(user_bp)

@user_bp.route("/", methods=["OPTIONS"])
@cross_origin()
def options():
    print("\n Handling preflight request")
    response = jsonify({"message": "CORS preflight response"})
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# Create a new user
@user_bp.route("/", methods=["POST"])
@cross_origin()
def create_user():
    data = request.form  # Use form data instead of JSON
    files = request.files

    # Validate required fields
    required_fields = ["FirstName", "LastName", "Email", "AadharNo", "PAN", "RoleID"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Handle file uploads with unique names
    def save_file(file, prefix):
        if file and file.filename:
            ext = os.path.splitext(file.filename)[1]  # Get file extension
            unique_filename = f"{prefix}_{uuid.uuid4().hex}{ext}"  # Add random string
            file_path = os.path.join(UPLOAD_FOLDER, unique_filename)
            file.save(file_path)
            return file_path
        return None

    aadhar_doc_path = save_file(files.get("AadharUploadDoc"), "aadhar")
    pan_doc_path = save_file(files.get("PANUploadDoc"), "pan")
    income_proof_doc_path = save_file(files.get("IncomeProofDoc"), "income_proof")

    new_user = User(
        FirstName=data["FirstName"],
        LastName=data["LastName"],
        Email=data["Email"],
        Phone=data.get("Phone"),
        DOB=data.get("DOB"),
        AadharNo=data["AadharNo"],
        PAN=data["PAN"],
        AadharUploadDoc=aadhar_doc_path,
        PANUploadDoc=pan_doc_path,
        IncomeProofDoc=income_proof_doc_path,
        PhoneVerified=data.get("PhoneVerified", False),
        EmailVerified=data.get("EmailVerified", False),
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
            "FirstName": new_user.FirstName,
            "LastName": new_user.LastName,
            "Email": new_user.Email,
            "AadharUploadDoc": new_user.AadharUploadDoc,
            "PANUploadDoc": new_user.PANUploadDoc,
        }
    }), 201


# Read all users
@user_bp.route("/", methods=["GET"])
@cross_origin()
def get_users():
    users = User.query.all()
    return jsonify([
        {
            "UserID": u.UserID,
            "FirstName": u.FirstName,
            "LastName": u.LastName,
            "Email": u.Email,
            "Phone": u.Phone,
            "DOB": u.DOB,
            "AadharNo": u.AadharNo,
            "PAN": u.PAN,
            "AadharUploadDoc": u.AadharUploadDoc,
            "PANUploadDoc": u.PANUploadDoc,
            "PhoneVerified": u.PhoneVerified,
            "EmailVerified": u.EmailVerified,
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
@cross_origin()
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "UserID": user.UserID,
        "FirstName": user.FirstName,
        "LastName": user.LastName,
        "Email": user.Email,
        "Phone": user.Phone,
        "DOB": user.DOB,
        "AadharNo": user.AadharNo,
        "PAN": user.PAN,
        "AadharUploadDoc": user.AadharUploadDoc,
        "PANUploadDoc": user.PANUploadDoc,
        "PhoneVerified": user.PhoneVerified,
        "EmailVerified": user.EmailVerified,
        "MonthlyIncome": user.MonthlyIncome,
        "MaritalStatus": user.MaritalStatus,
        "NoOfDependents": user.NoOfDependents,
        "RoleID": user.RoleID,
        "CreatedAt": user.CreatedAt
    })


# Update a user
@user_bp.route("/<int:user_id>", methods=["PUT"])
@cross_origin()
def update_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    data = request.json
    user.FirstName = data.get("FirstName", user.FirstName)
    user.LastName = data.get("LastName", user.LastName)
    user.Email = data.get("Email", user.Email)
    user.Phone = data.get("Phone", user.Phone)
    user.DOB = data.get("DOB", user.DOB)
    user.AadharNo = data.get("AadharNo", user.AadharNo)
    user.PAN = data.get("PAN", user.PAN)
    user.AadharUploadDoc = data.get("AadharUploadDoc", user.AadharUploadDoc)
    user.PANUploadDoc = data.get("PANUploadDoc", user.PANUploadDoc)
    user.PhoneVerified = data.get("PhoneVerified", user.PhoneVerified)
    user.EmailVerified = data.get("EmailVerified", user.EmailVerified)
    user.MonthlyIncome = data.get("MonthlyIncome", user.MonthlyIncome)
    user.MaritalStatus = data.get("MaritalStatus", user.MaritalStatus)
    user.NoOfDependents = data.get("NoOfDependents", user.NoOfDependents)
    user.RoleID = data.get("RoleID", user.RoleID)

    db.session.commit()

    return jsonify({"message": "User updated successfully!"})


# Delete a user
@user_bp.route("/<int:user_id>", methods=["DELETE"])
@cross_origin()
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": "User deleted successfully!"})
