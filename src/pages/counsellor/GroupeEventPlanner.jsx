import React from "react";

const events = [
  {
    id: 1,
    title: "Coping with Exam Stress",
    date: "June 15, 2025",
    time: "4:00 PM",
    type: "Webinar",
  },
  {
    id: 2,
    title: "Peer Group Support Session",
    date: "June 18, 2025",
    time: "2:30 PM",
    type: "Group Session",
  },
];

const GroupEventPlanner = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🟢 Group Event Planner
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          + Create Event
        </button>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500">No upcoming events.</p>
      ) : (
        <ul className="space-y-4">
          {events.map((event) => (
            <li
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
            >
              <div className="flex justify-between flex-wrap gap-2 mb-2">
                <div>
                  <p className="font-medium text-gray-700">{event.title}</p>
                  <p className="text-sm text-gray-500">
                    {event.date} at {event.time} • {event.type}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition text-sm">
                    Join
                  </button>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition text-sm">
                    Edit
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupEventPlanner;
