import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Search, Users, MapPin, Phone, Briefcase, IndianRupee, Home, Filter } from 'lucide-react';
import HolderProfile from '@/components/HolderProfile';

// Import data
import holdersData from '@/data/holders.json';
import claimsData from '@/data/claims.json';
import schemesData from '@/data/schemes.json';

const PattaHolders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tribeFilter, setTribeFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [selectedHolder, setSelectedHolder] = useState<any>(null);

  // Get unique tribes for filter
  const tribes = [...new Set(holdersData.holders.map(holder => holder.tribe))];

  // Filter holders
  const filteredHolders = holdersData.holders.filter(holder => {
    const matchesSearch = holder.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          holder.tribe.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTribe = tribeFilter === 'all' || holder.tribe === tribeFilter;
    const matchesGender = genderFilter === 'all' || holder.gender === genderFilter;
    
    return matchesSearch && matchesTribe && matchesGender;
  });

  // Get holder's claim details
  const getHolderClaim = (claimId: string) => {
    return claimsData.claims.find(claim => claim.id === claimId);
  };

  // Get scheme details
  const getSchemeDetails = (schemeName: string) => {
    return schemesData.schemes.find(scheme => 
      scheme.name.toLowerCase().includes(schemeName.toLowerCase()) ||
      schemeName.toLowerCase().includes(scheme.name.toLowerCase())
    );
  };

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

  // Show full profile if selected
  if (selectedHolder?.showFullProfile) {
    const claim = getHolderClaim(selectedHolder.claim_id);
    const holderSchemes = selectedHolder.schemes_linked.map((schemeName: string) => 
      getSchemeDetails(schemeName)
    ).filter(Boolean);
    
    return (
      <HolderProfile 
        holder={selectedHolder}
        claim={claim}
        schemes={holderSchemes}
        onClose={() => setSelectedHolder(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Patta Holders</h1>
        <p className="text-muted-foreground">
          Comprehensive database of Forest Rights Act patta holders and their profiles
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Holders</p>
                <p className="text-2xl font-bold">{filteredHolders.length}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Male</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredHolders.filter(h => h.gender === 'Male').length}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Female</p>
                <p className="text-2xl font-bold text-pink-600">
                  {filteredHolders.filter(h => h.gender === 'Female').length}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-pink-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Income</p>
                <p className="text-xl font-bold text-success">
                  {formatCurrency(
                    filteredHolders.reduce((sum, h) => sum + h.annual_income, 0) / filteredHolders.length
                  )}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Filters and List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filters */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search holders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={tribeFilter} onValueChange={setTribeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tribe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tribes</SelectItem>
                    {tribes.map(tribe => (
                      <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={genderFilter} onValueChange={setGenderFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Holders List */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Patta Holders Registry</CardTitle>
              <CardDescription>
                Showing {filteredHolders.length} holders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredHolders.map(holder => {
                  const claim = getHolderClaim(holder.claim_id);
                  return (
                    <div 
                      key={holder.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedHolder?.id === holder.id ? 'ring-2 ring-primary bg-primary/5' : ''
                      }`}
                      onClick={() => setSelectedHolder(holder)}
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {getInitials(holder.name)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-semibold">{holder.name}</h4>
                            <Badge variant={claim?.status === 'granted' ? 'default' : 'secondary'} className={
                              claim?.status === 'granted' ? 'bg-success text-success-foreground' : ''
                            }>
                              {claim?.status || 'Unknown'}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center space-x-1">
                              <Users className="w-3 h-3" />
                              <span>{holder.tribe} Tribe</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Home className="w-3 h-3" />
                              <span>{holder.family_members} members</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-3 h-3" />
                              <span>{holder.land_size}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <IndianRupee className="w-3 h-3" />
                              <span>{formatCurrency(holder.annual_income)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Holder Details */}
        <div>
          {selectedHolder ? (
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Avatar className="w-16 h-16">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(selectedHolder.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{selectedHolder.name}</CardTitle>
                    <CardDescription>{selectedHolder.tribe} Tribe • {selectedHolder.gender}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="personal" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="personal">Personal</TabsTrigger>
                    <TabsTrigger value="claim">Claim</TabsTrigger>
                    <TabsTrigger value="schemes">Schemes</TabsTrigger>
                  </TabsList>

                  <TabsContent value="personal" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Family Size</p>
                        <p className="font-medium">{selectedHolder.family_members} members</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Annual Income</p>
                        <p className="font-medium">{formatCurrency(selectedHolder.annual_income)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Land Size</p>
                        <p className="font-medium">{selectedHolder.land_size}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact</p>
                        <p className="font-medium flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedHolder.contact}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Occupation</p>
                      <p className="font-medium flex items-center">
                        <Briefcase className="w-4 h-4 mr-2" />
                        {selectedHolder.occupation}
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="claim" className="space-y-4">
                    {(() => {
                      const claim = getHolderClaim(selectedHolder.claim_id);
                      if (!claim) return <p>No claim found</p>;
                      
                      return (
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Claim ID</p>
                            <p className="font-mono text-sm">{claim.id}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Type</p>
                              <p className="font-medium">{claim.type}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <Badge variant={claim.status === 'granted' ? 'default' : 'secondary'} className={
                                claim.status === 'granted' ? 'bg-success text-success-foreground' : ''
                              }>
                                {claim.status}
                              </Badge>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{claim.village}, {claim.district}, {claim.state}</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Submitted</p>
                              <p className="font-medium">{claim.submission_date}</p>
                            </div>
                            {claim.approval_date && (
                              <div>
                                <p className="text-sm text-muted-foreground">Approved</p>
                                <p className="font-medium">{claim.approval_date}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="schemes" className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-3">Linked Government Schemes</p>
                      <div className="space-y-2">
                        {selectedHolder.schemes_linked.map((schemeName: string, index: number) => {
                          const scheme = getSchemeDetails(schemeName);
                          return (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                              <div>
                                <p className="font-medium text-sm">{schemeName}</p>
                                {scheme && (
                                  <p className="text-xs text-muted-foreground">{scheme.ministry}</p>
                                )}
                              </div>
                              <Badge variant="outline" className="bg-success/10 text-success">
                                Active
                              </Badge>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    {selectedHolder.schemes_linked.length === 0 && (
                      <div className="text-center py-6 text-muted-foreground">
                        <Briefcase className="w-12 h-12 mx-auto mb-2" />
                        <p>No schemes linked</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <div className="mt-6 space-y-2">
                  <Button 
                    className="w-full"
                    onClick={() => setSelectedHolder({ ...selectedHolder, showFullProfile: true })}
                  >
                    View Full Profile
                  </Button>
                  <Button variant="outline" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Select a Patta Holder</h3>
                <p className="text-muted-foreground">
                  Choose a holder from the list to view their detailed profile and claim information.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default PattaHolders;