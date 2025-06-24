export function useEmi(maxLoan: number, tenure: number) {
  if (!maxLoan || !tenure) return 0
  return Math.round(maxLoan / (tenure * 12))
}
