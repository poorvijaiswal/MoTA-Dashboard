import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Eye, Home, TreePine, Waves, Building2 } from 'lucide-react';

// Import data
import claimsData from '@/data/claims.json';
import assetsData from '@/data/assets.json';
import holdersData from '@/data/holders.json';

const FRAAtlas = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedState, setSelectedState] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // Get unique states for filter
  const states = [...new Set(claimsData.claims.map(claim => claim.state))];

  // Filter claims based on selected filters
  const filteredClaims = claimsData.claims.filter(claim => {
    return (selectedState === 'all' || claim.state === selectedState) &&
           (selectedType === 'all' || claim.type === selectedType);
  });

  // Asset type icons
  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'forest': return <TreePine className="w-4 h-4" />;
      case 'farm': return <Home className="w-4 h-4" />;
      case 'pond': return <Waves className="w-4 h-4" />;
      case 'homestead': return <Building2 className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'granted': return 'success';
      case 'pending': return 'pending';
      case 'rejected': return 'destructive';
      default: return 'secondary';
    }
  };

  useEffect(() => {
    // Simulated map initialization - In a real app, you would use Leaflet here
    if (mapRef.current) {
      // This would be replaced with actual Leaflet map initialization
      console.log('Map would be initialized here with Leaflet');
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">FRA Atlas</h1>
          <p className="text-muted-foreground">
            Interactive map of Forest Rights Act claims and tribal assets
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              {states.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Claim Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="IFR">Individual (IFR)</SelectItem>
              <SelectItem value="CFR">Community (CFR)</SelectItem>
              <SelectItem value="CR">Community Rights (CR)</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Interactive Map
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Placeholder for Leaflet Map */}
              <div 
                ref={mapRef}
                className="w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center"
              >
                <div className="text-center p-6">
                  <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Interactive Map View</h3>
                  <p className="text-muted-foreground mb-4">
                    Leaflet map would be rendered here showing:
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-success"></div>
                      <span>Granted Claims</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-pending"></div>
                      <span>Pending Claims</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-destructive"></div>
                      <span>Rejected Claims</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend */}
              <div className="flex flex-wrap gap-4 mt-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <TreePine className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Forest Assets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Home className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm">Farm Land</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Waves className="w-4 h-4 text-blue-600" />
                  <span className="text-sm">Water Bodies</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">Homesteads</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Claims List */}
        <div className="space-y-4">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Claims Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Total Filtered:</span>
                  <span className="font-medium">{filteredClaims.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Granted:</span>
                  <span className="font-medium text-success">
                    {filteredClaims.filter(c => c.status === 'granted').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pending:</span>
                  <span className="font-medium text-pending">
                    {filteredClaims.filter(c => c.status === 'pending').length}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rejected:</span>
                  <span className="font-medium text-destructive">
                    {filteredClaims.filter(c => c.status === 'rejected').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Claims */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Claims</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 max-h-96 overflow-y-auto">
              {filteredClaims.slice(0, 10).map(claim => (
                <div 
                  key={claim.id}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setSelectedClaim(claim)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{claim.id}</span>
                    <Badge variant={getStatusColor(claim.status) as any}>
                      {claim.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>{claim.holder_name}</p>
                    <p>{claim.village}, {claim.district}</p>
                    <p className="text-xs">{claim.area} • {claim.type}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Selected Claim Details */}
          {selectedClaim && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Claim Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedClaim.holder_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedClaim.village}, {selectedClaim.district}, {selectedClaim.state}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedClaim.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Area</p>
                    <p className="font-medium">{selectedClaim.area}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <Badge variant={getStatusColor(selectedClaim.status) as any}>
                      {selectedClaim.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{selectedClaim.submission_date}</p>
                  </div>
                </div>

                {selectedClaim.rejection_reason && (
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <p className="text-sm font-medium text-destructive">Rejection Reason:</p>
                    <p className="text-sm">{selectedClaim.rejection_reason}</p>
                  </div>
                )}

                <Button className="w-full" size="sm">
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FRAAtlas;