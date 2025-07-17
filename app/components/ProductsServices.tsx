"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Tent, Shield, Droplets, Wrench, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useQuote } from "../context/QuoteContext"
// Import ShineBorder from Magic UI
import { ShineBorder } from "@/components/ui/ShineBorder";
import { FocusCards } from "@/components/ui/focus-cards";
import { SparklesCore } from "@/components/ui/sparkles";

export default function ProductsServices() {
  const [activeCategory, setActiveCategory] = useState("all")
  const { addToQuote } = useQuote()
  const [products, setProducts] = useState<Array<{
    id: number;
    category: string;
    name: string;
    description: string;
    image: string;
    specs: string[];
    price: string;
  }>>([]);

  const categories = [
    { id: "all", name: "All Products", icon: Package },
    { id: "greenhouses", name: "Greenhouses", icon: Home },
    { id: "tunnels", name: "Tunnels", icon: Tent },
    { id: "nethouses", name: "Nethouse", icon: Shield },
    { id: "irrigation", name: "Irrigation", icon: Droplets },
    { id: "accessories", name: "Accessories", icon: Wrench },
  ]

  // New products/services data
  const defaultProducts = [
    // Greenhouses/Tunnels
    {
      id: 1,
      category: "tunnels",
      name: "TTV8 Fixed Vent",
      description: "High tunnel up to 3.5m, span 8m, distance between arch 2m or 3m, minimum length 8m, vent 1.15m, loading capacity 25kg/sqm",
      image: "/TTV8 Fixed Vent Tunnel.jpg",
      specs: ["3.5m high", "8m span", "2m/3m arch", "8m+ length", "1.15m vent", "25kg/sqm"],
      price: "Quote on request",
    },
    {
      id: 2,
      category: "tunnels",
      name: "TT8",
      description: "High tunnel up to 3.5m, span 8m, distance between arch 2m or 3m, minimum length 8m, vent 1.15m, loading capacity 25kg/sqm",
      image: "/TT8 Tunnel.jpg",
      specs: ["3.5m high", "8m span", "2m/3m arch", "8m+ length", "1.15m vent", "25kg/sqm"],
      price: "Quote on request",
    },
    {
      id: 3,
      category: "tunnels",
      name: "TT10",
      description: "High tunnel up to 3.5m, span 10m, distance between arch 2m or 3m, minimum length, loading capacity 25kg/sqm",
      image: "/TT10  Tunnel.jpg",
      specs: ["3.5m high", "10m span", "2m/3m arch", "25kg/sqm"],
      price: "Quote on request",
    },
    // Nethouse
    {
      id: 4,
      category: "nethouses",
      name: "NH4",
      description: "Pole spacing 4m, height 3m, without trellising",
      image: "/NH4 Nethouse.webp",
      specs: [],
      price: "Quote on request",
    },
    {
      id: 5,
      category: "nethouses",
      name: "NH4T",
      description: "Pole spacing 4m, height 3m, trellising",
      image: "/NH4T Nethouse.jpg",
      specs: ["4m pole spacing", "3m height", "Trellising"],
      price: "Quote on request",
    },
    // Services
    {
      id: 6,
      category: "irrigation",
      name: "Irrigation",
      description: "Design, supply and installation of irrigation systems ranging from manual to fully automatic systems. Includes drip systems, filters, dosing equipment",
      image: "/Irrigation.jpg",
      specs: ["Manual/Automatic", "Drip systems", "Filters", "Dosing equipment"],
      price: "Quote on request",
    },
    // Accessories (for filter: Accessories)
    {
      id: 7,
      category: "accessories",
      name: "Matching Plastic",
      description: "Black and White",
      image: "/Matching Plastic.webp",
      specs: ["Black & White"],
      price: "Quote on request",
    },
    {
      id: 8,
      category: "accessories",
      name: "Greenhouse Covering Plastic",
      description: "9m by 35m roll",
      image: "/GreenHouse Covering Plastic.jpg",
      specs: ["9m x 35m roll"],
      price: "Quote on request",
    },
    {
      id: 9,
      category: "accessories",
      name: "Greenhouse Covering Mesh Net",
      description: "50% mesh, 2.5m by 35m roll",
      image: "/greenhouse covering mesh net.webp",
      specs: ["50% mesh", "2.5m x 35m roll"],
      price: "Quote on request",
    },
    {
      id: 10,
      category: "accessories",
      name: "Shednets",
      description: "40% to 80% shed net",
      image: "/Shednets.jpg",
      specs: ["40%-80% shade"],
      price: "Quote on request",
    },
    {
      id: 11,
      category: "accessories",
      name: "Crop Support",
      description: "Supply of crop support systems including clips, hooks, twine, truss arches, cluster support",
      image: "/Crop Support.jpg",
      specs: ["Clips", "Hooks", "Twine", "Truss arches", "Cluster support"],
      price: "Quote on request",
    },
    // Greenhouses
    {
      id: 12,
      category: "greenhouses",
      name: "TG8 Fixed Vent Greenhouse",
      description: "8m span, 7m height, 2-4m arch spacing, 25kg/sqm load capacity",
      image: "/TG8 Fixed Vent Greenhouse.jpg",
      specs: ["8m span", "7m height", "2-4m arch", "25kg/sqm load"],
      price: "Quote on request",
    },
    {
      id: 13,
      category: "greenhouses",
      name: "TG10 Fixed Vent Greenhouse",
      description: "10m span greenhouse with same specifications as TG8",
      image: "/TG10 Fixed Vent Greenhouse.webp",
      specs: ["10m span", "7m height", "2-4m arch", "25kg/sqm load"],
      price: "Quote on request",
    },
  ]

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("products")
    if (stored) {
      setProducts(JSON.parse(stored))
    } else {
      setProducts(defaultProducts)
      localStorage.setItem("products", JSON.stringify(defaultProducts))
    }
  }, [])

  // Save to localStorage when products change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  // Filter logic
  let filteredProducts = products
  if (activeCategory === "accessories") {
    // Only show the 5 accessories
    filteredProducts = products.filter((p) => [
      "Matching Plastic",
      "Greenhouse Covering Plastic",
      "Greenhouse Covering Mesh Net",
      "Shednets",
      "Crop Support"
    ].includes(p.name))
  } else if (activeCategory !== "all") {
    filteredProducts = products.filter((product) => product.category === activeCategory)
  }

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
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-5xl font-bold text-green-700 mb-6">Products & Services</h2>
            <SparklesCore
              className="absolute inset-0 w-full h-full pointer-events-none"
              particleColor="#22c55e"
              particleDensity={80}
              minSize={1}
              maxSize={3}
              speed={3}
              background="transparent"
            />
          </div>
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
                        {/* Removed price text */}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 px-4 py-1 text-sm rounded"
                          onClick={() => handleBookNow(product)}
                        >
                          Get Quote
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
          className="mt-20"
        >
          <div className="relative mb-10 flex justify-center items-center">
            <span className="relative z-10 text-3xl md:text-4xl font-bold text-green-700 text-center">Additional Services</span>
            <SparklesCore
              className="absolute inset-0 w-full h-full pointer-events-none"
              particleColor="#22c55e"
              particleDensity={80}
              minSize={1}
              maxSize={3}
              speed={3}
              background="transparent"
            />
          </div>
          <FocusCards
            cards={[
              {
                title: "Greenhouse Technology",
                src: "/01.png",
              },
              {
                title: "Partition Visual",
                src: "/02.png",
              },
              {
                title: "Modern Greenhouse",
                src: "/03.png",
              },
            ]}
          />
        </motion.div>
      </div>
    </section>
  )
}
