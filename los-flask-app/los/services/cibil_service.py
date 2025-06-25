from dataclasses import dataclass
from datetime import datetime
from typing import Dict

from ..models import db, CibilCache

# Weight constants add up to 100
WEIGHTS = {
    "salary": 35,
    "age": 15,
    "emi": 15,
    "rent": 10,
    "dependents": 10,
    "residence": 15,
}


@dataclass
class CibilResult:
    pan: str
    score: int
    maxLoanAllowed: float


def _clamp(value: float, min_value: float, max_value: float) -> float:
    return max(min_value, min(max_value, value))


def calc_cibil(input: Dict) -> CibilResult:
    """Calculate CIBIL score based on applicant information."""
    salary = float(input.get("salary", 0))
    age = int(input.get("age", 0))
    existing_emis = float(input.get("existingEmis", 0))
    monthly_rent = float(input.get("monthlyHomeRent", 0))
    dependents = int(input.get("dependents", 0))
    residence_type = input.get("residenceType", "OWNED")

    pct = 0.0
    pct += _clamp(salary / 100000, 0, 1) * WEIGHTS["salary"]

    if 25 <= age <= 45:
        pct += WEIGHTS["age"]
    elif 18 <= age < 25 or 45 < age <= 60:
        pct += WEIGHTS["age"] * 0.5

    pct += (1 - _clamp(existing_emis / 50000, 0, 1)) * WEIGHTS["emi"]

    if residence_type == "RENTED":
        pct += (1 - _clamp(monthly_rent / 50000, 0, 1)) * WEIGHTS["rent"]
    else:
        pct += WEIGHTS["rent"]

    pct += (1 - _clamp(dependents / 5, 0, 1)) * WEIGHTS["dependents"]

    pct += WEIGHTS["residence"] if residence_type == "OWNED" else WEIGHTS["residence"] * 0.9


    score = int(300 + pct * 6)

    # Allowed EMI is 40-60% of salary depending on score
    emi_fraction = 0.4 + (score - 300) / 600 * 0.2
    emi_fraction = _clamp(emi_fraction, 0.4, 0.6)
    allowed_total_emi = salary * emi_fraction
    new_emi_capacity = allowed_total_emi - existing_emis
    if new_emi_capacity <= 0:
        max_loan = 0.0
    else:
        r = 16 / 12 / 100  # default rate for 3 year tenure
        n = 36
        max_loan = new_emi_capacity * (1 - (1 + r) ** -n) / r
    max_loan = _clamp(max_loan, 0, 100_000)

    return CibilResult(
        pan=input.get("pan"), score=score, maxLoanAllowed=float(max_loan)
    )


def get_or_create_by_pan(pan: str, applicant_data: Dict) -> CibilResult:
    cache = CibilCache.query.filter_by(pan=pan).first()
    if cache:
        return CibilResult(
            pan=pan, score=cache.score, maxLoanAllowed=float(cache.max_loan)
        )

    result = calc_cibil({**applicant_data, "pan": pan})
    new_cache = CibilCache(
        pan=pan,
        score=result.score,
        max_loan=result.maxLoanAllowed,
        created_at=datetime.utcnow(),
    )
    db.session.add(new_cache)
    db.session.commit()
    return result
