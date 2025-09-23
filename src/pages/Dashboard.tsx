import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Users, FileText, Briefcase, MessageSquare, TrendingUp, TrendingDown, MapPin } from 'lucide-react';

// Import data
import claimsData from '@/data/claims.json';
import schemesData from '@/data/schemes.json';
import complaintsData from '@/data/complaints.json';
import reportsData from '@/data/reports.json';

const Dashboard = () => {
  // Calculate summary statistics
  const totalClaims = claimsData.claims.length;
  const grantedClaims = claimsData.claims.filter(c => c.status === 'granted').length;
  const pendingClaims = claimsData.claims.filter(c => c.status === 'pending').length;
  const rejectedClaims = claimsData.claims.filter(c => c.status === 'rejected').length;

  const totalSchemes = schemesData.schemes.length;
  const implementedSchemes = schemesData.schemes.filter(s => s.status === 'implemented').length;

  const totalComplaints = complaintsData.complaints.length;
  const pendingComplaints = complaintsData.complaints.filter(c => c.status === 'pending').length;

  // Chart data
  const claimsStatusData = [
    { name: 'Granted', value: grantedClaims, color: 'hsl(var(--success))' },
    { name: 'Pending', value: pendingClaims, color: 'hsl(var(--pending))' },
    { name: 'Rejected', value: rejectedClaims, color: 'hsl(var(--destructive))' }
  ];

  const schemeCoverageData = reportsData.state_coverage.map(state => ({
    state: state.state,
    coverage: state.coverage_percent
  }));

  const yearlyProgressData = reportsData.yearly_progress;

  const summaryCards = [
    {
      title: 'Total FRA Claims',
      value: totalClaims,
      description: `${grantedClaims} granted, ${pendingClaims} pending`,
      icon: FileText,
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Schemes',
      value: implementedSchemes,
      description: `${totalSchemes} total schemes available`,
      icon: Briefcase,
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Pending Complaints',
      value: pendingComplaints,
      description: `${totalComplaints} total complaints filed`,
      icon: MessageSquare,
      trend: '-5%',
      trendUp: false
    },
    {
      title: 'Coverage States',
      value: reportsData.state_coverage.length,
      description: 'Across all tribal regions',
      icon: MapPin,
      trend: '100%',
      trendUp: true
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Forest Rights Act Atlas & Decision Support System Overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.description}
                </p>
                <div className="flex items-center mt-2">
                  {card.trendUp ? (
                    <TrendingUp className="h-3 w-3 text-success mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive mr-1" />
                  )}
                  <span className={`text-xs ${card.trendUp ? 'text-success' : 'text-destructive'}`}>
                    {card.trend} from last month
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* // ...existing code... */}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Status Pie Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>FRA Claims Status</CardTitle>
            <CardDescription>Distribution of claim statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={claimsStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Yearly Progress Line Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Yearly Claims Progress</CardTitle>
            <CardDescription>Claims filed and granted over years</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={yearlyProgressData}>
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

        {/* Scheme Coverage by State */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Scheme Coverage by State</CardTitle>
            <CardDescription>Coverage across different states</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={schemeCoverageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="state"
                  angle={-35}
                  textAnchor="end"
                  height={80}
                  fontSize={10}
                />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="coverage"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

{/* // ...existing code... */}

    </div>
  );
};

export default Dashboard;