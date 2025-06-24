import { useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useEmi } from '../hooks/useEmi'
import { motion } from 'framer-motion'

export default function SanctionResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = (location.state || { cibilScore: 0, maxLoanAllowed: 0 }) as {
    cibilScore: number
    maxLoanAllowed: number
  }
  const [tenure, setTenure] = useState(1)
  const emi = useEmi(data.maxLoanAllowed, tenure)

  return (
    <motion.div
      className="mx-auto flex min-h-screen max-w-md flex-col justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1 className="mb-4 text-3xl font-bold">Your Offer Is Ready!</h1>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div className="rounded-2xl bg-white/10 p-4 text-center">
          <p className="text-sm">CIBIL Score</p>
          <p className="text-2xl font-bold">{data.cibilScore}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-4 text-center">
          <p className="text-sm">Max Loan ₹</p>
          <p className="text-2xl font-bold">{data.maxLoanAllowed}</p>
        </div>
      </div>
      <div className="mb-4 flex justify-center gap-2">
        {[1, 2, 3].map((yr) => (
          <button
            key={yr}
            onClick={() => setTenure(yr)}
            className={`rounded-full px-3 py-1 ${tenure === yr ? 'bg-blue-600' : 'bg-gray-600'}`}
          >
            {yr} {yr === 1 ? 'Year' : 'Years'}
          </button>
        ))}
      </div>
      <p className="mb-6 text-center">EMI preview: ₹{emi} / mo</p>
      <div className="flex justify-center gap-4">
        <button className="rounded-xl bg-blue-600 px-4 py-2" onClick={() => alert('Accepted!')}>
          Accept Offer
        </button>
        <button className="rounded-xl bg-red-600 px-4 py-2" onClick={() => navigate('/')}>Decline</button>
      </div>
    </motion.div>
  )
}
