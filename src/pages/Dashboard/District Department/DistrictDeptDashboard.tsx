import Sidebar from "../../../components/Sidebar";
import PattaHoldersRegistry from "../../../components/PattaHoldersRegistry";
import GISMapping from "../../../components/GISMapping";
import SchemeLayering from "../../../components/SchemeLayering";
import AnalyticsCharts from "../../../components/AnalyticsCharts";
import FeedbackGrievance from "../../../components/FeedbackGrievance";
import UserManagement from "../../../components/UserManagement";

const DistrictDeptDashboard = () => {
  return (
    <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
      <Sidebar />
      <main className="flex-1 p-8 space-y-8 overflow-x-hidden">
        <div className="max-w-full">
          <h1 className="text-3xl font-bold text-green-900">District Tribal & Forest Dept Dashboard</h1>
          <p className="mt-2 text-green-700">Analytics and tools for district-level management.</p>
        </div>

        <div className="max-w-full overflow-x-auto">
          <PattaHoldersRegistry />
        </div>

        <div className="max-w-full overflow-x-auto">
          <GISMapping />
        </div>

        <div className="max-w-full overflow-x-auto">
          <SchemeLayering />
        </div>

        <div className="max-w-full overflow-x-auto">
          <AnalyticsCharts />
        </div>

        <div className="max-w-full overflow-x-auto">
          <FeedbackGrievance />
        </div>

        <div className="max-w-full overflow-x-auto">
          <UserManagement />
        </div>
      </main>
    </div>
  );
};

export default DistrictDeptDashboard;
