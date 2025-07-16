"use client"

import { motion } from "framer-motion"
import { MapPin, Users, Target, Lightbulb } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function About() {
  const stats = [
    { icon: MapPin, label: "Based in Lilongwe", value: "Malawi" },
    { icon: Users, label: "Founded", value: "2023" },
    { icon: Target, label: "Operational Since", value: "2020" },
    { icon: Lightbulb, label: "Focus Area", value: "Southern Africa" },
  ]

  const directors = [
    { name: "Dziko Chatata", role: "Co-Director" },
    { name: "Ngabaghila Chatata", role: "Co-Director" },
  ]

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">About Smart Agri Solutions</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Transforming Southern African agriculture with innovative smart farming technologies
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-slate-800 mb-1">{stat.label}</h3>
                <p className="text-green-600 font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Vision & Mission */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                  <Target className="w-6 h-6 text-green-600 mr-3" />
                  Our Vision
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Transform Southern African agriculture with smart technology solutions that empower farmers to achieve
                  sustainable and profitable farming practices.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 text-green-600 mr-3" />
                  Our Mission
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  Promote profitable agricultural mechanization through innovative greenhouse technologies, irrigation
                  systems, and comprehensive farm advisory services.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Services & Directors */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Our Offerings</h3>
                <ul className="space-y-3 mb-8">
                  {[
                    "Greenhouses & Tunnels",
                    "Solar Driers",
                    "Irrigation Systems",
                    "Farm Advisory Services",
                    "Agricultural Mechanization",
                  ].map((offering, index) => (
                    <li key={index} className="flex items-center text-slate-600">
                      <div className="w-2 h-2 bg-green-600 rounded-full mr-3" />
                      {offering}
                    </li>
                  ))}
                </ul>

                <h4 className="text-xl font-bold text-slate-800 mb-4">Leadership</h4>
                <div className="space-y-2">
                  {directors.map((director, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="font-medium text-slate-700">{director.name}</span>
                      <span className="text-green-600 text-sm">{director.role}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
