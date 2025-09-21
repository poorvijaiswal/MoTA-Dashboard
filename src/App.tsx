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
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
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
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
