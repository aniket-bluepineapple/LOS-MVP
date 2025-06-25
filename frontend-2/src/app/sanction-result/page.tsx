"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AmountSlider from "@/components/AmountSlider";
import TenureSelector from "@/components/TenureSelector";
import CostBreakdownCard from "@/components/CostBreakdownCard";
import { useLoanCalculator } from "@/hooks/useLoanCalculator";
import EmiDateSelector from "@/components/EmiDateSelector";
import EmiScheduleTable from "@/components/EmiScheduleTable";
import { useEmiSchedule } from "@/hooks/useEmiSchedule";
import { BACKEND_URL } from "@/constants/layout";

export default function SanctionResult() {
  const [score, setScore] = useState(0);
  const [sanctionedMax, setSanctionedMax] = useState(0);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState<1 | 2 | 3>(1);
  const [emiDay, setEmiDay] = useState(1);

  useEffect(() => {
    const s = Number(localStorage.getItem("cibilScore"));
    const m = Number(localStorage.getItem("maxLoanAllowed"));
    setScore(isNaN(s) ? 0 : s);
    setSanctionedMax(isNaN(m) ? 0 : m);
    setAmount(isNaN(m) ? 0 : m);
  }, []);

  const breakdown = useLoanCalculator(amount, tenure);
  const { schedule } = useEmiSchedule(amount, tenure, emiDay);

  const acceptOffer = async () => {
    try {
      const borrower = localStorage.getItem("username") || "Borrower";
      const res = await fetch(`${BACKEND_URL}/api/agreements/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          BorrowerName: borrower,
          Amount: amount,
          Tenure: tenure,
          Rate: breakdown.rate,
          Emi: breakdown.emi.toFixed(2),
          StartDate: schedule[0]?.date,
        }),
      });
      const data = await res.json();
      if (res.ok && data.DocumentURL) {
        window.open(`${BACKEND_URL}/${data.DocumentURL}`, "_blank");
      }
      alert("Accepted");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto mt-10 w-[95%] md:w-[60%] space-y-6 rounded-3xl bg-white/10 p-6 text-center backdrop-blur"
    >
      <h1 className="text-3xl font-bold">🎉 Your Offer Is Ready!</h1>
      <div className="flex justify-around">
        <motion.div whileHover={{ rotateY: 180 }} className="w-1/2 p-4">
          <div className="rounded-3xl bg-white/20 p-4 shadow">
            <p className="text-sm">CIBIL Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
        </motion.div>
        <motion.div whileHover={{ rotateY: 180 }} className="w-1/2 p-4">
          <div className="rounded-3xl bg-white/20 p-4 shadow">
            <p className="text-sm">Sanctioned Max ₹</p>
            <p className="text-2xl font-bold">{sanctionedMax}</p>
          </div>
        </motion.div>
      </div>
      <AmountSlider value={amount} max={sanctionedMax} onChange={setAmount} />
      <TenureSelector value={tenure} onChange={setTenure} />
      <EmiDateSelector value={emiDay} onChange={setEmiDay} />
      <CostBreakdownCard {...breakdown} />
      <EmiScheduleTable schedule={schedule} />
      <div className="mt-4 flex justify-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={acceptOffer}
          className="rounded-full bg-blue-600 px-4 py-2 text-white"
        >
          Accept Offer
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => alert("Declined")}
          className="rounded-full bg-orange-500 px-4 py-2 text-white"
        >
          Decline
        </motion.button>
      </div>
    </motion.div>
  );
}
