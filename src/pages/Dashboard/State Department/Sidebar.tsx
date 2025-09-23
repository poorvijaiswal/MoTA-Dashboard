import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  MessageSquare, 
  BarChart3, 
  FileOutput, 
//   Settings, 
  Search,
  TreePine
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Dashboard',
    href: '/dashboard/state',
    icon: LayoutDashboard,
  },
  {
    title: 'Schemes',
    href: '/dashboard/state/schemes', 
    icon: FileText,
  },
  {
    title: 'Beneficiaries',
    href: '/dashboard/state/beneficiaries',
    icon: Users,
  },
  {
    title: 'Complaints',
    href: '/dashboard/state/complaints',
    icon: MessageSquare,
  },
  {
    title: 'DSS Analytics',
    href: '/dashboard/state/dss',
    icon: BarChart3,
  },
  {
    title: 'Analytics & Reports',
    href: '/dashboard/state/reports', 
    icon: FileOutput,
  },
//   {
//     title: 'Settings',
//     href: '/dashboard/state/settings',
//     icon: Settings,
//   },
];

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === '/dashboard/state') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-card border-r border-border h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-input-border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Main Menu
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.title}
              </NavLink>
            );
          })}
        </div>

        {/* Forest Rights Info */}
        <div className="mt-8 p-3 bg-secondary/10 rounded-lg border border-secondary/20">
          <div className="flex items-center text-secondary mb-2">
            <TreePine className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Forest Rights Act 2006</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Ensuring tribal communities' rights over forest lands and resources.
          </p>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;