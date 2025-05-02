from flask import Blueprint, request, jsonify
from app.services.user_logic import create_user, add_address, get_user_by_id
from app.models import Role, User, Address

user_bp = Blueprint("user_bp", __name__)

# Create a new user
@user_bp.route("/", methods=["POST"])
def register_user():
    data = request.json
    user = create_user(data)
    return jsonify({"message": "User created", "user_id": user.UserID}), 201

# Get user by ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = get_user_by_id(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({
        "id": user.UserID,
        "name": f"{user.FirstName} {user.LastName}",
        "email": user.Email
    })

# Add address for a user
@user_bp.route("/<int:user_id>/address", methods=["POST"])
def add_user_address(user_id):
    data = request.json
    address = add_address(user_id, data)
    return jsonify({"message": "Address added", "address_id": address.AddressID}), 201

# Get addresses for a user
@user_bp.route("/<int:user_id>/addresses", methods=["GET"])
def get_user_addresses(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    addresses = Address.query.filter_by(UserID=user_id).all()
    addresses_list = [
        {
            "id": address.AddressID,
            "street": address.Street,
            "city": address.City,
            "state": address.State,
            "zip": address.Zip,
            "type": address.AddressType
        }
        for address in addresses
    ]
    return jsonify({"user_id": user_id, "addresses": addresses_list})

# Get all users
@user_bp.route("/", methods=["GET"])
def get_all_users():
    users = User.query.all()
    users_list = [
        {
            "id": user.UserID,
            "name": f"{user.FirstName} {user.LastName}",
            "email": user.Email,
            "phone": user.Phone,
            "role": user.role.RoleName if user.role else "No role assigned"
        }
        for user in users
    ]
    return jsonify({"users": users_list})

@user_bp.route("/<int:user_id>/role", methods=["GET"])
def get_user_role(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    if not user.role:
        return jsonify({"error": "Role not assigned to user"}), 404

    role = user.role
    role_details = {
        "role_id": role.RoleID,
        "role_name": role.RoleName,
        "description": role.Description
    }

    return jsonify({"user_id": user_id, "role": role_details})
