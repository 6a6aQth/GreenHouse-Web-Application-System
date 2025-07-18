"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useQuote } from "../context/QuoteContext"
import { useToast } from "@/hooks/use-toast"

export default function BookingForm({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) {
  const { items, clearQuote } = useQuote()
  const { toast } = useToast()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false);

  // open whenever there’s at least one item
  const shouldShow = open && items.length > 0

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  // PayChangu Standard Checkout integration
  const payChanguCheckout = async () => {
    // Example: Calculate total fee (for demo, use 1000 MWK per item)
    const amount = items.length * 1000;
    const tx_ref = `rqf-${Date.now()}-${Math.floor(Math.random()*10000)}`;
    const payload = {
      amount,
      currency: "MWK",
      email: form.email,
      first_name: form.name.split(" ")[0] || form.name,
      last_name: form.name.split(" ").slice(1).join(" ") || "-",
      callback_url: "https://greenhouse.midascreed.com/api/paychangu-callback",
      return_url: "https://greenhouse.midascreed.com/quote-cancelled",
      tx_ref,
      customization: {
        title: "Quotation Fee",
        description: `Quote for: ${items.map(i => i.name).join(", ")}`,
      },
      meta: {
        phone: form.phone,
        region: form.region,
        notes: form.notes,
        items: items.map(i => i.name).join(", ")
      }
    };
    try {
      const res = await fetch("/api/paychangu-initiate", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data?.data?.checkout_url) {
        window.location.href = data.data.checkout_url;
      } else {
        toast({ title: "Payment Error", description: data.message || "Could not initiate payment." });
      }
    } catch (err) {
      toast({ title: "Payment Error", description: "Could not connect to payment gateway." });
    }
  }

  const submitQuoteRequest = async () => {
    try {
      const res = await fetch("/api/quote-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userName: form.name,
          userEmail: form.email,
          userPhone: form.phone,
          items: items.map((it) => ({ productId: Number(it.id), quantity: 1 })),
        }),
      });
      if (res.ok) {
        toast({ title: "Quote Request Submitted!", description: "We have received your request and will respond soon." });
        clearQuote();
        setOpen(false);
        setStep(1);
      } else {
        toast({ title: "Submission Error", description: "Failed to submit quote request." });
      }
    } catch (err) {
      toast({ title: "Submission Error", description: "Could not connect to server." });
    }
  };

  const submit = async () => {
    setLoading(true);
    await payChanguCheckout();
    await submitQuoteRequest();
    setLoading(false);
  }

  return (
    <>
      {/* trigger button removed */}
      <AnimatePresence>
        {shouldShow && (
          <motion.div
            key="modal"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white max-w-lg w-full rounded-xl p-6 relative"
              initial={{ scale: 0.85, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 50 }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-slate-600 hover:text-slate-800"
              >
                <X />
              </button>

              {/* Steps */}
              {step === 1 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Your Details</h3>
                  <div className="space-y-4">
                    <Input
                      placeholder="Full name"
                      name="name"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Email address"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Phone number"
                      name="phone"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      required
                    />
                    <Input
                      placeholder="Region / District"
                      name="region"
                      value={form.region}
                      onChange={(e) => setForm({ ...form, region: e.target.value })}
                    />
                  </div>
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleNext} disabled={!form.name || !form.email}>
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Additional Notes</h3>
                  <Textarea
                    placeholder="Delivery preferences or notes"
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  />

                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={handleBack}>
                      Back
                    </Button>
                    <Button onClick={handleNext}>Summary</Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Review & Submit</h3>
                  <div className="border rounded-md p-4 mb-4 max-h-40 overflow-y-auto">
                    {items.map((it) => (
                      <div key={it.id} className="flex justify-between py-1">
                        <span>{it.name}</span>
                        <span className="text-sm text-slate-500">{it.price}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" onClick={submit} disabled={loading}>
                    {loading ? "Processing..." : "Pay"}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
