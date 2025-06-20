import React from 'react';
import { FiSearch } from 'react-icons/fi';

const activities = [
  { id: 1, name: 'Counselor Jane', avatar: '/avatars/jane.png', lastMsg: 'Ready when you are ', time: '9:12 AM', unread: 2, online: true },
  { id: 2, name: 'Peer1 Alex', avatar: '/avatars/alex.png', lastMsg: 'Can we reschedule?', time: 'Yesterday', unread: 0, online: false },
  { id: 3, name: 'Peer2 Sam', avatar: '/avatars/sam.png', lastMsg: 'Thanks for the help!', time: 'Mon', unread: 1, online: true },
];

const ActivityPage = () => {
  return (
    <div className="h-full flex flex-col bg-white shadow overflow-hidden">
      {/* Search bar */}
      <div className="p-4 border-b flex items-center gap-2">
        <FiSearch size={20} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search"
          className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      {/* Activity list */}
      <ul className="flex-1 overflow-y-auto">
        {activities.map((act) => (
          <li key={act.id}>
            <button className="w-full text-left flex items-center gap-4 px-4 py-3 hover:bg-gray-100 transition">
              <div className="relative">
                <img
                  src={act.avatar}
                  alt={act.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                {act.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">{act.name}</span>
                  <span className="text-xs text-gray-500">{act.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600 truncate">{act.lastMsg}</p>
                  {act.unread > 0 && (
                    <span className="ml-2 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {act.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityPage;
