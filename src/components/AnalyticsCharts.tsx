import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ScatterChart, Scatter } from "recharts";
import holdersData from '@/data/holders.json';

const holders = holdersData.holders;

// Gender Distribution
const genderDist = [
  { name: "Male", value: holders.filter(h => h.gender === "Male").length },
  { name: "Female", value: holders.filter(h => h.gender === "Female").length },
];

// Claims Status
const claimsSummary = [
  { status: "Total", count: holders.length },
  { status: "Approved", count: holders.filter(h => h.status === "Approved").length },
  { status: "Pending", count: holders.filter(h => h.status === "Pending").length },
];

// Family Members
const familyData = holders
  .filter(h => h.family_members)
  .map(h => ({ name: h.name, members: h.family_members }));

// Annual Income
const incomeData = holders
  .filter(h => h.annual_income)
  .map(h => ({ name: h.name, income: h.annual_income }));

// District-wise Claim Counts
const districtCounts: Record<string, number> = {};
holders.forEach(h => {
  if (h.district) districtCounts[h.district] = (districtCounts[h.district] || 0) + 1;
});
const districtData = Object.entries(districtCounts).map(([district, count]) => ({ district, count }));

// District-wise Approved vs Pending (Stacked Bar)
const districtStatusMap: Record<string, { Approved: number; Pending: number }> = {};
holders.forEach(h => {
  if (!districtStatusMap[h.district]) districtStatusMap[h.district] = { Approved: 0, Pending: 0 };
  if (h.status === "Approved") districtStatusMap[h.district].Approved += 1;
  else districtStatusMap[h.district].Pending += 1;
});
const districtStatusData = Object.entries(districtStatusMap).map(([district, val]) => ({ district, ...val }));

// Schemes Participation
const schemesCounts: Record<string, number> = {};
holders.forEach(h => {
  h.schemes_linked?.forEach(scheme => {
    schemesCounts[scheme] = (schemesCounts[scheme] || 0) + 1;
  });
});
const schemesData = Object.entries(schemesCounts).map(([name, value]) => ({ name, value }));

// Occupation Distribution
const occupationCounts: Record<string, number> = {};
holders.forEach(h => {
  if (h.occupation) occupationCounts[h.occupation] = (occupationCounts[h.occupation] || 0) + 1;
});
const occupationData = Object.entries(occupationCounts).map(([occupation, value]) => ({ occupation, value }));

// Family Size vs Income
const familyIncomeData = holders
  .filter(h => h.family_members && h.annual_income)
  .map(h => ({ x: h.family_members, y: h.annual_income, status: h.status }));

// Color palette
const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#A020F0", "#FF69B4", "#32CD32", "#FF6347", "#FFD700", "#40E0D0"];

// Custom Tooltips
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return <div className="bg-white p-2 border rounded shadow text-sm"><p><b>{payload[0].name}:</b> {payload[0].value}</p></div>;
  }
  return null;
};
const CustomBarTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        {payload.map((p: any, idx: number) => <p key={idx}><b>{p.name || p.dataKey}:</b> {p.value}</p>)}
      </div>
    );
  }
  return null;
};
const CustomScatterTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-white p-2 border rounded shadow text-sm">
        <p><b>Family Members:</b> {point.x}</p>
        <p><b>Income:</b> ₹{point.y}</p>
        <p><b>Status:</b> {point.status}</p>
      </div>
    );
  }
  return null;
};

const AnalyticsCharts = () => (
  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    
    {/* Gender Distribution */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} >
            {genderDist.map((entry, index) => (
              <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2}/>
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Claims Status */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">Claims Status</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={claimsSummary}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {claimsSummary.map((entry, index) => <Cell key={`cell-claims-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Family Members */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">Family Members per Holder</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={familyData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar dataKey="members" radius={[6, 6, 0, 0]}>
            {familyData.map((entry, index) => <Cell key={`cell-family-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Annual Income */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300 col-span-2">
      <h2 className="font-semibold mb-2 text-green-700">Annual Income of Patta Holders</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={incomeData}>
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#A020F0" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>

    {/* District-wise Claim Counts */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">District-wise Claim Count</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={districtData}>
          <XAxis dataKey="district" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar dataKey="count" radius={[6, 6, 0, 0]}>
            {districtData.map((entry, index) => <Cell key={`cell-district-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
    
       {/* Schemes Participation */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">Schemes Participation</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={schemesData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} innerRadius={40} >
            {schemesData.map((entry, index) => (
              <Cell key={`cell-scheme-${index}`} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={2}/>
            ))}
          </Pie>
          <Tooltip content={<CustomPieTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>


    {/* District-wise Claim Status (Stacked Bar) */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300 col-span-2">
      <h2 className="font-semibold mb-2 text-green-700">District-wise Claim Status</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={districtStatusData} stackOffset="expand">
          <XAxis dataKey="district" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={val => `${(val * 100).toFixed(0)}%`} />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar dataKey="Approved" stackId="a" fill="#00C49F" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Pending" stackId="a" fill="#FF8042" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

 
    {/* Occupation Distribution */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300">
      <h2 className="font-semibold mb-2 text-green-700">Occupation Distribution</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={occupationData}>
          <XAxis dataKey="occupation" tick={{ fontSize: 12 }} />
          <YAxis />
          <Tooltip content={<CustomBarTooltip />} />
          <Legend />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {occupationData.map((entry, index) => <Cell key={`cell-occupation-${index}`} fill={COLORS[index % COLORS.length]} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Family Size vs Income */}
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-2xl transition-all duration-300 col-span-2">
      <h2 className="font-semibold mb-2 text-green-700">Family Size vs Annual Income</h2>
      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart>
          <XAxis type="number" dataKey="x" name="Family Members" />
          <YAxis type="number" dataKey="y" name="Annual Income" />
          <Tooltip content={<CustomScatterTooltip />} />
          <Scatter name="Holder" data={familyIncomeData} fill="#8884d8" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>

  </div>
);

export default AnalyticsCharts;
