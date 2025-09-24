import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { login } from "@/utils/auth";
import motaLogo from "@/../public/mota-logo.webp";

import type { UserRole } from "@/utils/auth"; // Ensure UserRole is imported

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (role: UserRole) => {
    login(role);
    switch (role) {
      case "state":
        navigate("/dashboard/state");
        break;
      case "district":
        navigate("/dashboard/district");
        break;
      case "revenue":
        navigate("/dashboard/revenue");
        break;
      case "planning":
        navigate("/dashboard/planning");
        break;
      case "ngo":
        navigate("/dashboard/ngo");
        break;
      case "mota":
        navigate("/login");
        break; 
      default:
        navigate("/");
    }
  };

  const roles: { label: string; role: UserRole }[] = [
    { label: "State Tribal & Forest Dept", role: "state" },
    { label: "District Tribal & Forest Dept", role: "district" },
    { label: "Revenue Department", role: "revenue" },
    { label: "Planning Authorities", role: "planning" },
    { label: "NGO", role: "ngo" },
    { label: "MoTA (Admin)", role: "mota" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Section - Brand & Information */}
      <div className="flex-1 min-h-[40vh] md:min-h-screen bg-gradient-hero bg-pattern-bg flex flex-col items-center justify-center p-8 text-amber-300 relative overflow-hidden">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-200 to-blue-300 via-blue-400"></div>
        
        <div className="relative z-10 max-w-lg text-center space-y-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 shadow-elegant">
              <img 
                src={motaLogo} 
                alt="Ministry of Tribal Affairs Logo" 
                className="w-45 h-45 object-contain rounded-full"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight">
              VanSampada Portal
            </h1>
            <div className="w-24 h-1 bg-accent mx-auto rounded-full"></div>
          </div>

          {/* Subtitle */}
          <div className="space-y-4 text-white/90">
            <p className="text-lg leading-relaxed">
              AI-powered FRA Atlas & WebGIS DSS for monitoring Forest Rights Act implementation across Madhya Pradesh, Tripura, Odisha, Telangana.
            </p>
          </div>

        </div>
      </div>

      {/* Right Section - Login */}
      <div className="flex-1 min-h-[60vh] md:min-h-screen flex items-center justify-center p-8 bg-gradient-to-b from-blue-200 to-blue-300">
        <Card className="w-full max-w-md p-8 shadow-elegant bg-amber-400">
          <div className="space-y-8">
            {/* Login Header */}
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-foreground">
                Select Your Role
              </h2>
              <p className="text-muted-foreground">
                Choose your department to access the portal
              </p>
            </div>

            {/* Role Selection Buttons */}
            <div className="space-y-4">
              {roles.map(({ label, role }) => (
                <Button
                  key={role}
                  variant="default"
                  size="lg"
                  className="w-full text-left justify-start h-14 font-medium bg-white text-amber-700 hover:bg-amber-100 shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => handleLogin(role)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {/* Footer Note */}
            <div className="text-center text-sm text-muted-foreground border-t pt-6">
              Secure access for authorized personnel only
            </div>
          </div>
        </Card>
      </div>

      {/* Mobile Layout Adjustment - Using Tailwind classes instead */}
    </div>
  );
};

export default Home;