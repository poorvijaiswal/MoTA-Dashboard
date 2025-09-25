"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ArrowRight, ArrowLeft, Square, Navigation, CheckCircle } from "lucide-react"

interface SpatialMatchStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function SpatialMatchStep({
  data,
  onDataChange,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious,
}: SpatialMatchStepProps) {
  const [spatialMatch, setSpatialMatch] = useState(data.spatialMatch || null)
  const [drawMode, setDrawMode] = useState<"point" | "polygon" | null>(null)

  const suggestedParcels = [
    {
      id: "FRA-2024-020",
      confidence: 0.92,
      area: 20.6,
      surveyNumber: "FRA-2024-020",
      village: "बेलावली",
      coordinates: [75.8, 22.7],
    },
    {
      id: "FRA-2024-021",
      confidence: 0.78,
      area: 18.2,
      surveyNumber: "FRA-2024-021",
      village: "बेलावली",
      coordinates: [75.81, 22.71],
    },
    {
      id: "FRA-2024-022",
      confidence: 0.65,
      area: 15.4,
      surveyNumber: "FRA-2024-022",
      village: "बेलावली",
      coordinates: [75.79, 22.69],
    },
  ]

  const handleParcelSelect = (parcel: any) => {
    setSpatialMatch(parcel)
    onDataChange({ spatialMatch: parcel })
  }

  const handleDrawPolygon = () => {
    // Mock polygon drawing
    const newParcel = {
      id: "PAR_NEW_001",
      confidence: 1.0,
      area: Number.parseFloat(data.mappedFields?.areaHa || "1.6"),
      surveyNumber: data.mappedFields?.surveyNumber || "New",
      village: data.mappedFields?.village || "Unknown",
      coordinates: [79.5, 22.1],
      isNew: true,
    }
    setSpatialMatch(newParcel)
    onDataChange({ spatialMatch: newParcel })
    setDrawMode(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Spatial Matching
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Interface */}
            <div>
              <h4 className="font-medium mb-3">Interactive Map</h4>
              <div className="aspect-square bg-green-50 rounded-lg border relative overflow-hidden">
                {/* Mock Map */}
                <div className="absolute inset-0">
                  <svg className="w-full h-full">
                    {/* Suggested parcels */}
                    {suggestedParcels.map((parcel, index) => (
                      <g key={parcel.id}>
                        <polygon
                          points={`${50 + index * 30},${60 + index * 20} ${120 + index * 30},${70 + index * 20} ${110 + index * 30},${130 + index * 20} ${40 + index * 30},${120 + index * 20}`}
                          fill={spatialMatch?.id === parcel.id ? "rgba(34, 197, 94, 0.3)" : "rgba(59, 130, 246, 0.2)"}
                          stroke={spatialMatch?.id === parcel.id ? "#22c55e" : "#3b82f6"}
                          strokeWidth="2"
                          className="cursor-pointer hover:opacity-80"
                          onClick={() => handleParcelSelect(parcel)}
                        />
                        <text
                          x={75 + index * 30}
                          y={95 + index * 20}
                          className="text-xs fill-current"
                          textAnchor="middle"
                        >
                          {parcel.id}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Map Controls */}
                <div className="absolute top-2 right-2 space-y-1">
                  <Button
                    size="sm"
                    variant={drawMode === "point" ? "default" : "outline"}
                    onClick={() => setDrawMode(drawMode === "point" ? null : "point")}
                  >
                    <Navigation className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={drawMode === "polygon" ? "default" : "outline"}
                    onClick={() => setDrawMode(drawMode === "polygon" ? null : "polygon")}
                  >
                    <Square className="h-4 w-4" />
                  </Button>
                </div>

                {/* Draw Instructions */}
                {drawMode && (
                  <div className="absolute bottom-2 left-2 right-2 bg-white/90 p-2 rounded text-xs">
                    {drawMode === "polygon" ? (
                      <div>
                        <p className="font-medium">Draw Polygon Mode</p>
                        <p>Click to add points, double-click to finish</p>
                        <Button size="sm" className="mt-2" onClick={handleDrawPolygon}>
                          Create New Parcel
                        </Button>
                      </div>
                    ) : (
                      <p>Click on map to place a point marker</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Suggested Matches */}
            <div>
              <h4 className="font-medium mb-3">Suggested Parcel Matches</h4>
              <div className="space-y-3">
                {suggestedParcels.map((parcel) => (
                  <Card
                    key={parcel.id}
                    className={`cursor-pointer transition-colors ${
                      spatialMatch?.id === parcel.id ? "border-green-500 bg-green-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleParcelSelect(parcel)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{parcel.id}</span>
                            {spatialMatch?.id === parcel.id && <CheckCircle className="h-4 w-4 text-green-500" />}
                          </div>
                          <div className="text-sm text-muted-foreground space-y-1">
                            <div>Survey: {parcel.surveyNumber}</div>
                            <div>Area: {parcel.area} ha</div>
                            <div>Village: {parcel.village}</div>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            parcel.confidence >= 0.9
                              ? "text-green-600"
                              : parcel.confidence >= 0.7
                                ? "text-yellow-600"
                                : "text-red-600"
                          }
                        >
                          {Math.round(parcel.confidence * 100)}% match
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Card className="border-dashed">
                  <CardContent className="p-4 text-center">
                    <p className="text-sm text-muted-foreground mb-2">Can't find the right parcel?</p>
                    <Button size="sm" variant="outline" onClick={() => setDrawMode("polygon")}>
                      <Square className="h-4 w-4 mr-2" />
                      Draw New Parcel
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {spatialMatch && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Spatial match selected</span>
              </div>
              <div className="text-sm">
                <strong>Parcel ID:</strong> {spatialMatch.id} • <strong>Area:</strong> {spatialMatch.area} ha •{" "}
                <strong>Survey:</strong> {spatialMatch.surveyNumber}
                {spatialMatch.isNew && (
                  <Badge variant="outline" className="ml-2">
                    New Parcel
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious} disabled={!canGoPrevious}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Field Mapping
        </Button>
        <Button onClick={onNext} disabled={!spatialMatch || !canGoNext}>
          Continue to Review
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
