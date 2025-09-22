import { useState } from "react";
const feedbacks = [
  { id: 1, holder: "Raman Munda", feedback: "Boundary issue", status: "Open" },
  { id: 2, holder: "Sunita Oraon", feedback: "Scheme not received", status: "Resolved" },
];

const FeedbackGrievance = () => {
  const [holder, setHolder] = useState("");
  const [feedback, setFeedback] = useState("");

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl mb-4">Feedback & Grievance</h2>
      <form className="space-y-2">
        <input value={holder} onChange={e => setHolder(e.target.value)} placeholder="Patta Holder Name" className="border p-1 rounded w-full" />
        <textarea value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="Feedback/Grievance" className="border p-1 rounded w-full" />
        <button type="submit" className="px-3 py-1 bg-red-600 text-white rounded">Submit</button>
      </form>
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Recent Feedbacks</h3>
        <ul>
          {feedbacks.map(f => (
            <li key={f.id} className="mb-1">
              <b>{f.holder}:</b> {f.feedback} <span className={`text-xs ml-2 ${f.status === "Open" ? "text-red-600" : "text-green-600"}`}>{f.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FeedbackGrievance;