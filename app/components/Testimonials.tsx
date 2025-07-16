"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const testimonials = [
    {
      id: 1,
      name: "James Mwale",
      location: "Lilongwe, Malawi",
      role: "Tomato Farmer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote:
        "Our yields tripled with the Smart Tunnel! The support team helped install in just 3 days. My tomato production has never been better.",
      rating: 5,
      crop: "Tomatoes",
    },
    {
      id: 2,
      name: "Grace Banda",
      location: "Blantyre, Malawi",
      role: "Vegetable Farmer",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b332c1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote:
        "The greenhouse technology transformed our farming. We now grow vegetables year-round and our income has increased by 250%.",
      rating: 5,
      crop: "Mixed Vegetables",
    },
    {
      id: 3,
      name: "Peter Phiri",
      location: "Mzuzu, Malawi",
      role: "Commercial Farmer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote:
        "Smart Agri Solutions provided excellent consultation and financing support. Their irrigation system reduced our water costs significantly.",
      rating: 5,
      crop: "Lettuce & Herbs",
    },
    {
      id: 4,
      name: "Mary Tembo",
      location: "Zomba, Malawi",
      role: "Smallholder Farmer",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      quote:
        "The solar dryer has been a game-changer for preserving our harvest. Post-harvest losses dropped from 30% to just 5%.",
      rating: 5,
      crop: "Maize & Beans",
    },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1))
    }, 5000)

    return () => clearInterval(timer)
  }, [testimonials.length])

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  }

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-green-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">What Our Farmers Say</h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto">
            Real stories from farmers who transformed their agricultural practices
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                      <div className="relative">
                        <img
                          src={testimonials[currentIndex].image || "/placeholder.svg"}
                          alt={testimonials[currentIndex].name}
                          className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/30"
                        />
                        <div className="absolute -top-2 -right-2 bg-green-400 p-2 rounded-full">
                          <Quote className="w-4 h-4 text-green-800" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Rating */}
                      <div className="flex justify-center md:justify-start mb-4">
                        {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg md:text-xl leading-relaxed mb-6 italic">
                        "{testimonials[currentIndex].quote}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold">{testimonials[currentIndex].name}</h4>
                        <p className="text-green-200">{testimonials[currentIndex].role}</p>
                        <p className="text-green-100 text-sm">{testimonials[currentIndex].location}</p>
                        <div className="inline-block bg-green-500/30 px-3 py-1 rounded-full text-sm mt-2">
                          Growing: {testimonials[currentIndex].crop}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentIndex ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
        >
          {[
            { number: "500+", label: "Happy Farmers" },
            { number: "300%", label: "Average Yield Increase" },
            { number: "50%", label: "Water Savings" },
            { number: "95%", label: "Customer Satisfaction" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.number}</div>
              <div className="text-green-200 text-sm md:text-base">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
