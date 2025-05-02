from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy.orm import foreign

db = SQLAlchemy()

class LoanOffer(db.Model):
    __tablename__ = "loan_offers"

    OfferID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ProductID = db.Column(db.Integer, nullable=False)  # Only store ProductID here, not a full relationship
    InterestRate = db.Column(db.Numeric(5, 2), nullable=False)
    LoanTenure = db.Column(db.Integer, nullable=False)  # in months
    MaxAmount = db.Column(db.Numeric(10, 2), nullable=False)
    OfferStatus = db.Column(db.Enum("Active", "Inactive"), default="Active", nullable=False)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    # Removed the product relationship, since it's in a different service
    loan_applications = db.relationship(
        "LoanApplication", 
        back_populates="loan_offer", 
        cascade="all, delete", 
        primaryjoin="LoanOffer.OfferID == foreign(LoanApplication.LoanOfferID)"
    )


class LoanApplication(db.Model):
    __tablename__ = "loan_applications"

    ApplicationID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(db.Integer, nullable=False)  # Store the UserID, API call will fetch details
    ProductID = db.Column(db.Integer, nullable=False)  # Store ProductID, API call will fetch details
    LoanOfferID = db.Column(db.Integer, nullable=False)  # Store LoanOfferID, API call will fetch details
    ApplicationStatus = db.Column(db.Enum("Pending", "Approved", "Rejected"), default="Pending", nullable=False)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)
    UpdatedAt = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Removed relationships to external models, we'll handle them with API calls
    loan_offer = db.relationship(
        "LoanOffer", 
        back_populates="loan_applications", 
        primaryjoin="foreign(LoanApplication.LoanOfferID) == LoanOffer.OfferID"
    )
