"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyingClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tx_ref = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tx_ref) {
      setStatus("error");
      setError("Missing transaction reference.");
      return;
    }
    setStatus("verifying");
    setError(null);
    fetch(`/api/verify-payment?tx_ref=${tx_ref}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.replace("/payment/success"), 2000);
        } else {
          setStatus("error");
          setError(data.data?.message || "Payment verification failed.");
        }
      })
      .catch(() => {
        setStatus("error");
        setError("Could not connect to server.");
      });
  }, [tx_ref, router]);

  if (status === "verifying") {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg">
        <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-4"></span>
        Verifying your payment...
      </div>
    );
  }
  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg text-green-600">
        Payment verified! Redirecting...
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-lg text-red-600">
      Payment failed.<br />
      {error && <div className="mt-2 text-sm text-gray-700">{error}</div>}
      <button
        className="mt-4 underline text-green-700"
        onClick={() => router.replace(`/payment/verifying?tx_ref=${tx_ref}`)}
      >
        Retry
      </button>
    </div>
  );
} 