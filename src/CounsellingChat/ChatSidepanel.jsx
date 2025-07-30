import React, { useEffect, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import Avatar from "react-avatar";
import getRelativeTime from "../utils/time";
import { useChatContext } from "../Auth/ChatContex";

const ChatSidepanel = ({ onChatSelect, isStudent, activeChatId, unreadCounts = {} }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [usersOpen, setUsersOpen] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(true);

  const {
    chatSession,
    setChatSession,
    recentChats,
    fetchRecentChats,
    selectChatSession,
    chatMap
  } = useChatContext();

  // ✅ Fetch chat rooms from context on load
  useEffect(() => {
    fetchRecentChats();
  }, []);

  const filteredChats = recentChats.filter(chat => {
    const partner = isStudent ? chat.counselor_data : chat.user_data;
    const fullname = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`.trim();
    return fullname.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleChatSelect = async (chatId) => {
    if (chatId === activeChatId) return;
    try {
      const chat = recentChats.find((c) => c.item_id === chatId);
      await selectChatSession({
        chatId,
        token: localStorage.getItem("token"),
        userType: isStudent ? "user" : "counselor",
        isStudent,
        onSelect: onChatSelect,
      });

      setChatSession({
        item_id: chatId,
        user_anonymous: chat?.user_anonymous ?? false,
      });
    } catch (err) {
      console.error("Chat select failed:", err);
    }
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
          onClick={() => setUsersOpen(!usersOpen)}
          className="flex items-center justify-between w-full text-left mt-2"
        >
          <h2 className="text-lg font-semibold text-violet-500">Users</h2>
          <FiChevronRight className={`transition-transform duration-300 ${usersOpen ? "rotate-90" : ""}`} />
        </button>

        {usersOpen && (
          <ul className="mt-2 space-y-1 text-sm text-gray-800">
            {recentChats.map((chat) => {
              const partner =
                chat.counselor_data?.fullname?.trim() ||
                `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
                "Unknown";

              return (
                <li
                  key={chat.item_id}
                  className={`p-2 rounded-md ${chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""}`}
                >
                  {partner}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div>
        <button
          onClick={() => setChatsOpen(!chatsOpen)}
          className="flex items-center justify-between w-full text-left"
        >
          <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
          <FiChevronRight className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`} />
        </button>

        {chatsOpen && (
          <ul className="mt-2 space-y-2 text-sm text-gray-600">
            {filteredChats.length === 0 ? (
              <li className="p-2 text-gray-400">No recent chats</li>
            ) : (
              filteredChats.map((chat) => {
                const partner = isStudent ? chat.counselor_data : chat.user_data;
                const fullname =
                  partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`.trim();

                const lastMessage = (chatMap[chat.item_id] || []).slice(-1)[0];

                let preview = "[no current chat]";
                if (lastMessage?.text?.trim()) {
                  preview = lastMessage.text.slice(0, 30);
                } else if (lastMessage?.fileType === "image") {
                  preview = "📷 Image";
                } else if (lastMessage?.fileType === "file") {
                  preview = "📎 File";
                }

                const createdAt = lastMessage?.created_at || lastMessage?.time || null;
                const timePreview = createdAt ? getRelativeTime(new Date(createdAt)) : "";

                const avatarUrl =
                  partner?.profilePhoto?.best || partner?.profilePhoto || partner?.avatar || null;

                const unreadCount = unreadCounts[chat.item_id] || 0;

                return (
                  <li
                    key={chat.item_id}
                    onClick={() => handleChatSelect(chat.item_id)}
                    className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
                      activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
                    }`}
                  >
                    <div className="shrink-0">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={fullname} className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <Avatar name={fullname} size="32" round />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-gray-800 truncate">{fullname}</div>
                        <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
                      </div>
                      <div className="text-xs text-gray-600 truncate">{preview}</div>
                    </div>

                    {unreadCount > 0 && (
                      <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
                        {unreadCount}
                      </span>
                    )}
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
























//  import React, { useEffect, useState } from "react";
// import axiosClient from "../utils/axios-client-analytics";
// import { FiChevronRight } from "react-icons/fi";
// import Avatar from 'react-avatar'; 
// import getRelativeTime from "../utils/time";
// import { useChatContext } from "../Auth/ChatContex";

// const ChatSidepanel = ({ onChatSelect, partner, isStudent, activeChatId, unreadCounts = {} }) => {
//   const [recentChats, setRecentChats] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [usersOpen, setUsersOpen] = useState(true);
//   const [chatsOpen, setChatsOpen] = useState(true);

// const {
//   setChatSession,      
//   chatSession,
//   chatMap,
//   setChatMap,
//   fetchChatMessages,
//   ...rest 
// } = useChatContext();
//   useEffect(() => {
//     const fetchRecentChats = async () => {
//       try {
//         const res = await axiosClient.get("/vpc/get-chat-rooms/");
//         const rooms = res.data;
//         setRecentChats(rooms);
//       } catch (err) {
//         console.error("Error fetching chat rooms:", err);
//       }
//     };

//     fetchRecentChats();
//   }, []);

//   const filteredChats = recentChats.filter((chat) => {
//     const partnerData = isStudent ? chat.counselor_data : chat.user_data;
//     const fullname = partnerData?.fullname || `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();
//     return fullname.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   const handleChatSelect = async (chatId) => {
//     if (chatId === activeChatId) return;

//     try {
//       const messages = await fetchChatMessages(chatId); 

//       const chat = recentChats.find((c) => c.item_id === chatId);
//       const partnerData = isStudent
//         ? chat?.counselor_data
//         : chat?.user_data;

//       onChatSelect?.(
//         messages,
//         partnerData,
//         messages,
//         {
//           item_id: chatId,
//           user_anonymous: chat.user_anonymous ?? false,
//         }
//       );

//       setChatSession({
//       item_id: chatId,
//       user_anonymous: chat.user_anonymous ?? false})
//     } catch (err) {
//       console.error("Error selecting chat:", err);
//     }
//   };

//   return (
//     <aside className="w-full md:w-80 bg-white border-r p-4 space-y-4 h-full overflow-y-auto">
//       <input
//         type="text"
//         placeholder="Search chats..."
//         className="w-full p-2 border rounded text-sm"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div>
//         <button
//           onClick={() => setUsersOpen(!usersOpen)}
//           className="flex items-center justify-between w-full text-left mt-2"
//         >
//           <h2 className="text-lg font-semibold text-violet-500">Users</h2>
//           <FiChevronRight className={`transition-transform duration-300 ${usersOpen ? "rotate-90" : ""}`} />
//         </button>

//         {usersOpen && (
//           <ul className="mt-2 space-y-1 text-sm text-gray-800">
//             {recentChats.map((chat) => {
//               const fullname =
//                 chat.counselor_data?.fullname?.trim() ||
//                 `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
//                 "Unknown";
//               return (
//                 <li
//                   key={chat.item_id}
//                   className={`p-2 rounded-md ${chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""}`}
//                 >
//                   {fullname}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>

//       <div>
//         <button
//           onClick={() => setChatsOpen(!chatsOpen)}
//           className="flex items-center justify-between w-full text-left"
//         >
//           <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
//           <FiChevronRight className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`} />
//         </button>

//         {chatsOpen && (
//           <ul className="mt-2 space-y-2 text-sm text-gray-600">
//             {filteredChats.length === 0 ? (
//               <li className="p-2 text-gray-400">No recent chats</li>
//             ) : (
//               filteredChats.map((chat) => {
//                 const partnerData = isStudent ? chat.counselor_data : chat.user_data;
//                 const fullname =
//                   partnerData?.fullname ||
//                   `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();

//                 const lastMessage = (chatMap[chat.item_id] || []).slice(-1)[0];
// let preview = "[no current chat]";
// if (lastMessage?.text?.trim()) {
//   preview = lastMessage.text.slice(0, 30);
// } else if (lastMessage?.fileType === "image") {
//   preview = "📷 Image";
// } else if (lastMessage?.fileType === "file") {
//   preview = "📎 File";
// }

//                 const createdAt = lastMessage?.created_at || lastMessage?.time;
//                 const timePreview = createdAt ? getRelativeTime(new Date(createdAt)) : "";
//                 const avatarUrl =
//                   partnerData?.profilePhoto?.best || partnerData?.profilePhoto || partnerData?.avatar || null;

//                 const unreadCount = unreadCounts[chat.item_id] || 0;

//                 return (
//                   <li
//                     key={chat.item_id}
//                     onClick={() => handleChatSelect(chat.item_id)}
//                     className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
//                       activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
//                     }`}
//                   >
//                     <div className="shrink-0">
//                       {avatarUrl ? (
//                         <img src={avatarUrl} alt={fullname} className="w-8 h-8 rounded-full object-cover" />
//                       ) : (
//                         <Avatar name={fullname} size="32" round />
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex justify-between items-center">
//                         <div className="font-medium text-gray-800 truncate">{fullname}</div>
//                         <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
//                       </div>
//                       <div className="text-xs text-gray-600 truncate">{preview}</div>
//                     </div>

//                     {unreadCount > 0 && (
//                       <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </li>
//                 );
//               })
//             )}
//           </ul>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default ChatSidepanel;