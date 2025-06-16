import React from "react";

const moodLogs = [
  {
    id: 1,
    student: "Jane Doe",
    date: "June 14, 2025",
    mood: "😊 Happy",
    note: "Feeling excited about finishing my assignment early.",
  },
  {
    id: 2,
    student: "John Smith",
    date: "June 14, 2025",
    mood: "😐 Neutral",
    note: "Just another normal day.",
  },
  {
    id: 3,
    student: "Grace Adams",
    date: "June 14, 2025",
    mood: "😢 Sad",
    note: "Had an argument with a friend this morning.",
  },
];

const StudentMoodLogs = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🟢 Student Mood Logs
      </h2>

      {moodLogs.length === 0 ? (
        <p className="text-gray-500">No mood logs submitted today.</p>
      ) : (
        <ul className="space-y-4">
          {moodLogs.map((log) => (
            <li
              key={log.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-gray-700">{log.student}</p>
                <span className="text-sm text-gray-500">{log.date}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{log.mood}</span>
              </div>
              <p className="text-gray-600 text-sm">{log.note}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StudentMoodLogs;
