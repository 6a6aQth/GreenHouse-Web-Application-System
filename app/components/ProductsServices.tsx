"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Tent, Shield, Droplets, Wrench, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuote } from "../context/QuoteContext"

export default function ProductsServices() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { addToQuote } = useQuote()

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "greenhouses", name: "Greenhouses", icon: Home },
    { id: "tunnels", name: "Tunnels", icon: Tent },
    { id: "nethouses", name: "Nethouses", icon: Shield },
    { id: "irrigation", name: "Irrigation", icon: Droplets },
    { id: "accessories", name: "Accessories", icon: Wrench },
  ]

  const products = [
    {
      id: 1,
      category: "greenhouses",
      name: "TG8 Fixed Vent Greenhouse",
      description: "8m span, 7m height, 2-4m arch spacing, 25kg/sqm load capacity",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["8m span", "7m height", "25kg/sqm load"],
      price: "Quote on request",
    },
    {
      id: 2,
      category: "greenhouses",
      name: "TG10 Fixed Vent Greenhouse",
      description: "10m span greenhouse with same specifications as TG8",
      image:
        "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["10m span", "7m height", "25kg/sqm load"],
      price: "Quote on request",
    },
    {
      id: 3,
      category: "tunnels",
      name: "TTV8 Fixed Vent Tunnel",
      description: "10m span, 3.5m high, 25kg/sqm load, 115cm vent height",
      image:
        "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["10m span", "3.5m height", "115cm vent"],
      price: "Quote on request",
    },
    {
      id: 4,
      category: "tunnels",
      name: "TT8 & TT10 Tunnels",
      description: "Up to 35m length, 2-3m arch spacing options",
      image:
        "https://images.unsplash.com/photo-1592419044706-39796d40f98c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["Up to 35m length", "2-3m arch spacing"],
      price: "Quote on request",
    },
    {
      id: 5,
      category: "nethouses",
      name: "NH4 Nethouse",
      description: "4m pole spacing, 3m height, with/without trellising options",
      image:
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["4m pole spacing", "3m height", "Trellising optional"],
      price: "Quote on request",
    },
    {
      id: 6,
      category: "accessories",
      name: "Shade Nets",
      description: "Available in 40%, 50%, 60%, 75%, 80% shade options",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["Multiple shade %", "Various sizes"],
      price: "Quote on request",
    },
    {
      id: 7,
      category: "irrigation",
      name: "Drip Irrigation Systems",
      description: "Manual & automatic systems with filters & dosing equipment",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["Manual/Automatic", "Filters included", "Dosing equipment"],
      price: "Quote on request",
    },
    {
      id: 8,
      category: "accessories",
      name: "Crop Support Kit",
      description: "Clips, hooks, trellising twine, cluster kits, truss arches",
      image:
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      specs: ["Complete kit", "Various accessories"],
      price: "Quote on request",
    },
  ]

  const filteredProducts =
    activeCategory === "all" ? products : products.filter((product) => product.category === activeCategory)

  const handleBookNow = (product: (typeof products)[0]) => {
    addToQuote({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
    })
  }

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Products & Services</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive agricultural solutions for modern farming
          </p>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300 ${
                activeCategory === category.id
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "border-green-600 text-green-600 hover:bg-green-50"
              }`}
            >
              <category.icon className="w-4 h-4" />
              {category.name}
            </Button>
          ))}
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 group overflow-hidden">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                      {categories.find((cat) => cat.id === product.category)?.name}
                    </Badge>
                  </div>

                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                      {product.name}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{product.description}</p>

                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {product.specs.map((spec, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-green-600">{product.price}</span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          onClick={() => handleBookNow(product)}
                        >
                          Book Now
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Services Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold text-slate-800 mb-8">Additional Services</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Farm Design Consulting",
                description: "Professional farm layout and design services",
                icon: "🏗️",
              },
              {
                title: "Greenhouse Loan Support",
                description: "Assistance with financing your greenhouse project",
                icon: "💰",
              },
              {
                title: "Business Advisory",
                description: "Strategic guidance for agricultural businesses",
                icon: "📊",
              },
            ].map((service, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="text-4xl mb-4">{service.icon}</div>
                  <h4 className="text-xl font-bold text-slate-800 mb-3">{service.title}</h4>
                  <p className="text-slate-600">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
