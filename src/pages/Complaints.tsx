import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, User, Calendar, Filter, Edit2 } from 'lucide-react';

// Import data
import complaintsData from '@/data/complaints.json';
import reportsData from '@/data/reports.json';

const Complaints = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({ status: '', resolution_note: '', assigned_to: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Get unique values for filters
  const categories = [...new Set(complaintsData.complaints.map(c => c.category))];
  const statuses = ['pending', 'in-progress', 'resolved'];

  // Filter complaints
  const filteredComplaints = complaintsData.complaints.filter(complaint => {
    const matchesSearch = complaint.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          complaint.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          complaint.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || complaint.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || complaint.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredComplaints.length / itemsPerPage);
  const paginatedComplaints = filteredComplaints.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Summary statistics
  const totalComplaints = filteredComplaints.length;
  const pendingCount = filteredComplaints.filter(c => c.status === 'pending').length;
  const inProgressCount = filteredComplaints.filter(c => c.status === 'in-progress').length;
  const resolvedCount = filteredComplaints.filter(c => c.status === 'resolved').length;
  const resolutionRate = totalComplaints > 0 ? Math.round((resolvedCount / totalComplaints) * 100) : 0;

  // Chart data
  const complaintsTypeData = categories.map(category => ({
    name: category.charAt(0).toUpperCase() + category.slice(1),
    value: complaintsData.complaints.filter(c => c.category === category).length,
    color: getCategoryColor(category)
  }));

  const monthlyData = reportsData.monthly_complaints;

  function getCategoryColor(category: string) {
    switch (category) {
      case 'land': return '#16a34a';
      case 'claim': return '#2563eb';
      case 'scheme': return '#ca8a04';
      default: return '#6b7280';
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': 
        return <Badge variant="default" className="bg-pending text-pending-foreground">Pending</Badge>;
      case 'in-progress': 
        return <Badge variant="default" className="bg-warning text-warning-foreground">In Progress</Badge>;
      case 'resolved': 
        return <Badge variant="default" className="bg-success text-success-foreground">Resolved</Badge>;
      default: 
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colors = {
      land: 'bg-green-100 text-green-800',
      claim: 'bg-blue-100 text-blue-800',
      scheme: 'bg-yellow-100 text-yellow-800'
    };
    return (
      <Badge variant="outline" className={colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    );
  };

  const handleUpdateComplaint = (complaint: any) => {
    setSelectedComplaint(complaint);
    setUpdateData({
      status: complaint.status,
      resolution_note: complaint.resolution_note || '',
      assigned_to: complaint.assigned_to || ''
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSaveUpdate = () => {
    // In a real app, this would save to backend
    console.log('Updating complaint:', selectedComplaint.id, updateData);
    setIsUpdateDialogOpen(false);
    setSelectedComplaint(null);
  };

  const getPriorityIcon = (category: string, status: string) => {
    if (status === 'pending' && category === 'land') {
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Complaints Management</h1>
        <p className="text-muted-foreground">
          Track and resolve citizen complaints related to FRA claims, schemes, and land rights
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Complaints</p>
                <p className="text-2xl font-bold">{totalComplaints}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-pending">{pendingCount}</p>
              </div>
              <Clock className="h-8 w-8 text-pending" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-warning">{inProgressCount}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-success">{resolvedCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolution Rate</p>
                <p className="text-2xl font-bold text-indigo-600">{resolutionRate}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="complaints">Complaint Registry</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Complaints by Type */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Complaints by Category</CardTitle>
                <CardDescription>Distribution across different complaint types</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={complaintsTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {complaintsTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Recent High Priority */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent High Priority Cases</CardTitle>
                <CardDescription>Complaints requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {complaintsData.complaints
                    .filter(c => c.status === 'pending' || (c.category === 'land' && c.status !== 'resolved'))
                    .slice(0, 6)
                    .map(complaint => (
                      <div key={complaint.id} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getPriorityIcon(complaint.category, complaint.status)}
                            <span className="font-medium text-sm">{complaint.id}</span>
                          </div>
                          {getStatusBadge(complaint.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{complaint.user}</p>
                        <p className="text-sm text-foreground line-clamp-2">{complaint.text}</p>
                        <div className="flex items-center justify-between mt-2">
                          {getCategoryBadge(complaint.category)}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateComplaint(complaint)}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-success">3.2</p>
                  <p className="text-sm text-muted-foreground">Avg Resolution Days</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">12</p>
                  <p className="text-sm text-muted-foreground">This Month</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-pending">5</p>
                  <p className="text-sm text-muted-foreground">Escalated Cases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-600">4.2/5</p>
                  <p className="text-sm text-muted-foreground">Satisfaction Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complaints" className="space-y-6">
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
                    placeholder="Search complaints..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
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

          {/* Complaints Table */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Complaint Registry</CardTitle>
              <CardDescription>
                Showing {paginatedComplaints.length} of {totalComplaints} complaints
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Complaint</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Filed</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedComplaints.map((complaint) => (
                    <TableRow key={complaint.id} className="hover:bg-muted/50">
                      <TableCell className="font-mono text-sm">{complaint.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{complaint.user}</span>
                        </div>
                      </TableCell>
                      <TableCell>{getCategoryBadge(complaint.category)}</TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm line-clamp-2">{complaint.text}</p>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(complaint.status)}</TableCell>
                      <TableCell>
                        <div className="text-sm">{complaint.assigned_to}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1 text-sm">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          <span>{complaint.filed_date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleUpdateComplaint(complaint)}
                          >
                            <Edit2 className="w-4 h-4" />
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
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalComplaints)} of {totalComplaints} results
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
          {/* Monthly Trend */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Monthly Complaints Trend</CardTitle>
              <CardDescription>Filed vs Resolved complaints over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="filed" 
                    stroke="hsl(var(--destructive))" 
                    strokeWidth={2}
                    name="Filed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resolution Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Resolution Time Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Land Disputes</span>
                    <span className="font-medium">5.2 days avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Claim Issues</span>
                    <span className="font-medium">3.1 days avg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Scheme Related</span>
                    <span className="font-medium">2.8 days avg</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Department Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Revenue Department</span>
                    <div className="text-right">
                      <div className="font-medium text-success">92% resolved</div>
                      <div className="text-xs text-muted-foreground">24 cases</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Forest Department</span>
                    <div className="text-right">
                      <div className="font-medium text-success">87% resolved</div>
                      <div className="text-xs text-muted-foreground">18 cases</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tribal Development</span>
                    <div className="text-right">
                      <div className="font-medium text-warning">78% resolved</div>
                      <div className="text-xs text-muted-foreground">15 cases</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Update Complaint Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Complaint</DialogTitle>
            <DialogDescription>
              Update the status and resolution for complaint {selectedComplaint?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select
                value={updateData.status}
                onValueChange={(value) => setUpdateData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assigned To</label>
              <Input
                value={updateData.assigned_to}
                onChange={(e) => setUpdateData(prev => ({ ...prev, assigned_to: e.target.value }))}
                placeholder="Enter officer/department name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Resolution Notes</label>
              <Textarea
                value={updateData.resolution_note}
                onChange={(e) => setUpdateData(prev => ({ ...prev, resolution_note: e.target.value }))}
                rows={3}
                placeholder="Enter resolution details or progress notes..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveUpdate}>
              Update Complaint
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Complaints;