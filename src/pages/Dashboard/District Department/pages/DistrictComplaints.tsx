import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Phone, MapPin, Clock, AlertTriangle, CheckCircle, XCircle, User, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Complaint {
  id: string;
  title: string;
  description: string;
  complainant: string;
  complainantContact: string;
  district: string;
  tehsil: string;
  village: string;
  category: string;
  subcategory: string;
  status: string;
  priority: string;
  dateSubmitted: string;
  lastUpdated: string;
  expectedResolution: string;
  assignedOfficer: string;
  officerContact: string;
  department: string;
  actionsTaken: string;
  documentsRequired: string;
  affectedFamilies: number;
  landArea: string;
  relatedScheme: string;
}

const StateComplaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [filterDistrict, setFilterDistrict] = useState('Indore');
  const [filterVillage, setFilterVillage] = useState('All');
  const [filterTehsil, setFilterTehsil] = useState('All');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('');
  const [actionUpdate, setActionUpdate] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        const response = await fetch('/data/complaints.json');
        const data = await response.json();
        setComplaints(data);
        setFilteredComplaints(data);
      } catch (error) {
        console.error('Failed to load complaints:', error);
      }
    };
    loadComplaints();
  }, []);

  useEffect(() => {
    let filtered = complaints.filter(complaint => complaint.district === 'Indore');
    if (typeof filterVillage !== 'undefined' && filterVillage !== 'All') {
      filtered = filtered.filter(complaint => complaint.village === filterVillage);
    }
    if (typeof filterTehsil !== 'undefined' && filterTehsil !== 'All') {
      filtered = filtered.filter(complaint => complaint.tehsil === filterTehsil);
    }
    if (searchTerm) {
      filtered = filtered.filter(complaint => 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.complainant.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(complaint => complaint.status === filterStatus);
    }
    if (filterPriority !== 'All') {
      filtered = filtered.filter(complaint => complaint.priority === filterPriority);
    }
    setFilteredComplaints(filtered);
  }, [complaints, searchTerm, filterStatus, filterPriority, filterVillage, filterTehsil]);

  const villages = [...new Set(complaints.filter(c => c.district === 'Indore').map(c => c.village))];
  const tehsils = [...new Set(complaints.filter(c => c.district === 'Indore').map(c => c.tehsil))];
  const statuses = [...new Set(complaints.map(c => c.status))];
  const priorities = [...new Set(complaints.map(c => c.priority))];
  const districts = [...new Set(complaints.map(c => c.district))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved': return 'bg-green-100 text-green-800 border-green-200';
      case 'In Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Investigation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Legal Action Initiated': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Under Process': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'Critical': return <AlertTriangle className="h-4 w-4" />;
      case 'High': return <XCircle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      case 'Low': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleViewDetails = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setStatusUpdate(complaint.status);
    setActionUpdate('');
    setIsDetailModalOpen(true);
  };

  const handleUpdateComplaint = () => {
    if (selectedComplaint) {
      const updatedComplaints = complaints.map(c => 
        c.id === selectedComplaint.id 
          ? { 
              ...c, 
              status: statusUpdate, 
              lastUpdated: new Date().toISOString().split('T')[0],
              actionsTaken: actionUpdate ? `${c.actionsTaken}; ${actionUpdate}` : c.actionsTaken
            }
          : c
      );
      setComplaints(updatedComplaints);
      setFilteredComplaints(updatedComplaints);
      toast({
        title: "Complaint Updated",
        description: "Complaint status and actions have been updated successfully.",
      });
      setIsDetailModalOpen(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const getDaysElapsed = (dateString: string) => {
    const submissionDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - submissionDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const criticalComplaints = complaints.filter(c => c.priority === 'Critical').length;
  const resolvedComplaints = complaints.filter(c => c.status === 'Resolved').length;
  const avgResolutionTime = 32; // This would be calculated from actual data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-[#1B365D]">Complaints Management</h1>
          <p className="text-gray-600 mt-1">
            Forest Rights & Tribal Affairs Grievances - Madhya Pradesh
          </p>
        </div>
        <Button className="bg-[#1B365D] hover:bg-[#0F1B2E] text-white shadow-md">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Register Complaint
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Complaints</p>
                <p className="text-3xl font-bold">{complaints.length}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold">{pendingComplaints}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Clock className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Critical</p>
                <p className="text-3xl font-bold">{criticalComplaints}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <XCircle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Resolved</p>
                <p className="text-3xl font-bold">{resolvedComplaints}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center text-lg">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by ID, name, village, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Status</SelectItem>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Priority</SelectItem>
                {priorities.map(priority => (
                  <SelectItem key={priority} value={priority}>{priority}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Village Filter Dropdown */}
            <Select value={filterVillage} onValueChange={setFilterVillage}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="All Villages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Villages</SelectItem>
                {villages.map(village => (
                  <SelectItem key={village} value={village}>{village}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Tehsil Filter Dropdown */}
            <Select value={filterTehsil} onValueChange={setFilterTehsil}>
              <SelectTrigger className="w-full md:w-48 h-10">
                <SelectValue placeholder="All Tehsils" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Tehsils</SelectItem>
                {tehsils.map(tehsil => (
                  <SelectItem key={tehsil} value={tehsil}>{tehsil}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <div className="space-y-4">
        {filteredComplaints.map((complaint) => (
          <Card key={complaint.id} className="shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{complaint.title}</h3>
                    <Badge className={`${getStatusColor(complaint.status)} text-xs font-medium px-2 py-1`}>
                      {complaint.status}
                    </Badge>
                    <Badge className={`${getPriorityColor(complaint.priority)} text-xs font-medium px-2 py-1`}>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(complaint.priority)}
                        {complaint.priority}
                      </div>
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{complaint.complainant}</p>
                        <p className="text-xs text-gray-500">{complaint.complainantContact}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{complaint.village}</p>
                        <p className="text-xs text-gray-500">{complaint.district}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Submitted</p>
                        <p className="text-xs text-gray-500">{formatDate(complaint.dateSubmitted)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-gray-900 text-sm">Days Elapsed</p>
                        <p className={`text-xs ${getDaysElapsed(complaint.dateSubmitted) > 30 ? 'text-red-600 font-semibold' : 'text-gray-500'}`}>
                          {getDaysElapsed(complaint.dateSubmitted)} days
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">ID: {complaint.id}</span>
                  <span>{complaint.category}</span>
                  <span>Officer: {complaint.assignedOfficer}</span>
                  {complaint.affectedFamilies > 0 && (
                    <span className="text-orange-600 font-medium">{complaint.affectedFamilies} families affected</span>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(complaint)}
                    className="h-8 px-3 text-xs border-[#1B365D] text-[#1B365D] hover:bg-[#1B365D] hover:text-white"
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="h-8 px-3 text-xs border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Update
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Complaint Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-[#1B365D]">Complaint Details & Management</DialogTitle>
              <div className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                ID: {selectedComplaint?.id}
              </div>
            </div>
          </DialogHeader>
          
          {selectedComplaint && (
            <div className="flex-1 overflow-y-auto">
              <div className="space-y-6 p-1">
                {/* Header Section */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-lg font-bold text-gray-900 leading-tight">{selectedComplaint.title}</h2>
                    <div className="flex gap-2">
                      <Badge className={`${getStatusColor(selectedComplaint.status)} text-xs`}>
                        {selectedComplaint.status}
                      </Badge>
                      <Badge className={`${getPriorityColor(selectedComplaint.priority)} text-xs`}>
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(selectedComplaint.priority)}
                          {selectedComplaint.priority}
                        </div>
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedComplaint.description}</p>
                </div>

                {/* Key Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        Complainant Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2 text-sm">
                      <div><span className="font-medium text-gray-600">Name:</span> <span className="text-gray-900">{selectedComplaint.complainant}</span></div>
                      <div><span className="font-medium text-gray-600">Contact:</span> <span className="text-gray-900">{selectedComplaint.complainantContact}</span></div>
                      <div><span className="font-medium text-gray-600">Location:</span> <span className="text-gray-900">{selectedComplaint.village}, {selectedComplaint.tehsil}, {selectedComplaint.district}</span></div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Case Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2 text-sm">
                      <div><span className="font-medium text-gray-600">Category:</span> <span className="text-gray-900">{selectedComplaint.category}</span></div>
                      <div><span className="font-medium text-gray-600">Subcategory:</span> <span className="text-gray-900">{selectedComplaint.subcategory}</span></div>
                      <div><span className="font-medium text-gray-600">Department:</span> <span className="text-gray-900">{selectedComplaint.department}</span></div>
                      <div><span className="font-medium text-gray-600">Affected Families:</span> <span className="text-orange-600 font-semibold">{selectedComplaint.affectedFamilies}</span></div>
                      <div><span className="font-medium text-gray-600">Land Area:</span> <span className="text-gray-900">{selectedComplaint.landArea}</span></div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700 flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Timeline & Officer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2 text-sm">
                      <div><span className="font-medium text-gray-600">Submitted:</span> <span className="text-gray-900">{formatDate(selectedComplaint.dateSubmitted)}</span></div>
                      <div><span className="font-medium text-gray-600">Last Updated:</span> <span className="text-gray-900">{formatDate(selectedComplaint.lastUpdated)}</span></div>
                      <div><span className="font-medium text-gray-600">Expected Resolution:</span> <span className="text-gray-900">{formatDate(selectedComplaint.expectedResolution)}</span></div>
                      <div><span className="font-medium text-gray-600">Days Elapsed:</span> 
                        <span className={`ml-1 font-semibold ${getDaysElapsed(selectedComplaint.dateSubmitted) > 30 ? 'text-red-600' : 'text-green-600'}`}>
                          {getDaysElapsed(selectedComplaint.dateSubmitted)} days
                        </span>
                      </div>
                      <div><span className="font-medium text-gray-600">Assigned Officer:</span> <span className="text-gray-900">{selectedComplaint.assignedOfficer}</span></div>
                    </CardContent>
                  </Card>
                </div>

                {/* Actions and Documents */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700">Actions Taken</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-50 p-3 rounded text-sm leading-relaxed">
                        {selectedComplaint.actionsTaken || "No actions recorded yet."}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold text-gray-700">Documents Required</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-gray-50 p-3 rounded text-sm leading-relaxed">
                        {selectedComplaint.documentsRequired || "No specific documents mentioned."}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Update Section */}
                <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-blue-700 flex items-center">
                      <Edit className="h-4 w-4 mr-2" />
                      Update Complaint Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Change Status</label>
                        <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="Select Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="In Review">In Review</SelectItem>
                            <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                            <SelectItem value="Legal Action Initiated">Legal Action Initiated</SelectItem>
                            <SelectItem value="Under Process">Under Process</SelectItem>
                            <SelectItem value="Resolved">Resolved</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Add Action Note</label>
                        <Textarea
                          placeholder="Describe the action taken or notes..."
                          value={actionUpdate}
                          onChange={(e) => setActionUpdate(e.target.value)}
                          rows={3}
                          className="text-sm resize-none"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t bg-white">
            <Button variant="outline" onClick={() => setIsDetailModalOpen(false)} className="px-6">
              Close
            </Button>
            <Button onClick={handleUpdateComplaint} className="bg-[#1B365D] hover:bg-[#0F1B2E] px-6">
              Update Complaint
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StateComplaints;