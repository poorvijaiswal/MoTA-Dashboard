import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, Calendar, MapPin, Users, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import StateSchemeForm from '@/components/StateSchemeForm';

interface StateScheme {
  id: string;
  name: string;
  department: string;
  budget: number;
  eligibility: string;
  district: string;
  tehsil: string;
  status: string;
  startDate: string;
  endDate: string;
  beneficiaries: number;
  targetBeneficiaries: number;
  utilization: number;
  description: string;
  category: string;
  priority: string;
  documents: string[];
  verificationLevel: string;
  processingTimeDays: number;
}

const StateSchemes = () => {
  const [schemes, setSchemes] = useState<StateScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<StateScheme[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [selectedScheme, setSelectedScheme] = useState<StateScheme | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [showSchemeForm, setShowSchemeForm] = useState(false);
  const [editingScheme, setEditingScheme] = useState<StateScheme | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadSchemes = async () => {
      try {
        const response = await fetch('/data/state-schemes.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Ensure all schemes have valid data
        const validSchemes = data.schemes.filter((scheme: StateScheme) => 
          scheme && 
          scheme.id && 
          scheme.name && 
          scheme.district && 
          scheme.status
        );
        
        setSchemes(validSchemes);
        setFilteredSchemes(validSchemes);
      } catch (error) {
        console.error('Failed to load schemes:', error);
        toast({
          title: "Error",
          description: "Failed to load schemes data.",
          variant: "destructive"
        });
        // Set empty arrays to prevent rendering issues
        setSchemes([]);
        setFilteredSchemes([]);
      }
    };
    loadSchemes();
  }, [toast]);

  useEffect(() => {
    let filtered = schemes;
    
    if (searchTerm) {
      filtered = filtered.filter(scheme => 
        scheme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scheme.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'All') {
      filtered = filtered.filter(scheme => scheme.status === filterStatus);
    }
    
    if (filterDistrict !== 'All') {
      filtered = filtered.filter(scheme => scheme.district === filterDistrict);
    }
    
    setFilteredSchemes(filtered);
  }, [schemes, searchTerm, filterStatus, filterDistrict]);

  const districts = [...new Set(schemes.map(s => s.district))].filter(d => d && d.trim() !== '');
  const statuses = [...new Set(schemes.map(s => s.status))].filter(s => s && s.trim() !== '');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (scheme: StateScheme) => {
    setSelectedScheme(scheme);
    setIsDetailModalOpen(true);
  };

  const handleEditScheme = (scheme: StateScheme) => {
    setEditingScheme(scheme);
    setShowSchemeForm(true);
  };

  const handleAddNewScheme = () => {
    setEditingScheme(null);
    setShowSchemeForm(true);
  };

  const handleSaveScheme = (schemeData: StateScheme) => {
    if (editingScheme) {
      // Update existing scheme
      setSchemes(prev => prev.map(s => s.id === schemeData.id ? schemeData : s));
      toast({
        title: "Scheme Updated",
        description: "The scheme has been successfully updated.",
      });
    } else {
      // Add new scheme
      setSchemes(prev => [...prev, schemeData]);
      toast({
        title: "Scheme Created",
        description: "New scheme has been successfully created.",
      });
    }
    setShowSchemeForm(false);
    setEditingScheme(null);
  };

  const handleCancelSchemeForm = () => {
    setShowSchemeForm(false);
    setEditingScheme(null);
  };

  // Show scheme form if adding/editing
  if (showSchemeForm) {
    return (
      <StateSchemeForm 
        scheme={editingScheme || undefined}
        onSave={handleSaveScheme}
        onCancel={handleCancelSchemeForm}
      />
    );
  }

  const formatCurrency = (amount: number) => {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gov-heading">Schemes Management</h1>
          <p className="gov-subtext mt-1">
            Madhya Pradesh Forest Rights & Tribal Development Schemes
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddNewScheme}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Scheme
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Schemes</p>
                <p className="text-2xl font-bold">{schemes.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Schemes</p>
                <p className="text-2xl font-bold">{schemes.filter(s => s.status === 'Active').length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(schemes.reduce((sum, s) => sum + s.budget, 0))}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Beneficiaries</p>
                <p className="text-2xl font-bold">
                  {schemes.reduce((sum, s) => sum + s.beneficiaries, 0).toLocaleString()}
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search schemes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {statuses.filter(status => status && status.trim()).map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Districts</SelectItem>
                {districts.filter(district => district && district.trim()).map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="gov-card">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold mb-2">{scheme.name}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {scheme.district}
                    </span>
                    <Badge className={getStatusColor(scheme.status)}>
                      {scheme.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Department:</span>
                    <p className="font-medium">{scheme.department}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Budget:</span>
                    <p className="font-medium">{formatCurrency(scheme.budget)}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Beneficiaries:</span>
                    <p className="font-medium">{scheme.beneficiaries}/{scheme.targetBeneficiaries}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Utilization:</span>
                    <p className="font-medium">{scheme.utilization}%</p>
                  </div>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${scheme.utilization}%` }}
                  />
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {scheme.description}
                </p>

                <div className="flex justify-between items-center pt-2">
                  <div className="text-xs text-muted-foreground">
                    {formatDate(scheme.startDate)} - {formatDate(scheme.endDate)}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(scheme)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditScheme(scheme)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Scheme Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Scheme Details</DialogTitle>
          </DialogHeader>
          {selectedScheme && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Basic Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">ID:</span> {selectedScheme.id}</div>
                    <div><span className="font-medium">Name:</span> {selectedScheme.name}</div>
                    <div><span className="font-medium">Department:</span> {selectedScheme.department}</div>
                    <div><span className="font-medium">District:</span> {selectedScheme.district}</div>
                    <div><span className="font-medium">Tehsil:</span> {selectedScheme.tehsil}</div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <Badge className={`ml-2 ${getStatusColor(selectedScheme.status)}`}>
                        {selectedScheme.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Financial Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Total Budget:</span> {formatCurrency(selectedScheme.budget)}</div>
                    <div><span className="font-medium">Beneficiaries:</span> {selectedScheme.beneficiaries}</div>
                    <div><span className="font-medium">Target:</span> {selectedScheme.targetBeneficiaries}</div>
                    <div><span className="font-medium">Utilization:</span> {selectedScheme.utilization}%</div>
                    <div><span className="font-medium">Start Date:</span> {formatDate(selectedScheme.startDate)}</div>
                    <div><span className="font-medium">End Date:</span> {formatDate(selectedScheme.endDate)}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Eligibility Criteria</h3>
                <p className="text-sm bg-muted p-3 rounded">{selectedScheme.eligibility}</p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Description</h3>
                <p className="text-sm bg-muted p-3 rounded">{selectedScheme.description}</p>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                  Close
                </Button>
                <Button onClick={() => selectedScheme && handleEditScheme(selectedScheme)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Scheme
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StateSchemes;