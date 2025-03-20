from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from los.models import db, Login, User
from datetime import datetime

login_bp = Blueprint("login", __name__, url_prefix="/api/login")

# Create a new login (Register user login credentials)
@login_bp.route("/", methods=["POST"])
def create_login():
    data = request.json

    # Validate required fields
    required_fields = ["UserID", "Username", "PasswordHash"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if user exists
    user = User.query.get(data["UserID"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    # Check if login already exists for this user
    if Login.query.filter_by(UserID=data["UserID"]).first():
        return jsonify({"message": "Login already exists for this user"}), 400

    # Hash the password before storing it
    hashed_password = generate_password_hash(data["PasswordHash"], method="pbkdf2:sha256")

    new_login = Login(
        UserID=data["UserID"],
        Username=data["Username"],
        PasswordHash=hashed_password,
        Status=data.get("Status", "Active")
    )

    db.session.add(new_login)
    db.session.commit()

    return jsonify({
        "message": "Login created successfully!",
        "login": {
            "LoginID": new_login.LoginID,
            "UserID": new_login.UserID,
            "Username": new_login.Username,
            "LastLoginAt": new_login.LastLoginAt,
            "Status": new_login.Status
        }
    }), 201


# Read all logins
@login_bp.route("/", methods=["GET"])
def get_logins():
    logins = Login.query.all()
    return jsonify([
        {
            "LoginID": l.LoginID,
            "UserID": l.UserID,
            "Username": l.Username,
            "LastLoginAt": l.LastLoginAt,
            "Status": l.Status
        }
        for l in logins
    ])


# Read a single login
@login_bp.route("/<int:login_id>", methods=["GET"])
def get_login(login_id):
    login = Login.query.get(login_id)
    if not login:
        return jsonify({"message": "Login not found"}), 404

    return jsonify({
        "LoginID": login.LoginID,
        "UserID": login.UserID,
        "Username": login.Username,
        "LastLoginAt": login.LastLoginAt,
        "Status": login.Status
    })


# Update a login (Change Username or Status)
@login_bp.route("/<int:login_id>", methods=["PUT"])
def update_login(login_id):
    login = Login.query.get(login_id)
    if not login:
        return jsonify({"message": "Login not found"}), 404

    data = request.json
    login.Username = data.get("Username", login.Username)
    login.Status = data.get("Status", login.Status)

    db.session.commit()

    return jsonify({"message": "Login updated successfully!"})


# Change password
@login_bp.route("/<int:login_id>/change-password", methods=["PUT"])
def change_password(login_id):
    login = Login.query.get(login_id)
    if not login:
        return jsonify({"message": "Login not found"}), 404

    data = request.json
    new_password = data.get("NewPassword")
    if not new_password:
        return jsonify({"message": "New password is required"}), 400

    # Hash and update the password
    login.PasswordHash = generate_password_hash(new_password, method="pbkdf2:sha256")

    db.session.commit()

    return jsonify({"message": "Password updated successfully!"})


# Login user (Authentication)
@login_bp.route("/authenticate", methods=["POST"])
def authenticate_user():
    data = request.json

    # Validate required fields
    required_fields = ["Username", "Password"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    login = Login.query.filter_by(Username=data["Username"]).first()
    if not login or not check_password_hash(login.PasswordHash, data["Password"]):
        return jsonify({"message": "Invalid username or password"}), 401

    # Update last login timestamp
    login.LastLoginAt = datetime.utcnow()
    db.session.commit()

    return jsonify({"message": "Login successful!", "UserID": login.UserID, "Username": login.Username})


# Delete a login
@login_bp.route("/<int:login_id>", methods=["DELETE"])
def delete_login(login_id):
    login = Login.query.get(login_id)
    if not login:
        return jsonify({"message": "Login not found"}), 404

    db.session.delete(login)
    db.session.commit()
    return jsonify({"message": "Login deleted successfully!"})
