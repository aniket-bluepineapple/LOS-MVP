from flask import Blueprint, request, jsonify
from los.models import db, Role

role_bp = Blueprint("role", __name__, url_prefix="/api/roles")

# Create a new role
@role_bp.route("/", methods=["POST"])
def create_role():
    data = request.json

    # Validate required fields
    if "RoleName" not in data or not data["RoleName"].strip():
        return jsonify({"message": "RoleName is required"}), 400

    new_role = Role(
        RoleName=data["RoleName"],
        Description=data.get("Description", "")
    )

    db.session.add(new_role)
    db.session.commit()

    return jsonify({
        "message": "Role added successfully!",
        "role": {
            "RoleID": new_role.RoleID,
            "RoleName": new_role.RoleName,
            "Description": new_role.Description
        }
    }), 201


# Read all roles
@role_bp.route("/", methods=["GET"])
def get_roles():
    roles = Role.query.all()
    return jsonify([
        {
            "RoleID": r.RoleID,
            "RoleName": r.RoleName,
            "Description": r.Description
        }
        for r in roles
    ])


# Read a single role
@role_bp.route("/<int:role_id>", methods=["GET"])
def get_role(role_id):
    role = Role.query.get(role_id)
    if not role:
        return jsonify({"message": "Role not found"}), 404

    return jsonify({
        "RoleID": role.RoleID,
        "RoleName": role.RoleName,
        "Description": role.Description
    })


# Update a role
@role_bp.route("/<int:role_id>", methods=["PUT"])
def update_role(role_id):
    role = Role.query.get(role_id)
    if not role:
        return jsonify({"message": "Role not found"}), 404

    data = request.json
    role.RoleName = data.get("RoleName", role.RoleName)
    role.Description = data.get("Description", role.Description)

    db.session.commit()

    return jsonify({"message": "Role updated successfully!"})


# Delete a role
@role_bp.route("/<int:role_id>", methods=["DELETE"])
def delete_role(role_id):
    role = Role.query.get(role_id)
    if not role:
        return jsonify({"message": "Role not found"}), 404

    db.session.delete(role)
    db.session.commit()
    return jsonify({"message": "Role deleted successfully!"})
