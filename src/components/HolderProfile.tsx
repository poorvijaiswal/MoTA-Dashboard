import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Briefcase, 
  IndianRupee, 
  Home, 
  Users,
  Calendar,
  FileText,
  Award,
  TrendingUp,
  Download
} from 'lucide-react';

interface HolderProfileProps {
  holder: any;
  claim: any;
  schemes: any[];
  onClose: () => void;
}

const HolderProfile = ({ holder, claim, schemes, onClose }: HolderProfileProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="shadow-card">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                {getInitials(holder.name)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">{holder.name}</h1>
              <p className="text-lg text-muted-foreground">{holder.tribe} Tribe • {holder.gender}</p>
              <div className="flex items-center space-x-4 mt-2">
                <Badge variant="outline" className="bg-primary/10">
                  Holder ID: {holder.id}
                </Badge>
                {claim && (
                  <Badge variant={claim.status === 'granted' ? 'default' : 'secondary'} className={
                    claim.status === 'granted' ? 'bg-success text-success-foreground' : ''
                  }>
                    FRA Status: {claim.status}
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <Button onClick={onClose} variant="outline">
                Close Profile
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="land">Land & Claims</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Stats */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Family Size</span>
                  <span className="font-medium">{holder.family_members}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Land Size</span>
                  <span className="font-medium">{holder.land_size}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Annual Income</span>
                  <span className="font-medium">{formatCurrency(holder.annual_income)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Schemes Linked</span>
                  <span className="font-medium">{holder.schemes_linked.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Phone className="w-5 h-5 mr-2" />
                  Contact & Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{holder.contact}</span>
                </div>
                {claim && (
                  <>
                    <div className="flex items-center space-x-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{claim.village}, {claim.district}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Home className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{claim.state}</span>
                    </div>
                  </>
                )}
                <div className="flex items-center space-x-3">
                  <Briefcase className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{holder.occupation}</span>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Summary */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2" />
                  Benefits Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">
                    {formatCurrency(holder.annual_income * 0.2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Estimated Annual Benefits</p>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Direct Transfer</span>
                    <span className="font-medium">₹6,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Housing Support</span>
                    <span className="font-medium">₹1,20,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Skill Development</span>
                    <span className="font-medium">₹15,000</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Detailed personal and family information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <p className="text-lg font-semibold">{holder.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gender</label>
                    <p className="text-lg">{holder.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Tribe</label>
                    <p className="text-lg">{holder.tribe} Tribe</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Occupation</label>
                    <p className="text-lg">{holder.occupation}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Family Members</label>
                    <p className="text-lg font-semibold">{holder.family_members} persons</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Annual Income</label>
                    <p className="text-lg font-semibold text-success">{formatCurrency(holder.annual_income)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Contact Number</label>
                    <p className="text-lg">{holder.contact}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Registration Date</label>
                    <p className="text-lg">March 15, 2023</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="land" className="space-y-6">
          {claim && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Land Holdings & FRA Claim</CardTitle>
                <CardDescription>Forest rights and land ownership details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Claim ID</label>
                      <p className="font-mono text-sm">{claim.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Claim Type</label>
                      <Badge variant="outline">{claim.type}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Land Area</label>
                      <p className="text-lg font-semibold">{holder.land_size}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge variant={claim.status === 'granted' ? 'default' : 'secondary'} className={
                        claim.status === 'granted' ? 'bg-success text-success-foreground' : ''
                      }>
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Village</label>
                      <p className="text-lg">{claim.village}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">District</label>
                      <p className="text-lg">{claim.district}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">State</label>
                      <p className="text-lg">{claim.state}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Submission Date</label>
                      <p className="text-lg">{claim.submission_date}</p>
                    </div>
                  </div>
                </div>
                
                {claim.shape_file && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Survey Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <label className="text-muted-foreground">Survey Number</label>
                        <p className="font-medium">{claim.shape_file.survey_number}</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">Total Area</label>
                        <p className="font-medium">{claim.shape_file.total_area_sqm} sq.m</p>
                      </div>
                      <div>
                        <label className="text-muted-foreground">Land Type</label>
                        <p className="font-medium">{claim.shape_file.land_classification}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="schemes" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Linked Government Schemes</CardTitle>
              <CardDescription>Current scheme enrollments and benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {holder.schemes_linked.map((schemeName: string, index: number) => (
                  <Card key={index} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{schemeName}</h4>
                          <p className="text-sm text-muted-foreground">Active since 2023</p>
                        </div>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          Active
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Timeline of important events and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                  <div>
                    <p className="font-medium">FRA Claim Approved</p>
                    <p className="text-sm text-muted-foreground">March 20, 2024</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                  <div>
                    <p className="font-medium">Enrolled in PM-KISAN</p>
                    <p className="text-sm text-muted-foreground">February 15, 2024</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 rounded-full bg-pending mt-2"></div>
                  <div>
                    <p className="font-medium">FRA Application Submitted</p>
                    <p className="text-sm text-muted-foreground">January 15, 2024</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <Button className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download Profile
            </Button>
            <Button variant="outline" className="flex-1">
              <FileText className="w-4 h-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" className="flex-1">
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HolderProfile;