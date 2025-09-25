"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowLeft, Upload, FileText, User, MapPin, AlertCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface ReviewStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}) => {
  const [isPublishing, setIsPublishing] = useState(false)
  const [isPublished, setIsPublished] = useState(false)
  const navigate = useNavigate()

  const handlePublish = async () => {
    setIsPublishing(true)

    // Mock publishing process
    setTimeout(() => {
      setIsPublishing(false)
      setIsPublished(true)

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard/district/fra-atlas")
      }, 2000)
    }, 3000)
  }

  if (isPublished) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-green-800 mb-2">Published Successfully!</h2>
        <p className="text-muted-foreground mb-4">Parcel is now live on the Atlas and available for analysis.</p>
        <Button onClick={() => navigate("/atlas")}>View in Atlas</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Review & Publish
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Document</div>
                  <div className="text-xs text-muted-foreground">{data.uploadedFile?.name || "No file"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <User className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Patta Holder</div>
                  <div className="text-xs text-muted-foreground">
                    {data.mappedFields?.pattaHolderName || "मंगल कोरकू"}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <MapPin className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-xs text-muted-foreground">{data.mappedFields?.village || "बेलावली, इंदौर, मध्य प्रदेश"}</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <CheckCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-sm font-medium">Parcel</div>
                  <div className="text-xs text-muted-foreground">{data.spatialMatch?.id || "FRA-2024-020"}</div>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Review */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Extracted Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Extracted Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Custom summary for screenshot requirements in Hindi */}
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">दावा आईडी:</span>
                    <span className="text-sm text-muted-foreground">FRA-2024-020</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">दावेदार का नाम:</span>
                    <span className="text-sm text-muted-foreground">मंगल कोरकू</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">प्रकार:</span>
                    <span className="text-sm text-muted-foreground">IFR (व्यक्तिगत वन अधिकार)</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">स्थिति:</span>
                    <span className="text-sm text-yellow-800 bg-yellow-100 px-2 py-1 rounded">लंबित</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">क्षेत्रफल:</span>
                    <span className="text-sm text-muted-foreground">20.6 एकड़</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">स्थान:</span>
                    <span className="text-sm text-muted-foreground">बेलावली, इंदौर, मध्य प्रदेश</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm font-medium">प्रस्तुत:</span>
                    <span className="text-sm text-muted-foreground">2024-12-19</span>
                  </div>
                </CardContent>
              </Card>

              {/* Spatial Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Spatial Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {data.spatialMatch ? (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Parcel ID:</span>
                        <span className="text-sm text-muted-foreground">{data.spatialMatch.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Area:</span>
                        <span className="text-sm text-muted-foreground">{data.spatialMatch.area} ha</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm font-medium">Survey Number:</span>
                        <span className="text-sm text-muted-foreground">{data.spatialMatch.surveyNumber}</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <span className="text-sm font-medium">Match Confidence:</span>
                        <Badge variant="outline" className="text-green-600">
                          {Math.round(data.spatialMatch.confidence * 100)}%
                        </Badge>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4 text-muted-foreground">
                      <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                      <p>No spatial match selected</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Validation Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Validation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Document uploaded and processed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">OCR extraction completed (94% confidence)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Named entities identified and mapped</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.spatialMatch ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      {data.spatialMatch ? "Spatial match confirmed" : "Spatial match required"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Publish Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={handlePublish}
                disabled={isPublishing || !data.spatialMatch}
                className="min-w-48"
              >
                {isPublishing ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Publish to Atlas
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-start">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious || isPublishing}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Spatial Match
        </Button>
      </div>
    </div>
  )
}

export default ReviewStep;
