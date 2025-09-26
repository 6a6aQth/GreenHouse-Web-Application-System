"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useQuote } from "../context/QuoteContext";
import { useRouter } from "next/navigation";

export default function BookingForm({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const { items, clearQuote, currentQuoteRequestId, setCurrentQuoteRequestId } = useQuote();
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!form.name || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }
    if (items.length === 0) {
      setError("No items selected for quote.");
      setLoading(false);
      return;
    }

    let apiMethod = "POST";
    let apiUrl = "/api/quote-request";
    let payload: any = {
      userName: form.name,
      userEmail: form.email,
      userPhone: form.phone,
      notes: form.notes || null, // Add notes to the main quote request
    };

    if (currentQuoteRequestId) {
      apiMethod = "PATCH";
      payload.id = currentQuoteRequestId;
      // For PATCH, we need to explicitly send user details to update the existing quote request
      payload.userName = form.name;
      payload.userEmail = form.email;
      payload.userPhone = form.phone;
      payload.notes = form.notes || null;
      
      // For PATCH, we need to send items with their dbId (if available) for updates, or productId for new creations
      payload.items = items.map(item => ({
        id: item.dbId, // Use dbId for existing items
        productId: item.id, // Use productId for new items (if dbId is undefined)
        quantity: item.quantity,
        notes: form.notes || null, // Item-specific notes can be added here if needed
      }));
    } else {
      // For POST, we send all items to be created with the new quote request
      payload.items = items.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        notes: form.notes || null, // Item-specific notes can be added here if needed
      }));
    }

    try {
      const res = await fetch(apiUrl, {
        method: apiMethod,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        clearQuote();
        setOpen(false);
        router.push("/?quote=success");
        // If a new quote was created, update currentQuoteRequestId
        if (apiMethod === "POST") {
          const newQuoteRequest = await res.json();
          setCurrentQuoteRequestId(newQuoteRequest.id);
        }
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit request.");
      }
    } catch (err) {
      setError("Failed to submit request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <form className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative" onSubmit={handleSubmit}>
        <button type="button" className="absolute top-2 right-2 text-gray-400 hover:text-red-500" onClick={() => setOpen(false)}>
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4">Request a Quote</h2>
        <div className="mb-4">
          <Input name="name" placeholder="Your Name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Input name="email" type="email" placeholder="Your Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="mb-4">
          <Textarea name="notes" placeholder="Additional notes (optional)" value={form.notes} onChange={handleChange} />
        </div>
        {error && <div className="text-red-500 mb-2 text-sm">{error}</div>}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
          {loading ? "Submitting..." : "Submit Request"}
        </Button>
      </form>
    </div>
  );
} 