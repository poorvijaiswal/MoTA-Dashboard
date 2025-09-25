"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { UploadStep } from "../components/ingest/upload-step"
import { OCRStep } from "../components/ingest/ocr-step"
import { NERStep } from "../components/ingest/ner-step"
import { FieldMappingStep } from "../components/ingest/field-mapping-step"
import { SpatialMatchStep } from "../components/ingest/spatial-match-step"
import ReviewStep from "../components/ingest/review-step"
import { Upload, FileText, Eye, ArrowRight, MapPin, CheckCircle, ArrowLeft, Shield } from "lucide-react"
import { Link } from "react-router-dom"

const steps = [
  { id: 1, title: "Upload", icon: Upload, component: UploadStep },
  { id: 2, title: "OCR", icon: FileText, component: OCRStep },
  { id: 3, title: "NER", icon: Eye, component: NERStep },
  { id: 4, title: "Field Mapping", icon: ArrowRight, component: FieldMappingStep },
  { id: 5, title: "Spatial Match", icon: MapPin, component: SpatialMatchStep },
  { id: 6, title: "Review & Publish", icon: CheckCircle, component: ReviewStep },
]

export default function IngestPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [wizardData, setWizardData] = useState({
    uploadedFile: null,
    ocrText: "",
    nerFields: {},
    mappedFields: {},
    spatialMatch: null,
    reviewData: {},
  })

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleStepData = (stepData: any) => {
    setWizardData((prev) => ({ ...prev, ...stepData }))
  }

  const handleStepClick = (stepId: number) => {
    // Allow navigation to completed steps or current step
    if (stepId <= currentStep) {
      setCurrentStep(stepId)
    }
  }

  const getCurrentStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed"
    if (stepId === currentStep) return "current"
    return "pending"
  }

  const CurrentStepComponent = steps[currentStep - 1].component
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/atlas">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Atlas
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold">Data Ingestion Wizard</h1>
                <p className="text-sm text-muted-foreground">
                  Upload and process FRA documents through OCR, NER, and geospatial matching
                </p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium">
              Step {currentStep} of {steps.length}
            </div>
            <div className="text-xs text-muted-foreground">{steps[currentStep - 1].title}</div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-6">
        {/* Progress Bar */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Step Indicators */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const status = getCurrentStepStatus(step.id)
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      onClick={() => handleStepClick(step.id)}
                      className="flex flex-col items-center cursor-pointer"
                      disabled={step.id > currentStep}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                          status === "completed"
                            ? "bg-green-500 text-white"
                            : status === "current"
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-500"
                        } ${step.id <= currentStep ? "hover:opacity-80" : "cursor-not-allowed"}`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="mt-2 text-center">
                        <div className="text-sm font-medium">{step.title}</div>
                        <Badge
                          variant={status === "completed" ? "default" : status === "current" ? "secondary" : "outline"}
                          className="mt-1 text-xs"
                        >
                          {status}
                        </Badge>
                      </div>
                    </button>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 transition-colors ${
                          status === "completed" ? "bg-green-500" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Current Step Content */}
        <div className="mb-8">
          <CurrentStepComponent
            data={wizardData}
            onDataChange={handleStepData}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canGoNext={currentStep < steps.length}
            canGoPrevious={currentStep > 1}
          />
        </div>
      </div>
    </div>
  )
}
