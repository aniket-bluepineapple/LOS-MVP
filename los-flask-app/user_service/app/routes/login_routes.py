from flask import Blueprint, request, jsonify
from app.services.user_logic import create_login
from app.utils.auth import verify_password
from app.models import Login

login_bp = Blueprint("login_bp", __name__)

@login_bp.route("/", methods=["POST"])
def register_login():
    data = request.json
    login = create_login(data['user_id'], data['username'], data['password'])
    return jsonify({"message": "Login created", "login_id": login.LoginID}), 201

@login_bp.route("/auth", methods=["POST"])
def login_user():
    data = request.json
    login = Login.query.filter_by(Username=data['username']).first()
    if login and verify_password(data['password'], login.PasswordHash):
        return jsonify({"message": "Login successful"})
    return jsonify({"error": "Invalid credentials"}), 401
