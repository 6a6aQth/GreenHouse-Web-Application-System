"use client";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function QuoteBannerWithParams() {
  const [showQuoteBanner, setShowQuoteBanner] = useState(false);
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("quote") === "success") {
      setShowQuoteBanner(true);
      const timer = setTimeout(() => setShowQuoteBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);
  if (!showQuoteBanner) return null;
  return (
    <div className="w-full bg-green-600 text-white text-center py-3 font-semibold shadow-md z-50">
      Your quote request was submitted successfully! We will contact you soon.
      <button className="ml-4 underline" onClick={() => setShowQuoteBanner(false)}>Dismiss</button>
    </div>
  );
} 