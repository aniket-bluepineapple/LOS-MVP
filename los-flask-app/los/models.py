from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


class Role(db.Model):
    __tablename__ = "roles"

    RoleID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    RoleName = db.Column(db.String(255), unique=True, nullable=False)
    Description = db.Column(db.Text)

    users = db.relationship("User", backref="role", lazy=True)


class User(db.Model):
    __tablename__ = "users"

    UserID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    FirstName = db.Column(db.String(255), nullable=False)
    LastName = db.Column(db.String(255), nullable=False)
    Email = db.Column(db.String(255), unique=True, nullable=False)
    Phone = db.Column(db.String(20))
    EmailVerified = db.Column(db.Boolean, default=False)
    PhoneVerified = db.Column(db.Boolean, default=False)
    DOB = db.Column(db.Date)
    AadharNo = db.Column(db.String(20), unique=True, nullable=False)
    PAN = db.Column(db.String(10), unique=True, nullable=False)
    AadharUploadDoc = db.Column(db.String(255))
    PANUploadDoc = db.Column(db.String(255))
    IncomeProofDoc = db.Column(db.String(255))
    MonthlyIncome = db.Column(db.Numeric(10, 2))
    # Total of all monthly EMIs the applicant currently pays
    ExistingEmis = db.Column(db.Numeric(10, 2), default=0)
    MaritalStatus = db.Column(db.String(25))
    NoOfDependents = db.Column(db.Integer)
    EmploymentNature = db.Column(db.String(255))
    WorkExperience = db.Column(db.Integer)
    CompanyName = db.Column(db.String(255))
    CompanyAddress = db.Column(db.String(255))
    OfficialEmail = db.Column(db.String(255))
    RoleID = db.Column(db.Integer, db.ForeignKey("roles.RoleID", ondelete="SET NULL"))
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    login = db.relationship(
        "Login", back_populates="user", uselist=False, cascade="all, delete"
    )
    addresses = db.relationship("Address", back_populates="user", cascade="all, delete")
    documents = db.relationship(
        "Document", back_populates="user", cascade="all, delete"
    )
    loan_applications = db.relationship(
        "LoanApplication", back_populates="user", cascade="all, delete"
    )
    credit_score = db.relationship(
        "CreditScore", back_populates="user", uselist=False, cascade="all, delete"
    )
    sent_notifications = db.relationship(
        "SystemNotification",
        foreign_keys="SystemNotification.SenderID",
        back_populates="sender",
        cascade="all, delete",
    )
    received_notifications = db.relationship(
        "SystemNotification",
        foreign_keys="SystemNotification.ReceiverID",
        back_populates="receiver",
        cascade="all, delete",
    )


