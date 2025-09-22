// Update the import path if Sidebar is located elsewhere, for example:
import Sidebar from "../../../components/Sidebar";
import PattaHoldersRegistry from "../../../components/PattaHoldersRegistry";
import GISMapping from "../../../components/GISMapping";
import SchemeLayering from "../../../components/SchemeLayering";
import AnalyticsCharts from "../../../components/AnalyticsCharts";
import FeedbackGrievance from "../../../components/FeedbackGrievance";
import UserManagement from "../../../components/UserManagement";

const DistrictDeptDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold text-green-900">District Tribal & Forest Dept Dashboard</h1>
        <p className="mt-2 text-green-700">Analytics and tools for district-level management.</p>
        <PattaHoldersRegistry />
        <GISMapping />
        <SchemeLayering />
        <AnalyticsCharts />
         <FeedbackGrievance />
        <UserManagement />
      </main>
    </div>
  );
};

export default DistrictDeptDashboard;