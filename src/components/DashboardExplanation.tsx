import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  HelpCircle, 
  BarChart3, 
  Users, 
  MapPin, 
  TrendingUp,
  Calculator,
  Database,
  Target
} from 'lucide-react';

const DashboardExplanation = () => {
  return (
    <div className="space-y-6">
      <Card className="shadow-card border-l-4 border-l-primary">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HelpCircle className="w-5 h-5 mr-2" />
            Understanding the Dashboard Metrics
          </CardTitle>
          <CardDescription>
            Comprehensive explanation of how scheme coverage and other metrics are calculated
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheme Coverage Calculation */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="w-5 h-5 mr-2" />
              Scheme Coverage Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Formula:</h4>
              <code className="text-sm bg-background p-2 rounded border">
                Coverage % = (Enrolled Beneficiaries / Eligible Population) × 100
              </code>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Data Sources:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Census data for total tribal population</li>
                  <li>• FRA patta holder registry</li>
                  <li>• Scheme enrollment databases</li>
                  <li>• SECC (Socio Economic Caste Census) data</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium text-sm">Example for Odisha (78% coverage):</p>
                <div className="text-sm space-y-1">
                  <p>• Eligible tribal families: 125,000</p>
                  <p>• Enrolled in schemes: 97,500</p>
                  <p>• Coverage: 97,500 ÷ 125,000 = 78%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What Dashboard Shows */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="w-5 h-5 mr-2" />
              Dashboard Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-primary/10">1</Badge>
                <div>
                  <p className="font-medium text-sm">Implementation Progress</p>
                  <p className="text-sm text-muted-foreground">
                    Real-time tracking of scheme rollout across states
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-success/10">2</Badge>
                <div>
                  <p className="font-medium text-sm">Gap Analysis</p>
                  <p className="text-sm text-muted-foreground">
                    Identifies underserved areas and populations
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-warning/10">3</Badge>
                <div>
                  <p className="font-medium text-sm">Resource Allocation</p>
                  <p className="text-sm text-muted-foreground">
                    Budget utilization and efficiency metrics
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Badge variant="outline" className="bg-pending/10">4</Badge>
                <div>
                  <p className="font-medium text-sm">Performance Monitoring</p>
                  <p className="text-sm text-muted-foreground">
                    Year-over-year progress and trend analysis
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patta Holders Registry */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Database className="w-5 h-5 mr-2" />
              Patta Holders Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">What it contains:</h4>
              <p className="text-sm text-muted-foreground">
                Comprehensive database of Forest Rights Act beneficiaries with verified land titles
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Key Information:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Personal details (name, tribe, family size)</li>
                  <li>• Land ownership and FRA claim status</li>
                  <li>• Linked government schemes and benefits</li>
                  <li>• Contact information and location</li>
                  <li>• Income and occupation details</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium text-sm">Registry Purpose:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Scheme eligibility verification</li>
                  <li>• Benefit delivery tracking</li>
                  <li>• Policy impact assessment</li>
                  <li>• Resource planning and allocation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shape Files Explanation */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Shape Files & Mapping
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Geographic Precision:</h4>
              <p className="text-sm text-muted-foreground">
                Digital boundary maps with precise coordinates for every claim and asset
              </p>
            </div>
            
            <div className="space-y-3">
              <div>
                <p className="font-medium text-sm">Shape File Data Includes:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• GPS coordinates of land boundaries</li>
                  <li>• Survey numbers and official records</li>
                  <li>• Land classification and soil type</li>
                  <li>• Elevation and topographic data</li>
                  <li>• Water bodies and forest coverage</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <p className="font-medium text-sm">Real-world Applications:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Dispute resolution and verification</li>
                  <li>• Development planning and zoning</li>
                  <li>• Environmental impact assessment</li>
                  <li>• Resource mapping and monitoring</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-l-4 border-l-success">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            DSS Engine Integration
          </CardTitle>
          <CardDescription>
            How structured scheme policies enable intelligent decision support
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">Structured Policy Rules:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Eligibility criteria (age, income, land size)</li>
                <li>• Benefit amounts and payment schedules</li>
                <li>• Required documents and verification levels</li>
                <li>• Processing timelines and approval workflows</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-2">AI-Powered Matching:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Automatic beneficiary-scheme matching</li>
                <li>• Gap identification and prioritization</li>
                <li>• Resource optimization recommendations</li>
                <li>• Impact prediction and planning</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
            <p className="text-sm">
              <strong>Example:</strong> DSS Engine automatically identifies that 1,250 FRA holders in Odisha 
              meet PM-KISAN eligibility criteria but are not enrolled, recommending targeted outreach 
              with estimated annual benefit of ₹75 lakh.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardExplanation;