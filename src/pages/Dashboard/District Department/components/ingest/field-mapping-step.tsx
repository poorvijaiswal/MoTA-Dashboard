"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, ArrowLeft, Link2, CheckCircle } from "lucide-react"

interface FieldMappingStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function FieldMappingStep({
  data,
  onDataChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: FieldMappingStepProps) {
  const [mappedFields, setMappedFields] = useState(data.mappedFields || {})

  const fieldMappings = [
    { source: "name", target: "pattaHolderName", label: "पट्टा धारक का नाम", value: data.nerFields?.name || "मंगल कोरकू" },
  { source: "fatherName", target: "fatherName", label: "पिता का नाम", value: data.nerFields?.fatherName || "श्री उमेश कोरकू" },
    { source: "tribalGroup", target: "tribalGroup", label: "जनजाति समूह", value: data.nerFields?.tribalGroup || "कोरकू" },
    { source: "village", target: "village", label: "गांव", value: data.nerFields?.village || "बेलावली" },
    { source: "district", target: "district", label: "जिला", value: data.nerFields?.district || "इंदौर" },
    { source: "state", target: "state", label: "राज्य", value: data.nerFields?.state || "मध्य प्रदेश" },
    { source: "area", target: "areaHa", label: "क्षेत्रफल (एकड़)", value: data.nerFields?.area || "20.6" },
    { source: "surveyNumber", target: "surveyNumber", label: "दावा आईडी", value: data.nerFields?.surveyNumber || "FRA-2024-020" },
    { source: "claimType", target: "pattaType", label: "पट्टा प्रकार", value: data.nerFields?.claimType || "IFR" },
    { source: "status", target: "claimStatus", label: "स्थिति", value: data.nerFields?.status || "लंबित" },
  ]

  const handleMapping = () => {
    const mapped = fieldMappings.reduce(
      (acc, field) => {
        if (field.value) {
          acc[field.target] = field.value
        }
        return acc
      },
      {} as Record<string, string>,
    )

    setMappedFields(mapped)
    onDataChange({ mappedFields: mapped })
  }

  const mappedCount = Object.keys(mappedFields).length
  const totalFields = fieldMappings.filter((f) => f.value).length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Field Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">Map extracted fields to database schema</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {mappedCount}/{totalFields} fields mapped
                </Badge>
                <Button size="sm" onClick={handleMapping}>
                  Auto-Map Fields
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Source Fields */}
              <div>
                <h4 className="font-medium mb-4">Extracted Fields (NER Output)</h4>
                <div className="space-y-3">
                  {fieldMappings.map((field) => (
                    <div key={field.source} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{field.label}</span>
                        <Badge variant="outline" className="text-xs">
                          Source
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono bg-gray-50 p-2 rounded">
                        {field.value || "Not extracted"}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Schema */}
              <div>
                <h4 className="font-medium mb-4">Database Schema (Target)</h4>
                <div className="space-y-3">
                  {fieldMappings.map((field) => (
                    <div key={field.target} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{field.label}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            Target
                          </Badge>
                          {mappedFields[field.target] && <CheckCircle className="h-4 w-4 text-green-500" />}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground font-mono bg-blue-50 p-2 rounded">
                        {field.target}
                      </div>
                      {mappedFields[field.target] && (
                        <div className="text-sm mt-2 p-2 bg-green-50 rounded border border-green-200">
                          <strong>Mapped value:</strong> {mappedFields[field.target]}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {mappedCount > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-medium">{mappedCount} fields successfully mapped to database schema</span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to NER
        </Button>
        <Button onClick={onNext} disabled={mappedCount === 0 || !canGoNext}>
          Continue to Spatial Match
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
