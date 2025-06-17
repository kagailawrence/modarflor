"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const stats = [
  { id: 1, value: 500, label: "Projects Completed", suffix: "+" },
  { id: 2, value: 15, label: "Years of Experience", suffix: "+" },
  { id: 3, value: 50, label: "Team Members", suffix: "" },
  { id: 4, value: 98, label: "Client Satisfaction", suffix: "%" },
]

const StatsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px 0px" })
  const [counted, setCounted] = useState(false)

  useEffect(() => {
    if (isInView && !counted) {
      setCounted(true)
    }
  }, [isInView, counted])

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Track Record</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            With years of experience and hundreds of successful projects, we've established ourselves as leaders in the
            floor decoration industry.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.id} className="text-center p-6 rounded-lg bg-background shadow-sm border">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: stat.id * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className="flex items-baseline">
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={counted ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: stat.id * 0.1 }}
                    className="text-4xl md:text-5xl font-bold text-primary"
                  >
                    {counted ? stat.value : 0}
                  </motion.span>
                  <span className="text-2xl md:text-3xl font-bold text-primary ml-1">{stat.suffix}</span>
                </div>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection
