"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState("");
  const [rfqs, setRfqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "mike") {
      setAuthenticated(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  useEffect(() => {
    if (authenticated) {
      setLoading(true);
      fetch("/api/quote-request")
        .then((res) => res.json())
        .then((data) => setRfqs(data))
        .finally(() => setLoading(false));
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-xs flex flex-col gap-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Admin Login</h2>
          <Input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white">Login</Button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Admin Dashboard</h2>
        <p className="mb-4">Below are successful RFQ submissions.</p>
        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : rfqs.length === 0 ? (
          <div className="border rounded p-4 text-gray-500 text-center">No RFQs yet.</div>
        ) : (
          <div className="space-y-6">
            {rfqs.map((rfq) => (
              <div key={rfq.id} className="border rounded p-4">
                <div className="mb-2 font-semibold text-green-700">{rfq.userName} ({rfq.userEmail}, {rfq.userPhone})</div>
                <div className="text-sm text-gray-500 mb-2">Submitted: {new Date(rfq.createdAt).toLocaleString()}</div>
                <div className="mb-2">
                  <span className="font-semibold">Status:</span> {rfq.status}
                </div>
                <div>
                  <span className="font-semibold">Items:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {rfq.quoteItems.map((item: any) => (
                      <li key={item.id}>
                        {item.product?.name || "Unknown Product"} (Qty: {item.quantity})
                        <span className="text-xs text-gray-400 ml-2">[{item.product?.category}]</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 