"use client";

interface Props {
  value: number;
  onChange: (val: number) => void;
}

export default function EmiDateSelector({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <p className="font-medium">Select EMI Date</p>
      <select
        className="w-full rounded-3xl border border-gray-300 p-2"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      >
        {Array.from({ length: 28 }, (_, i) => i + 1).map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </select>
    </div>
  );
}