"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calculator, Home, Ruler, DollarSign, Info, AlertCircle } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

const flooringTypes = {
  epoxy: {
    name: "Epoxy Flooring",
    priceRange: { min: 3, max: 8 },
    unit: "sq ft",
    description: "Durable, seamless coating perfect for garages and commercial spaces",
    factors: ["Surface preparation", "Number of coats", "Decorative elements", "Complexity"],
  },
  tile: {
    name: "Tile Installation",
    priceRange: { min: 5, max: 15 },
    unit: "sq ft",
    description: "Ceramic, porcelain, and natural stone options",
    factors: ["Tile material", "Pattern complexity", "Subfloor preparation", "Grout type"],
  },
  carpet: {
    name: "Carpet Installation",
    priceRange: { min: 2, max: 8 },
    unit: "sq ft",
    description: "Residential and commercial grade carpeting",
    factors: ["Carpet quality", "Padding type", "Room layout", "Furniture moving"],
  },
  hardwood: {
    name: "Hardwood Flooring",
    priceRange: { min: 6, max: 20 },
    unit: "sq ft",
    description: "Solid and engineered hardwood options",
    factors: ["Wood species", "Plank width", "Finish type", "Installation method"],
  },
  vinyl: {
    name: "Vinyl & Laminate",
    priceRange: { min: 3, max: 10 },
    unit: "sq ft",
    description: "Waterproof and durable synthetic flooring",
    factors: ["Material quality", "Thickness", "Underlayment", "Installation complexity"],
  },
}

