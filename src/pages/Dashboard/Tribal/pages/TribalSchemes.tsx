import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Calendar, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation";

interface Scheme {
  id: string;
  name: string;
  full_name: string;
  ministry: string;
  description: string;
  benefit_amount: string;
  user_status: string;
  deadline: string;
  status: string;
}

const Schemes = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState<Scheme[]>([]);

  useEffect(() => {
    // Load schemes data
    fetch('/dataTribal/schemes.json')
      .then(res => res.json())
      .then(data => setSchemes(Array.isArray(data.schemes) ? data.schemes : []))
      .catch(() => setSchemes([]));
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Eligible':
        return <CheckCircle className="w-4 h-4" />;
      case 'Applied':
        return <AlertCircle className="w-4 h-4" />;
      case 'Not Eligible':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Gift className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Eligible':
        return 'bg-success text-success-foreground';
      case 'Applied':
        return 'bg-primary text-primary-foreground';
      case 'Not Eligible':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const canApply = (userStatus: string) => {
    return userStatus === 'Eligible';
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Available Schemes</h1>
          <p className="text-muted-foreground">Discover and apply for government schemes</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
            <Button size="sm" className="bg-background text-foreground shadow-sm">
              All Schemes
            </Button>
            <Button variant="ghost" size="sm">
              Eligible
            </Button>
            <Button variant="ghost" size="sm">
              Applied
            </Button>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(Array.isArray(schemes) ? schemes : []).map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scheme.ministry}</p>
                  </div>
                  <Badge className={getStatusColor(scheme.user_status)}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(scheme.user_status)}
                      <span>{scheme.user_status}</span>
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-foreground">{scheme.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Benefit Amount:</span>
                    <span className="font-medium text-success">{scheme.benefit_amount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Deadline:</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span className="font-medium">
                        {new Date(scheme.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/dashboard/tribal/schemes/${scheme.id}`)}
                  >
                    View Details
                  </Button>
                  
                  {canApply(scheme.user_status) && (
                    <Button 
                      size="sm" 
                      className="flex-1 bg-secondary hover:bg-secondary-hover text-secondary-foreground"
                      onClick={() => navigate(`/dashboard/tribal/schemes/${scheme.id}`)}
                    >
                      Apply Now
                    </Button>
                  )}
                  
                  {scheme.user_status === 'Applied' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate('/dashboard/tribal/my-schemes')}
                    >
                      Track Application
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {schemes.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Schemes Available</h3>
              <p className="text-muted-foreground">
                Check back later for new scheme announcements.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Schemes;