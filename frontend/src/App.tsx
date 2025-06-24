import { Route, Routes, Navigate } from 'react-router-dom'
import LoanApplicationForm from './pages/LoanApplicationForm'
import SanctionResultPage from './pages/SanctionResultPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/apply" replace />} />
      <Route path="/apply" element={<LoanApplicationForm />} />
      <Route path="/offer" element={<SanctionResultPage />} />
    </Routes>
  )
}

export default App
