import { FC } from 'react'
import { UseFormRegisterReturn } from 'react-hook-form'

interface Props {
  label: string
  register: UseFormRegisterReturn
  type?: string
}

const TextInput: FC<Props> = ({ label, register, type = 'text' }) => (
  <div className="flex flex-col gap-1">
    <label className="text-sm font-medium">{label}</label>
    <input
      type={type}
      className="rounded-xl border border-gray-300 bg-white/20 p-2 text-black focus:border-blue-500 focus:outline-none"
      {...register}
    />
  </div>
)

export default TextInput
