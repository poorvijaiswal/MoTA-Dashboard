import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Upload, Mic, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navigation from "../components/Navigation";

const ComplaintsNew = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    files: [] as string[],
    location: {
      latitude: 20.1366,
      longitude: 79.9570,
      address: 'Gadchiroli, Maharashtra'
    }
  });

  const categories = [
    "Claim issue",
    "Scheme issue", 
    "Land boundary",
    "Encroachment",
    "Other"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      setFormData(prev => ({ ...prev, files: [...prev.files, ...fileNames] }));
    }
  };

  const handleSubmit = async () => {
    // Mock submission - would normally save to backend
    const newComplaint = {
      id: 'CMP' + String(Date.now()).slice(-3),
      user_id: 'user_001',
      category: formData.category,
      title: `${formData.category} - ${formData.description.substring(0, 50)}...`,
      description: formData.description,
      status: 'Pending',
      priority: 'Medium',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      location: formData.location,
      attachments: formData.files,
      timeline: [{
        date: new Date().toISOString(),
        status: 'Submitted',
        note: 'Complaint filed by Ram Charan'
      }],
      officer_feedback: null
    };

    // Save to localStorage for demo
    const existingComplaints = JSON.parse(localStorage.getItem('complaints') || '{"complaints": []}');
    existingComplaints.complaints.push(newComplaint);
    localStorage.setItem('complaints', JSON.stringify(existingComplaints));

    toast({
      title: "Complaint Submitted",
      description: `Your complaint ${newComplaint.id} has been filed successfully.`,
    });

    navigate('/dashboard/tribal/complaints');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="mb-6">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-8 h-0.5 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2 space-x-8 text-xs text-muted-foreground">
            <span>Category</span>
            <span>Details</span>
            <span>Review</span>
          </div>
        </div>

        {/* Step 1: Category Selection */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Complaint Category</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={formData.category === category ? "default" : "outline"}
                    className="h-12 justify-start"
                    onClick={() => setFormData(prev => ({ ...prev, category }))}
                  >
                    {category}
                  </Button>
                ))}
              </div>
              
              <Button 
                onClick={() => setStep(2)}
                disabled={!formData.category}
                className="w-full bg-primary hover:bg-primary-hover"
              >
                Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Provide Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="min-h-24"
                />
              </div>

              {/* Voice Recording Mock */}
              <div className="space-y-2">
                <Label>Voice Message (Optional)</Label>
                <Button variant="outline" className="w-full h-12">
                  <Mic className="w-4 h-4 mr-2" />
                  Record Voice Message
                </Button>
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label>Attach Files (Optional)</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click to upload images or documents
                      </p>
                    </div>
                  </label>
                  {formData.files.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {formData.files.map((file, i) => (
                        <p key={i} className="text-sm text-success">✓ {file}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Current Location</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{formData.location.address}</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Use My Location
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={() => setStep(3)}
                  disabled={!formData.description}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review Your Complaint</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Category</h4>
                  <p className="text-muted-foreground">{formData.category}</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Description</h4>
                  <p className="text-muted-foreground">{formData.description}</p>
                </div>

                {formData.files.length > 0 && (
                  <div>
                    <h4 className="font-medium">Attachments</h4>
                    <ul className="text-muted-foreground">
                      {formData.files.map((file, i) => (
                        <li key={i}>• {file}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-muted-foreground">{formData.location.address}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="flex-1 bg-primary hover:bg-primary-hover"
                >
                  Submit Complaint
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ComplaintsNew;