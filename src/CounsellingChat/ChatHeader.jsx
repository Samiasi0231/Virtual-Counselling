
import React from 'react';
import { FiUser, FiUserX } from 'react-icons/fi';

const ChatHeader = ({ contextUser, chatSession, partner, user, toggleAnonymous }) => {
  return (
    <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
      {/* Partner avatar and name */}
      <div className="flex items-center gap-2">
        {contextUser?.user_type === 'student' && chatSession?.counselor_data?.avatar && (
          <img
            src={chatSession.counselor_data.avatar}
            alt="Counselor Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}
        <span className="font-semibold text-gray-700">{partner}</span>
      </div>

      {/* Dropdown & Toggle */}
      <div className="flex items-center gap-4 ml-auto">
        <select
          value={partner}
          onChange={() => {}}
          className="text-sm border p-1 rounded bg-white"
          disabled
        >
          <option value={partner}>{partner}</option>
        </select>

        {contextUser?.user_type === 'student' && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-700 flex items-center gap-1">
              {user.anonymous ? <FiUserX /> : <FiUser />}
              {user.anonymous ? 'Anonymous' : 'Visible'}
            </span>
            <div
              onClick={toggleAnonymous}
              className={`w-14 h-7 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
                user.anonymous ? 'bg-gray-600' : 'bg-purple-500'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  user.anonymous ? 'translate-x-0' : 'translate-x-7'
                }`}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;
