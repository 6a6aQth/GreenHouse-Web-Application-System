"use client"

import { motion } from "framer-motion"
import { BookOpen, Droplets, Sun, Cog, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Learn() {
  const learningTopics = [
    {
      icon: BookOpen,
      title: "Benefits of Greenhouse Farming",
      description:
        "Discover how controlled environment agriculture can increase yields by up to 300% while reducing water usage and protecting crops from weather extremes.",
      color: "bg-blue-100 text-blue-600",
    },
    {
      icon: Sun,
      title: "Solar Dryers & Post-Harvest",
      description:
        "Learn how solar drying technology reduces post-harvest losses by up to 40%, extending shelf life and increasing farmer income.",
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      icon: Droplets,
      title: "Water-Saving Irrigation",
      description:
        "Understand drip irrigation systems that can reduce water consumption by 50% while improving crop quality and consistency.",
      color: "bg-cyan-100 text-cyan-600",
    },
    {
      icon: Cog,
      title: "Agricultural Mechanization",
      description:
        "Explore modern farming equipment and techniques that increase efficiency and reduce labor costs for sustainable farming.",
      color: "bg-gray-100 text-gray-600",
    },
    {
      icon: TrendingUp,
      title: "Smart Farming Analytics",
      description:
        "Master data-driven farming decisions using sensors, monitoring systems, and agricultural analytics for optimal results.",
      color: "bg-green-100 text-green-600",
    },
  ]

  return (
    <section id="learn" className="py-20 bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Learn Smart Farming</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Expand your agricultural knowledge with our educational resources and expert insights
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {learningTopics.map((topic, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardHeader className="pb-4">
                  <div
                    className={`w-16 h-16 rounded-full ${topic.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <topic.icon className="w-8 h-8" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">{topic.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="bg-green-600 text-white p-8">
            <CardContent className="p-0">
              <h3 className="text-2xl font-bold mb-4">Ready to Transform Your Farm?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Join thousands of farmers across Southern Africa who have revolutionized their agricultural practices
                with our smart farming solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors">
                  Download Resources
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-green-600 transition-colors">
                  Schedule Consultation
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
