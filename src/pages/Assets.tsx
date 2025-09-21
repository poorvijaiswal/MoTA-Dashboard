import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Search, MapPin, TreePine, Waves, Building2, Home, Eye, Filter, Calendar, Satellite } from 'lucide-react';

// Import data
import assetsData from '@/data/assets.json';
import reportsData from '@/data/reports.json';

const Assets = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique values for filters
  const assetTypes = [...new Set(assetsData.assets.map(asset => asset.type))];
  const sources = [...new Set(assetsData.assets.map(asset => asset.source))];

  // Filter assets
  const filteredAssets = assetsData.assets.filter(asset => {
    const matchesSearch = asset.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          asset.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    const matchesSource = sourceFilter === 'all' || asset.source === sourceFilter;
    
    return matchesSearch && matchesType && matchesSource;
  });

  // Pagination
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const paginatedAssets = filteredAssets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Chart data
  const assetTypeData = reportsData.asset_distribution.map(item => ({
    name: item.type,
    count: item.count,
    color: getAssetColor(item.type)
  }));

  const assetsByStateData = [
    { state: 'Odisha', forest: 45, farm: 32, pond: 12, homestead: 18 },
    { state: 'Jharkhand', forest: 38, farm: 28, pond: 15, homestead: 22 },
    { state: 'Madhya Pradesh', forest: 52, farm: 35, pond: 8, homestead: 16 },
    { state: 'Rajasthan', forest: 25, farm: 45, pond: 5, homestead: 14 },
    { state: 'Meghalaya', forest: 68, farm: 18, pond: 10, homestead: 12 }
  ];

  // Asset type configurations
  function getAssetIcon(type: string) {
    switch (type) {
      case 'forest': return <TreePine className="w-4 h-4 text-green-600" />;
      case 'farm': return <Home className="w-4 h-4 text-yellow-600" />;
      case 'pond': return <Waves className="w-4 h-4 text-blue-600" />;
      case 'homestead': return <Building2 className="w-4 h-4 text-orange-600" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  }

  function getAssetColor(type: string) {
    switch (type) {
      case 'forest': return '#16a34a';
      case 'farm': return '#ca8a04';
      case 'pond': return '#2563eb';
      case 'homestead': return '#ea580c';
      default: return '#6b7280';
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'Protected':
      case 'Active':
      case 'Occupied':
      case 'Cultivated':
      case 'Organic Certified':
        return <Badge variant="default" className="bg-success text-success-foreground">{status}</Badge>;
      case 'Under Construction':
        return <Badge variant="default" className="bg-pending text-pending-foreground">{status}</Badge>;
      case 'Reserved':
      case 'Sacred/Protected':
        return <Badge variant="secondary">{status}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  }

  // Summary statistics
  const totalAssets = filteredAssets.length;
  const assetCounts = assetTypes.reduce((acc, type) => {
    acc[type] = filteredAssets.filter(a => a.type === type).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Asset Management</h1>
        <p className="text-muted-foreground">
          Comprehensive inventory and mapping of tribal assets and land resources
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
                <p className="text-2xl font-bold">{totalAssets}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        {assetTypes.map(type => (
          <Card key={type} className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground capitalize">{type}</p>
                  <p className="text-2xl font-bold" style={{ color: getAssetColor(type) }}>
                    {assetCounts[type] || 0}
                  </p>
                </div>
                {getAssetIcon(type)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="registry">Asset Registry</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Asset Type Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Asset Distribution by Type</CardTitle>
                <CardDescription>Total assets mapped across categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={assetTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, count }) => `${name}: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {assetTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Asset Distribution Map
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-72 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
                  <div className="text-center p-6">
                    <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-semibold mb-2">Interactive Asset Map</h3>
                    <p className="text-muted-foreground text-sm">
                      Leaflet map showing asset locations with clustered markers
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Assets */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recently Surveyed Assets</CardTitle>
              <CardDescription>Latest asset updates and surveys</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {assetsData.assets.slice(0, 6).map(asset => (
                  <div key={asset.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getAssetIcon(asset.type)}
                        <span className="font-medium text-sm">{asset.id}</span>
                      </div>
                      {getStatusBadge(asset.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{asset.location}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>{asset.last_surveyed}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <Satellite className="w-3 h-3" />
                        <span>{asset.source}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="registry" className="space-y-6">
          {/* Filters */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Search & Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Asset Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {assetTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {sources.map(source => (
                      <SelectItem key={source} value={source}>
                        {source.charAt(0).toUpperCase() + source.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  Export Registry
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Assets Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Registry</CardTitle>
              <CardDescription>
                Showing {paginatedAssets.length} of {totalAssets} assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Asset ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Area</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Last Surveyed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAssets.map((asset) => (
                    <TableRow key={asset.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{asset.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getAssetIcon(asset.type)}
                          <span className="capitalize">{asset.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{asset.location}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{asset.area}</TableCell>
                      <TableCell>{getStatusBadge(asset.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Satellite className="w-3 h-3 text-muted-foreground" />
                          <span className="capitalize">{asset.source}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm">{asset.last_surveyed}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <MapPin className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAssets)} of {totalAssets} results
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Assets by State Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Asset Distribution by State</CardTitle>
              <CardDescription>Breakdown of different asset types across states</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={assetsByStateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="forest" stackId="a" fill="#16a34a" name="Forest" />
                  <Bar dataKey="farm" stackId="a" fill="#ca8a04" name="Farm" />
                  <Bar dataKey="pond" stackId="a" fill="#2563eb" name="Pond" />
                  <Bar dataKey="homestead" stackId="a" fill="#ea580c" name="Homestead" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Asset Quality Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Survey Coverage</CardTitle>
                <CardDescription>Asset mapping completion status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Satellite Surveyed</span>
                    <span className="font-medium">
                      {assetsData.assets.filter(a => a.source === 'satellite').length} assets
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Ground Verified</span>
                    <span className="font-medium">
                      {assetsData.assets.filter(a => a.source === 'ground').length} assets
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coverage Rate</span>
                    <span className="font-medium text-success">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Asset Status Summary</CardTitle>
                <CardDescription>Current status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active/Protected</span>
                    <Badge variant="default" className="bg-success text-success-foreground">
                      {assetsData.assets.filter(a => 
                        ['Protected', 'Active', 'Occupied', 'Cultivated'].includes(a.status)
                      ).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Under Development</span>
                    <Badge variant="default" className="bg-pending text-pending-foreground">
                      {assetsData.assets.filter(a => a.status === 'Under Construction').length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Reserved/Sacred</span>
                    <Badge variant="secondary">
                      {assetsData.assets.filter(a => 
                        ['Reserved', 'Sacred/Protected'].includes(a.status)
                      ).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Assets;