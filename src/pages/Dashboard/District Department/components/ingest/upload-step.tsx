"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, ImageIcon, X, ArrowRight } from "lucide-react"

interface UploadStepProps {
  data: any
  onDataChange: (data: any) => void
  onNext: () => void
  onPrevious: () => void
  canGoNext: boolean
  canGoPrevious: boolean
}

export function UploadStep({ data, onDataChange, onNext, canGoNext }: UploadStepProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(data.uploadedFile)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        const file = e.dataTransfer.files[0]
        if (file.type === "application/pdf" || file.type.startsWith("image/")) {
          setUploadedFile(file)
          onDataChange({ uploadedFile: file })
        }
      }
    },
    [onDataChange],
  )

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadedFile(file)
      onDataChange({ uploadedFile: file })
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
    onDataChange({ uploadedFile: null })
  }

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return FileText
    if (file.type.startsWith("image/")) return ImageIcon
    return FileText
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload FRA Document
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!uploadedFile ? (
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Upload FRA Patta Document</h3>
              <p className="text-muted-foreground mb-4">Drag and drop your document here, or click to browse</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="outline">PDF</Badge>
                <Badge variant="outline">JPG</Badge>
                <Badge variant="outline">PNG</Badge>
              </div>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileInput}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button asChild>
                  <span className="cursor-pointer">Choose File</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {(() => {
                      const Icon = getFileIcon(uploadedFile)
                      return <Icon className="h-6 w-6 text-blue-600" />
                    })()}
                  </div>
                  <div>
                    <h4 className="font-medium">{uploadedFile.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadedFile.size)} • {uploadedFile.type}
                    </p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={removeFile}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* File Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  {uploadedFile.type === "application/pdf" ? (
                    <div>
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">PDF Document Ready for Processing</p>
                    </div>
                  ) : (
                    <div>
                      <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">Image Document Ready for Processing</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Upload Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Supported formats:</strong> PDF, JPG, PNG files up to 10MB
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Document quality:</strong> Ensure text is clear and readable for better OCR results
              </div>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <div>
                <strong>Document types:</strong> FRA patta claims, title deeds, survey maps, ID proofs
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!uploadedFile || !canGoNext}>
          Continue to OCR
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
