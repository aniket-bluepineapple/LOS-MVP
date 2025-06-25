from flask import Blueprint, request, jsonify
from fpdf import FPDF
from los.models import db, Document, User
import os
from datetime import datetime

agreement_bp = Blueprint("agreement", __name__, url_prefix="/api/agreements")

@agreement_bp.route("/generate", methods=["POST"])
def generate_agreement():
    data = request.json or {}
    required = ["BorrowerName", "Amount", "Tenure", "Rate", "Emi", "StartDate"]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    user = None
    if "UserID" in data:
        user = User.query.get(data["UserID"])

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    borrower = data.get("BorrowerName")
    lines = [
        "Loan Agreement",
        "",
        f"Borrower: {borrower}",
        f"Amount: {data['Amount']}",
        f"Tenure: {data['Tenure']} years",
        f"Interest Rate: {data['Rate']}%",
        f"EMI: {data['Emi']}",
        f"Start Date: {data['StartDate']}",
        "",
        "The borrower agrees to repay the loan in equal monthly instalments",
        "including interest as specified above. Late payments may incur ",
        "additional charges. This agreement is governed by applicable laws.",
    ]
    for line in lines:
        pdf.cell(0, 10, txt=line, ln=1)

    os.makedirs("agreements", exist_ok=True)
    uid = data.get("UserID") if user else "generic"
    filename = f"agreement_{uid}_{int(datetime.utcnow().timestamp())}.pdf"
    filepath = os.path.join("agreements", filename)
    pdf.output(filepath)

    if user:
        doc = Document(
            UserID=user.UserID,
            DocumentType="Loan Agreement",
            DocumentURL=filepath,
            Status="Verified",
        )
        db.session.add(doc)
        db.session.commit()

    return jsonify({"message": "Agreement generated", "DocumentURL": filepath})
