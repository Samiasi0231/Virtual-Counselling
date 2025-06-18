// Sidebar.jsx
import React from 'react';
import { FiBell, FiMessageCircle, FiUsers,FiCalendar,FiVideo} from 'react-icons/fi';
// Utility to get initials from name


const Sidebar = ({ partners, currentPartner, onSelectPartner }) => {
  return (
    <aside className="flex flex-col w- bg-[#7b30a7] text-gray-300">
     
      <nav className="flex mt-6 flex-col flex-grow overflow-auto">
         <div
    title="Activity"
    className="flex flex-col items-center px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
    style={{ color: '#6264A7' }}
  >
    <FiBell size={28} />
       <span className="text-xs mt-1 font-medium text-[#6264A7]">Chat</span>
  </div>

<div
  title="Chat"
  className="flex flex-col items-center px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
  style={{ color: '#6264A7' }}
>
  <FiMessageCircle size={28} />
  <span className="text-xs mt-1 font-medium text-[#6264A7]">Chat</span>
</div>

 <div
  title="List of Users"
  className="flex flex-col items-center px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
  style={{ color: '#6264A7' }}
>
  <FiUsers size={28} />
  <span className="text-xs mt-1 font-medium text-[#6264A7]">List of Users</span>
</div>

 <div
  title="Google Meet"
  className="flex flex-col items-center px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
  style={{ color: '#6264A7' }}
>
  <FiVideo size={28} />
  <span className="text-xs mt-1 font-medium text-[#6264A7]">Google Meet</span>
</div>

 <div
  title="Calendar"
  className="flex flex-col items-center px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
  style={{ color: '#6264A7' }}
>
  <FiCalendar size={24} />
  <span className="text-sm font-medium mt-1">Calendar</span>
</div>


      </nav>

      <div className="h-16 flex items-center justify-center border-t border-gray-700 text-sm text-gray-500">
        © Your App 2025
      </div>
    </aside>
  );
};

export default Sidebar;
