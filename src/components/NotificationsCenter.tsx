const notifications = [
  { id: 1, type: "Reminder", message: "12 claims pending verification", date: "2025-09-20" },
  { id: 2, type: "Alert", message: "5 documents expiring soon", date: "2025-09-18" },
  { id: 3, type: "Update", message: "New scheme added: Jal Jeevan Mission", date: "2025-09-15" },
];

const NotificationsCenter = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Alerts & Notifications</h2>

      <div className="bg-white rounded-xl shadow p-4">
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n.id}
              className="p-3 border-l-4 border-green-500 bg-gray-50 rounded-lg shadow-sm"
            >
              <p className="font-semibold text-green-700">{n.type}</p>
              <p className="text-gray-700 text-sm">{n.message}</p>
              <p className="text-xs text-gray-500">{n.date}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default NotificationsCenter;
