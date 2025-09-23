import { useState } from "react";

import holdersData from '@/data/holders.json';

const PattaHoldersRegistry = () => {
  const [search, setSearch] = useState("");
  const [tribe, setTribe] = useState("all");
  const [gender, setGender] = useState("all");
  const [selectedHolder, setSelectedHolder] = useState<any>(null);

  const holders = holdersData.holders;

  const filteredHolders = holders.filter(h =>
    (tribe === "all" || h.tribe === tribe) &&
    (gender === "all" || h.gender === gender) &&
    (h.name?.toLowerCase().includes(search.toLowerCase()) ||
      h.claim_id?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
  
      <main className="flex-1  p-6 space-y-4">
        {/* Title */}
        <div>
          <h2 className="font-bold text-2xl mb-2 text-green-800">Patta Holders Registry</h2>
          <p className="text-gray-600">Search, filter and view detailed patta holder records</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by name or claim ID"
            className="border p-2 rounded-lg w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          <select
            value={tribe}
            onChange={e => setTribe(e.target.value)}
            className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="all">All Tribes</option>
            {[...new Set(holders.map(h => h.tribe))].filter(Boolean).map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <select
            value={gender}
            onChange={e => setGender(e.target.value)}
            className="border p-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-100 text-green-900">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Tribe</th>
                <th className="py-3 px-4 text-left">Gender</th>
                <th className="py-3 px-4 text-left">Claim ID</th>
                <th className="py-3 px-4 text-left">Land Size</th>
                <th className="py-3 px-4 text-left">Schemes</th>
                <th className="py-3 px-4 text-left">Contact</th>
                <th className="py-3 px-4 text-center">Profile</th>
              </tr>
            </thead>
            <tbody>
              {filteredHolders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-gray-500">
                    No patta holders found.
                  </td>
                </tr>
              ) : (
                filteredHolders.map((h, idx) => (
                  <tr
                    key={h.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-green-50 transition`}
                  >
                    <td className="py-3 px-4 font-semibold">{h.name}</td>
                    <td className="py-3 px-4">{h.tribe}</td>
                    <td className="py-3 px-4">{h.gender}</td>
                    <td className="py-3 px-4">{h.claim_id}</td>
                    <td className="py-3 px-4">{h.land_size}</td>
                    <td className="py-3 px-4">{h.schemes_linked?.join(", ")}</td>
                    <td className="py-3 px-4">{h.contact}</td>
                    <td className="py-3 px-4 text-center">
                      <button
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 transition"
                        onClick={() => setSelectedHolder(h)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {selectedHolder && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="font-bold text-xl mb-4 text-green-700">{selectedHolder.name}</h3>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><span className="font-semibold">Tribe:</span> {selectedHolder.tribe}</p>
                <p><span className="font-semibold">Gender:</span> {selectedHolder.gender}</p>
                <p><span className="font-semibold">Claim ID:</span> {selectedHolder.claim_id}</p>
                <p><span className="font-semibold">Land Size:</span> {selectedHolder.land_size}</p>
                <p><span className="font-semibold">Schemes Linked:</span> {selectedHolder.schemes_linked?.join(", ")}</p>
                <p><span className="font-semibold">Contact:</span> {selectedHolder.contact}</p>
                <p><span className="font-semibold">Family Members:</span> {selectedHolder.family_members}</p>
                <p><span className="font-semibold">Annual Income:</span> ₹{selectedHolder.annual_income}</p>
                <p><span className="font-semibold">Occupation:</span> {selectedHolder.occupation}</p>
              </div>
              <button
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition w-full"
                onClick={() => setSelectedHolder(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PattaHoldersRegistry;
