"use client";
import { useCallback } from "react";

interface AmountSliderProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
}

const format = (n: number) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function AmountSlider({ value, max, onChange }: AmountSliderProps) {
  const handleChange = useCallback(
    (val: string) => {
      const num = Math.min(Math.max(10000, Number(val)), max);
      onChange(num);
    },
    [max, onChange]
  );

  return (
    <div className="space-y-2">
      <p className="font-medium">Select Loan Amount</p>
      <input
        type="range"
        min={10000}
        max={max}
        step={1000}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full"
      />
      <input
        type="number"
        min={10000}
        max={max}
        step={1000}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded border px-2 text-black"
      />
      <p className="text-sm">₹{format(value)}</p>
    </div>
  );
}
