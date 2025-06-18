// import React from 'react';
// import { Link } from 'react-router-dom';
// import LineChart from '../../charts/LineChart01';
// import { chartAreaGradient } from '../../charts/ChartjsConfig';
// import EditMenu from '../../components/DropdownEditMenu';

// // Import utilities
// import { adjustColorOpacity, getCssVariable } from '../../utils/Utils';

// function DashboardCard05() {



//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="px-5 pt-5">
//         <header className="flex justify-between items-start mb-2">
//           <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">All users</h2>
//         </header>
//              <div className="flex flex-col items-center justify-center w-24 h-24 border rounded shadow bg-white">
//     <h3 className="text-sm text-gray-700">All User</h3>
//     <h1 className="text-2xl font-bold text-blue-600">300</h1>
//   </div>
//       </div>
//     </div>
//   );
// }

// export default DashboardCard05;
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
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          🟢 Group Event Planner
        </h2>
        <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
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
                  <button className=" text-white px-3 py-1 rounded bg-purple-700 hover:bg-purple-800 transition text-sm">
                    Join
                  </button>
                  <button className="border border-purple-700 text-purple-700 hover:bg-purple-200  px-3 py-1 rounded  transition text-sm">
                    Edit
                  </button>
                  <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-900 transition text-sm">
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
