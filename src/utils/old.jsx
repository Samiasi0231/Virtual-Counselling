
import React, { useEffect, useState } from "react";
import axiosClient from "../utils/axios-client-analytics";
import { FiChevronRight } from "react-icons/fi";
import Avatar from 'react-avatar'; 
import getRelativeTime from "../utils/time";

const ChatSidepanel = ({ onChatSelect, partner, isStudent, activeChatId, unreadIds = [] }) => {
  const [recentChats, setRecentChats] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersOpen, setUsersOpen] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(true);
useEffect(() => {
  const fetchRecentChats = async () => {
    try {
      const res = await axiosClient.get("/vpc/get-chat-rooms/");
      const rooms = res.data;

      const updatedChats = await Promise.all(
        rooms.map(async (chat) => {
          try {
            const res = await axiosClient.get(`/vpc/get-messages/${chat.item_id}/`);
            const messages = Array.isArray(res.data) ? res.data : res.data.fullMessages || res.data.messages || [];
            messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

            const lastMessage = messages.length ? messages[messages.length - 1] : null;

            return {
              ...chat,
              messages,
              last_message: lastMessage,
            };
          } catch (err) {
            console.error(`Error fetching messages for chat ${chat.item_id}`, err);
            return chat;
          }
        })
      );

      // ✅ Check what you're setting in state
      // console.log("Recent chats with last messages:", updatedChats);
      setRecentChats(updatedChats);
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
      if (chatId === activeChatId) return;
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
  const status = err?.response?.status;
  if (status === 500) {
    console.error("Server error. Try again later.");
  } else {
    console.error("Error fetching messages:", err);
  }
}

  };
const unreadSet = new Set(unreadIds);
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
              const fullname =
                chat.counselor_data?.fullname?.trim() ||
                `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
                "Unknown";
              return (
                <li
                  key={chat.item_id}
                  className={`p-2 rounded-md ${chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""}`}
                >
                  {fullname}
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
                const partnerData = isStudent ? chat.counselor_data : chat.user_data;
                const fullname =
                  partnerData?.fullname ||
                  `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();
              const preview = chat.last_message?.text?.trim()
  ? chat.last_message.text.slice(0, 5)
  : "[No message yet]";


                const createdAt = chat.last_message?.created_at;
                const timePreview = createdAt ? getRelativeTime(new Date(createdAt)) : "";
                const avatarUrl =
                  partnerData?.profilePhoto?.best || partnerData?.profilePhoto || partnerData?.avatar || null;

                const unreadCount = (chat.messages || []).filter(msg => unreadSet.has(msg.item_id)).length;


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
import React, { useState, useEffect, useRef,useMemo,useCallback,useLayoutEffect } from 'react';
import { useLocation,useNavigate,useSearchParams } from 'react-router-dom';
import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
import {formatMessageDate} from "../../utils/time"
import mergeAndDeduplicate  from "../../utils/message"


import Avatar from 'react-avatar';



const messageQueue = {
  queue: [],
  add(message) {
    this.queue.push(message);
    localStorage.setItem('messageQueue', JSON.stringify(this.queue));
  },
  clear() {
    this.queue = [];
    localStorage.removeItem('messageQueue');
  },
  load() {
    const stored = localStorage.getItem('messageQueue');
    this.queue = stored ? JSON.parse(stored) : [];
    return this.queue;
  }
};

const getAnonymousMap = () => {
  try {
    const stored = localStorage.getItem('anonymous_map');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};
let typingTimer = null;

const sendTypingStatus = (websocketRef, chatSession, userType, isStudent, anonymous) => {
  if (
    websocketRef.current &&
    websocketRef.current.readyState === WebSocket.OPEN &&
    chatSession?.item_id
  ) {
    websocketRef.current.send(JSON.stringify({
      type: 'typing',
      sender: userType,
      chatId: chatSession.item_id,
      anonymous: isStudent ? anonymous : false,
    }));
  }
};

const setAnonymousForChat = (chatId, value) => {
  const map = getAnonymousMap();
  map[chatId] = value;
  localStorage.setItem('anonymous_map', JSON.stringify(map));
};

const getAnonymousForChat = (chatId) => {
  const map = getAnonymousMap();
  return map[chatId] ?? false;
};

const ChatPage = ({ initialRole = 'student' }) => {
  const scrollContainerRef = useRef(null);
const [page, setPage] = useState(1); 
const [hasMoreMessages, setHasMoreMessages] = useState(true);
   const navigate = useNavigate();
  const websocketRef = useRef(null);
  const location = useLocation();
  const chatIdFromURL = new URLSearchParams(location.search).get('chatId');
const storedChatId = localStorage.getItem('lastChatId');
const chatIdToUse = chatIdFromURL || storedChatId; 
  const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();
 const [anonLoading, setAnonLoading] = useState(false);
 const [showScrollDown, setShowScrollDown] = useState(false);
  const contextUser = student || counsellor;
  const userType = contextUser?.user_type;
  const token = userType === 'student' ? studentToken : counsellorToken;
  const isStudent = userType === 'student';
  const [unreadIds, setUnreadIds] = useState([]);
  const [chatSession, setChatSession] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [mobileView, setMobileView] = useState(() => !chatIdFromURL);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showScrollButtons, setShowScrollButtons] = useState({ up: false, down: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);


 useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (isOnline && websocketRef.current?.readyState === WebSocket.OPEN) {
      const queued = messageQueue.load();
      if (queued.length > 0) {
        queued.forEach(msg => {
          if (websocketRef.current?.readyState === WebSocket.OPEN) {
            websocketRef.current.send(JSON.stringify(msg));
          }
        });
        messageQueue.clear();
      }
    }
  }, [isOnline]);


  const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;



const extractFileData = (data) => {
  if (Array.isArray(data.attachments) && data.attachments.length > 0) {
    return {
      file: data.attachments[0].location,
      fileType: data.attachments[0].attachments_type,
    };
  }
  if (Array.isArray(data.media) && data.media.length > 0) {
    return {
      file: data.media[0].location,
      fileType: data.media[0].media_type,
    };
  }
  return { file: null, fileType: null };
};

const loadOlderMessages = async () => {
  if (!chatSession?.item_id || !token) return;

  const container = scrollContainerRef.current;
  const prevScrollHeight = container?.scrollHeight;

  setLoadingMessages(true);

  try {
    const res = await axiosClient.get(
      `/vpc/get-messages/${chatSession.item_id}/?page=${page}&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const olderMessages = Array.isArray(res.data.messages) ? res.data.messages : [];

    if (olderMessages.length === 0) {
      setHasMoreMessages(false);
      return;
    }

    const formatted = olderMessages.map((msg) => {
      const isFromCurrentUser = msg.from_counselor
        ? userType === 'counsellor'
        : userType === 'student';

      const sender = msg.from_counselor ? msg.sender_counselor : msg.sender_user;
      const lastname = sender?.fullname?.split(' ').slice(-1)[0] || '';

      return {
        ...msg,
        isFromCurrentUser,
        file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
        fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
        text: msg.text || '',
        time: new Date(msg.created_at).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        groupDate: formatMessageDate(msg.created_at),
        studentAnonymous: msg.anonymous ?? false,
        senderLastName: lastname,
      };
    });

    setMessages(prev => [...formatted, ...prev]);
    setPage(prev => prev + 1);

    setTimeout(() => {
      const newScrollHeight = container?.scrollHeight;
      container.scrollTop = newScrollHeight - prevScrollHeight;
    }, 100);
  } catch (err) {
    console.error('Failed to load older messages:', err);
  } finally {
    setLoadingMessages(false);
  }
};


useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    setShowScrollDown(!isNearBottom);

    setShowScrollButtons({
      up: scrollTop > 200,
      down: !isNearBottom,
    });
  };

  container.addEventListener('scroll', handleScroll);
  handleScroll();

  return () => container.removeEventListener('scroll', handleScroll);
}, []);



  const isStudentAnonymous = chatSession?.user_anonymous;

 const displayName = useMemo(() => {
  if (!partnerInfo) return isStudent ? 'Counselor' : (isStudentAnonymous ? 'Anonymous' : 'Student');

  const name = partnerInfo.fullname || `${partnerInfo.firstname || ''} ${partnerInfo.lastname || ''}`.trim();
  return isStudent ? name || 'Counselor' : (isStudentAnonymous ? 'Anonymous' : name || 'Student');
}, [partnerInfo, isStudent, isStudentAnonymous]);


 const displayAvatar = useMemo(() => {
  const rawPhoto = normalizeProfilePhoto(partnerInfo?.profilePhoto) || partnerInfo?.avatar || null;
  if (!rawPhoto) return null;
  if (isStudent) return rawPhoto;
  return isStudentAnonymous ? null : rawPhoto;
}, [partnerInfo, isStudent, isStudentAnonymous]);


  if (!['student', 'counsellor'].includes(userType)) {
    return <p className="text-center text-red-500">Unauthorized user</p>;
  }

   const handleChatSelect = useCallback((fullMessages, partnerData, messages, sessionData) => {
    setPartnerInfo(partnerData);
    const msgList = fullMessages || messages || [];
    setMessages(msgList);
    localStorage.setItem('lastChatId', sessionData.item_id);
    setChatSession(sessionData);
    const unread = msgList.filter(msg => !msg.read && msg.sender !== userType).map(msg => msg.id);
    setUnreadIds(unread);
    setUnreadCounts(prev => ({ ...prev, [sessionData.item_id]: unread.length }));
    if (isStudent && sessionData?.item_id) {
      const savedAnonymous = getAnonymousForChat(sessionData.item_id);
      setAnonymous(savedAnonymous);
    }
    setMobileView(false);
    
  }, [isStudent, userType]);

  const partner = useMemo(() => userType === 'student'
    ? chatSession?.counselor_data?.fullname || 'Counselor'
    : `${chatSession?.user_data?.lastname || 'Student'} ${chatSession?.user_data?.lastname || ''}`
  , [userType, chatSession]);

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [typing, userType, chatSession]);

useEffect(() => {
  const fetchChatMessages = async () => {
    if (!chatIdToUse || !token) return;
    setLoadingMessages(true);

    try {
      let page = 1;
      let allMessages = [];
      let hasMore = true;

      const cached = JSON.parse(localStorage.getItem(`chat_messages_${chatIdToUse}`) || '[]');

      while (hasMore) {
        const res = await axiosClient.get(
          `/vpc/get-messages/${chatIdToUse}/?page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const currentPageMsgs = Array.isArray(res.data)
          ? res.data
          : res.data.fullMessages || res.data.messages || [];

        if (!currentPageMsgs.length) break;

        const alreadySeen = currentPageMsgs.some(msg =>
          cached.some(c => c.item_id === msg.item_id)
        );

        allMessages = [...currentPageMsgs, ...allMessages];
        if (alreadySeen) break;

        page++;
        hasMore = currentPageMsgs.length > 0;
      }

      
      const formattedAPI = allMessages.map((msg) => {
        const isFromCurrentUser = msg.from_counselor
          ? userType === 'counsellor'
          : userType === 'student';

        const sender = msg.from_counselor
          ? msg.sender_counselor
          : msg.sender_user;

        const lastname = sender?.fullname?.split(' ').slice(-1)[0] || '';

        return {
          ...msg,
          isFromCurrentUser,
          file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
          fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
          text: msg.text || '',
          time: new Date(msg.created_at).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          groupDate: formatMessageDate(msg.created_at),
          studentAnonymous: msg.anonymous ?? false,
          senderLastName: lastname,
        };
      });

      
      const mergedMessages = mergeAndDeduplicate(cached, formattedAPI);
      setMessages(mergedMessages);
      localStorage.setItem(`chat_messages_${chatIdToUse}`, JSON.stringify(mergedMessages.slice(-100)));

      setPage(page);
      setHasMoreMessages(true);

      const unread = mergedMessages
        .filter((msg) => !msg.read && msg.sender !== userType)
        .map((msg) => msg.item_id);

      const partnerData = mergedMessages.length
        ? isStudent
          ? mergedMessages[0]?.sender_counselor
          : mergedMessages[0]?.sender_user
        : null;

      setUnreadIds(unread);

      if (!chatSession) {
        setPartnerInfo(partnerData);
      }

      setChatSession({
        item_id: chatIdToUse,
        user_anonymous: false,
      });

      localStorage.setItem('lastChatId', chatIdToUse);

      if (isStudent) {
        const savedAnonymous = getAnonymousForChat(chatIdToUse);
        setAnonymous(savedAnonymous);
      }

      setMobileView(false);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  fetchChatMessages();
}, [chatIdToUse, isStudent, userType, token]);


useLayoutEffect(() => {
  const cached = JSON.parse(localStorage.getItem(`chat_messages_${chatIdToUse}`) || '[]');
  setMessages(cached);
}, [chatIdToUse]);
useEffect(() => {
  if (!chatSession) return;

  const data = isStudent ? chatSession.counselor_data : chatSession.user_data;
  if (data) {
    setPartnerInfo(data);
  }
}, [chatSession, isStudent]);


useEffect(() => {
  if (chatSession?.item_id) {
    const trimmedMessages = messages.slice(-50); 
    localStorage.setItem(
      `chat_messages_${chatSession.item_id}`,
      JSON.stringify(trimmedMessages)
    );
  }
}, [messages, chatSession]);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);



const toggleAnonymous = async () => {
  if (!isStudent || !chatSession?.item_id || !token) return;
  const chatId = chatSession.item_id;
  const newAnonymousState = !anonymous;
  setAnonLoading(true);
  setAnonymous(newAnonymousState);
  setAnonymousForChat(chatId, newAnonymousState);
  setChatSession((prev) => ({ ...prev, user_anonymous: newAnonymousState }));

  try {
    await axiosClient.put(
      `/vpc/update-anonymous/${chatId}/`,
      { user_anonymous: newAnonymousState },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    setAnonymous(!newAnonymousState);
    setAnonymousForChat(chatId, !newAnonymousState);
    setChatSession((prev) => ({ ...prev, user_anonymous: !newAnonymousState }));
    console.error('Failed to toggle anonymous mode:', error.response?.data || error.message);
  } finally {
    setAnonLoading(false);
  }
};


  useEffect(() => {
    if (!chatSession?.item_id || !token) return;

    const wsUrl = `wss://cbt.neofin.ng/vpc/message-feed/${chatSession.item_id}/ws?auth_token=${token}`;
    const ws = new WebSocket(wsUrl);
    websocketRef.current = ws;
  ws.onopen = () => {
      console.log('[WebSocket] Connected');
      // Process any queued messages
      const queued = messageQueue.load();
      if (queued.length > 0) {
        queued.forEach(msg => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
          }
        });
        messageQueue.clear();
      }
    };
   
    ws.onerror = (e) => console.error('[WebSocket] Error:', e);
    ws.onclose = () => console.log('[WebSocket] Disconnected');

  ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if ((data?.text || data?.attachments?.length || data?.media?.length) && data?.item_id)
 {
      const now = new Date();
      const sender = data.sender || (data.from_counselor ? 'counsellor' : 'student');
      const isFromCurrentUser = sender === userType;

const { file, fileType } = extractFileData(data);

const newMsg = {
  id: data.item_id || now.getTime(),
  sender,
  text: data.text,
  file,        
  fileType,     
  time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  groupDate: formatMessageDate(now),
  read: false,
  studentAnonymous: data.anonymous ?? false,
  isFromCurrentUser,
  senderFullname: data.sender_counselor?.fullname || data.sender_user?.fullname,
  senderAvatar: data.sender_counselor?.profilePhoto?.best || data.sender_user?.profilePhoto,
};
if (data?.type === 'seen_update' && data.userId && Array.isArray(data.messageIds)) {
  setMessages(prev =>
    prev.map(msg =>
      data.messageIds.includes(msg.item_id)
        ? { ...msg, seen_users: [...(msg.seen_users || []), data.userId] }
        : msg
    )
  )}

setMessages((prev) => {
  const safePrev = Array.isArray(prev) ? prev : [];

  const incomingFileType =
    data.attachments?.[0]?.attachments_type || data.media?.[0]?.media_type || null;

  const filtered = safePrev.filter((msg) => {
    const isTemp = msg.id?.startsWith('temp');
    const matchesText = msg.text === data.text;
    const matchesFile =
      msg.file?.startsWith('blob:') && msg.fileType === incomingFileType;

    return !(isTemp && ((matchesText && !data.attachments?.length && !data.media?.length) || matchesFile));
  });

  const updatedMessages = [...filtered, newMsg];

  if (chatSession?.item_id) {
    const localKey = `chat_messages_${chatSession.item_id}`;
    localStorage.setItem(localKey, JSON.stringify(updatedMessages.slice(-100)));
  }

  return updatedMessages;
});

    }


    if (data?.type === 'typing' && data.sender !== userType) {
      setTyping(data);
      setTimeout(() => setTyping(false), 1500);
    }
  } catch (err) {
    console.error('[WebSocket] Parse error:', err);
  }
};

  return () => {
      ws.close();
    };
  }, [chatSession?.item_id, userType, token]);


