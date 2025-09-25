import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Gift, Calendar, FileText, Upload, Building2, CheckCircle } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import Navigation from "../components/Navigation";

interface Scheme {
  id: string;
  name: string;
  full_name: string;
  ministry: string;
  description: string;
  benefit_amount: string;
  eligibility: string[];
  required_documents: string[];
  application_process: string;
  user_status: string;
  deadline: string;
}

const SchemeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState<Scheme | null>(null);
  const [showApplication, setShowApplication] = useState(false);
  const [applicationData, setApplicationData] = useState({
    documents: [] as string[],
    consent: false
  });

  useEffect(() => {
    // Load scheme data
    fetch('/dataTribal/schemes.json')
      .then(res => res.json())
      .then(data => {
        const found = data.schemes.find((s: any) => s.id === id);
        setScheme(found);
      });
  }, [id]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileNames = Array.from(e.target.files).map(file => file.name);
      setApplicationData(prev => ({ 
        ...prev, 
        documents: [...prev.documents, ...fileNames] 
      }));
    }
  };

  const handleSubmitApplication = () => {
    // Mock application submission
    toast({
      title: "Application Submitted",
      description: `Your application for ${scheme?.name} has been submitted successfully.`,
    });

    // Navigate to My Schemes
    navigate('/dashboard/tribal/my-schemes');
  };

  if (!scheme) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-6">
          <p>Loading scheme details...</p>
        </div>
      </div>
    );
  }

  const canApply = scheme.user_status === 'Eligible';

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Gift className="w-6 h-6 text-secondary" />
                  <CardTitle className="text-xl">{scheme.name}</CardTitle>
                </div>
                <p className="text-lg text-muted-foreground">{scheme.full_name}</p>
                <div className="flex items-center space-x-2 text-sm">
                  <Building2 className="w-4 h-4" />
                  <span>{scheme.ministry}</span>
                </div>
              </div>
              <Badge className={scheme.user_status === 'Eligible' ? 'bg-success text-success-foreground' : 
                              scheme.user_status === 'Applied' ? 'bg-primary text-primary-foreground' : 
                              'bg-muted text-muted-foreground'}>
                {scheme.user_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground mb-4">{scheme.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Benefit Amount</p>
                <p className="text-lg font-semibold text-success">{scheme.benefit_amount}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Application Deadline</p>
                  <p className="font-medium">{new Date(scheme.deadline).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eligibility Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>Eligibility Criteria</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheme.eligibility.map((criteria, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{criteria}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Required Documents */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Required Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {scheme.required_documents.map((doc, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <FileText className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{doc}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card>
          <CardHeader>
            <CardTitle>Application Process</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{scheme.application_process}</p>
          </CardContent>
        </Card>

        {/* Application Form */}
        {canApply && !showApplication && (
          <Card>
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium mb-2">Ready to Apply?</h3>
              <p className="text-muted-foreground mb-4">
                You meet the eligibility criteria for this scheme.
              </p>
              <Button 
                onClick={() => setShowApplication(true)}
                className="bg-secondary hover:bg-secondary-hover text-secondary-foreground"
              >
                Start Application
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Application Form */}
        {showApplication && (
          <Card>
            <CardHeader>
              <CardTitle>Application Form</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Document Upload */}
              <div className="space-y-3">
                <Label>Upload Required Documents</Label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="doc-upload"
                  />
                  <label htmlFor="doc-upload" className="cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Click to upload required documents
                      </p>
                    </div>
                  </label>
                  {applicationData.documents.length > 0 && (
                    <div className="mt-4 space-y-1">
                      {applicationData.documents.map((file, i) => (
                        <p key={i} className="text-sm text-success">✓ {file}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start space-x-2">
                <Checkbox 
                  id="consent"
                  checked={applicationData.consent}
                  onCheckedChange={(checked) => 
                    setApplicationData(prev => ({ ...prev, consent: !!checked }))
                  }
                />
                <Label htmlFor="consent" className="text-sm leading-5">
                  I confirm that all the information provided is accurate and I consent to 
                  the verification of the documents and information by the concerned authorities.
                </Label>
              </div>

              <Separator />

              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => setShowApplication(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitApplication}
                  disabled={!applicationData.consent || applicationData.documents.length === 0}
                  className="flex-1 bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                >
                  Submit Application
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Already Applied */}
        {scheme.user_status === 'Applied' && (
          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Application Submitted</h3>
              <p className="text-muted-foreground mb-4">
                Your application for this scheme has been submitted and is under review.
              </p>
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/tribal/my-schemes')}
              >
                Track Application Status
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SchemeDetail;