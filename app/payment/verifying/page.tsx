import { Suspense } from "react";
import VerifyingClient from "./VerifyingClient";

export default function PaymentVerifyingPage() {
  return (
    <Suspense>
      <VerifyingClient />
    </Suspense>
  );
} 