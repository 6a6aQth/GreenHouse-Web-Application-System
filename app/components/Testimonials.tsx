"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { SparklesCore } from "@/components/ui/sparkles";

export default function Testimonials() {
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
  ];

  const cards = testimonials.map((t) => ({
    quote: t.quote,
    name: t.name,
    title: `${t.role} - ${t.location}`,
  }));

  return (
    <section className="py-20 bg-[#f5f5dc] text-green-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative inline-block w-full">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 relative z-10">What Our Farmers Say</h2>
          <SparklesCore
            className="absolute inset-0 w-full h-full pointer-events-none"
            particleColor="#22c55e"
            particleDensity={80}
            minSize={1}
            maxSize={3}
            speed={3}
            background="transparent"
          />
          <p className="text-xl text-green-700 max-w-3xl mx-auto relative z-10">
            Real stories from farmers who transformed their agricultural practices
          </p>
        </div>
        <InfiniteMovingCards items={cards} direction="left" speed="fast" />
      </div>
    </section>
  );
}
