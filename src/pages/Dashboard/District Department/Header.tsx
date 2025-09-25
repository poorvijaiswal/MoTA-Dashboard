import React, { useState, useRef, useEffect } from 'react';
import { 
  FaBell, 
  FaUser, 
  FaSignOutAlt, 
  FaChevronDown,
  FaHome,
  FaFileAlt,
  FaUsers,
  FaComments,
  FaChartBar,
  FaFileExport,
  FaCog,
  FaMap,
  FaClipboardCheck,
  FaBrain
} from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigationMenus = [
    {
      title: 'Dashboard',
      icon: FaHome,
      dropdown: [
        { title: 'Overview', href: '/dashboard/district', icon: FaHome },
        { title: 'Analytics', href: '/dashboard/district/analytics', icon: FaChartBar },
        { title: 'FRA Atlas', href: '/dashboard/district/fra-atlas', icon: FaMap },
      ]
    },
    {
      title: 'Data Ingestion',
      icon: FaFileExport,
      href: '/dashboard/district/data-ingestion',
    },
    {
      title: 'FRA Management',
      icon: FaFileAlt,
      dropdown: [
        { title: 'Claims Management', href: '/dashboard/district/claims', icon: FaFileAlt },
        { title: 'Field Verification', href: '/dashboard/district/verification', icon: FaMap },
        { title: 'Task Management', href: '/dashboard/district/tasks', icon: FaClipboardCheck }
      ]
    },
    {
      title: 'Beneficiaries',
      icon: FaUsers,
      href: '/dashboard/district/beneficiaries',
      dropdown: [
        { title: 'Patta Holders', href: '/dashboard/district/beneficiaries', icon: FaUsers },
        { title: 'Community Rights', href: '/dashboard/district/community', icon: FaUsers },
        { title: 'Individual Rights', href: '/dashboard/district/individual', icon: FaUser }
      ]
    },
    {
      title: 'Schemes',
      icon: FaFileExport,
      href: '/dashboard/district/schemes',
      dropdown: [
        { title: 'Active Schemes', href: '/dashboard/district/schemes', icon: FaFileExport },
        { title: 'Policy Management', href: '/dashboard/district/policies', icon: FaCog },
        { title: 'Budget Allocation', href: '/dashboard/district/budget', icon: FaChartBar }
      ]
    },
    {
      title: 'Support',
      icon: FaComments,
      dropdown: [
        { title: 'Complaints', href: '/dashboard/district/complaints', icon: FaComments },
        { title: 'DSS Recommendations', href: '/dashboard/district/dss', icon: FaBrain },
        { title: 'Help Center', href: '/dashboard/district/help', icon: FaComments }
      ]
    }
  ];

  const handleMenuClick = (menu) => {
    if (menu.dropdown) {
      setActiveDropdown(activeDropdown === menu.title ? null : menu.title);
    } else if (menu.href) {
      navigate(menu.href);
      setActiveDropdown(null);
    }
  };

  const handleDropdownClick = (item) => {
    navigate(item.href);
    setActiveDropdown(null);
  };

  const isActive = (href) => {
    if (!href) return false;
    if (href === '/dashboard/district') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  // For outclick detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setActiveDropdown(null);
      }
    }
    if (activeDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeDropdown]);

  return (
    <div className="relative shadow-lg border-b border-slate-200 bg-white">
      {/* Professional Modern Header */}
      <div className="relative bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo & Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight drop-shadow-sm">VanSampada District Portal</h1>
                <p className="text-xs text-slate-500 font-medium tracking-wide">Ministry of Tribal Affairs, Government of India</p>
              </div>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-6">
            <button className="flex items-center space-x-2 text-slate-600 hover:text-slate-900 transition-colors relative">
              <FaBell className="w-5 h-5" />
              <span className="text-sm font-medium">Notifications</span>
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow absolute -top-2 -right-6">3</span>
            </button>

            <div className="flex items-center space-x-2 bg-slate-100/80 px-3 py-2 rounded-xl shadow">
              <FaUser className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-semibold text-slate-800">District Officer</span>
            </div>

            <button 
              onClick={() => {
                localStorage.removeItem('auth');
                navigate('/');
              }}
              className="flex items-center space-x-2 text-slate-600 hover:text-red-500 transition-colors bg-red-100/80 px-3 py-2 rounded-xl shadow"
            >
              <FaSignOutAlt className="w-5 h-5" />
              <span className="text-sm font-semibold">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern Navigation Menu */}
      <div className="bg-white/90 border-b border-slate-200 shadow-sm backdrop-blur-md bg-blue-400">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex items-center space-x-4 relative">
            {navigationMenus.map((menu) => (
              <div key={menu.title} className="relative group" ref={activeDropdown === menu.title ? dropdownRef : null}>
                <button
                  type="button"
                  onClick={() => handleMenuClick(menu)}
                  className={`flex items-center space-x-2 px-5 py-3 text-base font-semibold rounded-xl transition-all duration-200 border-b-2 shadow-sm relative overflow-hidden backdrop-blur-sm
                    ${isActive(menu.href) || activeDropdown === menu.title
                      ? 'text-blue-700 border-blue-500 bg-slate-100 shadow scale-105'
                      : 'text-slate-600 border-transparent hover:text-blue-700 hover:bg-slate-100 hover:scale-[1.03]'}
                  `}
                >
                  <menu.icon className="w-5 h-5" />
                  <span>{menu.title}</span>
                  {menu.dropdown && (
                    <FaChevronDown 
                      className={`w-3 h-3 transition-transform duration-200 ml-1
                        ${activeDropdown === menu.title ? 'rotate-180' : ''}
                        `} 
                    />
                  )}
                  {/* Active indicator */}
                  {isActive(menu.href) || activeDropdown === menu.title ? (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                  ) : null}
                </button>

                {/* Dropdown Menu */}
                {menu.dropdown && activeDropdown === menu.title && (
                  <div className="absolute top-full left-0 w-64 bg-white/95 border border-slate-200 rounded-xl shadow-2xl z-50 py-2 mt-2 backdrop-blur-md">
                    {menu.dropdown.map((item) => (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => handleDropdownClick(item)}
                        className={`flex items-center space-x-3 px-4 py-3 text-sm w-full text-left rounded-lg transition-colors font-medium
                          ${isActive(item.href)
                            ? 'text-blue-700 bg-slate-100 border-l-4 border-blue-500 shadow'
                            : 'text-slate-700 hover:text-blue-700 hover:bg-slate-100'}
                        `}
                      >
                        <item.icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
