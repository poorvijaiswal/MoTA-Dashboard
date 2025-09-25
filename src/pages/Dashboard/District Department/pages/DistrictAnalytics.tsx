import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Users, CheckCircle, Clock, AlertTriangle, TreePine } from "lucide-react";

const StateAnalytics: React.FC = () => {
  // Static demo data for visual completeness
  const [districtData, setDistrictData] = useState<any[]>([
    {
      district: "Indore",
      forestCover: 32.5,
      tribalPopulation: 18.2,
      activePattaHolders: 845,
      schemeCoverage: 76.4,
      ntfpAccess: 12,
      fraClaimsApproved: 210,
      fraClaimsPending: 102,
      fraClaimsRejected: 18,
      schemeUtilization: 76.4,
      monthlyClaims: [
        { month: "Jan", approved: 18, pending: 7, rejected: 2 },
        { month: "Feb", approved: 22, pending: 8, rejected: 1 },
        { month: "Mar", approved: 25, pending: 10, rejected: 3 },
        { month: "Apr", approved: 20, pending: 9, rejected: 2 },
        { month: "May", approved: 19, pending: 8, rejected: 1 },
        { month: "Jun", approved: 21, pending: 7, rejected: 2 },
        { month: "Jul", approved: 23, pending: 6, rejected: 2 },
        { month: "Aug", approved: 24, pending: 8, rejected: 2 },
        { month: "Sep", approved: 18, pending: 7, rejected: 1 }
      ]
    }
  ]);
  const [complaintData, setComplaintData] = useState<any[]>([
    { category: "Patta Delay", count: 12, resolved: 8, inProgress: 2, open: 2, month: "Jan", priority: "High" },
    { category: "Scheme", count: 9, resolved: 6, inProgress: 2, open: 1, month: "Feb", priority: "Medium" },
    { category: "Land", count: 7, resolved: 5, inProgress: 1, open: 1, month: "Mar", priority: "Critical" },
    { category: "NTFP Access", count: 5, resolved: 3, inProgress: 1, open: 1, month: "Apr", priority: "Low" },
    { category: "Other", count: 4, resolved: 2, inProgress: 1, open: 1, month: "May", priority: "Medium" }
  ]);
  const [resolutionMetrics, setResolutionMetrics] = useState<any>({
    resolutionRate: 82.5,
    averageResolutionTime: 14
  });
  const [officerPerformance, setOfficerPerformance] = useState<any[]>([
    { officer: "Ms. Shalini Joshi", resolved: 32, pending: 4 },
    { officer: "Mr. Sandeep Verma", resolved: 28, pending: 6 },
    { officer: "Ms. Priya Singh", resolved: 25, pending: 5 },
    { officer: "Mr. Ajay Rathore", resolved: 22, pending: 8 }
  ]);

  // Remove useEffect, use static demo data above

  const COLORS = ["#2563EB", "#16A34A", "#F59E0B", "#DC2626", "#9333EA"];

  return (
    <div className="p-4 space-y-6 bg-gray-50 min-h-screen">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">Indore District Analytics</h2>
      {/* Enhanced KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <TreePine className="text-green-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Forest Cover</p>
            <h2 className="text-lg font-bold">{districtData[0]?.forestCover ?? "-"}%</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <Users className="text-blue-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Tribal Population %</p>
            <h2 className="text-lg font-bold">{districtData[0]?.tribalPopulation ?? "-"}%</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Resolution Rate</p>
            <h2 className="text-lg font-bold">{resolutionMetrics.resolutionRate || "-"}%</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <Clock className="text-yellow-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Avg Resolution Days</p>
            <h2 className="text-lg font-bold">{resolutionMetrics.averageResolutionTime || "-"}</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <AlertTriangle className="text-red-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Critical Complaints</p>
            <h2 className="text-lg font-bold">{complaintData.filter(c => c.priority === "Critical").length}</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <CheckCircle className="text-green-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Patta Holders</p>
            <h2 className="text-lg font-bold">{districtData[0]?.activePattaHolders ?? "-"}</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <Users className="text-purple-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">Scheme Coverage %</p>
            <h2 className="text-lg font-bold">{districtData[0]?.schemeCoverage ?? "-"}%</h2>
          </div>
        </Card>
        <Card className="p-3 flex items-center space-x-2 shadow-md">
          <TreePine className="text-green-600 w-5 h-5" />
          <div>
            <p className="text-gray-500 text-xs">NTFP Access</p>
            <h2 className="text-lg font-bold">{districtData[0]?.ntfpAccess ?? "-"}</h2>
          </div>
        </Card>
      </div>

      {/* Analytics Charts & Insights */}
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

        {/* Complaint Category Pie */}
        <Card className="p-3 shadow-md">
          <h3 className="font-semibold mb-2 text-sm">Complaint Categories (Indore)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={complaintData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label
              >
                {complaintData.map((_, index) => (
                  <Cell key={`cell-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Monthly Claims Line Chart */}
        <Card className="p-3 shadow-md">
          <h3 className="font-semibold mb-2 text-sm">Monthly Claims Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={districtData[0]?.monthlyClaims ?? []}>
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="approved" stroke="#16A34A" />
              <Line type="monotone" dataKey="pending" stroke="#F59E0B" />
              <Line type="monotone" dataKey="rejected" stroke="#DC2626" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Officer Performance Bar Chart */}
        <Card className="p-3 shadow-md">
          <h3 className="font-semibold mb-2 text-sm">Officer Performance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={officerPerformance}>
              <XAxis dataKey="officer" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Bar dataKey="resolved" fill="#16A34A" name="Resolved" />
              <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Complaints Trend (Area) */}
        <Card className="p-3 shadow-md md:col-span-2">
          <h3 className="font-semibold mb-2 text-sm">Complaints Trend (Indore)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={complaintData}>
              <XAxis dataKey="month" fontSize={10} />
              <YAxis fontSize={10} />
              <Tooltip />
              <Area type="monotone" dataKey="resolved" stroke="#16A34A" fill="#BBF7D0" />
              <Area type="monotone" dataKey="inProgress" stroke="#F59E0B" fill="#FDE68A" />
              <Area type="monotone" dataKey="open" stroke="#DC2626" fill="#FECACA" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Insights & Summary */}
        <Card className="p-3 shadow-md md:col-span-2">
          <h3 className="font-semibold mb-2 text-sm">Key Insights & Summary</h3>
          <ul className="text-xs text-gray-700 list-disc ml-4 space-y-1">
            <li>Indore has a forest cover of {districtData[0]?.forestCover ?? "-"}% and tribal population of {districtData[0]?.tribalPopulation ?? "-"}%.</li>
            <li>Resolution rate for complaints is {resolutionMetrics.resolutionRate || "-"}% with average resolution time of {resolutionMetrics.averageResolutionTime || "-"} days.</li>
            <li>Active patta holders: {districtData[0]?.activePattaHolders ?? "-"}, NTFP access cases: {districtData[0]?.ntfpAccess ?? "-"}.</li>
            <li>Scheme coverage: {districtData[0]?.schemeCoverage ?? "-"}%.</li>
            <li>Officer performance and monthly claims trends are visualized for better monitoring.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default StateAnalytics;
