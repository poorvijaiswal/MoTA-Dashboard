import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import holdersData from "../data/holders.json";
const holders = holdersData.holders;

// Gender Distribution
const genderDist = [
  { name: "Male", value: holders.filter(h => h.gender === "Male").length },
  { name: "Female", value: holders.filter(h => h.gender === "Female").length },
];

// Tribe Distribution
const tribeCounts: Record<string, number> = {};
holders.forEach(h => {
  if (h.tribe) tribeCounts[h.tribe] = (tribeCounts[h.tribe] || 0) + 1;
});
const tribeDist = Object.entries(tribeCounts).map(([name, value]) => ({ name, value }));

// Claims Status
const claimsSummary = [
  { status: "Total", count: holders.length },
  { status: "Male", count: genderDist[0].value },
  { status: "Female", count: genderDist[1].value },
];

// Income Distribution (Line Chart)
const incomeData = holders
  .filter(h => h.annual_income)
  .map(h => ({
    name: h.name,
    income: h.annual_income,
  }));

// Family Members Distribution (Bar Chart)
const familyData = holders
  .filter(h => h.family_members)
  .map(h => ({
    name: h.name,
    members: h.family_members,
  }));

// Land Size Distribution (Pie Chart)
const landSizeData: Record<string, number> = {};
holders.forEach(h => {
  if (h.land_size) landSizeData[h.land_size] = (landSizeData[h.land_size] || 0) + 1;
});
const landSizeDist = Object.entries(landSizeData).map(([name, value]) => ({ name, value }));

const COLORS = ["#0088FE", "#FF8042", "#00C49F", "#FFBB28", "#A020F0", "#FF69B4", "#32CD32", "#FF6347", "#FFD700", "#40E0D0"];

const AnalyticsCharts = () => (
  <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Gender Distribution Pie */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold mb-2 text-green-700">Gender Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={genderDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
            {genderDist.map((entry, index) => (
              <Cell key={`cell-gender-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Tribe Distribution Bar Chart (with different colors) */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold mb-2 text-green-700">Tribe Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={tribeDist}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value">
            {tribeDist.map((entry, index) => (
              <Cell key={`cell-tribe-bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Claims Status Bar (different colors) */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold mb-2 text-green-700">Claims Status</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={claimsSummary}>
          <XAxis dataKey="status" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count">
            {claimsSummary.map((entry, index) => (
              <Cell key={`cell-claims-bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Family Members Bar (different colors) */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold mb-2 text-green-700">Family Members per Holder</h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={familyData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="members">
            {familyData.map((entry, index) => (
              <Cell key={`cell-family-bar-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Land Size Pie Chart */}
    <div className="bg-white shadow rounded p-4">
      <h2 className="font-semibold mb-2 text-green-700">Land Size Distribution</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie data={landSizeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
            {landSizeDist.map((entry, index) => (
              <Cell key={`cell-landsize-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>

    {/* Income Line Chart */}
    <div className="bg-white shadow rounded p-4 col-span-2">
      <h2 className="font-semibold mb-2 text-green-700">Annual Income of Patta Holders</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={incomeData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#A020F0" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default AnalyticsCharts;