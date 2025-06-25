"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { BACKEND_URL } from "@/constants/layout";

export default function AgreementPage() {
  const params = useSearchParams();
  const router = useRouter();

  const borrower = params.get("BorrowerName") ?? "Borrower";
  const amount = params.get("Amount") ?? "";
  const tenure = params.get("Tenure") ?? "";
  const rate = params.get("Rate") ?? "";
  const emi = params.get("Emi") ?? "";
  const start = params.get("StartDate") ?? "";

  const accept = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/agreements/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BorrowerName: borrower,
          Amount: Number(amount),
          Tenure: Number(tenure),
          Rate: Number(rate),
          Emi: Number(emi),
          StartDate: start,
          ApplicationID: 1,
        }),
      });
      const data = await res.json();
      if (res.ok && data.DocumentURL) {
        window.open(`${BACKEND_URL}/${data.DocumentURL}`, "_blank");
        router.push("/sanction-result");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto mt-10 w-[95%] md:w-[60%] space-y-4 rounded-3xl bg-white/10 p-6 text-center backdrop-blur">
      <h1 className="text-3xl font-bold">Loan Agreement</h1>
      <p>Borrower: {borrower}</p>
      <p>Amount: {amount}</p>
      <p>Tenure: {tenure} years</p>
      <p>Interest Rate: {rate}%</p>
      <p>EMI: {emi}</p>
      <p>Start Date: {start}</p>
      <p>
        The borrower agrees to repay the loan in equal monthly instalments
        including interest as specified above. Late payments may incur
        additional charges. This agreement is governed by applicable laws.
      </p>
      <div className="flex justify-center gap-4">
        <button onClick={accept} className="rounded-full bg-blue-600 px-4 py-2 text-white">
          Accept & Download
        </button>
        <button onClick={() => router.back()} className="rounded-full bg-orange-500 px-4 py-2 text-white">
          Back
        </button>
      </div>
    </div>
  );
}