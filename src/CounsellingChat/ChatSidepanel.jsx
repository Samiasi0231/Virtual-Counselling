import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
import { FiChevronRight } from "react-icons/fi";

const ChatSidepanel = ({ onChatSelect, partnersList = [], partner }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [usersOpen, setUsersOpen] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(true);

  // Fetch recent chats on mount
  useEffect(() => {
    const fetchRecentChats = async () => {
      try {
        const res = await axiosClient.get("/vpc/get-chat-rooms/");
        setRecentChats(res.data); // Assuming res.data is an array of chat room objects
      } catch (err) {
        console.error("Error fetching recent chats:", err);
      }
    };

    fetchRecentChats();
  }, []);

  // Handle selecting a chat
  const handleChatSelect = async (chatId) => {
    setActiveChatId(chatId);

    try {
      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`);
      onChatSelect(res.data); // Send messages to parent
    } catch (err) {
      console.error("Error fetching full chat messages:", err);
    }
  };

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-6">
      {/* Users Section */}
      <div>
        <button
          onClick={() => setUsersOpen(!usersOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-violet-500">Users</h2>
          <FiChevronRight
            className={`transition-transform duration-300 ${
              usersOpen ? "rotate-90" : ""
            }`}
          />
        </button>
        {usersOpen && (
          <ul className="mt-2 space-y-1 text-sm text-gray-800">
            {partnersList.map((p) => (
              <li
                key={p}
                className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                  p === partner ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {p}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Chats Section */}
      <div>
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
          <FiChevronRight
            className={`transition-transform duration-300 ${
              chatsOpen ? "rotate-90" : ""
            }`}
          />
        </button>

        {chatsOpen && (
          <ul className="mt-2 space-y-1 text-sm text-gray-600">
            {recentChats.length === 0 ? (
              <li className="p-2 text-gray-400">No recent chats</li>
            ) : (
              recentChats.map((chat) => (
                <li
                  key={chat.item_id}
                  onClick={() => handleChatSelect(chat.item_id)}
                  className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    activeChatId === chat.item_id
                      ? "bg-gray-100 font-semibold"
                      : ""
                  }`}
                >
                  <strong>
                    {chat.counselor_data?.fullname ||
                      chat.user_data?.firstname ||
                      "Unknown"}
                  </strong>
                  {": "}
                  {chat.last_message?.text?.slice(0, 25) || "No messages yet"}
                </li>
              ))
            )}
          </ul>
        )}
      </div>
    </aside>
  );
};

export default ChatSidepanel;
