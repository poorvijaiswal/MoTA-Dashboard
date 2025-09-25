"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, ArrowRight, ArrowLeft, Loader2, CheckCircle, User, MapPin } from "lucide-react"

interface NERStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function NERStep({ data, onDataChange, onNext, onPrevious, canGoNext, canGoPrevious }: NERStepProps) {
  const [nerStatus, setNerStatus] = useState<"idle" | "processing" | "completed">("idle")
  const [nerFields, setNerFields] = useState(data.nerFields || {})

  // Mock NER processing
  useEffect(() => {
    if (data.ocrText && !data.nerFields.name) {
      setNerStatus("processing")

      setTimeout(() => {
        const mockNerFields = {
          name: "मंगल कोरकू",
          fatherName: "श्री उमेश कोरकू",
          tribalGroup: "कोरकू",
          village: "बेलावली",
          district: "इंदौर",
          state: "मध्य प्रदेश",
          area: "20.6",
          surveyNumber: "FRA-2024-020",
          claimType: "IFR",
          status: "लंबित",
          date: "2024-12-19",
        }
        setNerFields(mockNerFields)
        onDataChange({ nerFields: mockNerFields })
        setNerStatus("completed")
      }, 2000)
    }
  }, [data.ocrText, data.nerFields, onDataChange])

  const updateField = (key: string, value: string) => {
    const updated = { ...nerFields, [key]: value }
    setNerFields(updated)
    onDataChange({ nerFields: updated })
  }

  const fieldConfidence = {
    name: 0.95,
    fatherName: 0.88,
    tribalGroup: 0.92,
    village: 0.89,
    district: 0.94,
    state: 0.97,
    area: 0.85,
    surveyNumber: 0.91,
    claimType: 0.93,
    status: 0.96,
    date: 0.87,
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return "text-green-600"
    if (confidence >= 0.7) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Named Entity Recognition (NER)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {nerStatus === "processing" && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
                <h3 className="font-medium mb-2">Extracting Information</h3>
                <p className="text-sm text-muted-foreground">
                  AI is identifying and extracting key information from the document
                </p>
              </div>
            </div>
          )}

          {nerStatus === "completed" && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Information extraction completed</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <User className="h-5 w-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Patta Holder Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="name"
                          value={nerFields.name || ""}
                          onChange={(e) => updateField("name", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.name)}>
                          {Math.round(fieldConfidence.name * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="fatherName">Father's Name</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="fatherName"
                          value={nerFields.fatherName || ""}
                          onChange={(e) => updateField("fatherName", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.fatherName)}>
                          {Math.round(fieldConfidence.fatherName * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tribalGroup">Tribal Group</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="tribalGroup"
                          value={nerFields.tribalGroup || ""}
                          onChange={(e) => updateField("tribalGroup", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.tribalGroup)}>
                          {Math.round(fieldConfidence.tribalGroup * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <MapPin className="h-5 w-5" />
                      Location Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="village">Village</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="village"
                          value={nerFields.village || ""}
                          onChange={(e) => updateField("village", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.village)}>
                          {Math.round(fieldConfidence.village * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="district">District</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="district"
                          value={nerFields.district || ""}
                          onChange={(e) => updateField("district", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.district)}>
                          {Math.round(fieldConfidence.district * 100)}%
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="state">State</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="state"
                          value={nerFields.state || ""}
                          onChange={(e) => updateField("state", e.target.value)}
                        />
                        <Badge variant="outline" className={getConfidenceColor(fieldConfidence.state)}>
                          {Math.round(fieldConfidence.state * 100)}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Land Information */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="text-lg">Land & Claim Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <Label htmlFor="area">Area (Hectares)</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="area"
                            value={nerFields.area || ""}
                            onChange={(e) => updateField("area", e.target.value)}
                          />
                          <Badge variant="outline" className={getConfidenceColor(fieldConfidence.area)}>
                            {Math.round(fieldConfidence.area * 100)}%
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="surveyNumber">Survey Number</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            id="surveyNumber"
                            value={nerFields.surveyNumber || ""}
                            onChange={(e) => updateField("surveyNumber", e.target.value)}
                          />
                          <Badge variant="outline" className={getConfidenceColor(fieldConfidence.surveyNumber)}>
                            {Math.round(fieldConfidence.surveyNumber * 100)}%
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="claimType">Claim Type</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Select
                            value={nerFields.claimType || ""}
                            onValueChange={(value) => updateField("claimType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="IFR">Individual Forest Rights (IFR)</SelectItem>
                              <SelectItem value="CR">Community Rights (CR)</SelectItem>
                              <SelectItem value="CFR">Community Forest Resource (CFR)</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant="outline" className={getConfidenceColor(fieldConfidence.claimType)}>
                            {Math.round(fieldConfidence.claimType * 100)}%
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="status">Status</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Select
                            value={nerFields.status || ""}
                            onValueChange={(value) => updateField("status", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FILED">Filed</SelectItem>
                              <SelectItem value="VERIFIED">Verified</SelectItem>
                              <SelectItem value="APPROVED">Approved</SelectItem>
                              <SelectItem value="REJECTED">Rejected</SelectItem>
                              <SelectItem value="PENDING">Pending</SelectItem>
                            </SelectContent>
                          </Select>
                          <Badge variant="outline" className={getConfidenceColor(fieldConfidence.status)}>
                            {Math.round(fieldConfidence.status * 100)}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to OCR
        </Button>
        <Button onClick={onNext} disabled={nerStatus !== "completed" || !canGoNext}>
          Continue to Field Mapping
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
