import { Suspense } from "react";
import QuoteVerifyingClient from "./QuoteVerifyingClient";

export default function QuoteVerifyingPage() {
  return (
    <Suspense>
      <QuoteVerifyingClient />
    </Suspense>
  );
} 