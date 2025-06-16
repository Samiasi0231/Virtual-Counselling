import React from "react";

const appointments = [
  {
    id: 1,
    student: "Jane Doe",
    time: "10:30 AM",
    method: "Video Call",
  },
  {
    id: 2,
    student: "John Smith",
    time: "1:00 PM",
    method: "Chat",
  },
  {
    id: 3,
    student: "Grace Adams",
    time: "3:15 PM",
    method: "In-Person",
  },
];

const TodaysAppointments = () => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        🟢 Today's Appointments
      </h2>

      {appointments.length === 0 ? (
        <p className="text-gray-500">No appointments scheduled for today.</p>
      ) : (
        <ul className="space-y-4">
          {appointments.map((appointment) => (
            <li
              key={appointment.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-700">
                  Student: <span className="text-black">{appointment.student}</span>
                </p>
                <p className="text-sm text-gray-500">
                  Time: {appointment.time} | Method: {appointment.method}
                </p>
              </div>

              <div className="flex gap-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                  Join
                </button>
                <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                  Reschedule
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaysAppointments;
