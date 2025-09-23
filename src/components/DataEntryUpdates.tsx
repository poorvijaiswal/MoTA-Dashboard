import { useState } from "react";

const DataEntryUpdates = () => {
  const [holder, setHolder] = useState("");
  const [claimId, setClaimId] = useState("");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div>
      <h2 className="text-2xl font-bold text-green-800 mb-4">Data Entry & Updates</h2>

      {/* Form */}
      <form className="bg-white rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Patta Holder Name
          </label>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Claim ID
          </label>
          <input
            value={claimId}
            onChange={(e) => setClaimId(e.target.value)}
            className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-green-400"
            placeholder="Enter claim ID"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700">
            Upload Document / Shapefile
          </label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Save Entry
        </button>
      </form>
    </div>
  );
};

export default DataEntryUpdates;
