"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface QuoteItem {
  id: number | string
  dbId?: number // Add dbId to store the database ID of the QuoteItem
  name: string
  category: string
  price: string
  quantity: number
}

interface QuoteContextValue {
  items: QuoteItem[]
  addToQuote: (item: Omit<QuoteItem, "quantity" | "dbId">) => void
  removeFromQuote: (id: QuoteItem["id"]) => void
  updateQuoteItemQuantity: (id: QuoteItem["id"], quantity: number) => void
  clearQuote: () => void
  currentQuoteRequestId: number | null // Add currentQuoteRequestId
}

const QuoteContext = createContext<QuoteContextValue | null>(null)

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [currentQuoteRequestId, setCurrentQuoteRequestId] = useState<number | null>(null) // State to hold the active quote request ID

  const addToQuote = (item: Omit<QuoteItem, "quantity" | "dbId">) => {
    // Check if item already exists in local state to prevent duplicate entries
    const existingLocalItem = items.find((x) => x.id === item.id);
    if (existingLocalItem) {
      return; // If item already exists, do nothing.
    }

    // Only update local state. Database interaction will happen via BookingForm or specific PATCH/DELETE.
    setItems((prev) => [
      ...prev,
      { 
        ...item,
        quantity: 1,
        dbId: undefined // dbId will be assigned when the quote is saved to the DB
      }
    ]);
  }

  const removeFromQuote = async (id: QuoteItem["id"]) => {
    const itemToRemove = items.find(item => item.id === id);
    if (!itemToRemove) return;

    // Remove from local state
    setItems((prev) => prev.filter((x) => x.id !== id));

    // If there's an active quote request and the item has a dbId, delete from DB
    if (currentQuoteRequestId !== null && itemToRemove.dbId !== undefined) {
      try {
        const response = await fetch(`/api/quote-request?quoteRequestId=${currentQuoteRequestId}&itemId=${itemToRemove.dbId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error("Failed to delete quote item from DB:", await response.text());
        }
      } catch (error) {
        console.error("Error deleting quote item from DB:", error);
      }
    }
  }

  const updateQuoteItemQuantity = async (id: QuoteItem["id"], quantity: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item))
    )

    if (currentQuoteRequestId === null) {
      console.warn("Cannot update quantity: No active quote request ID found. Database update will occur on form submission.");
      return;
    }

    try {
      const existingQuoteItem = items.find(item => item.id === id);
      if (!existingQuoteItem || existingQuoteItem.dbId === undefined) {
        console.error("Cannot update quantity: Quote item not found or missing dbId.");
        return;
      }
      
      await fetch(`/api/quote-request`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: currentQuoteRequestId, 
          items: [{
            id: existingQuoteItem.dbId, 
            quantity: Math.max(1, quantity)
          }],
        }),
      });
    } catch (error) {
      console.error("Failed to update quote item quantity in DB:", error);
    }
  }

  const clearQuote = () => {
    setItems([])
    setCurrentQuoteRequestId(null) // Clear the quote request ID when clearing the quote
  }

  return (
    <QuoteContext.Provider value={{ items, addToQuote, removeFromQuote, updateQuoteItemQuantity, clearQuote, currentQuoteRequestId }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider")
  return ctx
}

