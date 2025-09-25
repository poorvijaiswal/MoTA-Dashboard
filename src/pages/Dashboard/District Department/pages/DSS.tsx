import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, MapPin, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const DSS = () => {
  const [dssData, setDssData] = useState([]);
  
  useEffect(() => {
    const loadDSSData = async () => {
      try {
        const response = await fetch('/data/dssCriteria.json');
        const data = await response.json();
        setDssData(data);
      } catch (error) {
        console.error('Failed to load DSS data:', error);
      }
    };
    loadDSSData();
  }, []);

  const districtAnalysis = [
    { district: 'Bastar', priority: 'High', score: 85, forestCover: 68, tribalPop: 72, pendingClaims: 456, utilization: 78 },
    { district: 'Mandla', priority: 'Medium', score: 72, forestCover: 45, tribalPop: 58, pendingClaims: 234, utilization: 86 },
    { district: 'Dindori', priority: 'High', score: 78, forestCover: 52, tribalPop: 64, pendingClaims: 298, utilization: 65 },
    { district: 'Jhabua', priority: 'Critical', score: 92, forestCover: 38, tribalPop: 89, pendingClaims: 567, utilization: 81 },
    { district: 'Alirajpur', priority: 'High', score: 81, forestCover: 41, tribalPop: 76, pendingClaims: 345, utilization: 81 },
    { district: 'Khandwa', priority: 'Medium', score: 68, forestCover: 35, tribalPop: 45, pendingClaims: 189, utilization: 72 },
    { district: 'Seoni', priority: 'Low', score: 45, forestCover: 48, tribalPop: 32, pendingClaims: 98, utilization: 108 },
    { district: 'Betul', priority: 'Medium', score: 65, forestCover: 44, tribalPop: 28, pendingClaims: 156, utilization: 0 }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold gov-heading">Decision Support System</h1>
          <p className="gov-subtext mt-1">District-wise Priority Analysis - Madhya Pradesh</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <BarChart3 className="h-4 w-4 mr-2" />
          Generate Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Priority</p>
                <p className="text-2xl font-bold text-red-600">1</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold text-orange-600">3</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Medium Priority</p>
                <p className="text-2xl font-bold text-yellow-600">3</p>
              </div>
              <MapPin className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Priority</p>
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* District Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>District Priority Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {districtAnalysis.map((district) => (
              <div key={district.district} className="p-4 border border-border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{district.district}</h3>
                    <Badge className={getPriorityColor(district.priority)}>
                      {district.priority} Priority
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground">DSS Score</span>
                    <p className="text-xl font-bold">{district.score}/100</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Forest Cover</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.forestCover} className="flex-1" />
                      <span className="font-medium">{district.forestCover}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Tribal Population</span>
                    <div className="flex items-center gap-2 mt-1">
                      <Progress value={district.tribalPop} className="flex-1" />
                      <span className="font-medium">{district.tribalPop}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Pending Claims</span>
                    <p className="font-medium text-orange-600">{district.pendingClaims}</p>
                  </div>
                  
                  <div>
                    <span className="text-muted-foreground">Scheme Utilization</span>
                    <p className="font-medium text-blue-600">{district.utilization}%</p>
                  </div>
                </div>

                <div className="mt-3 text-sm text-muted-foreground">
                  {district.priority === 'Critical' && "Immediate intervention required - allocate additional resources and officers"}
                  {district.priority === 'High' && "Enhanced monitoring needed - deploy additional technical support"}
                  {district.priority === 'Medium' && "Regular monitoring - quarterly progress review"}
                  {district.priority === 'Low' && "Maintain current support level - annual review sufficient"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DSS;