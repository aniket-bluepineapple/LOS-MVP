"use client";
import { EmiEntry } from "@/hooks/useEmiSchedule";
import { motion } from "framer-motion";

interface Props {
  schedule: EmiEntry[];
}

const format = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function EmiScheduleTable({ schedule }: Props) {
  return (
    <motion.div layout className="max-h-64 overflow-auto rounded-3xl bg-white/20 p-4 shadow mt-4">
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="py-1">#</th>
            <th className="py-1">Date</th>
            <th className="py-1 text-right">Principal</th>
            <th className="py-1 text-right">Interest</th>
            <th className="py-1 text-right">Total</th>
            <th className="py-1 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((e) => (
            <tr key={e.month}>
              <td className="py-1">{e.month}</td>
              <td className="py-1">{e.date}</td>
              <td className="py-1 text-right">₹{format(e.principal)}</td>
              <td className="py-1 text-right">₹{format(e.interest)}</td>
              <td className="py-1 text-right">₹{format(e.total)}</td>
              <td className="py-1 text-right">₹{format(Math.max(e.balance,0))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}