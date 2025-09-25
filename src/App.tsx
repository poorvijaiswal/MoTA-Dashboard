import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import FRAAtlas from "./pages/FRAAtlas";
import FRAClaims from "./pages/FRAClaims";
import PattaHolders from "./pages/PattaHolders";
import Assets from "./pages/Assets";
import Schemes from "./pages/Schemes";
import Complaints from "./pages/Complaints";
import DSSEngine from "./pages/DSSEngine";
import Reports from "./pages/Reports";
import NotFound from "./pages/NotFound";
import PattaHolderProfilePage from "./components/PattaHolderProfilePage";
import Home from "./pages/Home";
import NGODashboard from "./pages/Dashboard/NGO/NGODashboard";
import StateDeptDashboard from "./pages/Dashboard/State Department/StateDeptDashboard";
import RevenueDashboard from "./pages/Dashboard/Tribal/TribalDashboard";
import DistrictDeptDashboard from "./pages/Dashboard/District Department/DistrictDeptDashboard";
import PlanningDashboard from "./pages/Dashboard/Planning Authority/PlanningDashboard";
import StateDashboard from "./pages/Dashboard/State Department/pages/StateDashboard";
import StateSchemes from "./pages/Dashboard/State Department/pages/StateSchemes";
import Beneficiaries from "./pages/Dashboard/State Department/pages/Beneficiaries";
import StateComplaints from "./pages/Dashboard/State Department/pages/StateComplaints";
import DSS from "./pages/Dashboard/State Department/pages/DSS";
import StateAnalytics from "./pages/Dashboard/State Department/pages/StateAnalytics";
import StateFRAAtlasPage from "./pages/Dashboard/State Department/pages/StateFRAAtlasPage";
import ClaimsManagement from "./pages/Dashboard/State Department/pages/ClaimsManagement";
import FieldVerification from "./pages/Dashboard/State Department/pages/FieldVerification";
import TaskManagement from "./pages/Dashboard/State Department/pages/TaskManagement";
import DistrictBeneficiaries from "./pages/Dashboard/District Department/pages/DistrictBeneficiaries";
import DistrictDashboard from "./pages/Dashboard/District Department/pages/DistrictDashboard";
import DistrictClaimsManagement from "./pages/Dashboard/District Department/pages/DistrictClaimsManagement";
import DistrictFieldVerification from "./pages/Dashboard/District Department/pages/DistrictFieldVerification"
import DistrictSchemes from "./pages/Dashboard/District Department/pages/DistrictSchemes"
import DistrictTaskManagement from "./pages/Dashboard/District Department/pages/DistrictTaskManagement"  
import DistrictComplaints from "./pages/Dashboard/District Department/pages/DistrictComplaints";
import DistrictAnalytics from "./pages/Dashboard/District Department/pages/DistrictAnalytics";
import DistrictFRAAtlasPage from "./pages/Dashboard/District Department/pages/DistrictFRAAtlasPage";
import DataIngestion from "./pages/Dashboard/District Department/pages/DataIngestion";
import TribalDashboard from "./pages/Dashboard/Tribal/TribalDashboard";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('auth') === 'authenticated';
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home & Login */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* 🔹 MoTA (with Layout) */}
          <Route
            path="/mota/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="fra-atlas" element={<FRAAtlas />} />
            <Route path="fra-claims" element={<FRAClaims />} />
            <Route path="patta-holders" element={<PattaHolders />} />
            <Route path="assets" element={<Assets />} />
            <Route path="schemes" element={<Schemes />} />
            <Route path="complaints" element={<Complaints />} />
            <Route path="dss" element={<DSSEngine />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* 🔹 Other Dashboards (no Layout) */}
          <Route
            path="/dashboard/state/*"
            element={
              <ProtectedRoute>
                <StateDeptDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<StateDashboard />} />
            <Route path="claims" element={<ClaimsManagement />} />
            <Route path="verification" element={<FieldVerification />} />
            <Route path="tasks" element={<TaskManagement />} />
            <Route path="schemes" element={<StateSchemes />} />
            <Route path="beneficiaries" element={<Beneficiaries />} />
            <Route path="complaints" element={<StateComplaints />} />
            <Route path="dss" element={<DSSEngine />} />
            <Route path="reports" element={<StateAnalytics />} />
            <Route path="analytics" element={<StateAnalytics />} />
            <Route path="fra-atlas" element={<StateFRAAtlasPage />} />
            {/* <Route path="settings" element={<div className="p-6 gov-text">Settings - Coming Soon</div>} /> */}
          </Route>
          <Route
            path="/dashboard/district"
            element={
              <ProtectedRoute>
                <DistrictDeptDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<DistrictDashboard />} />
            <Route path="claims" element={<DistrictClaimsManagement />} />
            <Route path="verification" element={<DistrictFieldVerification />} />
            <Route path="tasks" element={<DistrictTaskManagement />} />
            <Route path="schemes" element={<DistrictSchemes />} />
            <Route path="beneficiaries" element={<DistrictBeneficiaries />} />
            <Route path="complaints" element={<DistrictComplaints />} />
            <Route path="dss" element={<DSSEngine />} />
            <Route path="reports" element={<DistrictAnalytics />} />
            <Route path="analytics" element={<DistrictAnalytics />} />
            <Route path="fra-atlas" element={<DistrictFRAAtlasPage />} />
            <Route path="data-ingestion" element={<DataIngestion />} />
          </Route>
          <Route
            path="/dashboard/tribal"
            element={
              <ProtectedRoute>
                <TribalDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/planning"
            element={
              <ProtectedRoute>
                <PlanningDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/ngo"
            element={
              <ProtectedRoute>
                <NGODashboard />
              </ProtectedRoute>
            }
          />

          {/* Patta Holder Full Profile Route */}
          <Route path="/profile/:claimId" element={<PattaHolderProfilePage />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
