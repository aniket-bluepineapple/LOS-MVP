"use client";
import { useMemo } from "react";
import { useLoanCalculator } from "./useLoanCalculator";

export interface EmiEntry {
  month: number;
  date: string;
  principal: number;
  interest: number;
  total: number;
  balance: number;
}

export function useEmiSchedule(
  amount: number,
  tenureYears: 1 | 2 | 3,
  emiDay: number,
  cibilScore?: number
) {
  const { rate } = useLoanCalculator(amount, tenureYears, cibilScore);
  const monthlyRate = rate / 12 / 100;
  const months = tenureYears * 12;
  const emi =
    amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -months));

  const schedule = useMemo(() => {
    let balance = amount;
    const rows: EmiEntry[] = [];
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), emiDay);
    if (start <= today) {
      start.setMonth(start.getMonth() + 1);
    }
    let due = new Date(start);
    for (let i = 0; i < months; i++) {
      const interest = balance * monthlyRate;
      const principal = emi - interest;
      balance = Math.max(0, balance - principal);
      rows.push({
        month: i + 1,
        date: due.toLocaleDateString("en-CA"),
        principal,
        interest,
        total: principal + interest,
        balance,
      });
      due = new Date(due);
      due.setMonth(due.getMonth() + 1);
    }
    return rows;
  }, [amount, months, monthlyRate, emiDay, cibilScore]);

  return { emi, rate, schedule };
}