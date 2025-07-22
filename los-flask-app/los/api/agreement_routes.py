from flask import Blueprint, request, jsonify, render_template
from fpdf import FPDF
from datetime import datetime
import os
from flask_cors import CORS
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


    # Create PDF
    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(0, 10, "Loan Agreement", ln=1, align="C")

    pdf.ln(10)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Loan Summary", ln=1)
    pdf.set_font("Arial", "", 12)

    summary_fields = [
        ("Application ID", data["ApplicationID"]),
        ("Amount", f"Rs. {data['Amount']}"),
        ("Tenure", f"{data['Tenure']} years"),
        ("Interest Rate", f"{data['Rate']}%"),
        ("EMI", f"Rs. {data['Emi']}"),
        ("Start Date", data["StartDate"]),
    ]

    col_widths = [60, 120]
    for label, value in summary_fields:
        pdf.set_font("Arial", "B", 12)
        pdf.cell(col_widths[0], 10, str(label), border=1)
        pdf.set_font("Arial", "", 12)
        pdf.cell(col_widths[1], 10, str(value), border=1, ln=1)

    pdf.ln(10)

    pdf.set_font("Arial", "B", 14)
    pdf.cell(0, 10, "Terms and Conditions", ln=1)
    pdf.set_font("Arial", "", 12)

    line_height = 8
    cell_width = 190

    terms = [
        "1. The borrower agrees to repay the loan in equal monthly instalments (EMI).",
        "2. EMIs include interest as per the agreed rate.",
        "3. Late payments may incur additional charges.",
        "4. This agreement is governed by applicable laws and RBI guidelines.",
        "5. All disputes are subject to the jurisdiction of the lender's registered office.",
        "6. By signing, the borrower accepts the terms and repayment schedule.",
    ]

    for term in terms:
        pdf.multi_cell(cell_width, line_height, term)
        pdf.ln(2)

    pdf.ln(20)

    pdf.cell(0, 10, "Borrower Signature: _______________________", ln=1)
    pdf.cell(0, 10, f"Date: {datetime.now().strftime('%Y-%m-%d')}", ln=1)


    os.makedirs("agreements", exist_ok=True)
    uid = data.get("ApplicationID") if user else "generic"
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
    return jsonify(
        [
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
                "UpdatedAt": p.UpdatedAt,
            }
            for p in agreements
        ]
    )
