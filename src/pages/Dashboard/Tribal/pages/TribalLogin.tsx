import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TreePine, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard/tribal/tribedashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-blue-100 to-blue-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="bg-primary rounded-full p-3">
              <TreePine className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Tribal Portal</h1>
          <p className="text-muted-foreground">Forest Rights Act - Tribal Services</p>
        </div>

        {/* Login Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Access your forest rights and tribal services
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-3 ">
              <div className="flex items-center space-x-3 text-sm">
                <Scale className="h-4 w-4 text-primary" />
                <span>File complaints & track status</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Users className="h-4 w-4 text-secondary" />
                <span>Apply for government schemes</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <TreePine className="h-4 w-4 text-success" />
                <span>Manage land claims & rights</span>
              </div>
            </div>

            {/* Login Button */}
            <Button 
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-6 text-lg font-semibold"
            >
              Login as Tribal User
            </Button>

            {/* Demo Notice */}
            <div className="text-center text-xs text-muted-foreground">
              Demo Mode - Login as Ram Charan (Gond Tribe)
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          Ministry of Tribal Affairs • Government of India
        </div>
      </div>
    </div>
  );
};

export default Login;