const roomShapes = [
  { id: "rectangle", name: "Rectangle", formula: "Length × Width" },
  { id: "square", name: "Square", formula: "Side × Side" },
  { id: "circle", name: "Circle", formula: "π × Radius²" },
  { id: "triangle", name: "Triangle", formula: "½ × Base × Height" },
  { id: "l-shape", name: "L-Shape", formula: "Area 1 + Area 2" },
]

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState("area")
  const [flooringType, setFlooringType] = useState("epoxy")
  const [roomShape, setRoomShape] = useState("rectangle")
  const [measurements, setMeasurements] = useState({
    length: "",
    width: "",
    radius: "",
    base: "",
    height: "",
    side: "",
    // L-shape measurements
    length1: "",
    width1: "",
    length2: "",
    width2: "",
  })
  const [area, setArea] = useState(0)
  const [estimate, setEstimate] = useState({ min: 0, max: 0 })
  const [waste, setWaste] = useState(10) // 10% waste factor

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }))
  }

  const calculateArea = () => {
    const { length, width, radius, base, height, side, length1, width1, length2, width2 } = measurements

    let calculatedArea = 0

    switch (roomShape) {
      case "rectangle":
        if (length && width) {
          calculatedArea = Number.parseFloat(length) * Number.parseFloat(width)
        }
        break
      case "square":
        if (side) {
          calculatedArea = Number.parseFloat(side) * Number.parseFloat(side)
        }
        break
      case "circle":
        if (radius) {
          calculatedArea = Math.PI * Math.pow(Number.parseFloat(radius), 2)
        }
        break
      case "triangle":
        if (base && height) {
          calculatedArea = 0.5 * Number.parseFloat(base) * Number.parseFloat(height)
        }
        break
      case "l-shape":
        if (length1 && width1 && length2 && width2) {
          calculatedArea =
            Number.parseFloat(length1) * Number.parseFloat(width1) +
            Number.parseFloat(length2) * Number.parseFloat(width2)
        }
        break
    }

    setArea(calculatedArea)
  }

  const calculateEstimate = () => {
    if (area > 0) {
      const selectedFlooring = flooringTypes[flooringType as keyof typeof flooringTypes]
      const adjustedArea = area * (1 + waste / 100) // Add waste factor

      const minCost = adjustedArea * selectedFlooring.priceRange.min
      const maxCost = adjustedArea * selectedFlooring.priceRange.max

      setEstimate({ min: minCost, max: maxCost })
    }
  }

  useEffect(() => {
    calculateArea()
  }, [measurements, roomShape])

  useEffect(() => {
    calculateEstimate()
  }, [area, flooringType, waste])

  const renderMeasurementInputs = () => {
    switch (roomShape) {
      case "rectangle":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="length">Length (ft)</Label>
              <Input
                id="length"
                type="number"
                value={measurements.length}
                onChange={(e) => handleMeasurementChange("length", e.target.value)}
                placeholder="Enter length"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="width">Width (ft)</Label>
              <Input
                id="width"
                type="number"
                value={measurements.width}
                onChange={(e) => handleMeasurementChange("width", e.target.value)}
                placeholder="Enter width"
              />
            </div>
          </div>
        )
      case "square":
        return (
          <div className="space-y-2">
            <Label htmlFor="side">Side Length (ft)</Label>
            <Input
              id="side"
              type="number"
              value={measurements.side}
              onChange={(e) => handleMeasurementChange("side", e.target.value)}
              placeholder="Enter side length"
            />
          </div>
        )
      case "circle":
        return (
          <div className="space-y-2">
            <Label htmlFor="radius">Radius (ft)</Label>
            <Input
              id="radius"
              type="number"
              value={measurements.radius}
              onChange={(e) => handleMeasurementChange("radius", e.target.value)}
              placeholder="Enter radius"
            />
          </div>
        )
      case "triangle":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="base">Base (ft)</Label>
              <Input
                id="base"
                type="number"
                value={measurements.base}
                onChange={(e) => handleMeasurementChange("base", e.target.value)}
                placeholder="Enter base"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="height">Height (ft)</Label>
              <Input
                id="height"
                type="number"
                value={measurements.height}
                onChange={(e) => handleMeasurementChange("height", e.target.value)}
                placeholder="Enter height"
              />
            </div>
          </div>
        )
      case "l-shape":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Area 1 (Rectangle 1)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={measurements.length1}
                  onChange={(e) => handleMeasurementChange("length1", e.target.value)}
                  placeholder="Length 1 (ft)"
                />
                <Input
                  type="number"
                  value={measurements.width1}
                  onChange={(e) => handleMeasurementChange("width1", e.target.value)}
                  placeholder="Width 1 (ft)"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Area 2 (Rectangle 2)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="number"
                  value={measurements.length2}
                  onChange={(e) => handleMeasurementChange("length2", e.target.value)}
                  placeholder="Length 2 (ft)"
                />
                <Input
                  type="number"
                  value={measurements.width2}
                  onChange={(e) => handleMeasurementChange("width2", e.target.value)}
                  placeholder="Width 2 (ft)"
                />
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Flooring Calculator</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Calculate the area of your space and get an estimated cost for your flooring project. Get started with our
              easy-to-use calculator tools.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="area" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Area Calculator
              </TabsTrigger>
              <TabsTrigger value="cost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Cost Estimator
              </TabsTrigger>
            </TabsList>

            {/* Area Calculator Tab */}
            <TabsContent value="area">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calculator className="h-5 w-5 mr-2" />
                      Room Measurements
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Room Shape Selection */}
                    <div className="space-y-2">
                      <Label>Room Shape</Label>
                      <Select value={roomShape} onValueChange={setRoomShape}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select room shape" />
                        </SelectTrigger>
                        <SelectContent>
                          {roomShapes.map((shape) => (
                            <SelectItem key={shape.id} value={shape.id}>
                              {shape.name} - {shape.formula}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Measurement Inputs */}
                    {renderMeasurementInputs()}

                    {/* Calculate Button */}
                    <Button onClick={calculateArea} className="w-full">
                      Calculate Area
                    </Button>

                    {/* Results */}
                    {area > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-primary/10 p-4 rounded-lg"
                      >
                        <h3 className="font-semibold mb-2">Calculated Area</h3>
                        <p className="text-2xl font-bold text-primary">{area.toFixed(2)} sq ft</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {(area * 0.092903).toFixed(2)} square meters
                        </p>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Visual Guide */}
                <Card>
                  <CardHeader>
                    <CardTitle>Measurement Guide</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg">
                        <h4 className="font-medium mb-2">Tips for Accurate Measurements:</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Measure at the widest points of the room</li>
                          <li>• Account for alcoves and closets</li>
                          <li>• Measure in feet for easier calculation</li>
                          <li>• Double-check your measurements</li>
                        </ul>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-blue-900 dark:text-blue-100">Pro Tip</h4>
                            <p className="text-sm text-blue-700 dark:text-blue-200">
                              For irregular shapes, break them down into rectangles and calculate each area separately.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-orange-900 dark:text-orange-100">Important</h4>
                            <p className="text-sm text-orange-700 dark:text-orange-200">
                              These calculations are estimates. Professional measurement is recommended for final
                              quotes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Cost Estimator Tab */}
            <TabsContent value="cost">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2" />
                      Cost Estimation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Area Input */}
                    <div className="space-y-2">
                      <Label htmlFor="area-input">Room Area (sq ft)</Label>
                      <Input
                        id="area-input"
                        type="number"
                        value={area || ""}
                        onChange={(e) => setArea(Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter area in square feet"
                      />
                      <p className="text-xs text-muted-foreground">
                        Use the Area Calculator tab or enter your known area
                      </p>
                    </div>

                    {/* Flooring Type Selection */}
                    <div className="space-y-3">
                      <Label>Flooring Type</Label>
                      <div className="grid grid-cols-1 gap-3">
                        {Object.entries(flooringTypes).map(([key, type]) => (
                          <Card
                            key={key}
                            className={`cursor-pointer transition-all ${
                              flooringType === key ? "ring-2 ring-primary bg-primary/5" : "hover:shadow-md"
                            }`}
                            onClick={() => setFlooringType(key)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium">{type.name}</h3>
                                <Badge variant="outline">
                                  Ksh {type.priceRange.min}-{type.priceRange.max}/{type.unit}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{type.description}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* Waste Factor */}
                    <div className="space-y-2">
                      <Label htmlFor="waste">Waste Factor (%)</Label>
                      <Select value={waste.toString()} onValueChange={(value) => setWaste(Number.parseInt(value))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5% - Simple layout</SelectItem>
                          <SelectItem value="10">10% - Standard (Recommended)</SelectItem>
                          <SelectItem value="15">15% - Complex layout</SelectItem>
                          <SelectItem value="20">20% - Very complex</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Cost Estimate Results */}
                    {area > 0 && estimate.min > 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                        <div className="bg-primary/10 p-6 rounded-lg">
                          <h3 className="font-semibold mb-4">Cost Estimate</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span>Area (with {waste}% waste):</span>
                              <span className="font-medium">{(area * (1 + waste / 100)).toFixed(2)} sq ft</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Price Range:</span>
                              <span className="font-medium">
                                Ksh
                                {flooringTypes[flooringType as keyof typeof flooringTypes].priceRange.min}-
                                {flooringTypes[flooringType as keyof typeof flooringTypes].priceRange.max}/sq ft
                              </span>
                            </div>
                            <div className="border-t pt-3">
                              <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">Total Estimate:</span>
                                <span className="text-2xl font-bold text-primary">
                                  Ksh {estimate.min.toLocaleString()} - Ksh {estimate.max.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Price Factors:</h4>
                          <ul className="text-sm space-y-1 text-muted-foreground">
                            {flooringTypes[flooringType as keyof typeof flooringTypes].factors.map((factor, index) => (
                              <li key={index}>• {factor}</li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>

                {/* Additional Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Important Notes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                        <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-2">Estimate Disclaimer</h4>
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                          This calculator provides rough estimates based on average pricing. Actual costs may vary based
                          on specific project requirements, material choices, and site conditions.
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">What's Typically Included:</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>✓ Materials and supplies</li>
                          <li>✓ Professional installation</li>
                          <li>✓ Basic site preparation</li>
                          <li>✓ Cleanup and disposal</li>
                        </ul>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-medium">Additional Costs May Include:</h4>
                        <ul className="text-sm space-y-1 text-muted-foreground">
                          <li>• Subfloor repairs or leveling</li>
                          <li>• Removal of existing flooring</li>
                          <li>• Furniture moving services</li>
                          <li>• Baseboard installation/replacement</li>
                          <li>• Complex patterns or custom work</li>
                        </ul>
                      </div>

                      <div className="pt-4 border-t">
                        <Button asChild className="w-full">
                          <Link href="/quote">Get Accurate Quote</Link>
                        </Button>
                        <p className="text-xs text-center text-muted-foreground mt-2">
                          For precise pricing, request a professional quote
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 bg-primary text-primary-foreground rounded-lg p-8 text-center"
          >
            <Home className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Ready for Professional Installation?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Get an accurate quote from our experts. We'll assess your space and provide detailed pricing for your
              specific project needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="secondary" size="lg" asChild>
                <Link href="/quote">Request Quote</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/20 text-primary-foreground"
                asChild
              >
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
