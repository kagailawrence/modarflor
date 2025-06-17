"use client"

import { Loader2 } from "lucide-react"

const PortfolioProjectLoading = () => (
  <div className="flex flex-col items-center justify-center min-h-[40vh]">
    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
    <p className="text-muted-foreground">Loading project details...</p>
  </div>
)

export default PortfolioProjectLoading
