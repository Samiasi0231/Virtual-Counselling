import React from 'react';

export default function UpcomingEventsCard() {
  const now = new Date();


  const dummyMeetings = [
    {
      id: '1',
      title: 'Career Counseling',
      date: '2025-06-22',
      time: '10:00',
      url: 'https://meet.google.com/career-123',
    },
    {
      id: '2',
      title: 'Students welfare Meeting',
      date: '2025-10-20',
      time: '14:00',
      url: 'https://meet.google.com/parent-456',
    },
    {
      id: '3',
      title: 'Past Session (Won’t show)',
      date: '2025-08-10',
      time: '09:00',
      url: 'https://meet.google.com/expired-789',
    },
  ];


  const upcoming = dummyMeetings.filter(m => {
    const datetime = new Date(`${m.date}T${m.time}`);
    return datetime > now;
  });

  return (
     <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
 
      <h3 className=" p-4 text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3"> 🟣Upcoming Events</h3>

      {upcoming.length === 0 ? (
        <p className="text-gray-500 px-3 ">No upcoming meetings yet.</p>
      ) : (
        <ul className="space-y-4">
          {upcoming.map(event => (
            <li key={event.id} className="border rounded-lg p-3 bg-purple-50">
              <p className="font-medium text-purple-800">{event.title}</p>
              <p className="text-sm text-gray-600">
                📅 {event.date} ⏰ {event.time}
              </p>
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-purple-600 underline"
              >
                Join Meeting
              </a>
            </li>
          ))}
        </ul>
      )}
  
    </div>
  );
}
























// import React from "react";

// const events = [
//   {
//     id: 1,
//     title: "Coping with Exam Stress",
//     date: "June 15, 2025",
//     time: "4:00 PM",
//     type: "Webinar",
//   },
//   {
//     id: 2,
//     title: "Peer Group Support Session",
//     date: "June 18, 2025",
//     time: "2:30 PM",
//     type: "Group Session",
//   },
// ];

// const GroupEventPlanner = () => {
//   return (
//     <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//           🟢 Group Event Planner
//         </h2>
//         <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-800 transition">
//           + Create Event
//         </button>
//       </div>

//       {events.length === 0 ? (
//         <p className="text-gray-500">No upcoming events.</p>
//       ) : (
//         <ul className="space-y-4">
//           {events.map((event) => (
//             <li
//               key={event.id}
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition"
//             >
//               <div className="flex justify-between flex-wrap gap-2 mb-2">
//                 <div>
//                   <p className="font-medium text-gray-700">{event.title}</p>
//                   <p className="text-sm text-gray-500">
//                     {event.date} at {event.time} • {event.type}
//                   </p>
//                 </div>

//                 <div className="flex gap-2">
//                   <button className=" text-white px-3 py-1 rounded bg-purple-700 hover:bg-purple-800 transition text-sm">
//                     Join
//                   </button>
//                   <button className="border border-purple-700 text-purple-700 hover:bg-purple-200  px-3 py-1 rounded  transition text-sm">
//                     Edit
//                   </button>
//                   <button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-900 transition text-sm">
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };

// export default GroupEventPlanner;
