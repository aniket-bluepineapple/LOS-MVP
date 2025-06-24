import { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  register: UseFormRegisterReturn
}

const MoneyInput: FC<Props> = ({ label, register }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <div className="flex rounded-xl border border-gray-300 bg-white/20 focus-within:border-blue-500">
      <span className="flex items-center px-2 text-black">₹</span>
      <input
        type="number"
        className="w-full rounded-r-xl bg-transparent p-2 text-black focus:outline-none"
        {...register}
      />
    </div>
  </div>
)

export default MoneyInput
