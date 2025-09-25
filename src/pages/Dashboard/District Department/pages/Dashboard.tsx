import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Users,
  TrendingUp,
  MapPin,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [beneficiaries, setBeneficiaries] = useState([]);

  // Load data from JSON files
  useEffect(() => {
    const loadData = async () => {
      try {
        const [schemesRes, complaintsRes, beneficiariesRes] = await Promise.all([
          fetch('/data/schemes.json'),
          fetch('/data/complaints.json'),
          fetch('/data/beneficiaries.json')
        ]);

        const schemesData = await schemesRes.json();
        const complaintsData = await complaintsRes.json();
        const beneficiariesData = await beneficiariesRes.json();

        setSchemes(schemesData);
        setComplaints(complaintsData);
        setBeneficiaries(beneficiariesData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      }
    };

    loadData();
  }, []);

  // Calculate statistics
  const totalSchemes = schemes.length;
  const activeSchemes = schemes.filter(s => s.status === 'Active').length;
  const totalComplaints = complaints.length;
  const pendingComplaints = complaints.filter(c => c.status === 'Pending').length;
  const totalBeneficiaries = beneficiaries.reduce((sum, b) => sum + b.familyMembers, 0);
  const activeBeneficiaries = beneficiaries.filter(b => b.status === 'Active').length;

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gov-heading">Dashboard</h1>
          <p className="gov-subtext mt-1">
            State Tribal & Forest Department Portal - Overview
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Schemes"
          value={totalSchemes}
          subtitle={`${activeSchemes} active schemes`}
          icon={FileText}
          trend={{ value: '+12.5%', isPositive: true }}
          onClick={() => navigate('/dashboard/state/schemes')}
        />
        
        <StatsCard
          title="Active Complaints"
          value={pendingComplaints}
          subtitle={`${totalComplaints} total complaints`}
          icon={MessageSquare}
          trend={{ value: '-8.3%', isPositive: true }}
          onClick={() => navigate('/dashboard/state/complaints')}
        />
        
        <StatsCard
          title="Beneficiaries Registered"
          value={activeBeneficiaries}
          subtitle={`${totalBeneficiaries} total family members`}
          icon={Users}
          trend={{ value: '+15.2%', isPositive: true }}
          onClick={() => navigate('/dashboard/state/beneficiaries')}
        />
        
        <StatsCard
          title="DSS Reports Generated"
          value={23}
          subtitle="This month analysis"
          icon={BarChart3}
          trend={{ value: '+5.7%', isPositive: true }}
          onClick={() => navigate('/dashboard/state/dss')}
        />
      </div>

      {/* Charts and Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* District-wise Overview */}
        <Card>
          <CardHeader className="gov-card-header">
            <CardTitle className="flex items-center text-white">
              <MapPin className="h-5 w-5 mr-2" />
              District-wise Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {['Bastar', 'Mandla', 'Dindori', 'Jhabua', 'Alirajpur'].map((district, index) => (
                <div key={district} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div>
                    <span className="font-medium">{district}</span>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 500) + 100} beneficiaries
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-primary/20 rounded-full">
                      <div 
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${60 + (index * 8)}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{60 + (index * 8)}%</span>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/state/reports')}
            >
              View Detailed Reports
            </Button>
          </CardContent>
        </Card>

        {/* Recent Complaints */}
        <Card>
          <CardHeader className="gov-card-header">
            <CardTitle className="flex items-center text-white">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Recent Complaints
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-start space-x-3 p-3 border border-border rounded-lg">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    complaint.priority === 'Critical' ? 'bg-destructive' :
                    complaint.priority === 'High' ? 'bg-warning' : 'bg-success'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{complaint.title}</p>
                    <p className="text-xs text-muted-foreground">{complaint.district} • {complaint.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        complaint.status === 'Resolved' ? 'status-resolved' :
                        complaint.status === 'In Review' ? 'status-pending' : 'status-pending'
                      }`}>
                        {complaint.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(complaint.dateSubmitted).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => navigate('/dashboard/state/complaints')}
            >
              View All Complaints
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Scheme Performance */}
      <Card>
        <CardHeader className="gov-card-header">
          <CardTitle className="flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2" />
            Scheme Performance Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {schemes.slice(0, 3).map((scheme) => (
              <div key={scheme.id} className="p-4 border border-border rounded-lg">
                <h3 className="font-semibold mb-2">{scheme.name}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget:</span>
                    <span className="font-medium">₹{(scheme.budget / 10000000).toFixed(1)}Cr</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Beneficiaries:</span>
                    <span className="font-medium">{scheme.beneficiaries}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>District:</span>
                    <span className="font-medium">{scheme.district}</span>
                  </div>
                  <div className="pt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      scheme.status === 'Active' ? 'status-active' :
                      scheme.status === 'Pending' ? 'status-pending' : 'status-resolved'
                    }`}>
                      {scheme.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;