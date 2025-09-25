import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, Eye, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

interface SchemeApplication {
  id: string;
  name: string;
  full_name: string;
  ministry: string;
  benefit_amount: string;
  application_date: string;
  status: 'Applied' | 'Under Review' | 'Approved' | 'Rejected';
  estimated_processing_time: string;
  disbursement_date?: string;
}

const MySchemes = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<SchemeApplication[]>([]);

  useEffect(() => {
    // Mock user's scheme applications
    const mockApplications: SchemeApplication[] = [
      {
        id: 'SCH003',
        name: 'MGNREGA',
        full_name: 'Mahatma Gandhi National Rural Employment Guarantee Act',
        ministry: 'Ministry of Rural Development',
        benefit_amount: '₹309 per day',
        application_date: '2024-01-10',
        status: 'Approved',
        estimated_processing_time: '15 days',
        disbursement_date: '2024-01-25'
      },
      {
        id: 'SCH001',
        name: 'PM-KISAN',
        full_name: 'Pradhan Mantri Kisan Samman Nidhi',
        ministry: 'Ministry of Agriculture & Farmers Welfare',
        benefit_amount: '₹6,000 per year',
        application_date: '2024-01-15',
        status: 'Under Review',
        estimated_processing_time: '30 days'
      }
    ];
    setApplications(mockApplications);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Applied':
        return <Clock className="w-4 h-4" />;
      case 'Under Review':
        return <AlertCircle className="w-4 h-4" />;
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Applied':
        return 'bg-muted text-muted-foreground';
      case 'Under Review':
        return 'bg-warning text-warning-foreground';
      case 'Approved':
        return 'bg-success text-success-foreground';
      case 'Rejected':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'Applied':
        return 25;
      case 'Under Review':
        return 50;
      case 'Approved':
        return 100;
      case 'Rejected':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">My Schemes</h1>
            <p className="text-muted-foreground">Track your scheme applications</p>
          </div>
          <Button 
            onClick={() => navigate('/dashboard/tribal/schemes')}
            className="bg-secondary hover:bg-secondary-hover text-secondary-foreground"
          >
            <Gift className="w-4 h-4 mr-2" />
            Browse Schemes
          </Button>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {applications.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Applications Yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't applied for any schemes yet.
                </p>
                <Button 
                  onClick={() => navigate('/dashboard/tribal/schemes')}
                  className="bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                >
                  Explore Available Schemes
                </Button>
              </CardContent>
            </Card>
          ) : (
            applications.map((application) => (
              <Card key={application.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-secondary" />
                        <span>{application.name}</span>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{application.ministry}</p>
                    </div>
                    <Badge className={getStatusColor(application.status)}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(application.status)}
                        <span>{application.status}</span>
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{getProgressPercentage(application.status)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(application.status)}%` }}
                      />
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Benefit Amount</p>
                      <p className="font-medium text-success">{application.benefit_amount}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Applied On</p>
                      <p className="font-medium">
                        {new Date(application.application_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Processing Time</p>
                      <p className="font-medium">{application.estimated_processing_time}</p>
                    </div>
                    {application.disbursement_date && (
                      <div>
                        <p className="text-muted-foreground">Disbursement Date</p>
                        <p className="font-medium text-success">
                          {new Date(application.disbursement_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status-specific Messages */}
                  {application.status === 'Under Review' && (
                    <div className="bg-warning/80 border border-warning/20 rounded-lg p-3">
                      <p className="text-sm text-warning-foreground">
                        📋 Your application is currently under review by the concerned department.
                        You will be notified once the verification is complete.
                      </p>
                    </div>
                  )}

                  {application.status === 'Approved' && (
                    <div className="bg-success/80 border border-success/20 rounded-lg p-3">
                      <p className="text-sm text-success-foreground">
                        ✅ Congratulations! Your application has been approved. 
                        Benefits will be disbursed as per the scheme guidelines.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/dashboard/tribal/schemes/${application.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {applications.length > 0 && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {applications.length}
                </p>
                <p className="text-xs text-muted-foreground">Total Applications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-success">
                  {applications.filter(a => a.status === 'Approved').length}
                </p>
                <p className="text-xs text-muted-foreground">Approved</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">
                  {applications.filter(a => a.status === 'Under Review').length}
                </p>
                <p className="text-xs text-muted-foreground">Under Review</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-secondary">
                  ₹6,309
                </p>
                <p className="text-xs text-muted-foreground">Total Benefits</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySchemes;