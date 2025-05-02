from flask import Blueprint, request, jsonify
from app.models import Document, db

document_bp = Blueprint("document_bp", __name__)

# Create a new document
@document_bp.route("/", methods=["POST"])
def create_document():
    data = request.json
    user_id = data.get("user_id")
    document_type = data.get("document_type")
    document_url = data.get("document_url")
    status = data.get("status", "Pending")

    new_document = Document(UserID=user_id, DocumentType=document_type, DocumentURL=document_url, Status=status)
    db.session.add(new_document)
    db.session.commit()

    return jsonify({"message": "Document created", "document_id": new_document.DocumentID}), 201

# Get all documents for a user
@document_bp.route("/<int:user_id>", methods=["GET"])
def get_documents_for_user(user_id):
    documents = Document.query.filter_by(UserID=user_id).all()
    documents_list = [
        {
            "id": doc.DocumentID,
            "type": doc.DocumentType,
            "url": doc.DocumentURL,
            "status": doc.Status
        }
        for doc in documents
    ]
    return jsonify({"user_id": user_id, "documents": documents_list})

# Update document status
@document_bp.route("/<int:document_id>", methods=["PUT"])
def update_document_status(document_id):
    data = request.json
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404

    status = data.get("status")
    document.Status = status
    db.session.commit()

    return jsonify({"message": "Document status updated", "document_id": document.DocumentID, "status": document.Status})

# Delete a document
@document_bp.route("/<int:document_id>", methods=["DELETE"])
def delete_document(document_id):
    document = Document.query.get(document_id)
    if not document:
        return jsonify({"error": "Document not found"}), 404

    db.session.delete(document)
    db.session.commit()

    return jsonify({"message": "Document deleted", "document_id": document_id})
