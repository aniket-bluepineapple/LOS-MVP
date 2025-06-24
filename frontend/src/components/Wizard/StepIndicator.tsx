import { FC } from 'react'

interface StepIndicatorProps {
  current: number
  total: number
}

const StepIndicator: FC<StepIndicatorProps> = ({ current, total }) => (
  <div className="mb-4 flex items-center justify-center space-x-2 text-sm">
    {Array.from({ length: total }, (_, i) => (
      <div
        key={i}
        className={`h-2 w-2 rounded-full ${i <= current ? 'bg-blue-500' : 'bg-gray-400'}`}
      />
    ))}
  </div>
)

export default StepIndicator
