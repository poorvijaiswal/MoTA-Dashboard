
import { FaUserShield, FaUsers, FaLock, FaClipboardList } from "react-icons/fa";

const roles = [
  { role: "District Official", description: "Full access to district-level data and reports.", icon: <FaUserShield className="text-green-600 w-6 h-6" /> },
  { role: "Block Official", description: "Access to block-level holders, claims, and analytics.", icon: <FaUsers className="text-blue-500 w-6 h-6" /> },
  { role: "Village Official", description: "Access to village-level holders and claim submissions.", icon: <FaLock className="text-yellow-500 w-6 h-6" /> },
];

const auditLogs = [
  { action: "User Login", user: "Raman Munda", time: "2025-09-22 10:23 AM" },
  { action: "Claim Approved", user: "Sunita Oraon", time: "2025-09-21 04:15 PM" },
  { action: "Feedback Submitted", user: "Birsa Khalkho", time: "2025-09-20 02:45 PM" },
];

const UserManagement = () => (
  <div className="flex min-h-screen bg-gray-50">
  
    <main className="flex-1 p-6 space-y-8 overflow-x-hidden">
      <h2 className="font-bold text-3xl text-green-800 mb-6">User Management & Security</h2>
      <p className="text-gray-700 mb-6">
        Manage system users with role-based access and monitor actions via audit logs. Ensure sensitive data is protected with secure authentication and proper permissions.
      </p>

      {/* Roles Section */}
      <div>
        <h3 className="font-semibold text-xl mb-4 text-green-700">Roles & Permissions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((r, idx) => (
            <div key={idx} className="bg-white shadow-lg rounded-xl p-5 hover:shadow-2xl transition-all duration-300 flex items-start gap-4">
              <div className="flex-shrink-0">{r.icon}</div>
              <div>
                <h4 className="font-semibold text-lg">{r.role}</h4>
                <p className="text-gray-600 text-sm mt-1">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Logs Section */}
      <div>
        <h3 className="font-semibold text-xl mb-4 text-green-700">Recent Audit Logs</h3>
        <div className="bg-white shadow-lg rounded-xl overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {auditLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-gray-700">{log.action}</td>
                  <td className="px-4 py-2 text-gray-700">{log.user}</td>
                  <td className="px-4 py-2 text-gray-500 text-sm">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Tips Section */}
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-lg">
        <h3 className="font-semibold text-lg text-green-800 mb-2 flex items-center gap-2">
          <FaClipboardList /> Security Best Practices
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Use strong, unique passwords for all user accounts.</li>
          <li>Enable two-factor authentication for district-level accounts.</li>
          <li>Regularly review user permissions and roles.</li>
          <li>Monitor audit logs for unusual or suspicious activity.</li>
          <li>Ensure sensitive data is encrypted in transit and at rest.</li>
        </ul>
      </div>
    </main>
  </div>
);

export default UserManagement;
