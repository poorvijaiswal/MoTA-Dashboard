import React, { useState, useMemo } from 'react';
import { 
  FaMapMarkerAlt, 
  FaSearch, 
  FaFilter, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaCamera,
  FaFileAlt,
  FaCalendarAlt,
  FaLeaf,
  FaTree,
  FaHome,
  FaEdit,
  FaTimes,
  FaDownload
} from 'react-icons/fa';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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

// Mock data for Madhya Pradesh assets and field verification
const mpDistricts = [
  'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
  'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
  'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior',
  'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni',
  'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur',
  'Neemuch', 'Niwari', 'Panna', 'Raisen', 'Rajgarh', 'Ratlam', 'Rewa',
  'Sagar', 'Satna', 'Sehore', 'Seoni', 'Shahdol', 'Shajapur', 'Sheopur',
  'Shivpuri', 'Sidhi', 'Singrauli', 'Tikamgarh', 'Ujjain', 'Umaria', 'Vidisha'
];

// Generate mock asset/verification data for Madhya Pradesh only
const generateAssetData = () => {
  const assetTypes = ['Forest Land', 'Agricultural Land', 'Grazing Land', 'Water Body', 'Settlement'];
  const verificationStatus = ['Scheduled', 'In Progress', 'Completed', 'Pending Review', 'Verified'];
  const landClasses = ['Revenue Forest', 'Protected Forest', 'Reserved Forest', 'Unclassed Forest'];
  const mpOfficers = [
    'Dr. A.K. Sharma (IFS)', 'R.P. Singh (ACF)', 'M.K. Verma (RFO)', 'S.R. Patel (DFO)', 
    'N.K. Jain (IFS)', 'P.K. Gupta (ACF)', 'V.S. Yadav (RFO)', 'R.K. Tiwari (DFO)',
    'M.P. Dubey (ACF)', 'S.K. Mishra (RFO)', 'D.P. Sharma (IFS)', 'K.L. Verma (DFO)'
  ];
  
  return Array.from({ length: 300 }, (_, index) => ({
    id: `AST-MP-${(index + 1).toString().padStart(4, '0')}`,
    claimId: `FRA-MP-${(Math.floor(Math.random() * 1000) + 1).toString().padStart(4, '0')}`,
    district: mpDistricts[Math.floor(Math.random() * mpDistricts.length)],
    village: [
      'Kachhpura', 'Rampura', 'Bhimlat', 'Pipariya', 'Amarkantak', 'Pachmarhi',
      'Khajuraho', 'Orchha', 'Mandu', 'Sanchi', 'Bhimbetka', 'Ujjain',
      'Maheshwar', 'Omkareshwar', 'Chitrakoot', 'Bandhavgarh', 'Pench', 'Kanha'
    ][Math.floor(Math.random() * 18)],
    assetType: assetTypes[Math.floor(Math.random() * assetTypes.length)],
    landClass: landClasses[Math.floor(Math.random() * landClasses.length)],
    area: `${(Math.random() * 50 + 1).toFixed(2)}`,
    surveyNumber: `${Math.floor(Math.random() * 999) + 1}/${Math.floor(Math.random() * 99) + 1}`,
    coordinates: {
      lat: (21.0 + Math.random() * 5).toFixed(6),
      lng: (74.0 + Math.random() * 8).toFixed(6)
    },
    verificationStatus: verificationStatus[Math.floor(Math.random() * verificationStatus.length)],
    scheduledDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000)
      .toLocaleDateString('en-IN'),
    verificationOfficer: mpOfficers[Math.floor(Math.random() * mpOfficers.length)],
    gpsAccuracy: `${(Math.random() * 5 + 1).toFixed(1)}m`,
    forestCover: `${(Math.random() * 100).toFixed(0)}%`,
    accessibility: ['Easy', 'Moderate', 'Difficult'][Math.floor(Math.random() * 3)],
    nearestRoad: `${(Math.random() * 10 + 0.1).toFixed(1)} km`,
    photographsTaken: Math.floor(Math.random() * 20) + 5,
    documentsVerified: Math.floor(Math.random() * 8) + 3,
    boundaryMarked: Math.random() > 0.5,
    issues: Math.random() > 0.7 ? ['Boundary Dispute', 'Documentation Issue', 'Access Problem', 'Land Classification Mismatch'][Math.floor(Math.random() * 4)] : 'None',
    officerRemarks: [
      'Verification completed successfully. All documents are in order.',
      'Boundary markers installed. GPS coordinates verified.',
      'Minor documentation issues found. Resolved on-site.',
      'Awaiting additional documents from claimant.',
      'Field verification in progress. No issues found so far.',
      'Community verification completed. Panchayat approval obtained.',
      'Forest department clearance pending.',
      'Site accessible. Verification scheduled for next week.'
    ][Math.floor(Math.random() * 8)],
    verificationDate: Math.random() > 0.6 ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN') : null,
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')
  }));
};

