import { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  options: { value: string | number; label: string }[]
  register: UseFormRegisterReturn
}

const SelectInput: FC<Props> = ({ label, options, register }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <select
      className="rounded-xl border border-gray-300 bg-white/20 p-2 text-black focus:border-blue-500 focus:outline-none"
      {...register}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
)

export default SelectInput
