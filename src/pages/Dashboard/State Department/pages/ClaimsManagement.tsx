import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaFileAlt, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaDownload, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaUser,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Search, Filter, FileText, MapPin, Calendar, User, ArrowUpDown } from 'lucide-react';

// Import claims data
import claimsData from '@/data/claims.json';
import PattaHolderProfilePage from '@/components/PattaHolderProfilePage';
import holdersData from '@/data/holders.json';
import schemesData from '@/data/schemes.json';
import complaintsData from '@/data/complaints.json';

const ClaimsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submission_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Filter claims for Madhya Pradesh only
  const mpClaims = useMemo(() => {
    return claimsData.claims.filter(claim => claim.state === 'Madhya Pradesh');
  }, []);

  // Get unique values for filters from MP data
  const mpDistricts = [...new Set(mpClaims.map(claim => claim.district))].sort();
  const statuses = ['granted', 'pending', 'rejected'];
  const types = ['IFR', 'CFR', 'CR'];

  // Filter and sort claims
  const filteredClaims = useMemo(() => {
    return mpClaims
      .filter(claim => {
        const matchesSearch = searchTerm === '' || 
          claim.holder_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.village.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
        const matchesDistrict = districtFilter === 'all' || claim.district === districtFilter;
        const matchesType = typeFilter === 'all' || claim.type === typeFilter;

        return matchesSearch && matchesStatus && matchesDistrict && matchesType;
      })
      .sort((a, b) => {
        let aValue = a[sortBy as keyof typeof a];
        let bValue = b[sortBy as keyof typeof b];
        
        if (sortBy === 'area') {
          aValue = parseFloat(a.area.split(' ')[0]);
          bValue = parseFloat(b.area.split(' ')[0]);
        }
        
        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
  }, [mpClaims, searchTerm, statusFilter, districtFilter, typeFilter, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaims = filteredClaims.slice(startIndex, endIndex);

  // Summary statistics
  const totalClaims = filteredClaims.length;
  const grantedCount = filteredClaims.filter(c => c.status === 'granted').length;
  const pendingCount = filteredClaims.filter(c => c.status === 'pending').length;
  const rejectedCount = filteredClaims.filter(c => c.status === 'rejected').length;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'granted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Granted</Badge>;
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getTypeDescription = (type: string) => {
    switch (type) {
      case 'IFR': return 'Individual Forest Rights';
      case 'CFR': return 'Community Forest Resources';
      case 'CR': return 'Community Rights';
      default: return type;
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getPaginationRange = () => {
    const range = [];
    const showPages = 5;
    let start = Math.max(1, currentPage - Math.floor(showPages / 2));
    let end = Math.min(totalPages, start + showPages - 1);
    
    if (end - start < showPages - 1) {
      start = Math.max(1, end - showPages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1B365D] mb-2">Claims Management</h1>
          <p className="text-gray-600">Manage Forest Rights Act claims across Madhya Pradesh districts</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center space-x-2">
            <FaDownload className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Button className="bg-[#1B365D] hover:bg-[#0F1B2E] flex items-center space-x-2">
            <FaFileAlt className="h-4 w-4" />
            <span>New Claim</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Claims</p>
                <p className="text-2xl font-bold">{totalClaims}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Granted</p>
                <p className="text-2xl font-bold">{grantedCount}</p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Pending</p>
                <p className="text-2xl font-bold">{pendingCount}</p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Rejected</p>
                <p className="text-2xl font-bold">{rejectedCount}</p>
              </div>
              <FaExclamationTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, ID, or village..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
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

            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger>
                <SelectValue placeholder="District" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {mpDistricts.map(district => (
                  <SelectItem key={district} value={district}>{district}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Claims Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Claims Registry</CardTitle>
          <CardDescription>
            Showing {currentClaims.length} of {totalClaims} claims for Madhya Pradesh
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('id')}
                  >
                    <div className="flex items-center">
                      Claim ID
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('holder_name')}
                  >
                    <div className="flex items-center">
                      Holder Name
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('area')}
                  >
                    <div className="flex items-center">
                      Area
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:text-foreground"
                    onClick={() => handleSort('submission_date')}
                  >
                    <div className="flex items-center">
                      Submitted
                      <ArrowUpDown className="w-4 h-4 ml-1" />
                    </div>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentClaims.map((claim) => (
                  <TableRow key={claim.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{claim.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{claim.holder_name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{claim.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {getTypeDescription(claim.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(claim.status)}</TableCell>
                    <TableCell className="font-medium">{claim.area}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span>{claim.village}, {claim.district}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">{claim.state}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1 text-sm">
                        <Calendar className="w-3 h-3 text-muted-foreground" />
                        <span>{claim.submission_date}</span>
                      </div>
                      {claim.approval_date && (
                        <div className="text-xs text-success">
                          Approved: {claim.approval_date}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/profile/${claim.id}`)}>
                          View
                        </Button>
                        {claim.status === 'pending' && (
                          <Button size="sm" variant="default" className="bg-[#1B365D] hover:bg-[#0F1B2E]">
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredClaims.length)} of {filteredClaims.length} results
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex space-x-1">
                {getPaginationRange().map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className={currentPage === page ? "bg-[#1B365D]" : ""}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClaimsManagement;