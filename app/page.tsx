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
import { Suspense } from "react";
import QuoteBannerWithParams from "./components/QuoteBannerWithParams";

export default function Home() {
  const [showNewsletterPopup, setShowNewsletterPopup] = useState(false)
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

  const handleCloseNewsletterPopup = () => {
    setShowNewsletterPopup(false)
    localStorage.setItem('newsletterPopupDismissed', 'true')
  }

  return (
    <QuoteProvider>
      <div className="min-h-screen bg-white">
        <Suspense>
          <QuoteBannerWithParams />
        </Suspense>
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
