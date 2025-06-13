import React from 'react';

const UpcomingSession = () => {
  const session = {
    counselorName: 'Dr. Amanda Blake',
    date: 'June 20, 2025',
    time: '3:00 PM',
    location: 'Zoom',
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-purple-800">
          🟣 Upcoming Session
        </h2>
        <span className="text-sm text-gray-500">#{'STU-3021'}</span>
      </div>

      <div className="space-y-2 text-sm text-gray-700">
        <p>
          <span className="font-medium">Counselor:</span> {session.counselorName}
        </p>
        <p>
          <span className="font-medium">Date:</span> {session.date}
        </p>
        <p>
          <span className="font-medium">Time:</span> {session.time}
        </p>
        <p>
          <span className="font-medium">Platform:</span> {session.location}
        </p>
      </div>

      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded text-sm font-medium transition">
          Join Session
        </button>
        <button className="flex-1 border border-purple-700 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded text-sm font-medium transition">
          Reschedule
        </button>
      </div>
    </div>
  );
};

export default UpcomingSession;
