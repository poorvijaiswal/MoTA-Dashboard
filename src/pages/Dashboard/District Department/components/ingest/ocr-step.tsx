"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, ArrowRight, ArrowLeft, Loader2, CheckCircle } from "lucide-react"

interface OCRStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function OCRStep({ data, onDataChange, onNext, onPrevious, canGoNext, canGoPrevious }: OCRStepProps) {
  const [ocrProgress, setOcrProgress] = useState(0)
  const [ocrStatus, setOcrStatus] = useState<"idle" | "processing" | "completed" | "error">("idle")
  const [ocrText, setOcrText] = useState(data.ocrText || "")

  // Mock OCR processing
  useEffect(() => {
    if (data.uploadedFile && !data.ocrText) {
      setOcrStatus("processing")
      setOcrProgress(0)

      const interval = setInterval(() => {
        setOcrProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setOcrStatus("completed")
            // Mock OCR result
            const mockOcrText = `
राज्य सरकार
वन अधिकार अधिनियम, 2006
व्यक्तिगत वन अधिकार पट्टा

पट्टाधारक का नाम: मंगल कोरकू
पिता का नाम: श्री उमेश कोरकू
जनजाति समूह: कोरकू
गांव: बेलावली
जिला: इंदौर
राज्य: मध्य प्रदेश

भूमि का क्षेत्रफल: 20.6 एकड़
सर्वे नंबर: FRA-2024-020
दावा प्रकार: व्यक्तिगत वन अधिकार (IFR)
स्थिति: लंबित

दिनांक: 19 दिसंबर 2024
अधिकार हस्ताक्षर: जिला कलेक्टर
            `.trim()
            setOcrText(mockOcrText)
            setTimeout(() => {
              onDataChange({ ocrText: mockOcrText })
            }, 0)
            return 100
          }
          return prev + 10
        })
      }, 200)

      return () => clearInterval(interval)
    }
  }, [data.uploadedFile, data.ocrText, onDataChange])

  const handleTextChange = (newText: string) => {
    setOcrText(newText)
    setTimeout(() => {
      onDataChange({ ocrText: newText })
    }, 0)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Optical Character Recognition (OCR)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ocrStatus === "processing" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                <span className="font-medium">Processing document...</span>
              </div>
              <Progress value={ocrProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Extracting text from your document using advanced OCR technology
              </p>
            </div>
          )}

          {ocrStatus === "completed" && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">OCR completed successfully</span>
                <Badge variant="outline" className="ml-auto">
                  Confidence: 94%
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Document Preview */}
                <div>
                  <h4 className="font-medium mb-3">Document Preview</h4>
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg border p-4 overflow-hidden">
                    <div className="text-xs leading-relaxed font-mono bg-white p-3 rounded border h-full overflow-y-auto">
                      {ocrText.split("\n").map((line, index) => (
                        <div key={index} className="hover:bg-yellow-100 px-1 py-0.5 rounded">
                          {line || "\u00A0"}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Extracted Text */}
                <div>
                  <h4 className="font-medium mb-3">Extracted Text</h4>
                  <textarea
                    value={ocrText}
                    onChange={(e) => handleTextChange(e.target.value)}
                    className="w-full h-80 p-3 border rounded-lg font-mono text-sm resize-none"
                    placeholder="Extracted text will appear here..."
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    You can edit the extracted text if needed before proceeding
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* OCR Quality Indicators */}
      {ocrStatus === "completed" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">OCR Quality Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">94%</div>
                <div className="text-sm text-muted-foreground">Overall Confidence</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">12</div>
                <div className="text-sm text-muted-foreground">Text Blocks Detected</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">Hindi + English</div>
                <div className="text-sm text-muted-foreground">Languages Detected</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Upload
        </Button>
        <Button onClick={onNext} disabled={ocrStatus !== "completed" || !canGoNext}>
          Continue to NER
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
