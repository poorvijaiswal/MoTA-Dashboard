import Sidebar from "@/components/Sidebar"; // Update path if necessary
import holdersData from '@/data/holders.json';
const holders = holdersData.holders;

const getRecommendation = (schemes: string[]) => {
  if (schemes.includes("PM-KISAN") && schemes.includes("PMFBY")) return "Crop Insurance & Financial Literacy";
  if (schemes.includes("MGNREGA")) return "Suggest Skill Training";
  if (schemes.includes("PMAY-G")) return "Suggest Housing Upgrade";
  if (schemes.includes("Van Dhan Vikas Yojana")) return "Forest Produce Value Addition";
  return "No action";
};

const SchemeLayering = () => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar />
    <main className="flex-1 p-6 overflow-x-hidden">
      <h2 className="font-bold text-2xl mb-4 text-green-800">Scheme Layering & DSS Recommendations</h2>
      <div className="mb-4 text-gray-700">
        <span className="font-semibold">
          See which schemes are linked and what interventions are recommended for each patta holder.
        </span>
      </div>
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full text-sm bg-white">
          <thead className="bg-green-100 text-green-900 sticky top-0 z-10">
            <tr>
              <th className="py-2 px-2">Patta Holder</th>
              <th className="py-2 px-2">Eligible Schemes</th>
              <th className="py-2 px-2">Recommended Intervention</th>
            </tr>
          </thead>
          <tbody>
            {holders.map((h, idx) => (
              <tr
                key={h.id}
                className={
                  idx % 2 === 0
                    ? "bg-white hover:bg-green-50 transition"
                    : "bg-green-50 hover:bg-green-100 transition"
                }
              >
                <td className="py-2 px-2 font-semibold">{h.name}</td>
                <td className="py-2 px-2">
                  {h.schemes_linked.map(scheme => (
                    <span
                      key={scheme}
                      className="inline-block bg-green-200 text-green-900 rounded px-2 py-1 mr-1 mb-1 text-xs"
                    >
                      {scheme}
                    </span>
                  ))}
                </td>
                <td className="py-2 px-2">
                  <span className="inline-block bg-blue-100 text-blue-900 rounded px-2 py-1 text-xs font-semibold">
                    {getRecommendation(h.schemes_linked)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  </div>
);

export default SchemeLayering;
