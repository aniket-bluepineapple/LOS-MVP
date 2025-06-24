"use client";

import { useEffect, useState } from "react";

export default function SanctionResult() {
  const [score, setScore] = useState("");
  const [maxLoan, setMaxLoan] = useState("");

  useEffect(() => {
    setScore(localStorage.getItem("cibilScore") || "");
    setMaxLoan(localStorage.getItem("maxLoanAllowed") || "");
  }, []);

  return (
    <div className="m-4 flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold">Sanction Result</h1>
      <p>Your CIBIL Score: {score}</p>
      <p>Maximum Loan You’re Eligible For: ₹{maxLoan}</p>
    </div>
  );
}
