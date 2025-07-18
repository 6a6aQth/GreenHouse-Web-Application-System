"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function QuoteVerifying() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tx_ref = searchParams.get("tx_ref");
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying");

  useEffect(() => {
    if (!tx_ref) {
      setStatus("error");
      return;
    }
    fetch(`/api/verify-payment?tx_ref=${tx_ref}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStatus("success");
          setTimeout(() => router.replace("/?quote=success"), 2000);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [tx_ref, router]);

  if (status === "verifying") return <div className="min-h-screen flex items-center justify-center text-lg">Verifying your payment...</div>;
  if (status === "success") return <div className="min-h-screen flex items-center justify-center text-lg text-green-600">Payment verified! Redirecting...</div>;
  return <div className="min-h-screen flex flex-col items-center justify-center text-lg text-red-600">Payment failed.<button className="mt-4 underline" onClick={() => router.replace("/")}>Try Again</button></div>;
} 