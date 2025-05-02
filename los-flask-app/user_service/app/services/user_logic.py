from app.models import db, User, Login, Address
from app.utils.auth import hash_password

def create_user(data):
    user = User(
        FirstName=data['first_name'],
        LastName=data['last_name'],
        Email=data['email'],
        Phone=data.get('phone'),
        RoleID=data.get('role_id')
    )
    db.session.add(user)
    db.session.commit()
    return user

def create_login(user_id, username, password):
    hashed = hash_password(password)
    login = Login(UserID=user_id, Username=username, PasswordHash=hashed)
    db.session.add(login)
    db.session.commit()
    return login

def add_address(user_id, data):
    address = Address(
        UserID=user_id,
        Street=data['street'],
        City=data['city'],
        State=data['state'],
        Zip=data['zip'],
        AddressType=data['type']
    )
    db.session.add(address)
    db.session.commit()
    return address

def get_user_by_id(user_id):
    return User.query.get(user_id)
