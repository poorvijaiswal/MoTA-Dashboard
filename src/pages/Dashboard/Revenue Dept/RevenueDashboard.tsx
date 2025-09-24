import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, LineChart, Line, CartesianGrid } from 'recharts';

// Embedded JSON data with corrected claims structure.
const data = {
    "statewiseClaims": [
        {
            "stateName": "Uttar Pradesh",
            "districts": [
                {
                    "districtName": "Lucknow",
                    "blocks": [
                        { "blockName": "Gomti Nagar", "claims": { "total": 120, "approved": 80, "pending": 30, "rejected": 10, "landRecords": 50, "taxAssessment": 30, "propertyMutation": 20, "revenueRecovery": 10, "waterConnection": 10 } },
                        { "blockName": "Hazratganj", "claims": { "total": 90, "approved": 60, "pending": 20, "rejected": 10, "landRecords": 35, "taxAssessment": 25, "propertyMutation": 15, "revenueRecovery": 5, "waterConnection": 10 } }
                    ]
                },
                {
                    "districtName": "Varanasi",
                    "blocks": [
                        { "blockName": "Sarnath", "claims": { "total": 150, "approved": 110, "pending": 30, "rejected": 10, "landRecords": 70, "taxAssessment": 40, "propertyMutation": 20, "revenueRecovery": 10, "waterConnection": 10 } },
                        { "blockName": "Lanka", "claims": { "total": 180, "approved": 130, "pending": 40, "rejected": 10, "landRecords": 90, "taxAssessment": 45, "propertyMutation": 25, "revenueRecovery": 10, "waterConnection": 10 } }
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
                        { "blockName": "Hinjewadi", "claims": { "total": 200, "approved": 150, "pending": 40, "rejected": 10, "landRecords": 100, "taxAssessment": 50, "propertyMutation": 30, "revenueRecovery": 10, "waterConnection": 10 } },
                        { "blockName": "Shivajinagar", "claims": { "total": 120, "approved": 80, "pending": 30, "rejected": 10, "landRecords": 50, "taxAssessment": 30, "propertyMutation": 20, "revenueRecovery": 10, "waterConnection": 10 } }
                    ]
                },
                {
                    "districtName": "Mumbai",
                    "blocks": [
                        { "blockName": "Andheri", "claims": { "total": 250, "approved": 180, "pending": 50, "rejected": 20, "landRecords": 120, "taxAssessment": 60, "propertyMutation": 40, "revenueRecovery": 20, "waterConnection": 10 } }
                    ]
                }
            ]
        },
        {
            "stateName": "Madhya Pradesh",
            "districts": [
                {
                    "districtName": "Indore",
                    "blocks": [
                        { "blockName": "Vijay Nagar", "claims": { "total": 150, "approved": 100, "pending": 40, "rejected": 10, "landRecords": 70, "taxAssessment": 40, "propertyMutation": 25, "revenueRecovery": 10, "waterConnection": 5 } },
                        { "blockName": "Rau", "claims": { "total": 80, "approved": 50, "pending": 20, "rejected": 10, "landRecords": 35, "taxAssessment": 20, "propertyMutation": 15, "revenueRecovery": 5, "waterConnection": 5 } }
                    ]
                },
                {
                    "districtName": "Bhopal",
                    "blocks": [
                        { "blockName": "BHEL", "claims": { "total": 110, "approved": 70, "pending": 30, "rejected": 10, "landRecords": 50, "taxAssessment": 20, "propertyMutation": 25, "revenueRecovery": 10, "waterConnection": 5 } },
                        { "blockName": "Huzur", "claims": { "total": 90, "approved": 65, "pending": 20, "rejected": 5, "landRecords": 40, "taxAssessment": 20, "propertyMutation": 20, "revenueRecovery": 5, "waterConnection": 5 } }
                    ]
                }
            ]
        },
        {
            "stateName": "Telangana",
            "districts": [
                {
                    "districtName": "Hyderabad",
                    "blocks": [
                        { "blockName": "Kukatpally", "claims": { "total": 180, "approved": 120, "pending": 50, "rejected": 10, "landRecords": 90, "taxAssessment": 45, "propertyMutation": 30, "revenueRecovery": 10, "waterConnection": 5 } },
                        { "blockName": "Jubilee Hills", "claims": { "total": 95, "approved": 75, "pending": 15, "rejected": 5, "landRecords": 45, "taxAssessment": 25, "propertyMutation": 20, "revenueRecovery": 5, "waterConnection": 0 } }
                    ]
                },
                {
                    "districtName": "Warangal",
                    "blocks": [
                        { "blockName": "Hanamkonda", "claims": { "total": 60, "approved": 40, "pending": 15, "rejected": 5, "landRecords": 25, "taxAssessment": 15, "propertyMutation": 10, "revenueRecovery": 5, "waterConnection": 5 } }
                    ]
                }
            ]
        },
        {
            "stateName": "Tripura",
            "districts": [
                {
                    "districtName": "West Tripura",
                    "blocks": [
                        { "blockName": "Agartala Sadar", "claims": { "total": 70, "approved": 50, "pending": 15, "rejected": 5, "landRecords": 35, "taxAssessment": 15, "propertyMutation": 15, "revenueRecovery": 5, "waterConnection": 0 } }
                    ]
                },
                {
                    "districtName": "North Tripura",
                    "blocks": [
                        { "blockName": "Dharmanagar", "claims": { "total": 50, "approved": 35, "pending": 10, "rejected": 5, "landRecords": 20, "taxAssessment": 10, "propertyMutation": 10, "revenueRecovery": 5, "waterConnection": 5 } }
                    ]
                }
            ]
        },
        {
            "stateName": "Odisha",
            "districts": [
                {
                    "districtName": "Bhubaneswar",
                    "blocks": [
                        { "blockName": "Khandagiri", "claims": { "total": 130, "approved": 90, "pending": 30, "rejected": 10, "landRecords": 60, "taxAssessment": 30, "propertyMutation": 25, "revenueRecovery": 10, "waterConnection": 5 } }
                    ]
                },
                {
                    "districtName": "Cuttack",
                    "blocks": [
                        { "blockName": "Choudwar", "claims": { "total": 100, "approved": 70, "pending": 20, "rejected": 10, "landRecords": 50, "taxAssessment": 20, "propertyMutation": 15, "revenueRecovery": 10, "waterConnection": 5 } }
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
            { "name": "Tax Assessment", "value": 200, "color": "#00BCD4" },
            { "name": "Property Mutation", "value": 150, "color": "#9C27B0" },
            { "name": "Revenue Recovery", "value": 80, "color": "#FF5722" },
            { "name": "Water Connection", "value": 60, "color": "#42A5F5" }
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
            { "name": "Indore", "claimsApproved": 400, "totalClaims": 550 },
            { "name": "Hyderabad", "claimsApproved": 550, "totalClaims": 700 },
            { "name": "West Tripura", "claimsApproved": 200, "totalClaims": 280 },
            { "name": "Bhubaneswar", "claimsApproved": 320, "totalClaims": 450 },
            { "name": "Varanasi", "claimsApproved": 240, "totalClaims": 330 },
            { "name": "Mumbai", "claimsApproved": 350, "totalClaims": 450 },
            { "name": "Bhopal", "claimsApproved": 300, "totalClaims": 400 },
            { "name": "Warangal", "claimsApproved": 250, "totalClaims": 320 },
            { "name": "North Tripura", "claimsApproved": 150, "totalClaims": 200 },
            { "name": "Cuttack", "claimsApproved": 280, "totalClaims": 380 }
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
            { "month": "Jun", "claims": 220 },
            { "month": "Jul", "claims": 250 },
            { "month": "Aug", "claims": 240 },
            { "month": "Sep", "claims": 260 },
            { "month": "Oct", "claims": 290 },
            { "month": "Nov", "claims": 280 },
            { "month": "Dec", "claims": 310 }
        ]
    }
};

// Define the data types for better type safety
type Claims = {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    landRecords: number;
    taxAssessment: number;
    propertyMutation: number;
    revenueRecovery: number;
    waterConnection: number;
};

type Block = {
    blockName: string;
    claims: Claims;
};

type District = {
    districtName: string;
    blocks: Block[];
};

type State = {
    stateName: string;
    districts: District[];
};

type Claim = {
    id: string;
    name: string;
    village: string;
    status: string;
};

type ClaimStatusBreakdown = {
    name: string;
    value: number;
    color: string;
}[];

type ClaimsByType = {
    name: string;
    value: number;
    color: string;
}[];

type PendingByVillage = {
    name: string;
    pendingClaims: number;
}[];

type BottleneckItem = {
    name: string;
    delay: number;
};

type RevenueData = {
    totalRevenue: number;
    assignedClaims: Claim[];
    claimsByType: ClaimsByType;
    claimStatusBreakdown: ClaimStatusBreakdown;
    pendingByVillage: PendingByVillage;
    bottlenecks: BottleneckItem[];
};

type DynamicClaims = {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
    claimsByStatus: ClaimsByType;
};

const MetricCard: React.FC<{ title: string; value: number | string; bgGradient?: string; }> = ({ title, value, bgGradient }) => {
    return (
        <div className={`p-4 sm:p-6 rounded-2xl shadow-lg text-white ${bgGradient}`}>
            <h3 className="text-sm sm:text-lg font-medium">{title}</h3>
            <p className="mt-1 sm:mt-2 text-2xl sm:text-4xl font-bold">{value}</p>
        </div>
    );
};

const BottleneckReport: React.FC<{ data: BottleneckItem[] }> = ({ data }) => {
    return (
        <ul className="space-y-4">
            {data.map((item, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <span className="font-medium text-gray-700">{item.name}</span>
                    <span className="text-sm font-semibold text-red-500">{item.delay} days</span>
                </li>
            ))}
        </ul>
    );
};

const StatewiseClaimsTable: React.FC<{
    selectedState: string | null;
    setSelectedState: (state: string) => void;
    selectedDistrict: string | null;
    setSelectedDistrict: (district: string) => void;
    statewiseData: State[];
}> = ({ selectedState, setSelectedState, selectedDistrict, setSelectedDistrict, statewiseData }) => {

    const states = statewiseData.map(s => s.stateName);
    const districts = selectedState ? statewiseData.find(s => s.stateName === selectedState)?.districts.map(d => d.districtName) : [];
    const blocks = selectedState && selectedDistrict ? statewiseData.find(s => s.stateName === selectedState)?.districts.find(d => d.districtName === selectedDistrict)?.blocks : [];

    const handleStateChange = (e) => {
        setSelectedState(e.target.value);
        setSelectedDistrict(null);
    };

    const handleDistrictChange = (e) => {
        setSelectedDistrict(e.target.value);
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl border border-gray-100">
            <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Claims by State, District & Block</h2>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label htmlFor="state-select" className="block text-sm font-medium text-gray-700 mb-1">Select State</label>
                    <select
                        id="state-select"
                        onChange={handleStateChange}
                        value={selectedState || ''}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Choose a State</option>
                        {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>
                <div className="flex-1">
                    <label htmlFor="district-select" className="block text-sm font-medium text-gray-700 mb-1">Select District</label>
                    <select
                        id="district-select"
                        onChange={handleDistrictChange}
                        value={selectedDistrict || ''}
                        disabled={!selectedState}
                        className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-lg shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Choose a District</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
            </div>

            {selectedDistrict && blocks && blocks.length > 0 && (
                <div className="overflow-x-auto rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Block</th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Claims</th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-green-600">Approved</th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-yellow-600">Pending</th>
                                <th scope="col" className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-red-600">Rejected</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {blocks.map((block, index) => (
                                <tr key={index}>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{block.blockName}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{block.claims.total}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">{block.claims.approved}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-yellow-600 font-semibold">{block.claims.pending}</td>
                                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-red-600 font-semibold">{block.claims.rejected}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};


const RevenueDashboard = () => {
    const revenueData = data.revenueData;
    const statewiseData = data.statewiseClaims;

    const [selectedState, setSelectedState] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [dynamicClaims, setDynamicClaims] = useState(null);

    useEffect(() => {
        let total = 0;
        let approved = 0;
        let pending = 0;
        let rejected = 0;

        if (selectedDistrict) {
            const state = statewiseData.find(s => s.stateName === selectedState);
            const district = state?.districts.find(d => d.districtName === selectedDistrict);

            if (district) {
                district.blocks.forEach(block => {
                    total += block.claims.total;
                    approved += block.claims.approved;
                    pending += block.claims.pending;
                    rejected += block.claims.rejected;
                });
            }
        } else {
             // Calculate totals for all blocks if no district is selected
            statewiseData.forEach(state => {
                state.districts.forEach(district => {
                    district.blocks.forEach(block => {
                        total += block.claims.total;
                        approved += block.claims.approved;
                        pending += block.claims.pending;
                        rejected += block.claims.rejected;
                    });
                });
            });
        }
        
        const claimsByStatus = [
            { name: "Approved", value: approved, color: "#4CAF50" },
            { name: "Pending", value: pending, color: "#FF9800" },
            { name: "Rejected", value: rejected, color: "#F44336" },
        ];
        
        setDynamicClaims({
            total,
            approved,
            pending,
            rejected,
            claimsByStatus
        });
        
    }, [selectedState, selectedDistrict, statewiseData]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen font-inter">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">Revenue Department Dashboard</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-4 sm:mb-8">
                <MetricCard 
                    title="Total Claims" 
                    value={dynamicClaims?.total || 0}
                    bgGradient="bg-gradient-to-br from-blue-500 to-blue-700"
                />
                <MetricCard 
                    title="Claims Approved" 
                    value={dynamicClaims?.approved || 0}
                    bgGradient="bg-gradient-to-br from-green-500 to-green-700"
                />
                <MetricCard 
                    title="Claims Pending" 
                    value={dynamicClaims?.pending || 0}
                    bgGradient="bg-gradient-to-br from-yellow-500 to-yellow-600"
                />
                <MetricCard 
                    title="Claims Rejected" 
                    value={dynamicClaims?.rejected || 0}
                    bgGradient="bg-gradient-to-br from-red-500 to-red-700"
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-8">
                {/* Claims Status Breakdown Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Claims Status Breakdown</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dynamicClaims?.claimsByStatus || []}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    fill="#8884d8"
                                    label
                                >
                                    {dynamicClaims?.claimsByStatus?.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Claims by Type Bar Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Claims by Type</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData.claimsByType}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" name="Claims" fill="#8884d8">
                                    {revenueData.claimsByType.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <StatewiseClaimsTable 
                    selectedState={selectedState} 
                    setSelectedState={setSelectedState} 
                    selectedDistrict={selectedDistrict} 
                    setSelectedDistrict={setSelectedDistrict} 
                    statewiseData={statewiseData}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {/* Monthly Claims Trend Chart */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Monthly Claims Trend</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data.planningData.monthlyClaims}
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 20,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="claims" stroke="#8884d8" activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                {/* Assigned Claims Table */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                    <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Assigned Claims</h2>
                    <div className="overflow-x-auto">
                        <ul className="space-y-4">
                            {revenueData.assignedClaims.map((claim) => (
                                <li key={claim.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-gray-800 truncate">{claim.name} <span className="text-sm font-normal text-gray-500">({claim.id})</span></p>
                                        <p className="text-sm text-gray-500 truncate">Village: {claim.village}</p>
                                    </div>
                                    <span className={`text-xs sm:text-sm font-semibold px-2 py-1 rounded-full ${
                                        claim.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-700' :
                                        claim.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                        claim.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {claim.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                {/* Pending Claims by Village & Bottlenecks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Pending Claims by Village</h2>
                        <ul className="space-y-4">
                            {revenueData.pendingByVillage.map((item, index) => (
                                <li key={index} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                    <span className="font-medium text-gray-700">{item.name}</span>
                                    <span className="text-red-500 font-bold">{item.pendingClaims} pending</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl">
                        <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Current Bottlenecks</h2>
                        <BottleneckReport data={revenueData.bottlenecks} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueDashboard;