class Login(db.Model):
    __tablename__ = "login"

    LoginID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(
        db.Integer,
        db.ForeignKey("users.UserID", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    Username = db.Column(db.String(255), unique=True, nullable=False)
    PasswordHash = db.Column(db.String(255), nullable=False)
    LastLoginAt = db.Column(db.DateTime)
    Status = db.Column(db.Enum("Active", "Inactive"), default="Active", nullable=False)

    user = db.relationship("User", back_populates="login")


class Address(db.Model):
    __tablename__ = "addresses"

    AddressID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(
        db.Integer, db.ForeignKey("users.UserID", ondelete="CASCADE"), nullable=False
    )
    Street = db.Column(db.String(255))
    City = db.Column(db.String(100))
    District = db.Column(db.String(100))
    State = db.Column(db.String(100))
    Zip = db.Column(db.String(20))
    AddressType = db.Column(db.String(25))
    MonthlyHomeRent = db.Column(db.Numeric(10, 2), default=4000)


    user = db.relationship("User", back_populates="addresses")


class Document(db.Model):
    __tablename__ = "documents"

    DocumentID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(
        db.Integer, db.ForeignKey("users.UserID", ondelete="CASCADE"), nullable=False
    )
    DocumentType = db.Column(db.String(100), nullable=False)
    DocumentURL = db.Column(db.String(255), nullable=False)
    Status = db.Column(
        db.Enum("Pending", "Verified", "Rejected"), default="Pending", nullable=False
    )

    user = db.relationship("User", back_populates="documents")


class Product(db.Model):
    __tablename__ = "products"

    ProductID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ProductType = db.Column(db.String(255), nullable=False)
    Description = db.Column(db.Text)
    InventoryCount = db.Column(db.Integer, default=0, nullable=False)
    Price = db.Column(db.Numeric(10, 2), nullable=False)
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

    loan_offers = db.relationship(
        "LoanOffer", back_populates="product", cascade="all, delete"
    )
    loan_applications = db.relationship(
        "LoanApplication", back_populates="product", cascade="all, delete"
    )


class LoanOffer(db.Model):
    __tablename__ = "loan_offers"

    OfferID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ProductID = db.Column(
        db.Integer,
        db.ForeignKey("products.ProductID", ondelete="CASCADE"),
        nullable=False,
    )
    InterestRate = db.Column(db.Numeric(5, 2), nullable=False)
    LoanTenure = db.Column(db.Integer, nullable=False)  # in months
    MaxAmount = db.Column(db.Numeric(10, 2), nullable=False)
    OfferStatus = db.Column(
        db.Enum("Active", "Inactive"), default="Active", nullable=False
    )
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)

    product = db.relationship("Product", back_populates="loan_offers")
    loan_applications = db.relationship(
        "LoanApplication", back_populates="loan_offer", cascade="all, delete"
    )


class LoanApplication(db.Model):
    __tablename__ = "loan_applications"

    ApplicationID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(
        db.Integer, db.ForeignKey("users.UserID", ondelete="CASCADE"), nullable=False
    )
    ProductID = db.Column(
        db.Integer,
        db.ForeignKey("products.ProductID", ondelete="CASCADE"),
        nullable=False,
    )
    LoanOfferID = db.Column(
        db.Integer,
        db.ForeignKey("loan_offers.OfferID", ondelete="CASCADE"),
        nullable=False,
    )
    ApplicationStatus = db.Column(
        db.Enum("Pending", "Approved", "Rejected"), default="Pending", nullable=False
    )
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)
    UpdatedAt = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    user = db.relationship("User", back_populates="loan_applications")
    product = db.relationship("Product", back_populates="loan_applications")
    loan_offer = db.relationship("LoanOffer", back_populates="loan_applications")
    notifications = db.relationship(
        "SystemNotification", back_populates="application", cascade="all, delete"
    )
    loan = db.relationship(
        "Loan", back_populates="application", uselist=False, cascade="all, delete"
    )


class CreditScore(db.Model):
    __tablename__ = "credit_scores"

    CreditID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    UserID = db.Column(
        db.Integer,
        db.ForeignKey("users.UserID", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )
    Score = db.Column(db.Integer, nullable=False)
    Timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="credit_score")


class SystemNotification(db.Model):
    __tablename__ = "system_notifications"

    NotificationID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SenderID = db.Column(
        db.Integer, db.ForeignKey("users.UserID", ondelete="CASCADE"), nullable=False
    )
    ReceiverID = db.Column(
        db.Integer, db.ForeignKey("users.UserID", ondelete="CASCADE"), nullable=False
    )
    ApplicationID = db.Column(
        db.Integer,
        db.ForeignKey("loan_applications.ApplicationID", ondelete="CASCADE"),
        nullable=False,
    )
    Message = db.Column(db.Text, nullable=False)
    Timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    sender = db.relationship(
        "User", foreign_keys=[SenderID], back_populates="sent_notifications"
    )
    receiver = db.relationship(
        "User", foreign_keys=[ReceiverID], back_populates="received_notifications"
    )
    application = db.relationship("LoanApplication", back_populates="notifications")


class CibilCache(db.Model):
    """Persistent cache for calculated CIBIL scores."""

    __tablename__ = "cibil_cache"

    pan = db.Column(db.String(10), primary_key=True)
    score = db.Column(db.Integer, nullable=False)
    max_loan = db.Column(db.Numeric(10, 2), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Loan(db.Model):
    """Details of an accepted loan."""

    __tablename__ = "loans"

    LoanID = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ApplicationID = db.Column(
        db.Integer,
        db.ForeignKey("loan_applications.ApplicationID", ondelete="CASCADE"),
        nullable=False,
    )
    PrincipalAmount = db.Column(db.Numeric(10, 2), nullable=False)
    InterestRate = db.Column(db.Numeric(5, 2), nullable=False)
    Tenure = db.Column(db.Integer, nullable=False)  # in months
    Emi = db.Column(db.Numeric(10, 2), nullable=False)
    StartDate = db.Column(db.Date, nullable=False)
    Status = db.Column(
        db.Enum("Active", "Closed"), default="Active", nullable=False
    )
    CreatedAt = db.Column(db.DateTime, default=datetime.utcnow)
    UpdatedAt = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    application = db.relationship(
        "LoanApplication", back_populates="loan", uselist=False
    )
