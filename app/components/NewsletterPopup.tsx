"use client"

import { X, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function NewsletterPopup({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const handleSubscribe = () => {
    // Optionally, add email validation or submission logic here
    localStorage.setItem('newsletterPopupDismissed', 'true')
    onClose()
  }
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl max-w-md w-full p-6 relative"
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.8, y: 50 }}
      >
        <button className="absolute top-4 right-4 text-slate-600 hover:text-slate-800" onClick={onClose}>
          <X />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-green-600" />
          <h4 className="text-lg font-semibold">Subscribe for tips & offers</h4>
        </div>

        <p className="text-sm text-slate-600 mb-4">
          Get smart-farming insights and exclusive discounts straight to your inbox.
        </p>

        <div className="flex gap-2">
          <Input placeholder="Your email" type="email" className="flex-1" value={email} onChange={e => setEmail(e.target.value)} />
          <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubscribe}>Subscribe</Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
