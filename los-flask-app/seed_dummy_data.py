from los import create_app
from los.models import (
    db, Role, User, Login, Address, Document,
    Product, LoanOffer, LoanApplication, CreditScore, SystemNotification
)
import random


def generate_unique_app_id():
    """Generate a six digit application ID unique among existing applications."""
    while True:
        app_id = random.randint(100000, 999999)
        if not LoanApplication.query.get(app_id):
            return app_id


def seed_dummy_data():
    app = create_app()
    with app.app_context():
        # Roles
        admin_role = Role(RoleName="Admin", Description="Administrator")
        customer_role = Role(RoleName="Customer", Description="Customer user")
        db.session.add_all([admin_role, customer_role])
        db.session.commit()

        # Users
        user1 = User(
            FirstName="John",
            LastName="Doe",
            Email="john@example.com",
            Phone="1234567890",
            AadharNo="111122223333",
            PAN="ABCDE1234F",
            RoleID=customer_role.RoleID,
        )
        user2 = User(
            FirstName="Jane",
            LastName="Smith",
            Email="jane@example.com",
            Phone="9876543210",
            AadharNo="444455556666",
            PAN="PQRSX5678L",
            RoleID=admin_role.RoleID,
        )
        db.session.add_all([user1, user2])
        db.session.commit()

        # Login credentials
        login1 = Login(UserID=user1.UserID, Username="john", PasswordHash="hashed1")
        login2 = Login(UserID=user2.UserID, Username="jane", PasswordHash="hashed2")
        db.session.add_all([login1, login2])
        db.session.commit()

        # Addresses
        addr1 = Address(
            UserID=user1.UserID,
            Street="123 Main St",
            City="Metropolis",
            District="Metro District",
            State="NY",
            Zip="10001",
            AddressType="HOME",
        )
        addr2 = Address(
            UserID=user2.UserID,
            Street="456 Elm St",
            City="Gotham",
            District="Gotham District",
            State="NJ",
            Zip="07097",
            AddressType="HOME",
        )
        db.session.add_all([addr1, addr2])
        db.session.commit()

        # Documents
        doc1 = Document(
            UserID=user1.UserID,
            DocumentType="ID",
            DocumentURL="http://example.com/doc1.pdf",
        )
        doc2 = Document(
            UserID=user2.UserID,
            DocumentType="ID",
            DocumentURL="http://example.com/doc2.pdf",
        )
        db.session.add_all([doc1, doc2])
        db.session.commit()

        # Products
        product1 = Product(
            ProductType="Personal Loan",
            Description="Personal loan product",
            InventoryCount=100,
            Price=1000,
        )
        product2 = Product(
            ProductType="Home Loan",
            Description="Home loan product",
            InventoryCount=50,
            Price=5000,
        )
        db.session.add_all([product1, product2])
        db.session.commit()

        # Loan Offers
        offer1 = LoanOffer(
            ProductID=product1.ProductID,
            InterestRate=10.5,
            LoanTenure=36,
            MaxAmount=50000,
        )
        offer2 = LoanOffer(
            ProductID=product2.ProductID,
            InterestRate=8.5,
            LoanTenure=120,
            MaxAmount=250000,
        )
        db.session.add_all([offer1, offer2])
        db.session.commit()

        # Loan Applications
        app1 = LoanApplication(
            ApplicationID=generate_unique_app_id(),
            UserID=user1.UserID,
            ProductID=product1.ProductID,
            LoanOfferID=offer1.OfferID,
            ApplicationStatus="Pending",
        )
        app2 = LoanApplication(
            ApplicationID=generate_unique_app_id(),
            UserID=user2.UserID,
            ProductID=product2.ProductID,
            LoanOfferID=offer2.OfferID,
            ApplicationStatus="Pending",
        )
        db.session.add_all([app1, app2])
        db.session.commit()

        # Credit Scores
        cs1 = CreditScore(UserID=user1.UserID, Score=750)
        cs2 = CreditScore(UserID=user2.UserID, Score=680)
        db.session.add_all([cs1, cs2])
        db.session.commit()

        # Notifications
        notification = SystemNotification(
            SenderID=user2.UserID,
            ReceiverID=user1.UserID,
            ApplicationID=app1.ApplicationID,
            Message="Application received",
        )
        db.session.add(notification)
        db.session.commit()

        print("Dummy data inserted successfully.")


if __name__ == "__main__":
    seed_dummy_data()