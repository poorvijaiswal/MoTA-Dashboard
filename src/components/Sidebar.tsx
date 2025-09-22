import { NavLink } from "react-router-dom";

const Sidebar = () => (
  <nav className="w-64 min-h-screen bg-gradient-to-b from-green-100 to-green-300 p-6 shadow-lg">
    <h2 className="text-xl font-bold mb-6 text-green-900">District Dashboard</h2>
    <ul className="space-y-4">
      <li><NavLink to="/dashboard" className="text-green-800 hover:font-bold">Home</NavLink></li>
      <li><NavLink to="/holders" className="text-green-800 hover:font-bold">Patta Holders</NavLink></li>
      <li><NavLink to="/gis" className="text-green-800 hover:font-bold">GIS Mapping</NavLink></li>
      <li><NavLink to="/schemes" className="text-green-800 hover:font-bold">Schemes & DSS</NavLink></li>
      <li><NavLink to="/analytics" className="text-green-800 hover:font-bold">Analytics</NavLink></li>
      <li><NavLink to="/feedback" className="text-green-800 hover:font-bold">Feedback</NavLink></li>
      <li><NavLink to="/users" className="text-green-800 hover:font-bold">User Management</NavLink></li>
    </ul>
  </nav>
);

export default Sidebar;