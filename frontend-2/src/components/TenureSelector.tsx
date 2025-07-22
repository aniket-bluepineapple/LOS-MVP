"use client";

interface TenureSelectorProps {
  value: 1 | 2 | 3;
  onChange: (val: 1 | 2 | 3) => void;
}

export default function TenureSelector({ value, onChange }: TenureSelectorProps) {
  return (
    <div className="space-y-2">
      <p className="font-medium">Select Tenure</p>
      <div className="flex justify-center gap-2">
        {[1, 2, 3].map((y) => (
          <button
            key={y}
            type="button"
            onClick={() => onChange(y as 1 | 2 | 3)}
            className={`rounded-full px-4 py-1 ${
              value === y ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
            }`}
          >
            {y}Y
          </button>
        ))}
      </div>
    </div>
  );
}
