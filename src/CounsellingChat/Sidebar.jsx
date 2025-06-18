// Sidebar.jsx
import React from 'react';
import { FiBell, FiMessageCircle, FiUsers,FiCalendar,FiVideo} from 'react-icons/fi';
// Utility to get initials from name


const Sidebar = ({ partners, currentPartner, onSelectPartner }) => {
  return (
    <aside className="flex flex-col w- bg-[#7b30a7] text-gray-300">
     
      <nav className="flex  flex-col flex-grow overflow-auto">
         <div
    title="Activity"
    className="px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
    style={{ color: '#6264A7' }}
  >
    <FiBell size={28} />
     <span className='text-white  text-xs'>Activity</span>
  </div>

   <div
    title="Chat"
    className="px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
    style={{ color: '#6264A7' }}
  >
    <FiMessageCircle size={28} />
     <span className='text-white items-center text-xs'>Chat</span>
  </div>
    <div
    title="List of Users"
    className="px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
    style={{ color: '#6264A7' }}
  >
 
    <FiUsers size={28} />
     <span className='text-white items-center text-xs'> List of users</span>
  </div>
  <div
    title="Google Meet"
    className="px-6 mt-6 rounded-lg cursor-pointer  hover:bg-purple-100"
     style={{ color: '#6264A7' }}
    
  >
    <FiVideo size={28} />
    <span className='text-white  text-xs'> Google meet</span>
  </div>
    <div
    title="Calendar"
    className="px-6 mt-6 rounded-lg cursor-pointer hover:bg-purple-100"
    style={{ color: '#6264A7' }}
  >
    <FiCalendar size={28} />
     <span className='text-white  text-xs'> Calendar</span>
  </div>
      </nav>

      <div className="h-16 flex items-center justify-center border-t border-gray-700 text-sm text-gray-500">
        © Your App 2025
      </div>
    </aside>
  );
};

export default Sidebar;
