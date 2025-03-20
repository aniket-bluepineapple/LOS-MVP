from flask import Blueprint, request, jsonify
from los.models import db, Document, User

document_bp = Blueprint("document", __name__, url_prefix="/api/documents")

# Create a new document
@document_bp.route("/", methods=["POST"])
def create_document():
    data = request.json

    # Validate required fields
    required_fields = ["UserID", "DocumentType", "DocumentURL"]
    if not all(field in data and data[field] for field in required_fields):
        return jsonify({"message": "Missing required fields"}), 400

    # Check if user exists
    user = User.query.get(data["UserID"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    new_document = Document(
        UserID=data["UserID"],
        DocumentType=data["DocumentType"],
        DocumentURL=data["DocumentURL"],
        Status=data.get("Status", "Pending")
    )

    db.session.add(new_document)
    db.session.commit()

    return jsonify({
        "message": "Document uploaded successfully!",
        "document": {
            "DocumentID": new_document.DocumentID,
            "UserID": new_document.UserID,
            "DocumentType": new_document.DocumentType,
            "DocumentURL": new_document.DocumentURL,
            "Status": new_document.Status
        }
    }), 201


# Read all documents
@document_bp.route("/", methods=["GET"])
def get_documents():
    documents = Document.query.all()
    return jsonify([
        {
            "DocumentID": d.DocumentID,
            "UserID": d.UserID,
            "DocumentType": d.DocumentType,
            "DocumentURL": d.DocumentURL,
            "Status": d.Status
        }
        for d in documents
    ])


# Read documents for a specific user
@document_bp.route("/user/<int:user_id>", methods=["GET"])
def get_documents_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404

    documents = Document.query.filter_by(UserID=user_id).all()
    return jsonify([
        {
            "DocumentID": d.DocumentID,
            "UserID": d.UserID,
            "DocumentType": d.DocumentType,
            "DocumentURL": d.DocumentURL,
            "Status": d.Status
        }
        for d in documents
    ])


# Read a single document
@document_bp.route("/<int:document_id>", methods=["GET"])
def get_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"message": "Document not found"}), 404

    return jsonify({
        "DocumentID": document.DocumentID,
        "UserID": document.UserID,
        "DocumentType": document.DocumentType,
        "DocumentURL": document.DocumentURL,
        "Status": document.Status
    })


# Update a document (Change status or URL)
@document_bp.route("/<int:document_id>", methods=["PUT"])
def update_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"message": "Document not found"}), 404

    data = request.json
    document.DocumentURL = data.get("DocumentURL", document.DocumentURL)
    document.Status = data.get("Status", document.Status)

    db.session.commit()

    return jsonify({"message": "Document updated successfully!"})


# Delete a document
@document_bp.route("/<int:document_id>", methods=["DELETE"])
def delete_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"message": "Document not found"}), 404

    db.session.delete(document)
    db.session.commit()
    return jsonify({"message": "Document deleted successfully!"})
