"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Calculator, Home, Building, Clock, CheckCircle, Phone, Mail } from "lucide-react"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { BASE_URL } from "@/lib/baseUrl"

const flooringTypes = [
  { id: "epoxy", name: "Epoxy Flooring", priceRange: "Ksh 390-1,040/sq ft", description: "Durable, seamless coating" },
  {
    id: "tile",
    name: "Tile Installation",
    priceRange: "Ksh 650-1,950/sq ft",
    description: "Ceramic, porcelain, natural stone",
  },
  {
    id: "carpet",
    name: "Carpet Installation",
    priceRange: "Ksh 260-1,040/sq ft",
    description: "Residential and commercial grade",
  },
  { id: "hardwood", name: "Hardwood Flooring", priceRange: "Ksh 780-2,600/sq ft", description: "Solid and engineered options" },
  { id: "vinyl", name: "Vinyl & Laminate", priceRange: "Ksh 390-1,300/sq ft", description: "Waterproof and durable" },
  { id: "other", name: "Other", priceRange: "Custom quote", description: "Tell us about your specific needs" },
]

const projectTypes = [
  { id: "residential", name: "Residential", icon: Home },
  { id: "commercial", name: "Commercial", icon: Building },
]

const additionalServices = [
  { id: "removal", name: "Old Flooring Removal", description: "Remove existing flooring materials" },
  { id: "subfloor", name: "Subfloor Preparation", description: "Level and prepare subfloor surface" },
  { id: "baseboards", name: "Baseboard Installation", description: "Install or replace baseboards" },
  { id: "transitions", name: "Transition Strips", description: "Install transition strips between rooms" },
  { id: "furniture", name: "Furniture Moving", description: "Move furniture before and after installation" },
]

