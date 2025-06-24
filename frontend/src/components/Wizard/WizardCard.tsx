import { FC, PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

const WizardCard: FC<PropsWithChildren> = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
    className="rounded-3xl bg-white/10 p-6 backdrop-blur-md"
  >
    {children}
  </motion.div>
)

export default WizardCard
