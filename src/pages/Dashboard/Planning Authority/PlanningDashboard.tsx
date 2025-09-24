import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

// Embedded JSON data to make the component self-contained.
const data = {
    "statewiseClaims": [
        {
            "stateName": "Uttar Pradesh",
            "districts": [
                {
                    "districtName": "Lucknow",
                    "blocks": [
                        { "blockName": "Gomti Nagar", "claims": { "total": 120, "approved": 80, "pending": 30, "rejected": 10 } },
                        { "blockName": "Hazratganj", "claims": { "total": 90, "approved": 60, "pending": 20, "rejected": 10 } }
                    ]
                }
            ]
        },
        {
            "stateName": "Maharashtra",
            "districts": [
                {
                    "districtName": "Pune",
                    "blocks": [
                        { "blockName": "Hinjewadi", "claims": { "total": 200, "approved": 150, "pending": 40, "rejected": 10 } }
                    ]
                }
            ]
        }
    ],
    "revenueData": {
        "totalRevenue": 50000000,
        "assignedClaims": [
            { "id": "C-001", "name": "Rajesh Kumar", "village": "Ahmadpur", "status": "Pending Verification" },
            { "id": "C-002", "name": "Priya Sharma", "village": "Ramnagar", "status": "In Progress" },
            { "id": "C-003", "name": "Amit Singh", "village": "Shantinagar", "status": "Approved" }
        ],
        "claimsByType": [
            { "name": "Land Records", "value": 300, "color": "#FFC107" },
            { "name": "Tax Assessment", "value": 200, "color": "#00BCD4" }
        ],
        "claimStatusBreakdown": [
            { "name": "Approved", "value": 450, "color": "#4CAF50" },
            { "name": "Pending", "value": 250, "color": "#FF9800" },
            { "name": "Rejected", "value": 100, "color": "#F44336" },
            { "name": "In Progress", "value": 150, "color": "#2196F3" }
        ],
        "pendingByVillage": [
            { "name": "Ahmadpur", "pendingClaims": 50 },
            { "name": "Ramnagar", "pendingClaims": 30 }
        ],
        "bottlenecks": [
            { "name": "Land Survey Team", "delay": 7 },
            { "name": "District Officer Approval", "delay": 5 }
        ]
    },
    "planningData": {
        "totalClaims": 1100,
        "claimsApproved": 750,
        "claimsPending": 250,
        "claimsRejected": 100,
        "impactedLives": 5000,
        "districtPerformance": [
            { "name": "Lucknow", "claimsApproved": 300, "totalClaims": 400 },
            { "name": "Pune", "claimsApproved": 450, "totalClaims": 600 },
            { "name": "Kanpur", "claimsApproved": 250, "totalClaims": 350 },
            { "name": "Mumbai", "claimsApproved": 500, "totalClaims": 700 },
            { "name": "Hyderabad", "claimsApproved": 150, "totalClaims": 250 },
            { "name": "Bangalore", "claimsApproved": 350, "totalClaims": 500 },
            { "name": "Delhi", "claimsApproved": 600, "totalClaims": 800 },
            { "name": "Kolkata", "claimsApproved": 280, "totalClaims": 400 },
            { "name": "Jaipur", "claimsApproved": 180, "totalClaims": 250 }
        ],
        "claimsByStatus": [
            { "name": "Approved", "value": 750 },
            { "name": "Pending", "value": 250 },
            { "name": "Rejected", "value": 100 }
        ],
        "monthlyClaims": [
            { "month": "Jan", "claims": 120 },
            { "month": "Feb", "claims": 150 },
            { "month": "Mar", "claims": 180 },
            { "month": "Apr", "claims": 170 },
            { "month": "May", "claims": 200 },
            { "month": "Jun", "claims": 220 }
        ]
    }
};

type PlanningData = {
    totalClaims: number;
    claimsApproved: number;
    claimsPending: number;
    claimsRejected: number;
    impactedLives: number;
    districtPerformance: { name: string; claimsApproved: number; totalClaims: number }[];
    claimsByStatus: { name: string; value: number }[];
    monthlyClaims: { month: string; claims: number }[];
};

// Custom MetricCard component with enhanced styling
const MetricCard = ({ title, value, bgColor }) => {
    return (
        <div className={`p-4 sm:p-6 rounded-2xl shadow-lg text-white font-inter transition-transform transform hover:scale-105 ${bgColor}`}>
            <h3 className="text-sm sm:text-lg font-medium">{title}</h3>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">{value}</p>
        </div>
    );
};

// Custom DistrictPerformanceTable component with filter functionality
const DistrictPerformanceTable = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = data.filter(district =>
        district.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2 sm:mb-0">District-wise Performance</h2>
                <input
                    type="text"
                    placeholder="Search district..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">District</th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Claims Approved</th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Claims</th>
                            <th scope="col" className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredData.map((district, index) => (
                            <tr key={index}>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.name}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{district.claimsApproved}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.totalClaims}</td>
                                <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {((district.claimsApproved / district.totalClaims) * 100).toFixed(1)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Colors for the Pie Chart
const COLORS = ['#4CAF50', '#FF9800', '#F44336'];

export default function PlanningDashboard() {
    const planningData: PlanningData = data.planningData;

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-inter">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Planning Department Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
                <MetricCard title="Total Claims" value={planningData.totalClaims} bgColor="bg-gradient-to-br from-blue-500 to-blue-700" />
                <MetricCard title="Claims Approved" value={planningData.claimsApproved} bgColor="bg-gradient-to-br from-green-500 to-green-700" />
                <MetricCard title="Lives Impacted" value={planningData.impactedLives} bgColor="bg-gradient-to-br from-purple-500 to-purple-700" />
                <MetricCard title="Claims Pending" value={planningData.claimsPending} bgColor="bg-gradient-to-br from-yellow-500 to-yellow-600" />
                <MetricCard title="Claims Rejected" value={planningData.claimsRejected} bgColor="bg-gradient-to-br from-red-500 to-red-700" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
                {/* Claims Status Pie Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl flex flex-col items-center">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Claims Status Breakdown</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={planningData.claimsByStatus}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={120}
                                fill="#8884d8"
                                label
                            >
                                {planningData.claimsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Monthly Claims Line Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Monthly Claims Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={planningData.monthlyClaims}>
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="claims" stroke="#8884d8" strokeWidth={2} name="Total Claims" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                {/* District Performance Bar Chart */}
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">District Performance</h2>
                <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={planningData.districtPerformance}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="claimsApproved" fill="#4CAF50" name="Claims Approved" />
                            <Bar dataKey="totalClaims" fill="#2196F3" name="Total Claims" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* District Performance Table */}
            <DistrictPerformanceTable data={planningData.districtPerformance} />
        </div>
    );
}
