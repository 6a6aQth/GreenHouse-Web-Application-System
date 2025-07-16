"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useQuote } from "../context/QuoteContext"
import { useToast } from "@/hooks/use-toast"

export default function BookingForm() {
  const { items, clearQuote } = useQuote()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    region: "",
    notes: "",
  })

  // open whenever there’s at least one item
  const shouldShow = open && items.length > 0

  const handleNext = () => setStep((s) => s + 1)
  const handleBack = () => setStep((s) => s - 1)

  const submit = () => {
    toast({ title: "Request sent!", description: "We’ll contact you shortly." })
    clearQuote()
    setOpen(false)
    setStep(1)
  }

  return (
    <>
      {/* trigger button – you can move/ style this differently */}
      {items.length > 0 && (
        <Button
          className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 rounded-full shadow-lg"
          onClick={() => setOpen(true)}
        >
          Book / Quote ({items.length})
        </Button>
      )}

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
                  <Button className="w-full" onClick={submit}>
                    Submit Request
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
