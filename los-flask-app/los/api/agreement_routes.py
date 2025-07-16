from flask import Blueprint, request, jsonify, render_template
from fpdf import FPDF
from datetime import datetime
import os
from flask_cors import CORS
from los.models import db, Loan


from los.models import db, Document, User, LoanApplication, Loan

agreement_bp = Blueprint(
    "agreement",
    __name__,
    url_prefix="/api/agreements",
    template_folder="../templates",
)
CORS(agreement_bp)

@agreement_bp.route("/view", methods=["GET"])
def view_agreement():
    args = request.args
    required = [
        "BorrowerName",
        "Amount",
        "Tenure",
        "Rate",
        "Emi",
        "StartDate",
    ]
    missing = [k for k in required if k not in args]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400
    return render_template("agreement.html", **args)


@agreement_bp.route("/accept", methods=["POST"])
def accept_agreement():
    data = request.json or {}
    required = [
        "BorrowerName",
        "Amount",
        "Tenure",
        "Rate",
        "Emi",
        "StartDate",
        "ApplicationID",
    ]
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({"message": f"Missing fields: {', '.join(missing)}"}), 400

    user = None
    if "UserID" in data:
        user = User.query.get(data["UserID"])

    application = LoanApplication.query.get(data["ApplicationID"])
    if not application:
        return jsonify({"message": "Application not found"}), 404
    if user is None:
        user = User.query.get(application.UserID)

    start_date = datetime.strptime(data["StartDate"], "%Y-%m-%d").date()

    pdf = FPDF()
    borrower = data.get("BorrowerName")

    # Page 1 - summary with borrower name
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, txt="Loan Agreement", ln=1, align="C")
    pdf.ln(5)
    pdf.set_font("Arial", size=12)
    summary_lines = [
        f"Borrower: {borrower}",
        f"Application ID: {data['ApplicationID']}",
        f"Amount: {data['Amount']}",
        f"Tenure: {data['Tenure']} years",
        f"Interest Rate: {data['Rate']}%",
        f"EMI: {data['Emi']}",
        f"Start Date: {data['StartDate']}",
    ]
    for line in summary_lines:
        pdf.cell(0, 10, txt=line, ln=1)

    # Page 2 - detailed terms without borrower name
    pdf.add_page()
    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, txt="Terms and Conditions", ln=1, align="C")
    pdf.ln(5)
    pdf.set_font("Arial", size=12)
    detail_lines = [
        "The borrower agrees to repay the loan in equal monthly instalments",
        "including interest as specified above. Late payments may incur",
        "additional charges. This agreement is governed by applicable laws",
        "and complies with relevant Reserve Bank of India guidelines for",
        "consumer lending. All disputes are subject to jurisdiction of the",
        "lender's registered office. By signing, the borrower accepts the",
        "terms outlined herein and acknowledges the repayment schedule.",
    ]
    for line in detail_lines:
        pdf.multi_cell(0, 10, txt=line)

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

    loan = Loan(
        ApplicationID=application.ApplicationID,
        PrincipalAmount=data["Amount"],
        InterestRate=data["Rate"],
        Tenure=int(data["Tenure"]) * 12,
        Emi=data["Emi"],
        StartDate=start_date,
    )
    db.session.add(loan)
    db.session.commit()
    return jsonify({"message": "Agreement generated", "DocumentURL": filepath})



@agreement_bp.route("/", methods=["GET"])
def get_agreements():
    agreements = Loan.query.all()
    return jsonify([
        {
            "LoanID": p.LoanID,
            "ApplicationID": p.ApplicationID,
            "PrincipalAmount": p.PrincipalAmount,
            "InterestRate": p.InterestRate,
            "Tenure": str(p.Tenure),
            "StartDate": p.StartDate,
            "Status": p.Status,
            "Emi": str(p.Emi),
            "CreatedAt": p.CreatedAt,
            "UpdatedAt": p.UpdatedAt
        }
        for p in agreements
    ])