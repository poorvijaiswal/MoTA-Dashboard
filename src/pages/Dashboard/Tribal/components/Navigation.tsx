import { Button } from "@/components/ui/button";
import { ArrowLeft, TreePine, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.pathname === '/dashboard/tribal/tribedashboard') {
      navigate('/dashboard/tribal/');
    } else {
      navigate('/dashboard/tribal/tribedashboard');
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard/tribal/tribedashboard') return 'Dashboard';
    if (path === '/dashboard/tribal/complaints/new') return 'File Complaint';
    if (path === '/dashboard/tribal/complaints') return 'My Complaints';
    if (path.startsWith('/dashboard/tribal/complaints/')) return 'Complaint Details';
    if (path === '/dashboard/tribal/schemes') return 'Available Schemes';
    if (path.startsWith('/dashboard/tribal/schemes/')) return 'Scheme Details';
    if (path === '/dashboard/tribal/my-schemes') return 'My Schemes';
    if (path === '/dashboard/tribal/land') return 'My Land & Claims';
    if (path === '/dashboard/tribal/bot') return 'WhatsApp Bot';
    return 'FRA Portal';
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground"
            >
              {location.pathname === '/dashboard/tribal/tribedashboard' ? (
                <Home className="h-5 w-5" />
              ) : (
                <ArrowLeft className="h-5 w-5" />
              )}
            </Button>
            
            <div className="flex items-center space-x-2">
              <TreePine className="h-6 w-6 text-primary" />
              <div>
                <h1 className="font-semibold text-foreground">{getPageTitle()}</h1>
                <p className="text-xs text-muted-foreground">Forest Rights Act Portal</p>
              </div>
            </div>
          </div>

          {location.pathname !== '/dashboard' && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/dashboard/tribal/tribedashboard')}
              className="text-primary hover:text-primary-hover"
            >
              Dashboard
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navigation;