const handleSend = async () => {
  if ((!newMessage.trim() && !file) || !chatSession?.item_id || !token) return;

  const now = new Date();
  const tempId = `temp-${Date.now()}`;

  const newOptimisticMessage = {
    id: tempId,
    sender: userType,
    text: newMessage,
    file: file ? URL.createObjectURL(file) : null,
    fileType: file?.type?.startsWith('image') ? 'image' : 'file',
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    groupDate: formatMessageDate(now),
    read: false,
    isFromCurrentUser: true,
    studentAnonymous: isStudent ? anonymous : false,
    senderFullname: contextUser?.fullname || '',
    senderAvatar: normalizeProfilePhoto(contextUser?.profilePhoto),
  };

 
  setMessages(prev => [...prev, newOptimisticMessage]);


  if (chatSession?.item_id) {
    const localKey = `chat_messages_${chatSession.item_id}`;
    const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
    const updated = [...existing, newOptimisticMessage].slice(-100);
    localStorage.setItem(localKey, JSON.stringify(updated));
  }

  setNewMessage('');
  setFile(null);
  setTyping(false);

  try {
    const formData = new FormData();
    if (newMessage.trim()) formData.append('text', newMessage.trim());
    if (file) formData.append('attachments', file);

    const messageData = {
      type: 'message',
      data: formData,
      chatId: chatSession.item_id,
      token
    };

    if (isOnline && websocketRef.current?.readyState === WebSocket.OPEN) {
      websocketRef.current.send(JSON.stringify(messageData));
    } else {
      // Queue the message if offline
      messageQueue.add(messageData);
    }

    await axiosClient.post(
      `/vpc/create-message/${chatSession.item_id}/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Message send failed:', error.response?.data || error.message);
  }
};

const getSenderName = (msg) => {
  if (msg.isFromCurrentUser) return 'You';
  if (!msg.from_counselor) {
    if (msg.studentAnonymous) return 'Anonymous';
    return msg.senderFullname || msg.senderLastName || 'Student';
  }
  return msg.senderFullname || msg.senderLastName || 'Counselor';
}
const groupedMessages = (messages || []).reduce((groups, msg) => {
const label = msg.groupDate || formatMessageDate(msg.created_at);
 if (!groups[label]) groups[label] = [];
  groups[label].push(msg);
  return groups;
}, {});

useEffect(() => {
  if (!messages || !Array.isArray(messages) || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) return;

  const currentUserId = contextUser?.item_id;
  if (!currentUserId || !chatSession?.item_id) return;

  const unseenMessages = messages.filter(
    (msg) => !msg.isFromCurrentUser && !msg.seen_users?.includes(currentUserId)
  );

  if (unseenMessages.length === 0) return;

  const unseenIds = unseenMessages.map((msg) => msg.item_id);

  websocketRef.current.send(JSON.stringify({
    type: 'mark_seen',
    chatId: chatSession.item_id,
    userId: currentUserId,
    messageIds: unseenIds,
  }));

  
  setMessages(prev =>
    prev.map(msg =>
      unseenIds.includes(msg.item_id)
        ? { ...msg, seen_users: [...(msg.seen_users || []), currentUserId] }
        : msg
    )
  );
}, [messages, contextUser, chatSession]);

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
};



return (
  <div className='h-screen bg-gray-100'>
     <div className="mb-6">
  <button
    onClick={() => navigate(-1)}
    className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
  >
    ← Back
  </button>
</div>
  <div className="h-screen flex flex-col md:flex-row bg-gray-100">

  <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
   <button
  onClick={() => setMobileView(prev => !prev)}
  className={`text-purple-600 transition-transform duration-300 transform ${
    mobileView ? 'rotate-90 scale-110' : ''
  }`}
>
  <FiMenu size={22} />
</button>

    <span className="font-semibold">{displayName}</span>
    {isStudent && (
      <button onClick={toggleAnonymous} className="text-sm px-2 py-1 border rounded-full text-gray-600">
        {anonymous ? <FiUserX /> : <FiUser />}
      </button>
    )}
  </div>
  <div className={`w-full md:w-80 ${mobileView ? 'block' : 'hidden'} md:block`}>
    <ChatSidepanel
      partner={partner}
      onChatSelect={handleChatSelect}
      isStudent={isStudent}
      activeChatId={chatSession?.item_id || chatIdFromURL}
      unreadCounts={unreadCounts}
    />
  </div>
  <div className={`flex flex-col flex-1 bg-white shadow-md border-l ${mobileView ? 'hidden md:flex' : 'flex'}`}>
    {loadingMessages ? (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    ) : (
      <>
        <div className="hidden md:flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            {displayAvatar ? (
              <img src={displayAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <Avatar name={displayName} size="32" round className="w-8 h-8" />
            )}
            <span className="font-semibold text-gray-700">{displayName}</span>
            {!isStudent && isStudentAnonymous && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Anonymous Student
              </span>
            )}
          </div>
          {isStudent && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm text-gray-700 flex items-center gap-1">
                {anonymous ? <FiUserX /> : <FiUser />} {anonymous ? 'Anonymous' : 'Visible'}
              </span>
              <button
                onClick={toggleAnonymous}
                disabled={!chatSession?.item_id}
                className={`w-14 h-7 flex items-center rounded-full px-1 transition-colors duration-300 ${
                  anonymous ? 'bg-gray-600' : 'bg-purple-500'
                } ${!chatSession?.item_id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                    anonymous ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          )}
        </div>

 <div ref={scrollContainerRef}
className="flex-1 px-3 py-2 overflow-y-auto space-y-2 bg-gray-50 relative">
{hasMoreMessages && !loadingMessages && (
  <div className="sticky top-3 z-20 flex justify-center">
    <button
      onClick={loadOlderMessages}
      className="bg-purple-600 text-white text-xs px-3 py-1 rounded-full shadow hover:bg-purple-700"
    >
    More Messages
    </button>
  </div>
)}

  {loadingMessages && (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white/60 z-10">
      <span className="text-sm text-gray-500">Loading messages...</span>
    </div>
  )}

 {Object.entries(groupedMessages).map(([date, msgs]) => (
  <div key={`group-${date}-${msgs[0]?.id || date}`}>
    <div className="text-center text-xs text-gray-500 my-3">{date}</div>

    {msgs.map((msg,index)=> (
      <div
     key={msg.id || `msg-${index}`}
        className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'} items-start gap-1 mb-1`}
      >
        {!msg.isFromCurrentUser && (
          <div className="shrink-0">
            {msg.senderAvatar && !msg.studentAnonymous ? (
              <img
                src={msg.senderAvatar}
                alt={getSenderName(msg)}
                className="w-6 h-6 rounded-full object-cover"
                title={getSenderName(msg)}
              />
            ) : (
              <Avatar
                name={getSenderName(msg)}
                size="24"
                round
                title={getSenderName(msg)}
              />
            )}
          </div>
        )}

        <div
          className={`p-4 rounded-2xl max-w-md md:max-w-[75%] transition-all duration-300 ${
            msg.isFromCurrentUser ? 'bg-green-200' : 'bg-white border'
          } ${unreadIds.includes(msg.id) ? 'ring-2 ring-purple-400' : ''}`}
        >
          <div className="whitespace-pre-wrap break-words text-sm overflow-hidden">
            <strong title={getSenderName(msg)}>{getSenderName(msg)}:</strong> {msg.text}
          </div>

          {msg.file && (
            <>
              {msg.fileType === 'image' ? (
                <img
                  src={msg.file}
                  alt="Uploaded"
                  className="mt-2 rounded max-w-xs max-h-40 object-cover"
                />
              ) : (
                <p className="text-xs text-blue-600 mt-1 break-all">
                  📎{' '}
                  <a href={msg.file} target="_blank" rel="noopener noreferrer">
                    {msg.file}
                  </a>
                </p>
              )}
            </>
          )}

          <span
            className={`text-[10px] block mt-1 text-right ${
              msg.isFromCurrentUser && msg.read ? 'text-green-600' : 'text-gray-500'
            }`}
          >
            {msg.isFromCurrentUser ? (msg.read ? '✓✓' : '✓') : ''}
            {msg.time}
          </span>
        </div>
      </div>
    ))}
  </div>
))}


  {typing && typing.sender && typing.sender !== userType && (
    <div className="text-sm italic text-gray-500">
      {typing.sender === 'student' ? (typing.anonymous ? 'Anonymous' : 'Student') : 'Counsellor'} is typing...
    </div>
  )}

  <div ref={messagesEndRef} />
{showScrollDown && (
  <button
    onClick={scrollToBottom}
    className="fixed bottom-24 right-4 z-50 bg-purple-600 text-white p-2 rounded-full shadow-md hover:bg-purple-700 md:bottom-20"
    title="Scroll to latest message"
  >
    ↓
  </button>
)}


</div>
        <div className="flex flex-col px-4 py-3 border-t bg-white gap-2">
          {file && (
            <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
              <div className="flex items-center gap-3">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 object-cover rounded" />
                <span className="text-sm text-gray-700">{file.name}</span>
              </div>
              <button onClick={() => setFile(null)} className="text-red-500 text-xs hover:underline">
                Remove
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
              <FiPaperclip size={20} />
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selected = e.target.files[0];
                setFile(selected);
              }}
            />
<textarea
  value={newMessage}
  rows={1}
  onChange={(e) => {
    const value = e.target.value;
    setNewMessage(value);
    setTyping(true);

    clearTimeout(typingTimer);
    typingTimer = setTimeout(() => {
      sendTypingStatus(websocketRef, chatSession, userType, isStudent, anonymous);
    }, 500);
  }}
  onKeyDown={(e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }}
  placeholder="Type a message..."
  className="flex-1 px-4 py-2 text-sm border rounded-xl focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none max-h-40 overflow-y-auto"
/>


            <button onClick={handleSend} className="text-purple-700 hover:text-purple-900">
              <FiSend size={20} />
            </button>
          </div>
        </div>
      </>
    )}
  </div>
