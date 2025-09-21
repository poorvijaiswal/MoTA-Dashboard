import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Users, 
  MapPin, 
  Lightbulb,
  RefreshCw,
  Download,
  Eye,
  ArrowRight,
  Zap
} from 'lucide-react';

// Import data
import reportsData from '@/data/reports.json';
import schemesData from '@/data/schemes.json';
import holdersData from '@/data/holders.json';
import claimsData from '@/data/claims.json';

const DSSEngine = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState('2 hours ago');

  // DSS Analytics Data
  const schemeGapAnalysis = [
    { state: 'Odisha', covered: 78, uncovered: 22, total_holders: 1250 },
    { state: 'Jharkhand', covered: 65, uncovered: 35, total_holders: 1890 },
    { state: 'Madhya Pradesh', covered: 72, uncovered: 28, total_holders: 1450 },
    { state: 'Rajasthan', covered: 69, uncovered: 31, total_holders: 980 },
    { state: 'Meghalaya', covered: 85, uncovered: 15, total_holders: 670 }
  ];

  const priorityInterventions = [
    {
      id: 1,
      category: 'Scheme Linkage',
      title: 'Link FRA holders to PM-KISAN',
      description: '1,250 eligible FRA holders in Odisha not enrolled in PM-KISAN scheme',
      priority: 'High',
      impact: 'High',
      beneficiaries: 1250,
      potential_benefit: 7500000,
      timeline: '30 days',
      actions: ['Verify land records', 'Process applications', 'Coordinate with Agriculture Dept']
    },
    {
      id: 2,
      category: 'Infrastructure',
      title: 'Improve Road Connectivity',
      description: '45 tribal villages lack proper road access affecting scheme delivery',
      priority: 'Medium',
      impact: 'High',
      beneficiaries: 8900,
      potential_benefit: 0,
      timeline: '6 months',
      actions: ['Survey existing roads', 'Prioritize under PMGSY', 'Allocate MGNREGA funds']
    },
    {
      id: 3,
      category: 'Water Security',
      title: 'Water Conservation Projects',
      description: 'Low water table in 23 districts affecting tribal agriculture',
      priority: 'High',
      impact: 'Very High',
      beneficiaries: 15600,
      potential_benefit: 0,
      timeline: '12 months',
      actions: ['Implement Jal Jeevan Mission', 'Watershed management', 'Community tanks']
    },
    {
      id: 4,
      category: 'Skill Development',
      title: 'Tribal Youth Training Programs',
      description: 'Low skill development coverage in remote tribal areas',
      priority: 'Medium',
      impact: 'Medium',
      beneficiaries: 3400,
      potential_benefit: 0,
      timeline: '90 days',
      actions: ['Mobile training units', 'Traditional craft training', 'Digital literacy']
    }
  ];

  const performanceMetrics = [
    { metric: 'Scheme Coverage', current: 74, target: 90, status: 'needs_improvement' },
    { metric: 'Claims Processing Speed', current: 85, target: 95, status: 'good' },
    { metric: 'Complaint Resolution', current: 92, target: 95, status: 'excellent' },
    { metric: 'Digital Infrastructure', current: 45, target: 80, status: 'critical' }
  ];

  const riskFactors = [
    {
      factor: 'Monsoon Dependency',
      level: 'High',
      description: '68% of tribal agriculture depends on monsoon, climate change risk',
      mitigation: 'Irrigation infrastructure, drought-resistant crops'
    },
    {
      factor: 'Digital Divide',
      level: 'Medium',
      description: 'Limited internet connectivity in 35% of tribal areas',
      mitigation: 'Mobile towers, digital literacy programs'
    },
    {
      factor: 'Market Access',
      level: 'High',
      description: 'Poor road connectivity affects market reach for tribal produce',
      mitigation: 'Rural road development, collection centers'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'destructive';
      case 'Medium': return 'warning';
      case 'Low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Very High': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'success';
      case 'needs_improvement': return 'warning';
      case 'critical': return 'destructive';
      default: return 'secondary';
    }
  };

  const runAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setLastAnalysis('Just now');
    }, 3000);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Brain className="w-8 h-8 mr-3 text-primary" />
            Decision Support System
          </h1>
          <p className="text-muted-foreground">
            AI-powered recommendations for tribal development and policy optimization
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Last Analysis</p>
            <p className="font-medium">{lastAnalysis}</p>
          </div>
          <Button 
            onClick={runAnalysis} 
            disabled={isAnalyzing}
            className="flex items-center"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Run Analysis
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Key Insights Alert */}
      <Alert className="border-primary/50 bg-primary/5">
        <Lightbulb className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">AI Insights Available</AlertTitle>
        <AlertDescription>
          System has identified <strong>4 high-priority interventions</strong> that could benefit{' '}
          <strong>29,150 tribal families</strong> with potential savings of ₹7.5 Crore annually.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="recommendations" className="w-full">
        <TabsList>
          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-6">
          {/* Priority Interventions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Priority Interventions
              </CardTitle>
              <CardDescription>
                AI-generated recommendations based on data analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityInterventions.map((intervention) => (
                  <Card key={intervention.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold">{intervention.title}</h3>
                            <Badge variant={getPriorityColor(intervention.priority) as any}>
                              {intervention.priority} Priority
                            </Badge>
                            <span className={`text-sm font-medium ${getImpactColor(intervention.impact)}`}>
                              {intervention.impact} Impact
                            </span>
                          </div>
                          <p className="text-muted-foreground mb-3">{intervention.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Beneficiaries</p>
                              <p className="text-lg font-semibold flex items-center">
                                <Users className="w-4 h-4 mr-1 text-primary" />
                                {intervention.beneficiaries.toLocaleString()}
                              </p>
                            </div>
                            {intervention.potential_benefit > 0 && (
                              <div>
                                <p className="text-sm text-muted-foreground">Potential Benefit</p>
                                <p className="text-lg font-semibold text-success">
                                  {formatCurrency(intervention.potential_benefit)}
                                </p>
                              </div>
                            )}
                            <div>
                              <p className="text-sm text-muted-foreground">Timeline</p>
                              <p className="text-lg font-semibold">{intervention.timeline}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Category</p>
                              <Badge variant="outline">{intervention.category}</Badge>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Recommended Actions:</p>
                            <ul className="space-y-1">
                              {intervention.actions.map((action, index) => (
                                <li key={index} className="flex items-center text-sm">
                                  <ArrowRight className="w-3 h-3 mr-2 text-primary" />
                                  {action}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" className="flex-1">
                          <Target className="w-4 h-4 mr-2" />
                          Implement
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="font-semibold mb-2">Scheme Optimization</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Identify gaps in scheme coverage and suggest improvements
                </p>
                <Button variant="outline" size="sm">
                  Generate Report
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-success" />
                <h3 className="font-semibold mb-2">Resource Allocation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Optimize resource distribution across regions
                </p>
                <Button variant="outline" size="sm">
                  View Analysis
                </Button>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-warning" />
                <h3 className="font-semibold mb-2">Impact Prediction</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Predict outcomes of policy interventions
                </p>
                <Button variant="outline" size="sm">
                  Run Simulation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Scheme Gap Analysis */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Scheme Coverage Gap Analysis</CardTitle>
              <CardDescription>State-wise coverage vs uncovered beneficiaries</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={schemeGapAnalysis}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="state" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="covered" stackId="a" fill="hsl(var(--success))" name="Covered %" />
                  <Bar dataKey="uncovered" stackId="a" fill="hsl(var(--destructive))" name="Gap %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Beneficiary Distribution */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Beneficiary Distribution</CardTitle>
                <CardDescription>Distribution across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Individual Rights', value: 45, color: '#16a34a' },
                        { name: 'Community Rights', value: 30, color: '#2563eb' },
                        { name: 'Community Resources', value: 25, color: '#ca8a04' }
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {[
                        { name: 'Individual Rights', value: 45, color: '#16a34a' },
                        { name: 'Community Rights', value: 30, color: '#2563eb' },
                        { name: 'Community Resources', value: 25, color: '#ca8a04' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resource Utilization */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Resource Utilization Efficiency</CardTitle>
                <CardDescription>Budget vs actual utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>MGNREGA</span>
                      <span className="font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>PM-KISAN</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Van Dhan Vikas</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>PMAY-G</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          {/* Performance Metrics */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>System Performance Metrics</CardTitle>
              <CardDescription>Key performance indicators vs targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {performanceMetrics.map((metric, index) => (
                  <Card key={index} className="border">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{metric.metric}</h3>
                        <Badge variant={getStatusColor(metric.status) as any}>
                          {metric.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current</span>
                          <span className="font-medium">{metric.current}%</span>
                        </div>
                        <Progress value={metric.current} className="h-2" />
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Target: {metric.target}%</span>
                          <span>
                            Gap: {metric.target - metric.current > 0 ? '+' : ''}{metric.target - metric.current}%
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Trend Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto mb-2 text-success" />
                <p className="text-2xl font-bold text-success">+15%</p>
                <p className="text-sm text-muted-foreground">Claims Processing Speed</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
                <p className="text-2xl font-bold">+2,450</p>
                <p className="text-sm text-muted-foreground">New Beneficiaries This Month</p>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-6 text-center">
                <Target className="w-8 h-8 mx-auto mb-2 text-warning" />
                <p className="text-2xl font-bold">87%</p>
                <p className="text-sm text-muted-foreground">Overall System Efficiency</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="risks" className="space-y-6">
          {/* Risk Factors */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-destructive" />
                Risk Assessment
              </CardTitle>
              <CardDescription>
                Identified risks and mitigation strategies for tribal development programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {riskFactors.map((risk, index) => (
                  <Card key={index} className="border-l-4 border-l-destructive">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold mb-1">{risk.factor}</h3>
                          <p className="text-sm text-muted-foreground">{risk.description}</p>
                        </div>
                        <Badge variant={
                          risk.level === 'High' ? 'destructive' : 
                          risk.level === 'Medium' ? 'default' : 'secondary'
                        }>
                          {risk.level} Risk
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Mitigation Strategy:</p>
                        <p className="text-sm text-foreground">{risk.mitigation}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Risk Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Risk Impact Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                    <span className="font-medium">Climate Dependency</span>
                    <div className="text-right">
                      <div className="text-sm text-destructive font-medium">High Impact</div>
                      <div className="text-xs text-muted-foreground">High Probability</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                    <span className="font-medium">Digital Infrastructure</span>
                    <div className="text-right">
                      <div className="text-sm text-warning font-medium">Medium Impact</div>
                      <div className="text-xs text-muted-foreground">Medium Probability</div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                    <span className="font-medium">Market Access</span>
                    <div className="text-right">
                      <div className="text-sm text-orange-600 font-medium">High Impact</div>
                      <div className="text-xs text-muted-foreground">Medium Probability</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Mitigation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Irrigation Infrastructure</span>
                      <span className="font-medium">35%</span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Digital Connectivity</span>
                      <span className="font-medium">52%</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Road Development</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Market Centers</span>
                      <span className="font-medium">41%</span>
                    </div>
                    <Progress value={41} className="h-2" />
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

export default DSSEngine;