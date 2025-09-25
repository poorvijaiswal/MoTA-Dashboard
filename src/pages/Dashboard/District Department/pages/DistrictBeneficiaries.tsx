import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Download, Phone, MapPin, Users, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Beneficiary {
  id: string;
  name: string;
  fatherName: string;
  district: string;
  tehsil: string;
  village: string;
  category: string;
  tribe: string;
  pattagType: string;
  pattagNumber: string;
  landArea: string;
  surveyNumber: string;
  registrationDate: string;
  status: string;
  contactNumber: string;
  schemes: string[];
  familyMembers: number;
  monthlyIncome: number;
  forestProduce: string[];
  bankAccount: string;
  aadhaarNumber: string;
}

const Beneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [filteredBeneficiaries, setFilteredBeneficiaries] = useState<Beneficiary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterTribe, setFilterTribe] = useState('All');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Sirf Indore hi fix rakhein
  const filterDistrict = 'Indore';
  const districts = ["Indore"];

  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        const response = await fetch('/data/beneficiaries.json');
        const data = await response.json();
        setBeneficiaries(data);
        setFilteredBeneficiaries(data.filter(b => b.district === 'Indore'));
      } catch (error) {
        console.error('Failed to load beneficiaries:', error);
      }
    };
    loadBeneficiaries();
  }, []);

  useEffect(() => {
    let filtered = beneficiaries;
    if (searchTerm) {
      filtered = filtered.filter(b =>
        b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.pattagNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.district.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'All') {
      filtered = filtered.filter(b => b.status === filterStatus);
    }
    // Always apply Indore district
    filtered = filtered.filter(b => b.district === 'Indore');
    if (filterTribe !== 'All') {
      filtered = filtered.filter(b => b.tribe === filterTribe);
    }
    setFilteredBeneficiaries(filtered);
  }, [beneficiaries, searchTerm, filterStatus, filterTribe]);

  const statuses = [...new Set(beneficiaries.map(b => b.status))];
  const tribes = [...new Set(beneficiaries.map(b => b.tribe))];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending Verification': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Under Review': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Scheduled Tribe': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Particularly Vulnerable Tribal Group': return 'bg-red-100 text-red-800 border-red-200';
      case 'Other Traditional Forest Dweller': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Community Rights Holder': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleViewDetails = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('en-IN');
  const formatCurrency = (amount: number) => `₹${amount.toLocaleString()}`;
  const totalFamilyMembers = filteredBeneficiaries.reduce((sum, b) => sum + b.familyMembers, 0);
  const avgIncome = filteredBeneficiaries.length
    ? (filteredBeneficiaries.reduce((sum, b) => sum + b.monthlyIncome, 0) / filteredBeneficiaries.length)
    : 0;

  return (
    <div className="space-y-6 pb-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Scheme Beneficiaries</h1>
          <p className="text-sm text-slate-600">Forest Rights Act Beneficiaries - Indore, M.P</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-2" />Export Data</Button>
          <Button size="sm"><FileText className="h-4 w-4 mr-2" />Add Beneficiary</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Beneficiaries</p>
            <p className="text-2xl font-bold">{filteredBeneficiaries.length}</p>
          </div>
          <Users className="h-8 w-8 text-primary" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Family Members</p>
            <p className="text-2xl font-bold">{totalFamilyMembers}</p>
          </div>
          <Users className="h-8 w-8 text-green-600" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Active Pattas</p>
            <p className="text-2xl font-bold">{filteredBeneficiaries.filter(b => b.status === 'Active').length}</p>
          </div>
          <FileText className="h-8 w-8 text-blue-600" />
        </Card>
        <Card className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Avg. Income</p>
            <p className="text-2xl font-bold">{formatCurrency(Math.round(avgIncome))}</p>
          </div>
          <Calendar className="h-8 w-8 text-purple-600" />
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4 flex-wrap">
          <div className="relative flex-grow md:flex-grow-0 md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, patta number, village..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Status</SelectItem>
              {statuses.map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterDistrict} disabled>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="District" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Indore">Indore</SelectItem>
            </SelectContent>
          </Select>
          <Select value={filterTribe} onValueChange={setFilterTribe}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tribe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Tribes</SelectItem>
              {tribes.map(tribe => (
                <SelectItem key={tribe} value={tribe}>{tribe}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredBeneficiaries.map(b => (
          <Card key={b.id} className="shadow-sm rounded-lg">
            <CardHeader className="flex items-center justify-between py-3 px-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
                    {b.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">{b.name}</CardTitle>
                  <p className="text-sm text-gray-600">S/o {b.fatherName}</p>
                </div>
              </div>
              <Badge className={`${getStatusColor(b.status)} rounded-md px-3 py-1 text-sm font-medium`}>
                {b.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="flex flex-wrap gap-2">
                <Badge className={`${getCategoryColor(b.category)} rounded-md px-3 py-1 text-sm font-medium`} variant="outline">
                  {b.tribe}
                </Badge>
                <Badge variant="outline" className="rounded-md px-3 py-1 text-sm font-medium">
                  {b.pattagType}
                </Badge>
              </div>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{b.village}, {b.district}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{b.contactNumber}</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span>{b.pattagNumber}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Land Area:</span> <span>{b.landArea}</span>
                </div>
                <div>
                  <span className="font-medium">Family:</span> <span>{b.familyMembers} members</span>
                </div>
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">Monthly Income:</span> <span>{formatCurrency(b.monthlyIncome)}</span>
              </div>
              <div>
                <span className="font-medium text-sm text-gray-700">Forest Produce:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {b.forestProduce.slice(0, 3).map((produce, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-2 py-1 rounded">
                      {produce}
                    </Badge>
                  ))}
                  {b.forestProduce.length > 3 && (
                    <Badge variant="secondary" className="text-xs px-2 py-1 rounded">
                      +{b.forestProduce.length - 3}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 pt-3 border-t border-gray-200">
                <div>Registered: {formatDate(b.registrationDate)}</div>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => handleViewDetails(b)}
                >
                  <Eye className="h-4 w-4" />
                  View
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto rounded-lg">
          <DialogHeader>
            <DialogTitle>Beneficiary Details</DialogTitle>
          </DialogHeader>
          {selectedBeneficiary && (
            <div className="space-y-6 p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {selectedBeneficiary.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">{selectedBeneficiary.name}</h2>
                  <p className="text-gray-600">S/o {selectedBeneficiary.fatherName}</p>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`${getStatusColor(selectedBeneficiary.status)} rounded-md px-3 py-1 text-sm font-medium`}>
                      {selectedBeneficiary.status}
                    </Badge>
                    <Badge className={`${getCategoryColor(selectedBeneficiary.category)} rounded-md px-3 py-1 text-sm font-medium`}>
                      {selectedBeneficiary.tribe}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <section>
                  <h3 className="font-semibold mb-2 text-gray-900 text-lg">Personal Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Category:</span> {selectedBeneficiary.category}</div>
                    <div><span className="font-medium">Tribe:</span> {selectedBeneficiary.tribe}</div>
                    <div><span className="font-medium">Contact:</span> {selectedBeneficiary.contactNumber}</div>
                    <div><span className="font-medium">Aadhaar:</span> {selectedBeneficiary.aadhaarNumber}</div>
                    <div><span className="font-medium">Bank Account:</span> {selectedBeneficiary.bankAccount}</div>
                    <div><span className="font-medium">Family Members:</span> {selectedBeneficiary.familyMembers}</div>
                    <div><span className="font-medium">Monthly Income:</span> {formatCurrency(selectedBeneficiary.monthlyIncome)}</div>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold mb-2 text-gray-900 text-lg">Location Details</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">District:</span> {selectedBeneficiary.district}</div>
                    <div><span className="font-medium">Tehsil:</span> {selectedBeneficiary.tehsil}</div>
                    <div><span className="font-medium">Village:</span> {selectedBeneficiary.village}</div>
                    <div><span className="font-medium">Survey Number:</span> {selectedBeneficiary.surveyNumber}</div>
                    <div><span className="font-medium">Registration Date:</span> {formatDate(selectedBeneficiary.registrationDate)}</div>
                  </div>
                </section>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                <section>
                  <h3 className="font-semibold mb-2 text-gray-900 text-lg">Patta Information</h3>
                  <div className="space-y-1 text-sm">
                    <div><span className="font-medium">Patta Type:</span> {selectedBeneficiary.pattagType}</div>
                    <div><span className="font-medium">Patta Number:</span> {selectedBeneficiary.pattagNumber}</div>
                    <div><span className="font-medium">Land Area:</span> {selectedBeneficiary.landArea}</div>
                  </div>
                </section>

                <section>
                  <h3 className="font-semibold mb-2 text-gray-900 text-lg">Schemes Enrolled</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedBeneficiary.schemes.map((s, i) => (
                      <Badge key={i} variant="outline" className="px-3 py-1 rounded-md text-sm">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </section>
              </div>

              <section>
                <h3 className="font-semibold mb-2 text-gray-900 text-lg">Forest Produce Collection</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBeneficiary.forestProduce.map((fp, i) => (
                    <Badge key={i} variant="secondary" className="px-3 py-1 rounded-md text-sm">
                      {fp}
                    </Badge>
                  ))}
                </div>
              </section>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Beneficiaries;
