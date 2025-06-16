
// // Import utilities
// import { getCssVariable } from '../../utils/Utils';

// function DashboardCard04() {


//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Appointment</h2>
//         </header>
//    <div className=" p-4 mb-3 flex flex-col gap-3">
//   {/* Achieved */}
//   <div className="flex justify-between items-center">
//     <h3 className="text-sm text-gray-600 font-medium">Achieved</h3>
//     <span className="text-lg font-semibold text-green-600">25</span>
//   </div>

//   {/* Upcoming Session */}
//   <div className="text-sm text-gray-700">
//     <h3 className="font-medium">Upcoming</h3>
//     <p className="mt-1">🕒 <span className="font-semibold">3:00 PM</span></p>
//     <p>📅 <span className="font-semibold">12th June 2025</span></p>
//   </div>
// </div>

//       </div>
//     </div>
//   );
// }

// export default DashboardCard04;
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
  <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
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