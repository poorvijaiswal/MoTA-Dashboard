import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { login } from "@/utils/auth";

const Home = () => {
  const navigate = useNavigate();

  const handleLogin = (role: string) => {
    login(role as any);
    switch (role) {
      case "state": navigate("/dashboard/state"); break;
      case "district": navigate("/dashboard/district"); break;
      case "revenue": navigate("/dashboard/revenue"); break;
      case "planning": navigate("/dashboard/planning"); break;
      case "ngo": navigate("/dashboard/ngo"); break;
      case "mota": navigate("/login"); break; // redirect to existing login page
      default: navigate("/");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-success/5 p-6">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            Welcome to VanSampada
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <Button 
              key={r.role} 
              onClick={() => handleLogin(r.role)} 
              className="w-full"
            >
              {r.label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
