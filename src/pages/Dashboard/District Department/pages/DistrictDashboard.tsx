import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, CheckCircle, Clock, TreePine, MapPin, Globe2 } from 'lucide-react';
const COLORS = ['#2563EB', '#16A34A', '#F59E0B', '#DC2626', '#9333EA'];

const IndoreDashboard = () => {
  const [districtData, setDistrictData] = useState<any[]>([]);
  useEffect(() => {
    fetch('/data/districtAnalytics.json')
      .then(res => res.json())
      .then(data => {
        const indore = Array.isArray(data) ? data.find(d => d.district === 'Indore') : null;
        setDistrictData(indore ? [indore] : []);
      });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col" style={{ height: '100vh', overflow: 'auto' }}>
      <div className="max-w-7xl mx-auto w-full flex flex-col gap-4 p-4">
        {/* Title & Summary */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold text-blue-900 mb-1">Indore District FRA Atlas & DSS</h1>
            <p className="text-sm text-gray-600">AI-powered WebGIS Decision Support System for FRA Monitoring</p>
            <p className="text-xs text-gray-500 mt-1">Focus: Madhya Pradesh, Tripura, Odisha, Telangana</p>
          </div>
          <div className="flex gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded bg-blue-100 text-blue-800 text-xs font-semibold"><Globe2 className="w-4 h-4 mr-1" /> Atlas Ready</span>
            <span className="inline-flex items-center px-3 py-1 rounded bg-green-100 text-green-800 text-xs font-semibold"><MapPin className="w-4 h-4 mr-1" /> WebGIS Enabled</span>
            <span className="inline-flex items-center px-3 py-1 rounded bg-purple-100 text-purple-800 text-xs font-semibold"><CheckCircle className="w-4 h-4 mr-1" /> DSS Active</span>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-3 flex items-center space-x-2 shadow-md">
            <TreePine className="text-green-600 w-5 h-5" />
            <div>
              <p className="text-gray-500 text-xs">Forest Cover</p>
              <h2 className="text-lg font-bold">{districtData[0]?.forestCover ?? '-'}%</h2>
            </div>
          </Card>
          <Card className="p-3 flex items-center space-x-2 shadow-md">
            <Users className="text-blue-600 w-5 h-5" />
            <div>
              <p className="text-gray-500 text-xs">Tribal Population %</p>
              <h2 className="text-lg font-bold">{districtData[0]?.tribalPopulation ?? '-'}</h2>
            </div>
          </Card>
          <Card className="p-3 flex items-center space-x-2 shadow-md">
            <CheckCircle className="text-green-600 w-5 h-5" />
            <div>
              <p className="text-gray-500 text-xs">Active Patta Holders</p>
              <h2 className="text-lg font-bold">{districtData[0]?.activePattaHolders ?? '-'}</h2>
            </div>
          </Card>
          <Card className="p-3 flex items-center space-x-2 shadow-md">
            <Clock className="text-yellow-600 w-5 h-5" />
            <div>
              <p className="text-gray-500 text-xs">Avg Processing Days</p>
              <h2 className="text-lg font-bold">{districtData[0]?.avgProcessingDays ?? '-'}</h2>
            </div>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* FRA Claims Bar */}
                <Card className="p-3 shadow-md">
                  <h3 className="font-semibold mb-2 text-sm">FRA Claims (Indore)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={districtData}>
                      <XAxis dataKey="district" fontSize={10} />
                      <YAxis fontSize={10} />
                      <Tooltip />
                      <Bar dataKey="fraClaimsApproved" fill="#16A34A" name="Approved" />
                      <Bar dataKey="fraClaimsPending" fill="#F59E0B" name="Pending" />
                      <Bar dataKey="fraClaimsRejected" fill="#DC2626" name="Rejected" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
                {/* Scheme Utilization Donut */}
                <Card className="p-3 shadow-md">
                  <h3 className="font-semibold mb-2 text-sm">Scheme Utilization (Indore)</h3>
                  <ResponsiveContainer width="100%" height={180}>
                    <PieChart>
                      <Pie
                        data={districtData}
                        dataKey="schemeUtilization"
                        nameKey="district"
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={2}
                        label
                      >
                        {districtData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card>
              </div>

              {/* DSS/Atlas Summary */}
              <Card className="p-3 shadow-md">
                <h3 className="font-semibold mb-2 text-sm">DSS & Atlas Insights</h3>
                <ul className="text-xs text-gray-700 list-disc ml-4 space-y-1">
                  <li>AI-powered recommendations for FRA claims and patta holders</li>
                  <li>WebGIS mapping of forest cover and tribal land allocation</li>
                  <li>Real-time monitoring of scheme utilization and beneficiary coverage</li>
                  <li>Integrated analytics for complaints, resolution, and scheme impact</li>
                  <li>Focus on Indore district, scalable to MP, Tripura, Odisha, Telangana</li>
                </ul>
              </Card>
      </div>
    </div>
  );
}
export default IndoreDashboard;