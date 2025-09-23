import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { login } from "@/utils/auth"; // Adjust import as needed

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    login(role as any);
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

  const roles = [
    { label: "State Tribal & Forest Dept", role: "state" },
    { label: "District Tribal & Forest Dept", role: "district" },
    { label: "Revenue Department", role: "revenue" },
    { label: "Planning Authorities", role: "planning" },
    { label: "NGO", role: "ngo" },
    { label: "MoTA (Admin)", role: "mota" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="max-w-5xl w-full shadow-2xl rounded-lg p-8 flex flex-col md:flex-row gap-10">
        {/* Left Info Section */}
        <section className="flex-1 flex flex-col justify-center space-y-6">
          <h1 className="text-5xl font-extrabold text-emerald-700 leading-tight drop-shadow-lg">
            VanSampada Portal
          </h1>
          <p className="text-lg text-gray-700 max-w-md">
            AI-powered FRA Atlas and WebGIS-based Decision Support System (DSS) for integrated monitoring and management of Forest Rights Act implementation in Madhya Pradesh, Tripura, Odisha, Telangana.
          </p>
          <p className="text-sm text-gray-600 max-w-md">
            Supporting ministries, tribal welfare departments, revenue, planning authorities, and NGOs working with tribal communities.
          </p>
        </section>

        {/* Right Login Section */}
        <section className="flex-1 bg-white rounded-md shadow-md p-6 flex flex-col space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-900">
            Select Your Role to Login
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {roles.map(({ label, role }) => (
              <Button
                key={role}
                variant="outline"
                className="text-gray-800 hover:bg-primary hover:text-white transition-colors"
                onClick={() => handleLogin(role)}
              >
                {label}
              </Button>
            ))}
          </div>
        </section>
      </Card>
    </div>
  );
};

export default Home;