</div>
</div>
  );
};

export default ChatPage;






  {/* Resoureces */}
              <SidebarLinkGroup activecondition={pathname.includes("community")}>
                {(handleClick, open) => {
                  return (
                    <React.Fragment>
                      <a
                        href="#0"
                        className={`block text-gray-800 dark:text-gray-100 truncate transition duration-150 ${
                          pathname.includes("community") ? "" : "hover:text-gray-900 dark:hover:text-white"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleClick();
                          setSidebarExpanded(true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <svg className={`shrink-0 fill-current ${pathname.includes('community') ? 'text-violet-500' : 'text-gray-400 dark:text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                              <path d="M12 1a1 1 0 1 0-2 0v2a3 3 0 0 0 3 3h2a1 1 0 1 0 0-2h-2a1 1 0 0 1-1-1V1ZM1 10a1 1 0 1 0 0 2h2a1 1 0 0 1 1 1v2a1 1 0 1 0 2 0v-2a3 3 0 0 0-3-3H1ZM5 0a1 1 0 0 1 1 1v2a3 3 0 0 1-3 3H1a1 1 0 0 1 0-2h2a1 1 0 0 0 1-1V1a1 1 0 0 1 1-1ZM12 13a1 1 0 0 1 1-1h2a1 1 0 1 0 0-2h-2a3 3 0 0 0-3 3v2a1 1 0 1 0 2 0v-2Z" />
                            </svg>
                            <span className="text-sm font-medium ml-4 lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                              Communtiy
                            </span>
                          </div>
                          {/* Icon */}
                          <div className="flex shrink-0 ml-2">
                            <svg className={`w-3 h-3 shrink-0 ml-1 fill-current text-gray-400 dark:text-gray-500 ${open && "rotate-180"}`} viewBox="0 0 12 12">
                              <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                            </svg>
                          </div>
                        </div>
                      </a>
                      <div className="lg:hidden lg:sidebar-expanded:block 2xl:block">
                        <ul className={`pl-8 mt-1 ${!open && "hidden"}`}>
                         <li className="mb-1 last:mb-0">
                            <NavLink
                              end
                               to={userType ? `/${userType}/joinlive` : "/unauthorized"}
                              className={({ isActive }) =>
                                "block transition duration-150 truncate " + (isActive ? "text-violet-500" : "text-gray-500/90 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200")
                              }
                            >
                              <span className="text-sm font-medium lg:opacity-0 lg:sidebar-expanded:opacity-100 2xl:opacity-100 duration-200">
                                join Live
                              </span>
                            </NavLink>
                          </li>
                        </ul>
                      </div>
                    </React.Fragment>
                  );
                }}
                
              </SidebarLinkGroup>