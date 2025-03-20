from flask import Blueprint, request, jsonify
from los.models import db, Address, User

address_bp = Blueprint("address", __name__, url_prefix="/api/addresses")

# Create a new address
@address_bp.route("/", methods=["POST"])
def create_address():
    data = request.json

    # Validate required fields
    required_fields = ["UserID", "Street", "City", "State", "Zip", "AddressType"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if user exists
    user = User.query.get(data["UserID"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    new_address = Address(
        UserID=data["UserID"],
        Street=data["Street"],
        City=data["City"],
        State=data["State"],
        Zip=data["Zip"],
        AddressType=data["AddressType"]
    )

    db.session.add(new_address)
    db.session.commit()

    return jsonify({
        "message": "Address added successfully!",
        "address": {
            "AddressID": new_address.AddressID,
            "UserID": new_address.UserID,
            "Street": new_address.Street,
            "City": new_address.City,
            "State": new_address.State,
            "Zip": new_address.Zip,
            "AddressType": new_address.AddressType
        }
    }), 201


# Read all addresses
@address_bp.route("/", methods=["GET"])
def get_addresses():
    addresses = Address.query.all()
    return jsonify([
        {
            "AddressID": a.AddressID,
            "UserID": a.UserID,
            "Street": a.Street,
            "City": a.City,
            "State": a.State,
            "Zip": a.Zip,
            "AddressType": a.AddressType
        }
        for a in addresses
    ])


# Read a single address
@address_bp.route("/<int:address_id>", methods=["GET"])
def get_address(address_id):
    address = Address.query.get(address_id)
    if not address:
        return jsonify({"message": "Address not found"}), 404

    return jsonify({
        "AddressID": address.AddressID,
        "UserID": address.UserID,
        "Street": address.Street,
        "City": address.City,
        "State": address.State,
        "Zip": address.Zip,
        "AddressType": address.AddressType
    })


# Update an address
@address_bp.route("/<int:address_id>", methods=["PUT"])
def update_address(address_id):
    address = Address.query.get(address_id)
    if not address:
        return jsonify({"message": "Address not found"}), 404

    data = request.json
    address.Street = data.get("Street", address.Street)
    address.City = data.get("City", address.City)
    address.State = data.get("State", address.State)
    address.Zip = data.get("Zip", address.Zip)
    address.AddressType = data.get("AddressType", address.AddressType)

    db.session.commit()

    return jsonify({"message": "Address updated successfully!"})


# Delete an address
@address_bp.route("/<int:address_id>", methods=["DELETE"])
def delete_address(address_id):
    address = Address.query.get(address_id)
    if not address:
        return jsonify({"message": "Address not found"}), 404

    db.session.delete(address)
    db.session.commit()
    return jsonify({"message": "Address deleted successfully!"})
