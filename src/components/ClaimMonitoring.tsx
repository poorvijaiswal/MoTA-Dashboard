const ClaimMonitoring = () => {
  // Sample stats
  const stats = [
    { label: "Total Claims", value: 452, color: "bg-blue-100 text-blue-800" },
    { label: "Approved", value: 312, color: "bg-green-100 text-green-800" },
    { label: "Pending", value: 90, color: "bg-yellow-100 text-yellow-800" },
    { label: "Rejected", value: 50, color: "bg-red-100 text-red-800" },
  ];

  const timeline = [
    { step: "Submitted", date: "2025-01-10", holder: "Raman Munda" },
    { step: "Verified", date: "2025-01-15", holder: "Raman Munda" },
    { step: "Approved", date: "2025-01-20", holder: "Raman Munda" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-4">FRA Claims Monitoring</h2>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl shadow hover:shadow-lg transition ${s.color}`}
          >
            <p className="text-lg font-semibold">{s.value}</p>
            <p className="text-sm">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timeline Example */}
      <div className="bg-gray-50 rounded-lg p-4 shadow">
        <h3 className="font-semibold text-green-700 mb-2">Recent Claim Progress</h3>
        <ul className="space-y-3">
          {timeline.map((t, idx) => (
            <li key={idx} className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-3"></div>
              <p className="text-sm">
                <span className="font-semibold">{t.holder}</span> – {t.step} on{" "}
                <span className="text-gray-600">{t.date}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ClaimMonitoring;
