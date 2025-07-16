"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import ProductsServices from "./components/ProductsServices"
import BookingForm from "./components/BookingForm"
import Learn from "./components/Learn"
import Testimonials from "./components/Testimonials"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import NewsletterPopup from "./components/NewsletterPopup"
import QuoteSummary from "./components/QuoteSummary"
import { QuoteProvider } from "./context/QuoteContext"

export default function Home() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowNewsletterPopup(true)
    }, 30000) // Show after 30 seconds

    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowNewsletterPopup(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <QuoteProvider>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main>
          <Hero />
          <About />
          <ProductsServices />
          <Learn />
          <Testimonials />
          <Contact />
        </main>
        <Footer />

        <AnimatePresence>
          {showNewsletterPopup && <NewsletterPopup onClose={() => setShowNewsletterPopup(false)} />}
        </AnimatePresence>

        <QuoteSummary />
        <BookingForm />
      </div>
    </QuoteProvider>
  )
}
