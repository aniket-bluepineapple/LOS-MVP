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
import { useRouter } from "next/navigation";

export default function SanctionResult() {
  const [score, setScore] = useState(0);
  const [sanctionedMax, setSanctionedMax] = useState(0);
  const [amount, setAmount] = useState(0);
  const [tenure, setTenure] = useState<1 | 2 | 3>(3);
  const [emiDay, setEmiDay] = useState(1);
  const [tenureMax, setTenureMax] = useState(0);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const cibilScore = Number(localStorage.getItem("cibilScore"));
    const loan = Number(localStorage.getItem("maxLoanAllowed"));
    setScore(isNaN(cibilScore) ? 0 : cibilScore);
    const roundedLoanAmount = isNaN(loan) ? 0 : Math.round(loan / 1000) * 1000;
    setSanctionedMax(roundedLoanAmount);
  }, []);

  const breakdown = useLoanCalculator(amount, tenure, score);
  const { schedule } = useEmiSchedule(amount, tenure, emiDay, score);

  useEffect(() => {
    const max = adjustMax(sanctionedMax, tenure, breakdown.rate);
    setTenureMax(max);
    setAmount((a) => (initialized ? Math.min(Math.max(a, 10000), max) : max));
    if (!initialized) setInitialized(true);
  }, [sanctionedMax, tenure, breakdown.rate, initialized]);

  const adjustMax = (base: number, yrs: 1 | 2 | 3, rate: number): number => {
    const r = rate / 12 / 100;
    const factor36 = (1 - Math.pow(1 + r, -36)) / r;
    const emiCap = base / factor36;
    const factorT = (1 - Math.pow(1 + r, -(yrs * 12))) / r;
    const raw = emiCap * factorT;
    const rounded = Math.round(raw / 1000) * 1000;
    return Math.max(10000, rounded);
  };

  const router = useRouter();

  const acceptOffer = () => {
    const borrower = localStorage.getItem("username") ?? "Borrower";
    const params = new URLSearchParams({
      BorrowerName: borrower,
      Amount: String(amount),
      Tenure: String(tenure),
      Rate: String(breakdown.rate),
      Emi: breakdown.emi.toFixed(2),
      StartDate: schedule[0]?.date || "",
    });
    router.push(`/agreement?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto mt-10 w-[95%] space-y-6 rounded-3xl bg-white/10 p-6 text-center backdrop-blur md:w-[60%]"
    >
      <h1 className="text-3xl font-bold">🎉 Your Offer Is Ready!</h1>
      <div className="flex justify-around">
        <motion.div className="w-1/2 p-4">
          <div className="rounded-3xl bg-white/20 p-4 shadow">
            <p className="text-sm">CIBIL Score</p>
            <p className="text-2xl font-bold">{score}</p>
          </div>
        </motion.div>
        <motion.div className="w-1/2 p-4">
          <div className="rounded-3xl bg-white/20 p-4 shadow">
            <p className="text-sm">Sanctioned Max ₹</p>
            <p className="text-2xl font-bold">{sanctionedMax}</p>
          </div>
        </motion.div>
      </div>
      <AmountSlider value={amount} max={tenureMax} onChange={setAmount} />
      <TenureSelector value={tenure} onChange={setTenure} />
      <EmiDateSelector value={emiDay} onChange={setEmiDay} />
      <CostBreakdownCard {...breakdown} amount={amount} />
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
