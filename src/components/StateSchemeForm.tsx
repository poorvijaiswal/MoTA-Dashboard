import React, { useState } from 'react';
import { 
  FaPlus, 
  FaMinus, 
  FaSave, 
  FaTimes, 
  FaFileAlt, 
  FaUsers, 
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaRupeeSign
} from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

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

interface StateSchemeFormProps {
  scheme?: StateScheme;
  onSave: (schemeData: StateScheme) => void;
  onCancel: () => void;
}

const StateSchemeForm = ({ scheme, onSave, onCancel }: StateSchemeFormProps) => {
  const [formData, setFormData] = useState<StateScheme>({
    id: scheme?.id || `SCH-MP-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
    name: scheme?.name || '',
    department: scheme?.department || '',
    budget: scheme?.budget || 0,
    eligibility: scheme?.eligibility || '',
    district: scheme?.district || '',
    tehsil: scheme?.tehsil || '',
    status: scheme?.status || 'Planning',
    startDate: scheme?.startDate || new Date().toISOString().split('T')[0],
    endDate: scheme?.endDate || '',
    beneficiaries: scheme?.beneficiaries || 0,
    targetBeneficiaries: scheme?.targetBeneficiaries || 0,
    utilization: scheme?.utilization || 0,
    description: scheme?.description || '',
    category: scheme?.category || 'Forest Rights',
    priority: scheme?.priority || 'Medium',
    documents: scheme?.documents || ['Aadhaar Card', 'Income Certificate'],
    verificationLevel: scheme?.verificationLevel || 'District Officer',
    processingTimeDays: scheme?.processingTimeDays || 30
  });

  const [documents, setDocuments] = useState<string[]>(formData.documents);
  const [referenceData, setReferenceData] = useState<{
    departments: string[];
    districts: string[];
    categories: string[];
  }>({
    departments: [],
    districts: [],
    categories: []
  });

  // Load reference data on component mount
  React.useEffect(() => {
    const loadReferenceData = async () => {
      try {
        const response = await fetch('/data/mp-reference-data.json');
        const data = await response.json();
        setReferenceData(data);
      } catch (error) {
        console.error('Failed to load reference data:', error);
        // Fallback to default values
        setReferenceData({
          departments: [
            'Forest Department',
            'Tribal Affairs Department', 
            'Revenue Department',
            'Rural Development Department',
            'Agriculture Department',
            'Social Justice Department',
            'Women & Child Development'
          ],
          districts: [
            'Agar Malwa', 'Alirajpur', 'Anuppur', 'Ashoknagar', 'Balaghat', 'Barwani',
            'Betul', 'Bhind', 'Bhopal', 'Burhanpur', 'Chhatarpur', 'Chhindwara',
            'Damoh', 'Datia', 'Dewas', 'Dhar', 'Dindori', 'Guna', 'Gwalior',
            'Harda', 'Hoshangabad', 'Indore', 'Jabalpur', 'Jhabua', 'Katni',
            'Khandwa', 'Khargone', 'Mandla', 'Mandsaur', 'Morena', 'Narsinghpur'
          ],
          categories: [
            'Forest Rights',
            'Tribal Welfare',
            'Agricultural Support', 
            'Education',
            'Healthcare',
            'Skills Development',
            'Housing',
            'Financial Inclusion'
          ]
        });
      }
    };
    loadReferenceData();
  }, []);

  const updateFormData = (field: keyof StateScheme, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addDocument = () => {
    const newDoc = `Document ${documents.length + 1}`;
    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    updateFormData('documents', updatedDocs);
  };

  const removeDocument = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    updateFormData('documents', updatedDocs);
  };

  const updateDocument = (index: number, value: string) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = value;
    setDocuments(updatedDocs);
    updateFormData('documents', updatedDocs);
  };

  const handleSave = () => {
    // Calculate utilization percentage
    const utilization = formData.targetBeneficiaries > 0 
      ? Math.round((formData.beneficiaries / formData.targetBeneficiaries) * 100)
      : 0;
    
    onSave({
      ...formData,
      utilization,
      documents
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-[#1B365D] to-[#2B4A7E] text-white">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center">
            <FaFileAlt className="h-6 w-6 mr-3" />
            {scheme ? 'Edit State Scheme' : 'Add New State Scheme'}
          </CardTitle>
          <CardDescription className="text-blue-100">
            Configure scheme details for Madhya Pradesh tribal and forest development programs
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="location">Location & Target</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#1B365D]">
                <FaFileAlt className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheme-id">Scheme ID</Label>
                  <Input
                    id="scheme-id"
                    value={formData.id}
                    onChange={(e) => updateFormData('id', e.target.value)}
                    placeholder="SCH-MP-0001"
                  />
                </div>
                <div>
                  <Label htmlFor="scheme-name">Scheme Name</Label>
                  <Input
                    id="scheme-name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="Enter scheme name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Select value={formData.department} onValueChange={(value) => updateFormData('department', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      {referenceData.departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {referenceData.categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planning">Planning</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => updateFormData('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="budget">Budget (₹ in Crores)</Label>
                  <Input
                    id="budget"
                    type="number"
                    step="0.01"
                    value={formData.budget}
                    onChange={(e) => updateFormData('budget', parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Scheme Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => updateFormData('description', e.target.value)}
                  placeholder="Detailed description of the scheme objectives and benefits..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#1B365D]">
                <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                Location & Target Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="district">Target District</Label>
                  <Select value={formData.district} onValueChange={(value) => updateFormData('district', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Districts">All Districts</SelectItem>
                      {referenceData.districts.map(district => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tehsil">Tehsil/Block</Label>
                  <Input
                    id="tehsil"
                    value={formData.tehsil}
                    onChange={(e) => updateFormData('tehsil', e.target.value)}
                    placeholder="Enter tehsil or block name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => updateFormData('startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => updateFormData('endDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="target-beneficiaries">Target Beneficiaries</Label>
                  <Input
                    id="target-beneficiaries"
                    type="number"
                    value={formData.targetBeneficiaries}
                    onChange={(e) => updateFormData('targetBeneficiaries', parseInt(e.target.value) || 0)}
                    placeholder="Number of target beneficiaries"
                  />
                </div>
                <div>
                  <Label htmlFor="current-beneficiaries">Current Beneficiaries</Label>
                  <Input
                    id="current-beneficiaries"
                    type="number"
                    value={formData.beneficiaries}
                    onChange={(e) => updateFormData('beneficiaries', parseInt(e.target.value) || 0)}
                    placeholder="Number of current beneficiaries"
                  />
                </div>
              </div>

              {formData.targetBeneficiaries > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label>Progress Overview</Label>
                  <div className="mt-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Beneficiaries Covered</span>
                      <span>{Math.round((formData.beneficiaries / formData.targetBeneficiaries) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#1B365D] h-2 rounded-full transition-all"
                        style={{ width: `${Math.min((formData.beneficiaries / formData.targetBeneficiaries) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#1B365D]">
                <FaUsers className="h-5 w-5 mr-2" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="eligibility">Eligibility Criteria</Label>
                <Textarea
                  id="eligibility"
                  value={formData.eligibility}
                  onChange={(e) => updateFormData('eligibility', e.target.value)}
                  placeholder="Define detailed eligibility criteria including income limits, tribal status, land ownership requirements, etc."
                  rows={6}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-[#1B365D] mb-2">Common Eligibility Examples:</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Must belong to Scheduled Tribe (ST) category</li>
                  <li>• Annual family income should not exceed ₹2,00,000</li>
                  <li>• Should be a resident of Madhya Pradesh for at least 5 years</li>
                  <li>• Age between 18-60 years for individual schemes</li>
                  <li>• Must have valid forest rights certificate (for forest-related schemes)</li>
                  <li>• Should not be beneficiary of similar schemes in last 3 years</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-[#1B365D]">
                <FaCalendarAlt className="h-5 w-5 mr-2" />
                Application Process
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Required Documents</Label>
                <div className="space-y-2 mt-2">
                  {documents.map((doc, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={doc}
                        onChange={(e) => updateDocument(index, e.target.value)}
                        placeholder="Document name"
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeDocument(index)}
                        disabled={documents.length <= 1}
                      >
                        <FaMinus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={addDocument}>
                    <FaPlus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="verification-level">Verification Level</Label>
                  <Select 
                    value={formData.verificationLevel} 
                    onValueChange={(value) => updateFormData('verificationLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Village Revenue Officer">Village Revenue Officer</SelectItem>
                      <SelectItem value="Block Development Officer">Block Development Officer</SelectItem>
                      <SelectItem value="District Officer">District Officer</SelectItem>
                      <SelectItem value="Divisional Officer">Divisional Officer</SelectItem>
                      <SelectItem value="State Officer">State Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="processing-time">Processing Time (days)</Label>
                  <Input
                    id="processing-time"
                    type="number"
                    value={formData.processingTimeDays}
                    onChange={(e) => updateFormData('processingTimeDays', parseInt(e.target.value) || 30)}
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">Process Timeline:</h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>• Application submission: Day 1</p>
                  <p>• Document verification: Day 1-7</p>
                  <p>• Field verification (if required): Day 8-15</p>
                  <p>• Officer review and approval: Day 16-{formData.processingTimeDays}</p>
                  <p>• Benefit disbursement: Within 15 days of approval</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel} className="flex items-center">
              <FaTimes className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              className="bg-[#1B365D] hover:bg-[#0F1B2E] flex items-center"
            >
              <FaSave className="w-4 h-4 mr-2" />
              {scheme ? 'Update Scheme' : 'Create Scheme'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StateSchemeForm;