const FieldVerification = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [assetTypeFilter, setAssetTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(15);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [verificationRemarks, setVerificationRemarks] = useState('');
  const [newVerificationStatus, setNewVerificationStatus] = useState('');

  const assetData = useMemo(() => generateAssetData(), []);

  // Filter and search logic
  const filteredAssets = useMemo(() => {
    return assetData.filter(asset => {
      const matchesSearch = searchTerm === '' || 
        asset.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.verificationOfficer.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || asset.verificationStatus === statusFilter;
      const matchesDistrict = districtFilter === 'all' || asset.district === districtFilter;
      const matchesAssetType = assetTypeFilter === 'all' || asset.assetType === assetTypeFilter;

      return matchesSearch && matchesStatus && matchesDistrict && matchesAssetType;
    });
  }, [assetData, searchTerm, statusFilter, districtFilter, assetTypeFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAssets = filteredAssets.slice(startIndex, endIndex);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Verified':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'Scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssetClick = (asset: any) => {
    setSelectedAsset(asset);
    setVerificationRemarks(asset.officerRemarks || '');
    setNewVerificationStatus(asset.verificationStatus);
    setIsDetailModalOpen(true);
  };

  const handleStatusUpdate = () => {
    if (selectedAsset) {
      // In a real application, this would make an API call
      selectedAsset.verificationStatus = newVerificationStatus;
      selectedAsset.officerRemarks = verificationRemarks;
      selectedAsset.lastUpdated = new Date().toLocaleDateString('en-IN');
      setIsDetailModalOpen(false);
    }
  };

  const getAssetIcon = (assetType: string) => {
    switch (assetType) {
      case 'Forest Land':
        return <FaTree className="h-4 w-4 text-green-600" />;
      case 'Agricultural Land':
        return <FaLeaf className="h-4 w-4 text-yellow-600" />;
      case 'Settlement':
        return <FaHome className="h-4 w-4 text-blue-600" />;
      default:
        return <FaMapMarkerAlt className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1B365D] mb-2">Field Verification</h1>
          <p className="text-gray-600">Asset verification and field surveys across Madhya Pradesh</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Button variant="outline" className="flex items-center space-x-2">
            <FaDownload className="h-4 w-4" />
            <span>Export Report</span>
          </Button>
          <Button className="bg-[#1B365D] hover:bg-[#0F1B2E] flex items-center space-x-2">
            <FaCalendarAlt className="h-4 w-4" />
            <span>Schedule Visit</span>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Assets</p>
                <p className="text-2xl font-bold">{filteredAssets.length}</p>
              </div>
              <FaMapMarkerAlt className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Verified</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.verificationStatus === 'Verified').length}
                </p>
              </div>
              <FaCheckCircle className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">In Progress</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.verificationStatus === 'In Progress').length}
                </p>
              </div>
              <FaClock className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Scheduled</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.verificationStatus === 'Scheduled').length}
                </p>
              </div>
              <FaCalendarAlt className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Issues Found</p>
                <p className="text-2xl font-bold">
                  {filteredAssets.filter(a => a.issues !== 'None').length}
                </p>
              </div>
              <FaExclamationTriangle className="h-8 w-8 text-red-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by claim ID, village, or officer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Verification Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Scheduled">Scheduled</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending Review">Pending Review</SelectItem>
                <SelectItem value="Verified">Verified</SelectItem>
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

            <Select value={assetTypeFilter} onValueChange={setAssetTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Asset Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Asset Types</SelectItem>
                <SelectItem value="Forest Land">Forest Land</SelectItem>
                <SelectItem value="Agricultural Land">Agricultural Land</SelectItem>
                <SelectItem value="Grazing Land">Grazing Land</SelectItem>
                <SelectItem value="Water Body">Water Body</SelectItem>
                <SelectItem value="Settlement">Settlement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assets Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FaMapMarkerAlt className="h-5 w-5" />
            <span>Asset Verification Data ({filteredAssets.length} total)</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset ID</TableHead>
                  <TableHead>Claim ID</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Village</TableHead>
                  <TableHead>Asset Type</TableHead>
                  <TableHead>Area (acres)</TableHead>
                  <TableHead>Coordinates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Scheduled Date</TableHead>
                  <TableHead>Verification Officer</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAssets.map((asset) => (
                  <TableRow 
                    key={asset.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleAssetClick(asset)}
                  >
                    <TableCell className="font-medium text-sm">{asset.id}</TableCell>
                    <TableCell className="text-blue-600 font-medium text-sm">{asset.claimId}</TableCell>
                    <TableCell className="text-sm">{asset.district}</TableCell>
                    <TableCell className="text-sm">{asset.village}</TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center space-x-1">
                        {getAssetIcon(asset.assetType)}
                        <span className="text-xs">{asset.assetType}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{asset.area}</TableCell>
                    <TableCell className="text-xs">
                      <div className="space-y-1">
                        <div>Lat: {asset.coordinates.lat}</div>
                        <div>Lng: {asset.coordinates.lng}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusBadge(asset.verificationStatus)} variant="outline">
                        {asset.verificationStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{asset.scheduledDate}</TableCell>
                    <TableCell className="text-xs">{asset.verificationOfficer}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredAssets.length)} of {filteredAssets.length} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Asset Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FaMapMarkerAlt className="h-5 w-5 text-green-600" />
              <span>Asset Verification Details - {selectedAsset?.id}</span>
            </DialogTitle>
            <DialogDescription>
              Comprehensive verification information and status updates
            </DialogDescription>
          </DialogHeader>

          {selectedAsset && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Asset ID</Label>
                      <p className="font-medium">{selectedAsset.id}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Claim ID</Label>
                      <p className="text-blue-600 font-medium">{selectedAsset.claimId}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">District</Label>
                      <p>{selectedAsset.district}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Village</Label>
                      <p>{selectedAsset.village}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Asset Type</Label>
                      <div className="flex items-center space-x-2">
                        {getAssetIcon(selectedAsset.assetType)}
                        <span>{selectedAsset.assetType}</span>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Land Class</Label>
                      <p>{selectedAsset.landClass}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Area</Label>
                      <p>{selectedAsset.area} acres</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Survey Number</Label>
                      <p>{selectedAsset.surveyNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Technical Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Location & Technical Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Latitude</Label>
                      <p className="font-mono text-sm">{selectedAsset.coordinates.lat}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Longitude</Label>
                      <p className="font-mono text-sm">{selectedAsset.coordinates.lng}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">GPS Accuracy</Label>
                      <p>{selectedAsset.gpsAccuracy}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Forest Cover</Label>
                      <p>{selectedAsset.forestCover}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Accessibility</Label>
                      <Badge variant="outline" className={
                        selectedAsset.accessibility === 'Easy' ? 'bg-green-100 text-green-800' :
                        selectedAsset.accessibility === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedAsset.accessibility}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Nearest Road</Label>
                      <p>{selectedAsset.nearestRoad}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Photographs</Label>
                      <p>{selectedAsset.photographsTaken} taken</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Documents</Label>
                      <p>{selectedAsset.documentsVerified} verified</p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Boundary Marked</Label>
                    <Badge variant="outline" className={selectedAsset.boundaryMarked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {selectedAsset.boundaryMarked ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Verification Status & Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Verification Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Current Status</Label>
                      <Badge className={getStatusBadge(selectedAsset.verificationStatus)} variant="outline">
                        {selectedAsset.verificationStatus}
                      </Badge>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Verification Officer</Label>
                      <p>{selectedAsset.verificationOfficer}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Scheduled Date</Label>
                      <p>{selectedAsset.scheduledDate}</p>
                    </div>
                    {selectedAsset.verificationDate && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Verification Date</Label>
                        <p>{selectedAsset.verificationDate}</p>
                      </div>
                    )}
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Last Updated</Label>
                      <p>{selectedAsset.lastUpdated}</p>
                    </div>
                    {selectedAsset.issues !== 'None' && (
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Issues</Label>
                        <Badge variant="outline" className="bg-red-100 text-red-800">
                          {selectedAsset.issues}
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Status Update Section */}
                  <div className="pt-4 border-t">
                    <Label htmlFor="status-update" className="text-sm font-medium">
                      Update Verification Status
                    </Label>
                    <Select value={newVerificationStatus} onValueChange={setNewVerificationStatus}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select new status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Pending Review">Pending Review</SelectItem>
                        <SelectItem value="Verified">Verified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Officer Remarks & Updates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <FaEdit className="h-4 w-4" />
                    <span>Officer Remarks & Updates</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Current Remarks</Label>
                    <p className="text-sm bg-gray-50 p-3 rounded-md mt-2">
                      {selectedAsset.officerRemarks}
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="new-remarks" className="text-sm font-medium">
                      Add New Remarks/Updates
                    </Label>
                    <Textarea
                      id="new-remarks"
                      placeholder="Enter verification remarks, updates, or observations..."
                      value={verificationRemarks}
                      onChange={(e) => setVerificationRemarks(e.target.value)}
                      className="mt-2"
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleStatusUpdate}
                      className="bg-[#1B365D] hover:bg-[#2C4A6B]"
                    >
                      <FaEdit className="h-4 w-4 mr-2" />
                      Update Status & Remarks
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsDetailModalOpen(false)}
                    >
                      <FaTimes className="h-4 w-4 mr-2" />
                      Close
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FieldVerification;