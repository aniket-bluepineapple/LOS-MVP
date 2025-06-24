export default function SanctionResult({
  searchParams,
}: {
  searchParams: { score?: string; maxLoan?: string };
}) {
  const { score = "", maxLoan = "" } = searchParams;
  return (
    <div className="m-4 flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold">Sanction Result</h1>
      <p>Your CIBIL Score: {score}</p>
      <p>Maximum Loan You’re Eligible For: ₹{maxLoan}</p>
    </div>
  );
}
