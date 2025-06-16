import React from "react";

const sessionNotes = [
  {
    id: 1,
    student: "Jane Doe",
    date: "June 12, 2025",
    summary:
      "Discussed progress on academic goals. Student expressed stress around upcoming exams.",
  },
  {
    id: 2,
    student: "John Smith",
    date: "June 11, 2025",
    summary:
      "Talked about family dynamics. Agreed to introduce journaling practice.",
  },
  {
    id: 3,
    student: "Grace Adams",
    date: "June 10, 2025",
    summary:
      "Student shared improved sleep habits. Reviewed self-care checklist together.",
  },
];

const RecentSessionNotes = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🟢 Recent Session Notes
      </h2>

      {sessionNotes.length === 0 ? (
        <p className="text-gray-500">No recent session notes available.</p>
      ) : (
        <ul className="space-y-4">
          {sessionNotes.map((note) => (
            <li
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-gray-700">{note.student}</p>
                <span className="text-sm text-gray-500">{note.date}</span>
              </div>
              <p className="text-gray-600 text-sm">{note.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentSessionNotes;
