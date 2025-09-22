import { useState } from "react";
import Sidebar from "@/components/Sidebar"; // Adjust path if necessary

const feedbacks = [
  { id: 1, holder: "Raman Munda", feedback: "Boundary issue", status: "Open" },
  { id: 2, holder: "Sunita Oraon", feedback: "Scheme not received", status: "Resolved" },
];

const FeedbackGrievance = () => {
  const [holder, setHolder] = useState("");
  const [feedback, setFeedback] = useState("");

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-6 overflow-x-hidden">
        <h2 className="font-bold text-2xl mb-6 text-green-800">Feedback & Grievance</h2>

        {/* Form Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 hover:shadow-2xl transition-shadow duration-300 max-w-3xl">
          <form className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1">Patta Holder Name</label>
              <input
                value={holder}
                onChange={e => setHolder(e.target.value)}
                placeholder="Enter name"
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1">Feedback / Grievance</label>
              <textarea
                value={feedback}
                onChange={e => setFeedback(e.target.value)}
                placeholder="Enter your feedback or grievance"
                className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-green-400 transition resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Feedback List */}
        <div className="bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300 max-w-3xl">
          <h3 className="font-semibold mb-4 text-green-700">Recent Feedbacks</h3>
          <ul className="space-y-3">
            {feedbacks.map(f => (
              <li
                key={f.id}
                className="p-3 border-l-4 rounded-lg border-gray-200 flex justify-between items-center hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-semibold">{f.holder}</p>
                  <p className="text-gray-700">{f.feedback}</p>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    f.status === "Open" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default FeedbackGrievance;
