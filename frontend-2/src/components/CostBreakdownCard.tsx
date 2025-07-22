"use client";
import { motion } from "framer-motion";

export interface Breakdown {
  emi: number;
  rate: number;
  processingFee: number;
  legalFee: number;
  cashback: number;
  netDisbursed: number;
  amount?: number;
}

const format = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function CostBreakdownCard({
  emi,
  rate,
  processingFee,
  legalFee,
  cashback,
  netDisbursed,
  amount,
}: Breakdown) {
  return (
    <motion.div layout className="rounded-3xl bg-white/20 p-4 shadow">
      <table className="w-full text-left">
        <tbody>
          {amount !== undefined && (
            <tr>
              <td className="py-1">Loan Amount</td>
              <td className="py-1 text-right">₹{format(Math.round(amount))}</td>
            </tr>
          )}
          <tr>
            <td className="py-1">EMI</td>
            <td className="py-1 text-right">₹{format(Math.round(emi))}</td>
          </tr>
          <tr>
            <td className="py-1">Interest %</td>
            <td className="py-1 text-right">{rate.toFixed(2)} % p.a.</td>
          </tr>
          <tr>
            <td className="py-1">Processing</td>
            <td className="py-1 text-right">₹{format(Math.round(processingFee))}</td>
          </tr>
          <tr>
            <td className="py-1">Legal Fee</td>
            <td className="py-1 text-right">₹{format(Math.round(legalFee))}</td>
          </tr>
          <tr>
            <td className="py-1">Cashback</td>
            <td className="py-1 text-right">-₹{format(Math.round(cashback))}</td>
          </tr>
          <tr>
            <td className="py-1 font-semibold">Net Receive</td>
            <td className="py-1 text-right font-semibold">
              ₹{format(Math.round(netDisbursed))}
            </td>
          </tr>
        </tbody>
      </table>
    </motion.div>
  );
}
