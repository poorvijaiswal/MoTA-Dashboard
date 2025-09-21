import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Briefcase, TrendingUp, Users, IndianRupee, Edit2, Plus, Filter, FileText } from 'lucide-react';

// Import data
import schemesData from '@/data/schemes.json';
import reportsData from '@/data/reports.json';

const Schemes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [ministryFilter, setMinistryFilter] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<any>(null);
  const [editingScheme, setEditingScheme] = useState<any>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Get unique values for filters
  const ministries = [...new Set(schemesData.schemes.map(scheme => scheme.ministry))];
  const statuses = ['available', 'sanctioned', 'implemented'];

  // Filter schemes
  const filteredSchemes = schemesData.schemes.filter(scheme => {
    const matchesSearch = scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scheme.ministry.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || scheme.status === statusFilter;
    const matchesMinistry = ministryFilter === 'all' || scheme.ministry === ministryFilter;
    
    return matchesSearch && matchesStatus && matchesMinistry;
  });

  // Summary statistics
  const totalSchemes = filteredSchemes.length;
  const implementedSchemes = filteredSchemes.filter(s => s.status === 'implemented').length;
  const sanctionedSchemes = filteredSchemes.filter(s => s.status === 'sanctioned').length;
  const availableSchemes = filteredSchemes.filter(s => s.status === 'available').length;
  const totalBeneficiaries = filteredSchemes.reduce((sum, s) => sum + (s.beneficiaries || 0), 0);
  const totalBudget = filteredSchemes.reduce((sum, s) => sum + (s.budget_allocated || 0), 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'implemented': 
        return <Badge variant="default" className="bg-success text-success-foreground">Implemented</Badge>;
      case 'sanctioned': 
        return <Badge variant="default" className="bg-pending text-pending-foreground">Sanctioned</Badge>;
      case 'available': 
        return <Badge variant="outline">Available</Badge>;
      default: 
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  const handleEditScheme = (scheme: any) => {
    setEditingScheme({ ...scheme });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    // In a real app, this would save to backend
    const updatedSchemes = schemesData.schemes.map(s => 
      s.id === editingScheme.id ? editingScheme : s
    );
    console.log('Updated schemes:', updatedSchemes);
    setIsEditDialogOpen(false);
    setEditingScheme(null);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Government Schemes</h1>
        <p className="text-muted-foreground">
          Manage and monitor government schemes for tribal development and welfare
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Schemes</p>
                <p className="text-2xl font-bold">{totalSchemes}</p>
              </div>
              <Briefcase className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Implemented</p>
                <p className="text-2xl font-bold text-success">{implementedSchemes}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sanctioned</p>
                <p className="text-2xl font-bold text-pending">{sanctionedSchemes}</p>
              </div>
              <FileText className="h-8 w-8 text-pending" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                <p className="text-xl font-bold text-blue-600">{totalBeneficiaries.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Budget</p>
                <p className="text-lg font-bold text-indigo-600">{formatCurrency(totalBudget)}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schemes">Scheme Registry</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-20 flex-col">
                  <Plus className="w-6 h-6 mb-2" />
                  Add New Scheme
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  Update Progress
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <FileText className="w-6 h-6 mb-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Schemes Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredSchemes.slice(0, 6).map(scheme => (
              <Card key={scheme.id} className="shadow-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{scheme.name}</CardTitle>
                      <CardDescription className="mt-1 text-sm">
                        {scheme.ministry}
                      </CardDescription>
                    </div>
                    {getStatusBadge(scheme.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Progress</span>
                      <span className="font-medium">{scheme.progress_percent}%</span>
                    </div>
                    <Progress value={scheme.progress_percent} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Beneficiaries</p>
                      <p className="font-medium">{scheme.beneficiaries?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Budget</p>
                      <p className="font-medium">{formatCurrency(scheme.budget_allocated || 0)}</p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setSelectedScheme(scheme)}
                    >
                      View Details
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditScheme(scheme)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-6">
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
                    placeholder="Search schemes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={ministryFilter} onValueChange={setMinistryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ministries</SelectItem>
                    {ministries.map(ministry => (
                      <SelectItem key={ministry} value={ministry}>
                        {ministry.split(' ').slice(-2).join(' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" className="w-full">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Schemes List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredSchemes.map(scheme => (
              <Card key={scheme.id} className="shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{scheme.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{scheme.ministry}</p>
                      <p className="text-sm text-foreground leading-relaxed">
                        {scheme.policy_text}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusBadge(scheme.status)}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleEditScheme(scheme)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Progress</p>
                      <div className="mt-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium">{scheme.progress_percent}%</span>
                        </div>
                        <Progress value={scheme.progress_percent} className="h-2" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Beneficiaries</p>
                      <p className="text-lg font-semibold">{scheme.beneficiaries?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Allocated</p>
                      <p className="text-lg font-semibold">{formatCurrency(scheme.budget_allocated || 0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Budget Utilized</p>
                      <p className="text-lg font-semibold text-success">
                        {formatCurrency(scheme.budget_utilized || 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Scheme Performance Chart */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Scheme Performance Overview</CardTitle>
              <CardDescription>Target vs Achievement comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={reportsData.scheme_performance}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="scheme" 
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="target" fill="hsl(var(--muted))" name="Target" />
                  <Bar dataKey="achieved" fill="hsl(var(--primary))" name="Achieved" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportsData.scheme_performance
                    .sort((a, b) => b.percent - a.percent)
                    .slice(0, 5)
                    .map((scheme, index) => (
                      <div key={scheme.scheme} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{scheme.scheme}</p>
                          <p className="text-sm text-muted-foreground">
                            {scheme.achieved.toLocaleString()} / {scheme.target.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">{scheme.percent}%</p>
                          <div className="w-16 mt-1">
                            <Progress value={scheme.percent} className="h-1" />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Budget Utilization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schemesData.schemes
                    .filter(s => s.budget_allocated && s.budget_utilized)
                    .slice(0, 5)
                    .map((scheme) => {
                      const utilizationPercent = ((scheme.budget_utilized || 0) / (scheme.budget_allocated || 1)) * 100;
                      return (
                        <div key={scheme.id} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-medium">{scheme.name}</span>
                            <span>{utilizationPercent.toFixed(1)}%</span>
                          </div>
                          <Progress value={utilizationPercent} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Utilized: {formatCurrency(scheme.budget_utilized || 0)}</span>
                            <span>Allocated: {formatCurrency(scheme.budget_allocated || 0)}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Scheme Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Scheme Policy</DialogTitle>
            <DialogDescription>
              Update the policy text and progress for {editingScheme?.name}
            </DialogDescription>
          </DialogHeader>
          {editingScheme && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Policy Text</label>
                <Textarea
                  value={editingScheme.policy_text}
                  onChange={(e) => setEditingScheme(prev => ({ ...prev, policy_text: e.target.value }))}
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Progress (%)</label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={editingScheme.progress_percent}
                    onChange={(e) => setEditingScheme(prev => ({ 
                      ...prev, 
                      progress_percent: parseInt(e.target.value) || 0 
                    }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={editingScheme.status}
                    onValueChange={(value) => setEditingScheme(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sanctioned">Sanctioned</SelectItem>
                      <SelectItem value="implemented">Implemented</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schemes;