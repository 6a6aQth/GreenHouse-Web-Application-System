export default function QuoteStatus() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-lg text-red-600">
      Payment was cancelled or failed.<br />
      <button className="mt-4 underline" onClick={() => window.location.href = "/"}>Try Again</button>
    </div>
  );
} 