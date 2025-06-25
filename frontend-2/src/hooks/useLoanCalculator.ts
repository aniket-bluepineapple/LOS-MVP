"use client";
import { useMemo } from "react";

const rateMap = { 1: 14, 2: 15, 3: 16 } as const;

export function calcEmi(principal: number, tenureYears: 1 | 2 | 3) {
  const rate = rateMap[tenureYears];
  const monthlyRate = rate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  return principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -tenureMonths));
}

export function principalFromEmi(emi: number, tenureYears: 1 | 2 | 3) {
  const rate = rateMap[tenureYears];
  const monthlyRate = rate / 12 / 100;
  const tenureMonths = tenureYears * 12;
  return emi * (1 - Math.pow(1 + monthlyRate, -tenureMonths)) / monthlyRate;
}

export function useLoanCalculator(amount: number, tenureYears: 1 | 2 | 3) {
  return useMemo(() => {
    const rate = rateMap[tenureYears];
    const processingFee = Math.max(amount * 0.015, 999);
    const legalFee = 2000;
    const sanctionedMax = Number(localStorage.getItem("maxLoanAllowed")) || 0;
    const cashback = amount >= 0.8 * sanctionedMax ? amount * 0.0025 : 0;
    const emi = calcEmi(amount, tenureYears);
    const netDisbursed = amount - processingFee - legalFee + cashback;

    return { rate, processingFee, legalFee, cashback, emi, netDisbursed };
  }, [amount, tenureYears]);
}
