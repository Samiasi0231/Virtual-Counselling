import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
import { FiChevronRight } from "react-icons/fi";

const ChatSidepanel = ({ onChatSelect, partner, isStudent,  activeChatId }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersOpen, setUsersOpen] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(true);

  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-chat-rooms/");
        setRecentChats(res.data);
      } catch (err) {
        console.error("Error fetching recent chats:", err);
      }
    };

    fetchRecentChats();
  }, []);

  const filteredChats = recentChats.filter((chat) => {
    const partnerData = isStudent ? chat.counselor_data : chat.user_data;
    const fullname = partnerData?.fullname || `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();
    return fullname.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatSelect = async (chatId) => {
    

    try {
      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`);
      const data = res.data;

      const chat = recentChats.find((c) => c.item_id === chatId);
      const partnerData = isStudent
        ? data.counselor_data || chat?.counselor_data
        : data.user_data || chat?.user_data;

      onChatSelect(
        data.fullMessages || data.messages || [],
        partnerData,
        data.messages || [],
        {
          item_id: chatId,
          user_anonymous: chat.user_anonymous ?? false,
        }
      );
    } catch (err) {
      console.error("Error fetching chat messages:", err);
    }
  };

  return (
    <aside className="w-full md:w-64 bg-white border-r p-4 space-y-4 h-full overflow-y-auto">
      {/* 🔍 Search input for mobile/desktop */}
      <input
        type="text"
        placeholder="Search chats..."
        className="w-full p-2 border rounded text-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Users (optional) */}
      <div>
        <button
          onClick={() => setUsersOpen(!usersOpen)}
          className="flex items-center justify-between w-full text-left mt-2"
        >
          <h2 className="text-lg font-semibold text-violet-500">Users</h2>
          <FiChevronRight
            className={`transition-transform duration-300 ${usersOpen ? "rotate-90" : ""}`}
          />
        </button>
        {usersOpen && (
          <ul className="mt-2 space-y-1 text-sm text-gray-800">
            {recentChats.map((chat) => {
              const fullname =
                chat.counselor_data?.fullname?.trim() ||
                `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
                "Unknown";
              return (
                <li
                  key={chat.item_id}
                  className={`p-2 rounded-md ${
                    chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""
                  }`}
                >
                  {fullname}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* ✅ Recent Chats with toggle */}
      <div>
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
          <FiChevronRight
            className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`}
          />
        </button>

        {chatsOpen && (
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {filteredChats.length === 0 ? (
              <li className="p-2 text-gray-400">No recent chats</li>
            ) : (
              filteredChats.map((chat) => {
                const partnerData = isStudent ? chat.counselor_data : chat.user_data;
                const fullname =
                  partnerData?.fullname ||
                  `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();
                const preview = chat.last_message?.text
                  ? chat.last_message.text.slice(0, 25)
                  : "No messages yet";

                return (
                  <li
                    key={chat.item_id}
                    onClick={() => handleChatSelect(chat.item_id)}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <strong>{fullname}</strong>: {preview}
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
