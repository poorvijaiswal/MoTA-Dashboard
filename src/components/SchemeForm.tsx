import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Save, X } from 'lucide-react';

interface SchemeFormProps {
  scheme?: any;
  onSave: (schemeData: any) => void;
  onCancel: () => void;
}

const SchemeForm = ({ scheme, onSave, onCancel }: SchemeFormProps) => {
  const [formData, setFormData] = useState({
    id: scheme?.id || `S${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
    name: scheme?.name || '',
    ministry: scheme?.ministry || '',
    status: scheme?.status || 'available',
    progress_percent: scheme?.progress_percent || 0,
    policy_text: scheme?.policy_text || '',
    beneficiaries: scheme?.beneficiaries || 0,
    budget_allocated: scheme?.budget_allocated || 0,
    budget_utilized: scheme?.budget_utilized || 0,
    policy_rules: {
      eligibility_criteria: {
        land_ownership: scheme?.policy_rules?.eligibility_criteria?.land_ownership || 'any',
        land_size_min: scheme?.policy_rules?.eligibility_criteria?.land_size_min || 0,
        land_size_max: scheme?.policy_rules?.eligibility_criteria?.land_size_max || null,
        family_income_max: scheme?.policy_rules?.eligibility_criteria?.family_income_max || null,
        tribe_status: scheme?.policy_rules?.eligibility_criteria?.tribe_status || 'any',
        age_min: scheme?.policy_rules?.eligibility_criteria?.age_min || 18,
        age_max: scheme?.policy_rules?.eligibility_criteria?.age_max || null
      },
      benefit_structure: {
        amount_per_year: scheme?.policy_rules?.benefit_structure?.amount_per_year || 0,
        payment_frequency: scheme?.policy_rules?.benefit_structure?.payment_frequency || 'yearly',
        payment_amount: scheme?.policy_rules?.benefit_structure?.payment_amount || 0,
        payment_months: scheme?.policy_rules?.benefit_structure?.payment_months || [12]
      },
      application_process: {
        documents_required: scheme?.policy_rules?.application_process?.documents_required || ['identity_proof'],
        verification_level: scheme?.policy_rules?.application_process?.verification_level || 'district_officer',
        processing_time_days: scheme?.policy_rules?.application_process?.processing_time_days || 30
      }
    }
  });

  const [documents, setDocuments] = useState<string[]>(
    formData.policy_rules.application_process.documents_required
  );

  const ministries = [
    'Ministry of Agriculture & Farmers Welfare',
    'Ministry of Rural Development',
    'Ministry of Tribal Affairs',
    'Ministry of Petroleum & Natural Gas',
    'Ministry of Skill Development & Entrepreneurship',
    'Ministry of Housing & Urban Affairs',
    'Ministry of Water Resources'
  ];

  const updateFormData = (path: string, value: any) => {
    const keys = path.split('.');
    const updatedData = { ...formData };
    let current = updatedData;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setFormData(updatedData);
  };

  const addDocument = () => {
    const newDoc = `document_${documents.length + 1}`;
    const updatedDocs = [...documents, newDoc];
    setDocuments(updatedDocs);
    updateFormData('policy_rules.application_process.documents_required', updatedDocs);
  };

  const removeDocument = (index: number) => {
    const updatedDocs = documents.filter((_, i) => i !== index);
    setDocuments(updatedDocs);
    updateFormData('policy_rules.application_process.documents_required', updatedDocs);
  };

  const updateDocument = (index: number, value: string) => {
    const updatedDocs = [...documents];
    updatedDocs[index] = value;
    setDocuments(updatedDocs);
    updateFormData('policy_rules.application_process.documents_required', updatedDocs);
  };

  const handleSave = () => {
    onSave({ ...formData, policy_rules: { ...formData.policy_rules } });
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>{scheme ? 'Edit Scheme' : 'Add New Scheme'}</CardTitle>
          <CardDescription>
            Configure scheme policies and eligibility rules for DSS Engine integration
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="eligibility">Eligibility</TabsTrigger>
          <TabsTrigger value="benefits">Benefits</TabsTrigger>
          <TabsTrigger value="process">Process</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="scheme-id">Scheme ID</Label>
                  <Input
                    id="scheme-id"
                    value={formData.id}
                    onChange={(e) => updateFormData('id', e.target.value)}
                    placeholder="S001"
                  />
                </div>
                <div>
                  <Label htmlFor="scheme-name">Scheme Name</Label>
                  <Input
                    id="scheme-name"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    placeholder="PM-KISAN"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="ministry">Ministry</Label>
                <Select value={formData.ministry} onValueChange={(value) => updateFormData('ministry', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ministry" />
                  </SelectTrigger>
                  <SelectContent>
                    {ministries.map(ministry => (
                      <SelectItem key={ministry} value={ministry}>{ministry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => updateFormData('status', value)}>
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
                <div>
                  <Label htmlFor="progress">Progress %</Label>
                  <Input
                    id="progress"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress_percent}
                    onChange={(e) => updateFormData('progress_percent', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="beneficiaries">Target Beneficiaries</Label>
                  <Input
                    id="beneficiaries"
                    type="number"
                    value={formData.beneficiaries}
                    onChange={(e) => updateFormData('beneficiaries', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget-allocated">Budget Allocated (₹)</Label>
                  <Input
                    id="budget-allocated"
                    type="number"
                    value={formData.budget_allocated}
                    onChange={(e) => updateFormData('budget_allocated', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="budget-utilized">Budget Utilized (₹)</Label>
                  <Input
                    id="budget-utilized"
                    type="number"
                    value={formData.budget_utilized}
                    onChange={(e) => updateFormData('budget_utilized', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="policy-text">Policy Description</Label>
                <Textarea
                  id="policy-text"
                  value={formData.policy_text}
                  onChange={(e) => updateFormData('policy_text', e.target.value)}
                  placeholder="Brief description of the scheme..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="eligibility" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Eligibility Criteria</CardTitle>
              <CardDescription>Define who can apply for this scheme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="land-ownership">Land Ownership Requirement</Label>
                  <Select 
                    value={formData.policy_rules.eligibility_criteria.land_ownership} 
                    onValueChange={(value) => updateFormData('policy_rules.eligibility_criteria.land_ownership', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="must_have_cultivable_land">Must have cultivable land</SelectItem>
                      <SelectItem value="landless">Landless only</SelectItem>
                      <SelectItem value="marginal_farmer">Marginal farmer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tribe-status">Tribe Status</Label>
                  <Select 
                    value={formData.policy_rules.eligibility_criteria.tribe_status} 
                    onValueChange={(value) => updateFormData('policy_rules.eligibility_criteria.tribe_status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="scheduled_tribe">Scheduled Tribe only</SelectItem>
                      <SelectItem value="primitive_tribal_group">Primitive Tribal Group</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="land-min">Minimum Land Size (acres)</Label>
                  <Input
                    id="land-min"
                    type="number"
                    step="0.1"
                    value={formData.policy_rules.eligibility_criteria.land_size_min}
                    onChange={(e) => updateFormData('policy_rules.eligibility_criteria.land_size_min', parseFloat(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="land-max">Maximum Land Size (acres)</Label>
                  <Input
                    id="land-max"
                    type="number"
                    step="0.1"
                    value={formData.policy_rules.eligibility_criteria.land_size_max || ''}
                    onChange={(e) => updateFormData('policy_rules.eligibility_criteria.land_size_max', e.target.value ? parseFloat(e.target.value) : null)}
                    placeholder="No limit"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="income-max">Max Family Income (₹/year)</Label>
                  <Input
                    id="income-max"
                    type="number"
                    value={formData.policy_rules.eligibility_criteria.family_income_max || ''}
                    onChange={(e) => updateFormData('policy_rules.eligibility_criteria.family_income_max', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="No limit"
                  />
                </div>
                <div>
                  <Label htmlFor="age-min">Minimum Age</Label>
                  <Input
                    id="age-min"
                    type="number"
                    value={formData.policy_rules.eligibility_criteria.age_min}
                    onChange={(e) => updateFormData('policy_rules.eligibility_criteria.age_min', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="age-max">Maximum Age</Label>
                  <Input
                    id="age-max"
                    type="number"
                    value={formData.policy_rules.eligibility_criteria.age_max || ''}
                    onChange={(e) => updateFormData('policy_rules.eligibility_criteria.age_max', e.target.value ? parseInt(e.target.value) : null)}
                    placeholder="No limit"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Benefit Structure</CardTitle>
              <CardDescription>Define the financial benefits and payment schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amount-per-year">Amount Per Year (₹)</Label>
                  <Input
                    id="amount-per-year"
                    type="number"
                    value={formData.policy_rules.benefit_structure.amount_per_year}
                    onChange={(e) => updateFormData('policy_rules.benefit_structure.amount_per_year', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="payment-frequency">Payment Frequency</Label>
                  <Select 
                    value={formData.policy_rules.benefit_structure.payment_frequency} 
                    onValueChange={(value) => updateFormData('policy_rules.benefit_structure.payment_frequency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="half-yearly">Half-yearly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="payment-amount">Payment Amount (₹)</Label>
                <Input
                  id="payment-amount"
                  type="number"
                  value={formData.policy_rules.benefit_structure.payment_amount}
                  onChange={(e) => updateFormData('policy_rules.benefit_structure.payment_amount', parseInt(e.target.value))}
                  placeholder="Amount per payment"
                />
              </div>

              <div>
                <Label>Payment Months</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(month => (
                    <Badge 
                      key={month}
                      variant={formData.policy_rules.benefit_structure.payment_months.includes(month) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        const months = formData.policy_rules.benefit_structure.payment_months;
                        const updated = months.includes(month) 
                          ? months.filter(m => m !== month)
                          : [...months, month].sort((a, b) => a - b);
                        updateFormData('policy_rules.benefit_structure.payment_months', updated);
                      }}
                    >
                      {new Date(0, month - 1).toLocaleString('en', { month: 'short' })}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Application Process</CardTitle>
              <CardDescription>Configure the application and verification process</CardDescription>
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
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeDocument(index)}
                        disabled={documents.length <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button size="sm" variant="outline" onClick={addDocument}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Document
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="verification-level">Verification Level</Label>
                  <Select 
                    value={formData.policy_rules.application_process.verification_level} 
                    onValueChange={(value) => updateFormData('policy_rules.application_process.verification_level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="village_revenue_officer">Village Revenue Officer</SelectItem>
                      <SelectItem value="block_development_officer">Block Development Officer</SelectItem>
                      <SelectItem value="district_officer">District Officer</SelectItem>
                      <SelectItem value="state_officer">State Officer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="processing-time">Processing Time (days)</Label>
                  <Input
                    id="processing-time"
                    type="number"
                    value={formData.policy_rules.application_process.processing_time_days}
                    onChange={(e) => updateFormData('policy_rules.application_process.processing_time_days', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="shadow-card">
        <CardContent className="p-6">
          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={onCancel}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {scheme ? 'Update Scheme' : 'Create Scheme'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SchemeForm;