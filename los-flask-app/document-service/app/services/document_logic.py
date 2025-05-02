from app.models import Document, db

def create_document_logic(user_id, document_type, document_url, status="Pending"):
    new_document = Document(UserID=user_id, DocumentType=document_type, DocumentURL=document_url, Status=status)
    db.session.add(new_document)
    db.session.commit()
    return new_document
