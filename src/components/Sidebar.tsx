import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Map, Layers, BarChart2, MessageSquare, UserCog, Menu } from "lucide-react";

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-gradient-to-b from-green-100 to-green-300 shadow-lg transition-all duration-300 
        ${isCollapsed ? "w-20" : "w-64"} flex flex-col`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-4 text-green-800 hover:text-green-900 focus:outline-none"
        >
          <Menu size={20} />
        </button>

        {/* Title */}
        {!isCollapsed && (
          <h2 className="text-xl font-bold mb-6 text-green-900 px-6">
            District Dashboard
          </h2>
        )}

        {/* Menu Items */}
        <ul className="flex-1 space-y-4 px-4">
          <li>
            <NavLink to="/" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <Home size={20} />
              {!isCollapsed && <span>Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/holders" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <Users size={20} />
              {!isCollapsed && <span>Patta Holders</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/gis" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <Map size={20} />
              {!isCollapsed && <span>GIS Mapping</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/schemes" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <Layers size={20} />
              {!isCollapsed && <span>Schemes & DSS</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/analytics" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <BarChart2 size={20} />
              {!isCollapsed && <span>Analytics</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/feedback" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <MessageSquare size={20} />
              {!isCollapsed && <span>Feedback</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/users" className="flex items-center space-x-3 text-green-800 hover:font-bold">
              <UserCog size={20} />
              {!isCollapsed && <span>User Management</span>}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? "ml-20" : "ml-64"
        }`}
      >
      </div>
    </div>
  );
};

export default Sidebar;
