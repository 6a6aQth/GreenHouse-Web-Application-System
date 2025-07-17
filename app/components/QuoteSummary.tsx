"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingCart, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useQuote } from "../context/QuoteContext"

export default function QuoteSummary() {
  const { items, removeFromQuote, clearQuote } = useQuote()
  const [open, setOpen] = useState(false)

  console.log('QuoteSummary items:', items);

  return (
    <>
      {/* Floating icon */}
      {items.length > 0 && (
        <Button
          variant="outline"
          className="fixed bottom-8 right-8 z-50 bg-white border-green-600 text-green-600 hover:bg-green-50 rounded-full h-14 w-14 p-0 flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out animate-bounce-slow"
          onClick={() => setOpen(true)}
        >
          <ShoppingCart className="w-7 h-7" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {items.length}
            </span>
          )}
        </Button>
      )}

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween" }}
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h4 className="font-semibold">Your Quote ({items.length})</h4>
              <button onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((it) => (
                <div key={it.id} className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{it.name}</p>
                    <p className="text-xs text-slate-500">{it.category}</p>
                  </div>
                  <button className="text-slate-400 hover:text-red-500" onClick={() => removeFromQuote(it.id)}>
                    <X size={16} />
                  </button>
                </div>
              ))}

              {items.length === 0 && <p className="text-sm text-slate-500">No items selected.</p>}
            </div>

            {items.length > 0 && (
              <div className="p-4 border-t flex gap-2">
                <Button className="flex-1 bg-green-600 hover:bg-green-700" onClick={() => setOpen(false)}>
                  Continue
                </Button>
                <Button variant="outline" className="flex-1 bg-transparent" onClick={clearQuote}>
                  Clear
                </Button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}
