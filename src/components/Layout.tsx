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
      {/* Modern Sidebar */}
      <aside className={cn(
        "bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700/50 shadow-2xl transition-all duration-300 flex flex-col relative overflow-hidden",
        sidebarOpen ? "w-72" : "w-16"
      )}>
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-emerald-500/20 via-transparent to-blue-500/20"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-blue-400/10 rounded-full blur-xl"></div>
        </div>

        {/* Header */}
        <div className="relative p-6 border-b border-slate-700/50 backdrop-blur-sm">
          <div className={cn(
            "flex items-center transition-all duration-300",
            sidebarOpen ? "space-x-4" : "justify-center"
          )}>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg border-0 transition-all duration-200 hover:scale-105"
              >
                <Menu className="w-5 h-5" />
              </Button>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            {sidebarOpen && (
              <div className="flex flex-col">
                <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  VanSampada
                </h2>
                <p className="text-xs text-slate-400 font-medium tracking-wide">Forest Rights Atlas & DSS</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 relative">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.path} className="relative group">
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 rounded-xl transition-all duration-200 border-0 relative overflow-hidden",
                    !sidebarOpen && "justify-center px-2",
                    isActive 
                      ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 shadow-lg border border-emerald-500/30" 
                      : "text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-[1.02]"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-400 rounded-r-full"></div>
                  )}
                  
                  {/* Icon with glow effect */}
                  <div className={cn(
                    "relative flex items-center justify-center",
                    isActive && "drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5 transition-transform duration-200",
                      sidebarOpen && "mr-3",
                      isActive && "scale-110"
                    )} />
                  </div>
                  
                  {sidebarOpen && (
                    <span className={cn(
                      "font-medium transition-all duration-200",
                      isActive ? "text-emerald-200" : "group-hover:text-white"
                    )}>
                      {item.label}
                    </span>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 transition-all duration-200 rounded-xl"></div>
                </Button>

                {/* Tooltip for collapsed state */}
                {!sidebarOpen && (
                  <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-slate-800 text-slate-200 px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 border border-slate-600 shadow-xl">
                    {item.label}
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 border-l border-b border-slate-600 rotate-45"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User section */}
        <div className="relative p-4 border-t border-slate-700/50 backdrop-blur-sm">
          {sidebarOpen ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-white">A</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-800"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white">Admin User</p>
                  <p className="text-xs text-slate-400">System Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg mx-auto relative">
                <span className="text-sm font-bold text-white">A</span>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-slate-800"></div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center rounded-xl bg-red-500/10 text-red-300 border border-red-500/30 hover:bg-red-500/20 hover:text-red-200 transition-all duration-200"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">        

        {/* Page content */}
        <main className="flex-1 p-6 bg-gradient-to-br from-background via-background to-primary/5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;