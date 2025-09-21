import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import { 
  FileText, 
  Download, 
  Calendar as CalendarIcon, 
  TrendingUp, 
  Users, 
  MapPin, 
  BarChart3,
  Filter,
  Eye,
  Share
} from 'lucide-react';
import { format } from 'date-fns';

// Import data
import reportsData from '@/data/reports.json';
import claimsData from '@/data/claims.json';
import schemesData from '@/data/schemes.json';
import complaintsData from '@/data/complaints.json';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('overview');
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date());
  const [exportFormat, setExportFormat] = useState('pdf');
  const [selectedState, setSelectedState] = useState('all');

  // Process data for different report types
  const yearlyData = reportsData.yearly_progress;
  const stateData = reportsData.state_coverage;
  const schemePerformance = reportsData.scheme_performance;
  const monthlyComplaints = reportsData.monthly_complaints;

  // Calculate summary statistics
  const totalClaims = claimsData.claims.length;
  const grantedClaims = claimsData.claims.filter(c => c.status === 'granted').length;
  const averageProcessingTime = 45; // days
  const totalBeneficiaries = schemesData.schemes.reduce((sum, s) => sum + (s.beneficiaries || 0), 0);

  // Top performing and lagging districts
  const topDistricts = [
    { district: 'Mayurbhanj', state: 'Odisha', completion: 92, claims: 156 },
    { district: 'South West Khasi Hills', state: 'Meghalaya', completion: 89, claims: 87 },
    { district: 'Chhindwara', state: 'Madhya Pradesh', completion: 85, claims: 134 },
    { district: 'Udaipur', state: 'Rajasthan', completion: 82, claims: 98 },
    { district: 'Dumka', state: 'Jharkhand', completion: 78, claims: 167 }
  ];

  const laggingDistricts = [
    { district: 'Khunti', state: 'Jharkhand', completion: 45, claims: 89, issues: 'Documentation gaps' },
    { district: 'West Garo Hills', state: 'Meghalaya', completion: 52, claims: 67, issues: 'Staff shortage' },
    { district: 'Banswara', state: 'Rajasthan', completion: 58, claims: 123, issues: 'Survey delays' },
    { district: 'Betul', state: 'Madhya Pradesh', completion: 61, claims: 95, issues: 'Technology gaps' }
  ];

  // Multi-year comparison data
  const multiYearComparison = [
    { year: '2020', odisha: 380, jharkhand: 520, mp: 420, rajasthan: 280, meghalaya: 180 },
    { year: '2021', odisha: 520, jharkhand: 680, mp: 580, rajasthan: 380, meghalaya: 240 },
    { year: '2022', odisha: 650, jharkhand: 820, mp: 720, rajasthan: 480, meghalaya: 320 },
    { year: '2023', odisha: 780, jharkhand: 950, mp: 850, rajasthan: 580, meghalaya: 380 },
    { year: '2024', odisha: 420, jharkhand: 580, mp: 480, rajasthan: 320, meghalaya: 250 }
  ];

  const reportTypes = [
    {
      id: 'overview',
      name: 'Executive Overview',
      description: 'High-level summary of all activities',
      icon: FileText
    },
    {
      id: 'claims',
      name: 'Claims Analysis',
      description: 'Detailed FRA claims statistics',
      icon: BarChart3
    },
    {
      id: 'schemes',
      name: 'Scheme Performance',
      description: 'Government scheme implementation data',
      icon: TrendingUp
    },
    {
      id: 'geographical',
      name: 'Geographical Analysis',
      description: 'State and district-wise breakdown',
      icon: MapPin
    },
    {
      id: 'comparative',
      name: 'Comparative Analysis',
      description: 'Multi-year and cross-state comparison',
      icon: BarChart3
    }
  ];

  const handleExportReport = () => {
    console.log(`Exporting ${selectedReport} report as ${exportFormat}`);
    // In a real app, this would trigger the export functionality
  };

  const getCompletionColor = (completion: number) => {
    if (completion >= 80) return 'text-success';
    if (completion >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive reports and data analysis for tribal development programs
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={exportFormat} onValueChange={setExportFormat}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={handleExportReport} className="flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Claims</p>
                <p className="text-2xl font-bold">{totalClaims.toLocaleString()}</p>
                <p className="text-xs text-success">+12% from last month</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">{Math.round((grantedClaims / totalClaims) * 100)}%</p>
                <p className="text-xs text-success">+8% from last month</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Processing Time</p>
                <p className="text-2xl font-bold">{averageProcessingTime}d</p>
                <p className="text-xs text-destructive">+2d from last month</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Beneficiaries</p>
                <p className="text-2xl font-bold">{totalBeneficiaries.toLocaleString()}</p>
                <p className="text-xs text-success">+15% from last month</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="claims">Claims</TabsTrigger>
          <TabsTrigger value="schemes">Schemes</TabsTrigger>
          <TabsTrigger value="geographical">Geographical</TabsTrigger>
          <TabsTrigger value="comparative">Comparative</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Executive Summary */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Executive Summary</CardTitle>
              <CardDescription>Key performance indicators and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Yearly Progress */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Yearly Progress Trend</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <AreaChart data={yearlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area 
                        type="monotone" 
                        dataKey="claims_granted" 
                        stroke="hsl(var(--success))" 
                        fill="hsl(var(--success))"
                        fillOpacity={0.3}
                        name="Granted Claims"
                      />
                      <Area 
                        type="monotone" 
                        dataKey="claims_filed" 
                        stroke="hsl(var(--primary))" 
                        fill="hsl(var(--primary))"
                        fillOpacity={0.3}
                        name="Filed Claims"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* State Performance */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">State Performance</h3>
                  <div className="space-y-3">
                    {stateData.slice(0, 5).map((state, index) => (
                      <div key={state.state} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div>
                          <p className="font-medium">{state.state}</p>
                          <p className="text-sm text-muted-foreground">
                            {state.granted} granted / {state.total_claims} total
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-lg font-bold ${getCompletionColor(state.coverage_percent)}`}>
                            {state.coverage_percent}%
                          </p>
                          <Badge variant={state.coverage_percent >= 75 ? 'default' : 'secondary'} 
                                 className={state.coverage_percent >= 75 ? 'bg-success text-success-foreground' : ''}>
                            {state.coverage_percent >= 75 ? 'Good' : 'Needs Improvement'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Key Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                    <div>
                      <p className="font-medium">15% increase in claim approvals</p>
                      <p className="text-sm text-muted-foreground">Compared to previous quarter</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                    <div>
                      <p className="font-medium">92% scheme implementation rate</p>
                      <p className="text-sm text-muted-foreground">Across all tribal regions</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-success mt-2"></div>
                    <div>
                      <p className="font-medium">2,450 new beneficiaries added</p>
                      <p className="text-sm text-muted-foreground">This month alone</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                    <div>
                      <p className="font-medium">Digital infrastructure gaps</p>
                      <p className="text-sm text-muted-foreground">35% areas lack connectivity</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-destructive mt-2"></div>
                    <div>
                      <p className="font-medium">Processing time increased</p>
                      <p className="text-sm text-muted-foreground">Average 45 days vs target 30 days</p>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full bg-warning mt-2"></div>
                    <div>
                      <p className="font-medium">Regional disparities</p>
                      <p className="text-sm text-muted-foreground">30% difference between top and bottom states</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="claims" className="space-y-6">
          {/* Claims Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Claims Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Granted', value: grantedClaims, color: 'hsl(var(--success))' },
                        { name: 'Pending', value: claimsData.claims.filter(c => c.status === 'pending').length, color: 'hsl(var(--pending))' },
                        { name: 'Rejected', value: claimsData.claims.filter(c => c.status === 'rejected').length, color: 'hsl(var(--destructive))' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Granted', value: grantedClaims, color: 'hsl(var(--success))' },
                        { name: 'Pending', value: claimsData.claims.filter(c => c.status === 'pending').length, color: 'hsl(var(--pending))' },
                        { name: 'Rejected', value: claimsData.claims.filter(c => c.status === 'rejected').length, color: 'hsl(var(--destructive))' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Claims by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={[
                    { type: 'IFR', count: claimsData.claims.filter(c => c.type === 'IFR').length },
                    { type: 'CFR', count: claimsData.claims.filter(c => c.type === 'CFR').length },
                    { type: 'CR', count: claimsData.claims.filter(c => c.type === 'CR').length }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Processing Timeline */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Claims Processing Timeline</CardTitle>
              <CardDescription>Monthly filing and approval trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={yearlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="claims_filed" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    name="Filed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="claims_granted" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={2}
                    name="Granted"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schemes" className="space-y-6">
          {/* Scheme Performance */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Scheme Performance Overview</CardTitle>
              <CardDescription>Target vs Achievement comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={schemePerformance}>
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

          {/* Scheme Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {schemePerformance
                    .sort((a, b) => b.percent - a.percent)
                    .slice(0, 5)
                    .map((scheme, index) => (
                      <div key={scheme.scheme} className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{scheme.scheme}</p>
                          <div className="w-full bg-muted rounded-full h-2 mt-1">
                            <div 
                              className="bg-success h-2 rounded-full" 
                              style={{ width: `${scheme.percent}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-semibold text-success">{scheme.percent}%</p>
                          <p className="text-xs text-muted-foreground">
                            {scheme.achieved.toLocaleString()} / {scheme.target.toLocaleString()}
                          </p>
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
                            <span className="font-medium">{scheme.name.substring(0, 20)}...</span>
                            <span>{utilizationPercent.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full" 
                              style={{ width: `${utilizationPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographical" className="space-y-6">
          {/* State-wise Performance */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>State-wise Coverage Analysis</CardTitle>
              <CardDescription>Coverage percentage across different states</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={stateData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="coverage_percent" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* District Performance */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Performing Districts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topDistricts.map((district, index) => (
                    <div key={district.district} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                      <div>
                        <p className="font-medium">{district.district}</p>
                        <p className="text-sm text-muted-foreground">{district.state}</p>
                        <p className="text-sm text-muted-foreground">{district.claims} claims processed</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-success">{district.completion}%</p>
                        <Badge variant="default" className="bg-success text-success-foreground">
                          #{index + 1}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Districts Needing Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {laggingDistricts.map((district) => (
                    <div key={district.district} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{district.district}</p>
                        <p className="text-sm text-muted-foreground">{district.state}</p>
                        <p className="text-xs text-destructive">{district.issues}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-destructive">{district.completion}%</p>
                        <p className="text-xs text-muted-foreground">{district.claims} claims</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          {/* Multi-year Comparison */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Multi-Year State Comparison</CardTitle>
              <CardDescription>Claims granted across states over multiple years</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={multiYearComparison}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="odisha" stroke="#16a34a" strokeWidth={2} name="Odisha" />
                  <Line type="monotone" dataKey="jharkhand" stroke="#2563eb" strokeWidth={2} name="Jharkhand" />
                  <Line type="monotone" dataKey="mp" stroke="#ca8a04" strokeWidth={2} name="Madhya Pradesh" />
                  <Line type="monotone" dataKey="rajasthan" stroke="#dc2626" strokeWidth={2} name="Rajasthan" />
                  <Line type="monotone" dataKey="meghalaya" stroke="#7c3aed" strokeWidth={2} name="Meghalaya" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Year-over-Year Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Claims Filed</span>
                    <span className="text-lg font-bold text-success">+18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Approvals</span>
                    <span className="text-lg font-bold text-success">+22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Beneficiaries</span>
                    <span className="text-lg font-bold text-success">+15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Regional Leaders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Highest Coverage</span>
                    <Badge variant="default" className="bg-success text-success-foreground">Meghalaya</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Most Claims</span>
                    <Badge variant="default" className="bg-primary text-primary-foreground">Jharkhand</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fastest Processing</span>
                    <Badge variant="default" className="bg-warning text-warning-foreground">Odisha</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Efficiency Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall Efficiency</span>
                    <span className="text-lg font-bold">87%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cost per Beneficiary</span>
                    <span className="text-lg font-bold">₹2,340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Digital Adoption</span>
                    <span className="text-lg font-bold">65%</span>
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

export default Reports;