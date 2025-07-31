








import React, { useEffect, useState } from 'react';
import axiosClient from '../../utils/axios-client-analytics';

const UpcomingEventsCard = () => {
  const [upcomingMeetings, setUpcomingMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const page = 0;
        const isPast = false;

        const res = await axiosClient.get(`/vpc/get-user-meetings/${page}/${isPast}/`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const now = new Date();

        const meetings = Array.isArray(res.data?.results) ? res.data.results : res.data || [];

        const formatted = meetings
          .map((link) => {
            const dateObj = new Date(link.date_and_time);
            return {
              id: link.id || link._id,
              title: link.title,
              url: link.link,
              datetime: dateObj,
              date: dateObj.toISOString().split("T")[0],
              time: dateObj.toTimeString().slice(0, 5),
            };
          })
          .filter(m => m.datetime > now)
          .sort((a, b) => a.datetime - b.datetime)
          .slice(0, 3); 

        setUpcomingMeetings(formatted);
      } catch (err) {
        console.error("Error fetching upcoming meetings:", err);
      }
    };

    fetchMeetings();
  }, []);

  const getCountdown = (datetime) => {
    const now = new Date();
    const diff = datetime.getTime() - now.getTime();
    if (diff <= 0) return 'Now';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);

    return `${days > 0 ? `${days}d ` : ''}${hrs}h ${mins}m`;
  };

  return (
    <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
      <div className="px-5 pt-5">
       <header className="flex justify-between items-start mb-2">
        <h2 className="text-base font-serif sm:text-lg font-light text-gray-500 dark:text-gray-100 mb-2">
        🟣 Upcoming Events
      </h2>
</header>
      {upcomingMeetings.length === 0 ? (
        <p className="text-gray-500 px-3">No upcoming meetings yet.</p>
      ) : (
        <ul className="space-y-4">
          {upcomingMeetings.map(event => (
            <li key={event.id} className="border rounded-lg p-3 bg-purple-50">
              <p className="font-medium text-purple-800">{event.title}</p>
              <p className="text-sm text-gray-600">
                📅 {event.date} ⏰ {event.time}
              </p>
              <p className="text-sm text-blue-700 font-semibold">
                ⏳ Starts in: {getCountdown(event.datetime)}
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
    </div>
  );
};

export default UpcomingEventsCard;
















// import React from 'react';

// export default function UpcomingEventsCard() {
//   const now = new Date();


//   const dummyMeetings = [
//     {
//       id: '1',
//       title: 'Career Counseling',
//       date: '2025-06-22',
//       time: '10:00',
//       url: 'https://meet.google.com/career-123',
//     },
//     {
//       id: '2',
//       title: 'Students welfare Meeting',
//       date: '2025-10-20',
//       time: '14:00',
//       url: 'https://meet.google.com/parent-456',
//     },
//     {
//       id: '3',
//       title: 'Past Session (Won’t show)',
//       date: '2025-08-10',
//       time: '09:00',
//       url: 'https://meet.google.com/expired-789',
//     },
//   ];


//   const upcoming = dummyMeetings.filter(m => {
//     const datetime = new Date(`${m.date}T${m.time}`);
//     return datetime > now;
//   });

//   return (
//      <div className="flex p-4 flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-gray-800 shadow-xs rounded-xl">
 
//       <h3 className=" p-4 text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3"> 🟣Upcoming Events</h3>

//       {upcoming.length === 0 ? (
//         <p className="text-gray-500 px-3 ">No upcoming meetings yet.</p>
//       ) : (
//         <ul className="space-y-4">
//           {upcoming.map(event => (
//             <li key={event.id} className="border rounded-lg p-3 bg-purple-50">
//               <p className="font-medium text-purple-800">{event.title}</p>
//               <p className="text-sm text-gray-600">
//                 📅 {event.date} ⏰ {event.time}
//               </p>
//               <a
//                 href={event.url}
//                 target="_blank"
//                 rel="noreferrer"
//                 className="text-sm text-purple-600 underline"
//               >
//                 Join Meeting
//               </a>
//             </li>
//           ))}
//         </ul>
//       )}
  
//     </div>
//   );
// }





















