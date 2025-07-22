export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-green-700">
      <div className="text-4xl font-bold mb-4">Payment Successful!</div>
      <div className="text-lg mb-8">Thank you for your payment. Your transaction has been verified and recorded.</div>
      <a href="/" className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">Return Home</a>
    </div>
  );
} 