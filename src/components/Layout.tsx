import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Map, 
  FileText, 
  Users, 
  Building2, 
  Briefcase, 
  MessageSquare, 
  BarChart3, 
  Menu,
  LogOut,
  Shield,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const basePath = "/mota";

  const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: `${basePath}/dashboard` },
  { icon: Map, label: 'FRA Atlas', path: `${basePath}/fra-atlas` },
  { icon: FileText, label: 'FRA Claims', path: `${basePath}/fra-claims` },
  { icon: Users, label: 'Patta Holders', path: `${basePath}/patta-holders` },
  { icon: Building2, label: 'Assets', path: `${basePath}/assets` },
  { icon: Briefcase, label: 'Schemes', path: `${basePath}/schemes` },
  { icon: MessageSquare, label: 'Complaints', path: `${basePath}/complaints` },
  { icon: Settings, label: 'DSS Engine', path: `${basePath}/dss` },
  { icon: BarChart3, label: 'Reports', path: `${basePath}/reports` },
];


  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn(
        "bg-card border-r border-border transition-all duration-300 flex flex-col",
        sidebarOpen ? "w-64" : "w-16"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            {sidebarOpen && (
              <div>
                <h2 className="text-lg font-semibold text-foreground">MoTA FRA</h2>
                <p className="text-xs text-muted-foreground">Atlas & DSS</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-12",
                  !sidebarOpen && "justify-center px-2",
                  isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className={cn("w-5 h-5", sidebarOpen && "mr-3")} />
                {sidebarOpen && <span>{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-border">
          {sidebarOpen ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2">
                <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-success-foreground">A</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">administrator</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full justify-center"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <p className="text-sm text-muted-foreground">
                Ministry of Tribal Affairs - Government of India
              </p>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-primary/5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;