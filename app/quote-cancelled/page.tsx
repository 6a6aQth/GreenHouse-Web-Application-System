export default function QuoteCancelled() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow text-center">
        <h1 className="text-2xl font-bold mb-4 text-red-600">Payment Cancelled</h1>
        <p>Your payment was cancelled or failed. Please try again or contact support if you need help.</p>
      </div>
    </div>
  );
} 