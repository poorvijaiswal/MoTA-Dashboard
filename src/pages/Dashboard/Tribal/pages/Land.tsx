import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, FileText, Calendar, Download, Eye } from "lucide-react";
import Navigation from "../components/Navigation";
import MapComponent from "../components/MapComponent";

interface Claim {
  id: string;
  claim_type: string;
  claim_type_full: string;
  area_hectares: number;
  survey_number: string;
  village: string;
  district: string;
  status: string;
  title_holder: string;
  recognition_date?: string;
  validity: string;
  coordinates: any;
  timeline: Array<{
    date: string;
    status: string;
    note: string;
  }>;
  documents: string[];
}

const Land = () => {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);

  useEffect(() => {
    // Load claims data
    fetch('/dataTribal/claims.json')
      .then(res => res.json())
      .then(data => {
        const userClaims = data.claims.filter((c: any) => c.user_id === 'user_001');
        setClaims(userClaims);
        if (userClaims.length > 0) {
          setSelectedClaim(userClaims[0]);
        }
      });
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-success text-success-foreground';
      case 'Under Verification':
        return 'bg-warning text-warning-foreground';
      case 'Submitted':
        return 'bg-primary text-primary-foreground';
      case 'Rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Land & Claims</h1>
            <p className="text-muted-foreground">Forest Rights Act land records and claims</p>
          </div>
        </div>

        {claims.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Land Claims</h3>
              <p className="text-muted-foreground">
                You don't have any registered land claims under FRA.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Claims List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h2 className="text-lg font-semibold">Land Claims</h2>
                {claims.map((claim) => (
                  <Card 
                    key={claim.id} 
                    className={`cursor-pointer transition-all ${
                      selectedClaim?.id === claim.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedClaim(claim)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{claim.claim_type_full}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            {claim.survey_number} • {claim.village}
                          </p>
                        </div>
                        <Badge className={getStatusColor(claim.status)}>
                          {claim.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Area</p>
                          <p className="font-medium">{claim.area_hectares} hectares</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Title Holder</p>
                          <p className="font-medium">{claim.title_holder}</p>
                        </div>
                        {claim.recognition_date && (
                          <>
                            <div>
                              <p className="text-muted-foreground">Recognition Date</p>
                              <p className="font-medium">
                                {new Date(claim.recognition_date).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Validity</p>
                              <p className="font-medium">{claim.validity}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Map View */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Land Boundaries</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="h-96 rounded-lg overflow-hidden">
                      <MapComponent selectedClaim={selectedClaim} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Selected Claim Details */}
            {selectedClaim && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span>Claim Details - {selectedClaim.id}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Documents */}
                  <div>
                    <h3 className="font-medium mb-3">Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {selectedClaim.documents.map((doc, index) => (
                        <Button key={index} variant="outline" size="sm" className="justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          <span className="truncate">{doc}</span>
                          <Download className="w-3 h-3 ml-auto" />
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Timeline */}
                  <div>
                    <h3 className="font-medium mb-3">Processing Timeline</h3>
                    <div className="space-y-4">
                      {selectedClaim.timeline.map((item, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-3 h-3 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-medium">{item.status}</h4>
                              <span className="text-xs text-muted-foreground">
                                {new Date(item.date).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="">
                    <Button variant="outline" className="flex-1 w-full">
                      <Eye className="w-full h-4 mr-2" />
                      View Certificate
                    </Button>
                    <Button variant="outline" className="flex-1 w-full mt-2">
                      <Download className="w-full h-4 mr-2" />
                      Download Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Land;