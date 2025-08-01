import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
import { FiChevronRight } from "react-icons/fi";
import Avatar from 'react-avatar';
import getRelativeTime from "../utils/time";

const ChatSidepanel = ({ onChatSelect, isStudent, activeChatId, unreadIds = [] }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatsOpen, setChatsOpen] = useState(true);
  const unreadSet = new Set(unreadIds);

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
    const partner = isStudent ? chat.counselor_data : chat.user_data;
    const name = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`;
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

 
 const handleChatSelect = (chat) => {
  if (chat.item_id === activeChatId) return;
  onChatSelect(chat); 
};


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
                const name = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`;
                const avatarUrl = partner?.profilePhoto?.best || partner?.profilePhoto || partner?.avatar || null;
                const timePreview = chat.last_message?.created_at
                  ? getRelativeTime(new Date(chat.last_message.created_at))
                  : '';
            
                const unreadCount = (chat.messages || []).filter(msg => unreadSet.has(msg.item_id)).length;

                return (
                  <li
                    key={chat.item_id}
                  onClick={() => handleChatSelect(chat)}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
                      activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <div className="shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <Avatar name={name} size="32" round />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-800 truncate">{name}</div>
                        <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
                      </div>
                     
                    </div>

                  
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
