"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { BASE_URL } from "@/lib/baseUrl"
import { motion, AnimatePresence } from "framer-motion"

export default function SchedulePage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      const res = await fetch(BASE_URL+"/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      })
      if (!res.ok) throw new Error("Failed to schedule. Please try again later.")
      setIsSubmitted(true)
      setFormState({ name: "", email: "", phone: "", date: "", time: "", message: "" })
      toast.success("Your schedule has been submitted! Check your email for confirmation.")
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to schedule.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      className="py-12 md:py-16"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="container mx-auto px-4 max-w-xl">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          <Card className="shadow-xl border-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur">
            <CardContent className="p-6 md:p-8">
              <motion.h2
                className="text-2xl font-bold mb-6 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Schedule a Visit
              </motion.h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>
                  <Input name="name" value={formState.name} onChange={handleChange} placeholder="Full Name" required />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                  <Input name="email" type="email" value={formState.email} onChange={handleChange} placeholder="Email Address" required />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
                  <Input name="phone" value={formState.phone} onChange={handleChange} placeholder="Phone Number" />
                </motion.div>
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="flex gap-2">
                  <Input name="date" type="date" value={formState.date} onChange={handleChange} required className="flex-1" />
                  <Input name="time" type="time" value={formState.time} onChange={handleChange} required className="flex-1" />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
                  <Textarea name="message" value={formState.message} onChange={handleChange} placeholder="Additional details (optional)" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  <Button type="submit" disabled={isSubmitting} className="w-full">
                    {isSubmitting ? "Submitting..." : "Schedule"}
                  </Button>
                </motion.div>
              </form>
              <AnimatePresence>
                {isSubmitted && (
                  <motion.div
                    className="mt-4 text-green-600 text-center font-semibold"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.4 }}
                  >
                    Thank you! Your schedule has been received.
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  )
}
