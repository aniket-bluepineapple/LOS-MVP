from datetime import datetime
from app import db

class Document(db.Model):
    __tablename__ = "documents"

    DocumentID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.Integer, nullable=False)  # Only store the UserID
    DocumentType = db.Column(db.String(100), nullable=False)
    DocumentURL = db.Column(db.String(255), nullable=False)
    Status = db.Column(db.Enum("Pending", "Verified", "Rejected"), default="Pending", nullable=False)

    def as_dict(self):
        # Remove the 'Timestamp' field from the returned dictionary
        return {
            "DocumentID": self.DocumentID,
            "UserID": self.UserID,
            "DocumentType": self.DocumentType,
            "DocumentURL": self.DocumentURL,
            "Status": self.Status
        }
