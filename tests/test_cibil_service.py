import pytest
from flask import Flask
from los.models import db, CibilCache
from los.services.cibil_service import calc_cibil, get_or_create_by_pan


@pytest.fixture
def app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    db.init_app(app)
    with app.app_context():
        db.create_all()
        yield app


def test_calc_cibil_typical():
    result = calc_cibil({
        "pan": "TEST1234X",
        "salary": 50000,
        "age": 30,
        "existingEmis": 5000,
        "monthlyRent": 10000,
        "dependents": 1,
        "residenceType": "RENTED",
        "employmentType": "SALARIED",
    })
    assert 300 <= result.score <= 900
    assert 0 <= result.maxLoanAllowed <= 100000


def test_get_or_create_by_pan_cache(app):
    data = {
        "salary": 40000,
        "age": 30,
        "existingEmis": 5000,
        "monthlyRent": 8000,
        "dependents": 2,
        "residenceType": "RENTED",
        "employmentType": "SALARIED",
    }
    with app.app_context():
        res1 = get_or_create_by_pan("PAN12345X", data)
        res2 = get_or_create_by_pan("PAN12345X", data)
        assert res1.score == res2.score
        caches = CibilCache.query.filter_by(pan="PAN12345X").all()
        assert len(caches) == 1
