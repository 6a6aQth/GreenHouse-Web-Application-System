import { Suspense } from "react";
import StatusClient from "./StatusClient";

export default function PaymentStatusPage() {
  return (
    <Suspense>
      <StatusClient />
    </Suspense>
  );
} 