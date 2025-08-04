<<<<<<< HEAD
import React, { useState } from "react";
=======
import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
import { FiChevronRight } from "react-icons/fi";
import Avatar from 'react-avatar';
import getRelativeTime from "../utils/time";

<<<<<<< HEAD
const ChatSidepanel = ({
  onChatSelect,
  isStudent,
  activeChatId,
  unreadIds = [],
  chatRooms = [],
  getAnonymousForChat = () => false // ✅ new prop with default fallback
}) => {
=======
const ChatSidepanel = ({ onChatSelect, isStudent, activeChatId, unreadIds = [] }) => {
  const [recentChats, setRecentChats] = useState([]);
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
  const [searchTerm, setSearchTerm] = useState('');
  const [chatsOpen, setChatsOpen] = useState(true);
  const unreadSet = new Set(unreadIds);

<<<<<<< HEAD
  const filteredChats = chatRooms.filter((chat) => {
=======
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-chat-rooms/");
        setRecentChats(res.data || []);
      } catch (err) {
        console.error("Error fetching chat rooms:", err);
      }
    };

    fetchChatRooms();
  }, []);

  // ✅ Search filter
  const filteredChats = recentChats.filter((chat) => {
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
    const partner = isStudent ? chat.counselor_data : chat.user_data;
    const name = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

<<<<<<< HEAD
  const handleChatSelect = (chat) => {
    if (chat.item_id === activeChatId) return;
    onChatSelect(chat);
  };
=======
 
 const handleChatSelect = (chat) => {
  if (chat.item_id === activeChatId) return;
  onChatSelect(chat); 
};

>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2

  return (
    <aside className="w-full md:w-80 bg-white border-r p-4 space-y-4 h-full overflow-y-auto">
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full p-2 border rounded text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-violet-500">Previous Users</h2>
          <FiChevronRight className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`} />
        </button>

        {chatsOpen && (
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {filteredChats.length === 0 ? (
              <li className="p-2 text-gray-400">No previous chats</li>
            ) : (
              filteredChats.map((chat) => {
                const partner = isStudent ? chat.counselor_data : chat.user_data;
<<<<<<< HEAD
                const rawName = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`.trim();
                const isAnonymous = !isStudent && getAnonymousForChat(chat.item_id);
                const displayName = isAnonymous ? "Anonymous" : rawName || "Student";
=======
                const name = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`;
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
                const avatarUrl = partner?.profilePhoto?.best || partner?.profilePhoto || partner?.avatar || null;
                const timePreview = chat.last_message?.created_at
                  ? getRelativeTime(new Date(chat.last_message.created_at))
                  : '';
<<<<<<< HEAD

=======
            
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
                const unreadCount = (chat.messages || []).filter(msg => unreadSet.has(msg.item_id)).length;

                return (
                  <li
                    key={chat.item_id}
<<<<<<< HEAD
                    onClick={() => handleChatSelect(chat)}
=======
                  onClick={() => handleChatSelect(chat)}
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
                      activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <div className="shrink-0">
<<<<<<< HEAD
                      {isAnonymous ? (
                        <Avatar name="Anonymous" size="32" round />
                      ) : (
                        avatarUrl ? (
                          <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <Avatar name={displayName} size="32" round />
                        )
=======
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <Avatar name={name} size="32" round />
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
<<<<<<< HEAD
                        <div className="font-medium text-gray-800 truncate">{displayName}</div>
                        <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
                      </div>
                      {unreadCount > 0 && (
                        <div className="text-xs text-purple-600 mt-0.5">
                          {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
=======
                        <div className="font-medium text-gray-800 truncate">{name}</div>
                        <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
                      </div>
                     
                    </div>

                  
>>>>>>> 72b2643fe629700b5247f66e0a56deb333041fe2
                  </li>
                );
              })
            )}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ChatSidepanel;
