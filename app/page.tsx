"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import About from "./components/About"
import ProductsServices from "./components/ProductsServices"
import BookingForm from "./components/BookingForm"
import Testimonials from "./components/Testimonials"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import NewsletterPopup from "./components/NewsletterPopup"
import QuoteSummary from "./components/QuoteSummary"
import { QuoteProvider } from "./context/QuoteContext"
import { useSearchParams } from "next/navigation"

export default function Home() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)
  const [showQuoteBanner, setShowQuoteBanner] = useState(false)
  const [bookingOpen, setBookingOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Helper to check dismissal
    const isDismissed = () => localStorage.getItem('newsletterPopupDismissed') === 'true'
    if (isDismissed()) return

    const timer = setTimeout(() => {
      if (!isDismissed()) setShowNewsletterPopup(true)
    }, 30000)

    const handleScroll = () => {
      if (!isDismissed() && window.scrollY > window.innerHeight * 0.8) {
        setShowNewsletterPopup(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (searchParams.get("quote") === "success") {
      setShowQuoteBanner(true);
      const timer = setTimeout(() => setShowQuoteBanner(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleCloseNewsletterPopup = () => {
    setShowNewsletterPopup(false)
    localStorage.setItem('newsletterPopupDismissed', 'true')
  }

  return (
    <QuoteProvider>
      <div className="min-h-screen bg-white">
        {showQuoteBanner && (
          <div className="w-full bg-green-600 text-white text-center py-3 font-semibold shadow-md z-50">
            Your quote request was submitted successfully! We will contact you soon.
            <button className="ml-4 underline" onClick={() => setShowQuoteBanner(false)}>Dismiss</button>
          </div>
        )}
        <Navbar />
        <main>
          <Hero />
          <ProductsServices />
          <About />
          <Testimonials />
          <Contact />
        </main>
        <Footer />

        <AnimatePresence>
          {showNewsletterPopup && <NewsletterPopup onClose={handleCloseNewsletterPopup} />}
        </AnimatePresence>

        <QuoteSummary />
        <BookingForm open={bookingOpen} setOpen={setBookingOpen} />
      </div>
    </QuoteProvider>
  )
}
