"use client";
import { useSearchParams, useRouter } from "next/navigation";

export default function PaymentStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status");
  const tx_ref = searchParams.get("tx_ref");

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-red-700">
        <div className="text-4xl font-bold mb-4">Payment Failed</div>
        <div className="text-lg mb-8">Your payment was not successful. Please try again.</div>
        <button
          className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          onClick={() => router.replace(`/payment/verifying?tx_ref=${tx_ref}`)}
        >
          Retry Payment
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-700">
      <div className="text-4xl font-bold mb-4">Payment Status</div>
      <div className="text-lg mb-8">Status: {status || "Unknown"}</div>
      <a href="/" className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">Return Home</a>
    </div>
  );
} 