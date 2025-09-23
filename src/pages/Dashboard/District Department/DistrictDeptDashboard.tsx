import { useState } from "react";

import PattaHoldersRegistry from "../../../components/PattaHoldersRegistry";
import GISMapping from "../../../components/GISMapping";
import SchemeLayering from "../../../components/SchemeLayering";
import AnalyticsCharts from "../../../components/AnalyticsCharts";
import FeedbackGrievance from "../../../components/FeedbackGrievance";
import UserManagement from "../../../components/UserManagement";
import ClaimMonitoring from "../../../components/ClaimMonitoring";
import DataEntryUpdates from "../../../components/DataEntryUpdates";
import NotificationsCenter from "../../../components/NotificationsCenter";

const tabs = [
  { id: "claims", label: "FRA Claims Monitoring", component: <ClaimMonitoring /> },
  { id: "registry", label: "Patta Holders Registry", component: <PattaHoldersRegistry /> },
  { id: "gis", label: "GIS Mapping", component: <GISMapping /> },
  { id: "schemes", label: "Scheme Layering (DSS)", component: <SchemeLayering /> },
  { id: "analytics", label: "Analytics & Reports", component: <AnalyticsCharts /> },
  { id: "data-entry", label: "Data Entry & Updates", component: <DataEntryUpdates /> },
  { id: "alerts", label: "Alerts & Notifications", component: <NotificationsCenter /> },
  { id: "users", label: "User Management", component: <UserManagement /> },
  { id: "feedback", label: "Feedback & Grievance", component: <FeedbackGrievance /> },
];

const DistrictDeptDashboard = () => {
  const [activeTab, setActiveTab] = useState("claims");

  return (
    <div className="flex min-h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
    

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-green-900">
          District Tribal & Forest Dept Dashboard
        </h1>
        <p className="mt-2 text-green-700">
          Tools & analytics for district-level FRA & scheme management.
        </p>

        {/* Tabs Navigation */}
        <div className="flex flex-wrap mt-6 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-all rounded-t-lg ${
                activeTab === tab.id
                  ? "bg-green-600 text-white shadow-md"
                  : "text-green-700 hover:bg-green-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Active Tab Content */}
        <div className="mt-6 bg-white shadow-md rounded-xl p-6">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </main>
    </div>
  );
};

export default DistrictDeptDashboard;
