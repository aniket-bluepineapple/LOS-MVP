import { useMutation } from '@tanstack/react-query'

export interface CibilResponse {
  cibilScore: number
  maxLoanAllowed: number
}

export function useCibil() {
  return useMutation<CibilResponse, Error, any>(async (data) => {
    const res = await fetch('/api/cibil', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Network error')
    return res.json()
  })
}
