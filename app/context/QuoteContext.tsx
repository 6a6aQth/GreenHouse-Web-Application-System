"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface QuoteItem {
  id: number | string
  name: string
  category: string
  price: string
}

interface QuoteContextValue {
  items: QuoteItem[]
  addToQuote: (item: QuoteItem) => void
  removeFromQuote: (id: QuoteItem["id"]) => void
  clearQuote: () => void
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])

  const addToQuote = (item: QuoteItem) =>
    setItems((prev) => (prev.find((x) => x.id === item.id) ? prev : [...prev, item]))

  const removeFromQuote = (id: QuoteItem["id"]) => setItems((prev) => prev.filter((x) => x.id !== id))

  const clearQuote = () => setItems([])

  return (
    <QuoteContext.Provider value={{ items, addToQuote, removeFromQuote, clearQuote }}>{children}</QuoteContext.Provider>
  )
}

export const useQuote = () => {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider")
  return ctx
}
