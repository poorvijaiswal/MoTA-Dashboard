import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Users, CheckCircle, Clock, AlertTriangle, TreePine } from "lucide-react";

const StateAnalytics: React.FC = () => {
  const [districtData, setDistrictData] = useState<any[]>([]);
  const [complaintData, setComplaintData] = useState<any[]>([]);
  const [resolutionMetrics, setResolutionMetrics] = useState<any>({});
  const [officerPerformance, setOfficerPerformance] = useState<any[]>([]);

  useEffect(() => {
    fetch("/data/districtAnalytics.json")
      .then((res) => res.json())
      .then((data) => setDistrictData(data));

    fetch("/data/enhanced-complaints-analytics.json")
      .then((res) => res.json())
      .then((data) => {
        setComplaintData(data.complaintAnalytics);
        setResolutionMetrics(data.resolutionMetrics);
        setOfficerPerformance(data.officerPerformance);
      });
  }, []);

  const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#9333EA"];

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* ====== KPI CARDS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center space-x-3 shadow-md">
          <TreePine className="text-green-600 w-6 h-6" />
          <div>
            <p className="text-gray-500">Avg Forest Cover</p>
            <h2 className="text-xl font-bold">
              {districtData.length > 0 &&
                (districtData.reduce((a, b) => a + b.forestCover, 0) /
                  districtData.length).toFixed(1)}%
            </h2>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 shadow-md">
          <Users className="text-blue-600 w-6 h-6" />
          <div>
            <p className="text-gray-500">Avg Tribal Population %</p>
            <h2 className="text-xl font-bold">
              {districtData.length > 0 &&
                (districtData.reduce((a, b) => a + b.tribalPopulation, 0) /
                  districtData.length).toFixed(1)}%
            </h2>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 shadow-md">
          <CheckCircle className="text-green-600 w-6 h-6" />
          <div>
            <p className="text-gray-500">Resolution Rate</p>
            <h2 className="text-xl font-bold">{resolutionMetrics.resolutionRate}%</h2>
          </div>
        </Card>

        <Card className="p-4 flex items-center space-x-3 shadow-md">
          <Clock className="text-yellow-600 w-6 h-6" />
          <div>
            <p className="text-gray-500">Avg Resolution Days</p>
            <h2 className="text-xl font-bold">{resolutionMetrics.averageResolutionTime}</h2>
          </div>
        </Card>
      </div>

      {/* ====== GRID LAYOUT FOR CHARTS ====== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* District FRA Claims Stacked Bar */}
        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-4">District-wise FRA Claims</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={districtData}>
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="fraClaimsApproved" stackId="a" fill="#16A34A" name="Approved" />
              <Bar dataKey="fraClaimsPending" stackId="a" fill="#F59E0B" name="Pending" />
              <Bar dataKey="fraClaimsRejected" stackId="a" fill="#DC2626" name="Rejected" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Complaints by Category */}
        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-4">Complaints by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={complaintData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="resolved" fill="#16A34A" name="Resolved" />
              <Bar dataKey="inProgress" fill="#F59E0B" name="In Progress" />
              <Bar dataKey="open" fill="#DC2626" name="Open" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Schemes Utilization Donut */}
        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-4">Schemes Utilization</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={districtData}
                dataKey="schemeUtilization"
                nameKey="district"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
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

        {/* Complaints Trend (Line/Area) */}
        <Card className="p-4 shadow-md">
          <h3 className="font-semibold mb-4">Complaints Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={complaintData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="resolved" stackId="1" stroke="#16A34A" fill="#BBF7D0" />
              <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#F59E0B" fill="#FDE68A" />
              <Area type="monotone" dataKey="open" stackId="1" stroke="#DC2626" fill="#FECACA" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Officer Performance Table */}
        <Card className="p-4 shadow-md md:col-span-2">
          <h3 className="font-semibold mb-4">Officer Performance</h3>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="p-2">Officer</th>
                <th className="p-2">District</th>
                <th className="p-2">Cases Resolved</th>
                <th className="p-2">Avg Days</th>
                <th className="p-2">Satisfaction</th>
              </tr>
            </thead>
            <tbody>
              {officerPerformance.map((o, i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">{o.officer}</td>
                  <td className="p-2">{o.district}</td>
                  <td className="p-2">{o.casesResolved}/{o.casesHandled}</td>
                  <td className="p-2">{o.avgResolutionDays}</td>
                  <td className="p-2">{o.satisfactionScore} ⭐</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default StateAnalytics;