export default function QuotePage() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Project Details
    projectType: "",
    flooringType: "",
    squareFootage: "",
    rooms: "",
    timeline: "",

    // Step 2: Additional Services
    additionalServices: [] as string[],
    specialRequirements: "",

    // Step 3: Contact Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    preferredContact: "",

    // Step 4: Project Details
    projectDescription: "",
    budget: "",
    startDate: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleServiceToggle = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(serviceId)
        ? prev.additionalServices.filter((id) => id !== serviceId)
        : [...prev.additionalServices, serviceId],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(BASE_URL + "/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error("Failed to submit quote. Please try again later.")
      toast.success("Your quote request has been submitted! Check your email for confirmation.")
      setStep(1)
      setFormData({
        projectType: "",
        flooringType: "",
        squareFootage: "",
        rooms: "",
        timeline: "",
        additionalServices: [],
        specialRequirements: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
        preferredContact: "",
        projectDescription: "",
        budget: "",
        startDate: "",
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to submit quote.")
    }
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  const getEstimatedRange = () => {
    const selectedFlooring = flooringTypes.find((type) => type.id === formData.flooringType)
    const sqft = Number.parseInt(formData.squareFootage) || 0

    if (!selectedFlooring || !sqft) return null

    // Extract price range and calculate estimate
    const priceMatch = selectedFlooring.priceRange.match(/Ksh ([\d,]+)-([\d,]+)/)
    if (priceMatch) {
      const [, min, max] = priceMatch
      const minTotal = Number.parseInt(min.replace(/,/g, "")) * sqft
      const maxTotal = Number.parseInt(max.replace(/,/g, "")) * sqft
      return `Ksh ${minTotal.toLocaleString()} - Ksh ${maxTotal.toLocaleString()}`
    }

    return "Custom Quote Required"
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Your Free Quote</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Tell us about your project and we'll provide you with a detailed, no-obligation quote within 24 hours.
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {[1, 2, 3, 4].map((stepNumber) => (
                <div key={stepNumber} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      stepNumber <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {stepNumber < step ? <CheckCircle className="h-4 w-4" /> : stepNumber}
                  </div>
                  {stepNumber < 4 && (
                    <div className={`h-1 w-full mx-2 ${stepNumber < step ? "bg-primary" : "bg-muted"}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Project Type</span>
              <span>Services</span>
              <span>Contact Info</span>
              <span>Details</span>
            </div>
          </div>

          {/* Stepper and content */}
          {step < 4 ? (
            <div>
              {/* Step 1: Project Type & Flooring */}
              {step === 1 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calculator className="h-5 w-5 mr-2" />
                        Project Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Project Type */}
                      <div className="space-y-3">
                        <Label>Project Type</Label>
                        <RadioGroup
                          value={formData.projectType}
                          onValueChange={(value) => handleSelectChange("projectType", value)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {projectTypes.map((type) => (
                              <div key={type.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={type.id} id={type.id} />
                                <Label htmlFor={type.id} className="flex items-center cursor-pointer">
                                  <type.icon className="h-4 w-4 mr-2" />
                                  {type.name}
                                </Label>
                              </div>
                            ))}
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Flooring Type */}
                      <div className="space-y-3">
                        <Label>Flooring Type</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {flooringTypes.map((type) => (
                            <Card
                              key={type.id}
                              className={`cursor-pointer transition-all ${
                                formData.flooringType === type.id ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                              }`}
                              onClick={() => handleSelectChange("flooringType", type.id)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-medium">{type.name}</h3>
                                  <Badge variant="outline">{type.priceRange}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">{type.description}</p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>

                      {/* Square Footage */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="squareFootage">Square Footage</Label>
                          <Input
                            id="squareFootage"
                            name="squareFootage"
                            type="number"
                            value={formData.squareFootage}
                            onChange={handleInputChange}
                            placeholder="e.g., 500"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="rooms">Number of Rooms</Label>
                          <Input
                            id="rooms"
                            name="rooms"
                            type="number"
                            value={formData.rooms}
                            onChange={handleInputChange}
                            placeholder="e.g., 3"
                          />
                        </div>
                      </div>

                      {/* Timeline */}
                      <div className="space-y-2">
                        <Label htmlFor="timeline">Preferred Timeline</Label>
                        <Select
                          value={formData.timeline}
                          onValueChange={(value) => handleSelectChange("timeline", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="When would you like to start?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asap">As soon as possible</SelectItem>
                            <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                            <SelectItem value="1month">Within 1 month</SelectItem>
                            <SelectItem value="2-3months">2-3 months</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Estimated Range */}
                      {getEstimatedRange() && (
                        <div className="bg-primary/10 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Estimated Price Range</h3>
                          <p className="text-2xl font-bold text-primary">{getEstimatedRange()}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            *This is a rough estimate. Final quote may vary based on specific requirements.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Additional Services */}
              {step === 2 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Additional Services</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <Label>Select any additional services you need:</Label>
                        {additionalServices.map((service) => (
                          <div key={service.id} className="flex items-start space-x-3">
                            <Checkbox
                              id={service.id}
                              checked={formData.additionalServices.includes(service.id)}
                              onCheckedChange={() => handleServiceToggle(service.id)}
                            />
                            <div className="flex-1">
                              <Label htmlFor={service.id} className="cursor-pointer font-medium">
                                {service.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{service.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="specialRequirements">Special Requirements or Notes</Label>
                        <Textarea
                          id="specialRequirements"
                          name="specialRequirements"
                          value={formData.specialRequirements}
                          onChange={handleInputChange}
                          placeholder="Any special requirements, accessibility needs, or additional details..."
                          rows={4}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Contact Information */}
              {step === 3 && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Project Address</Label>
                        <Input
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Street address"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP Code</Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>Preferred Contact Method</Label>
                        <RadioGroup
                          value={formData.preferredContact}
                          onValueChange={(value) => handleSelectChange("preferredContact", value)}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="contact-phone" />
                            <Label htmlFor="contact-phone">Phone</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="contact-email" />
                            <Label htmlFor="contact-email">Email</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="either" id="contact-either" />
                            <Label htmlFor="contact-either">Either</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                  Previous
                </Button>
                <Button type="button" onClick={nextStep}>
                  Next Step
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Step 4: Final Details */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                <Card>
                  <CardHeader>
                    <CardTitle>Project Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="projectDescription">Project Description</Label>
                      <Textarea
                        id="projectDescription"
                        name="projectDescription"
                        value={formData.projectDescription}
                        onChange={handleInputChange}
                        placeholder="Please describe your project in detail. Include any specific requirements, design preferences, or challenges we should know about..."
                        rows={5}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range (Optional)</Label>
                      <Select value={formData.budget} onValueChange={(value) => handleSelectChange("budget", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="under-5k">Under $5,000</SelectItem>
                          <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                          <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
                          <SelectItem value="20k-50k">$20,000 - $50,000</SelectItem>
                          <SelectItem value="over-50k">Over $50,000</SelectItem>
                          <SelectItem value="discuss">Prefer to discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="startDate">Preferred Start Date</Label>
                      <Input
                        id="startDate"
                        name="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Summary */}
                    <div className="bg-muted/30 p-6 rounded-lg">
                      <h3 className="font-semibold mb-4">Quote Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Project Type:</span>
                          <span className="font-medium">{formData.projectType || "Not specified"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Flooring Type:</span>
                          <span className="font-medium">
                            {flooringTypes.find((t) => t.id === formData.flooringType)?.name || "Not specified"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Square Footage:</span>
                          <span className="font-medium">{formData.squareFootage || "Not specified"} sq ft</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Additional Services:</span>
                          <span className="font-medium">{formData.additionalServices.length} selected</span>
                        </div>
                        {getEstimatedRange() && (
                          <div className="flex justify-between pt-2 border-t">
                            <span className="font-medium">Estimated Range:</span>
                            <span className="font-bold text-primary">{getEstimatedRange()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
                <Button type="submit" className="bg-primary">
                  Submit Quote Request
                </Button>
              </div>
            </form>
          )}

          {/* Contact Information Sidebar */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Call Us</h3>
                <p className="text-muted-foreground mb-2">+254-722 843995</p>
                <p className="text-sm text-muted-foreground">Mon-Fri: 8AM-6PM</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-muted-foreground mb-2">quotes@modaflor-ke.com</p>
                <p className="text-sm text-muted-foreground">24-hour response</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Quick Response</h3>
                <p className="text-muted-foreground mb-2">Within 24 hours</p>
                <p className="text-sm text-muted-foreground">Detailed quote provided</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
