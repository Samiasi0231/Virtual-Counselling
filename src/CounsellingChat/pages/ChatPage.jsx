import React, { useState, useEffect, useRef,useMemo,useCallback,useLayoutEffect } from 'react';
import { useLocation,useNavigate,useSearchParams } from 'react-router-dom';
import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
import InfiniteScroll from 'react-infinite-scroll-component';
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

const mergeAllCachedPages = (chatId) => {
  const messages = [];
  let page = 0;
  while (true) {
    const key = `chat_messages_${chatId}_page_${page}`;
    const pageData = JSON.parse(localStorage.getItem(key) || '[]');
    if (!pageData.length) break;
    messages.push(...pageData);
    page++;
  }

  const seen = new Set();
  return messages.filter((msg) => {
    if (seen.has(msg.item_id)) return false;
    seen.add(msg.item_id);
    return true;
  });
};


const formatMessage = (msg, userType) => {
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
};

const ChatPage = ({ initialRole = 'student' }) => {
  const scrollContainerRef = useRef(null);
const [page, setPage] = useState(0); 
const [chatRooms, setChatRooms] = useState([]);
const [hasMoreMessages, setHasMoreMessages] = useState(true);
   const navigate = useNavigate();
  const websocketRef = useRef(null);
  const location = useLocation();
  const [unreadCounts, setUnreadCounts] = useState({});
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
  const [showScrollButtons, setShowScrollButtons] = useState({ up: false, down: false });
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);
const [anonymousMap, setAnonymousMap] = useState(() => {
  try {
    const stored = localStorage.getItem('anonymous_map');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
});

// Getter and Setter
const getAnonymousForChat = useCallback(
  (chatId) => anonymousMap?.[chatId] ?? false,
  [anonymousMap]
);

const setAnonymousForChat = useCallback(
  (chatId, value) => {
    const updatedMap = { ...anonymousMap, [chatId]: value };
    setAnonymousMap(updatedMap);
    localStorage.setItem('anonymous_map', JSON.stringify(updatedMap));
  },
  [anonymousMap]
);




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


useEffect(() => {
  const fetchChatRooms = async () => {
    try {
      const res = await axiosClient.get("/vpc/get-chat-rooms/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChatRooms(res.data || []);
    } catch (err) {
      console.error("Error fetching chat rooms:", err);
    }
  };

  if (token) fetchChatRooms();
}, [token]);

const loadOlderMessages = async () => {
  if (!chatSession?.item_id || !token || !hasMoreMessages) return;

  const chatId = chatSession.item_id;
  const pageKey = `chat_messages_${chatId}_page_${page}`;
  const container = scrollContainerRef.current;
  const prevScrollHeight = container?.scrollHeight;

  setLoadingMessages(true);

  try {
    // Try cache first
    const cachedPage = JSON.parse(localStorage.getItem(pageKey) || '[]');
    let older = cachedPage;

    // If not cached, fetch from API
    if (cachedPage.length === 0) {
      const res = await axiosClient.get(
        `/vpc/get-messages/${chatId}/?page=${page}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      older = Array.isArray(res.data?.messages) ? res.data.messages : [];

      if (older.length === 0) {
        setHasMoreMessages(false);
        return;
      }

      localStorage.setItem(pageKey, JSON.stringify(older));
    }

    const formatted = older.map((msg) => {
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

    setMessages((prev) => {
      const existingIds = new Set(prev.map(m => m.item_id));
      const unique = formatted.filter(m => !existingIds.has(m.item_id));
      return [...unique, ...prev];
    });

    setPage((prev) => prev + 1);

    // Maintain scroll position
    setTimeout(() => {
      const newScrollHeight = container?.scrollHeight;
      if (container) container.scrollTop = newScrollHeight - prevScrollHeight;
    }, 100);
  } catch (err) {
    console.error(`Failed to load older messages for chat ${chatId}:`, err);
  } finally {
    setLoadingMessages(false);
  }
};


// const loadOlderMessages = async () => {
//   if (!chatSession?.item_id || !token) return;

//   const container = scrollContainerRef.current;
//   const prevScrollHeight = container?.scrollHeight;

//   setLoadingMessages(true);

//   try {
//     const res = await axiosClient.get(
//       `/vpc/get-messages/${chatSession.item_id}/?page=${page}&limit=5`,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//       }
//     );

//     const olderMessages = Array.isArray(res.data.messages) ? res.data.messages : [];

//     if (olderMessages.length === 0) {
//       setHasMoreMessages(false);
//       return;
//     }

//     const formatted = olderMessages.map((msg) => {
//       const isFromCurrentUser = msg.from_counselor
//         ? userType === 'counsellor'
//         : userType === 'student';

//       const sender = msg.from_counselor ? msg.sender_counselor : msg.sender_user;
//       const lastname = sender?.fullname?.split(' ').slice(-1)[0] || '';

//       return {
//         ...msg,
//         isFromCurrentUser,
//         file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
//         fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
//         text: msg.text || '',
//         time: new Date(msg.created_at).toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//         groupDate: formatMessageDate(msg.created_at),
//         studentAnonymous: msg.anonymous ?? false,
//         senderLastName: lastname,
//       };
//     });

//     setMessages(prev => [...formatted, ...prev]);
//     setPage(prev => prev + 1);

//     setTimeout(() => {
//       const newScrollHeight = container?.scrollHeight;
//       container.scrollTop = newScrollHeight - prevScrollHeight;
//     }, 100);
//   } catch (err) {
//     console.error('Failed to load older messages:', err);
//   } finally {
//     setLoadingMessages(false);
//   }
// };

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

  const handleChatSelect = useCallback(async (chatRoom) => {
  if (!chatRoom?.item_id || !token) return;

  const chatId = chatRoom.item_id;
  setLoadingMessages(true);

  try {

    // 🚀 Hydrate from all cached pages
    const cachedMessages = mergeAllCachedPages(chatId); // You must define this
    const formattedCached = cachedMessages.map((msg) => formatMessage(msg, userType));

    setMessages(formattedCached);
    setPage(formattedCached.length ? Math.ceil(formattedCached.length / 20) : 1);

    // Optionally fetch page 0 if no cache
    if (formattedCached.length === 0) {
      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/?page=0&limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const freshMessages = Array.isArray(res.data?.messages) ? res.data.messages : [];
      localStorage.setItem(`chat_messages_${chatId}_page_0`, JSON.stringify(freshMessages));

      const formatted = freshMessages.map((msg) => formatMessage(msg, userType));
      setMessages(formatted);
    }

    const unread = formattedCached
      .filter((msg) => !msg.read && msg.sender !== userType)
      .map((msg) => msg.item_id);

    setUnreadIds(unread);
    setUnreadCounts((prev) => ({ ...prev, [chatId]: unread.length }));

    const partnerData = isStudent ? chatRoom.counselor_data : chatRoom.user_data;
    setPartnerInfo(partnerData);
    setChatSession({
      item_id: chatId,
      user_anonymous: chatRoom.user_anonymous ?? false,
    });

    localStorage.setItem('lastChatId', chatId);
    if (isStudent) {
      setAnonymous(getAnonymousForChat(chatId));
    }

    let page = 1;
    let allMessages = [];
    let hasMore = true;

    const cached = JSON.parse(localStorage.getItem(`chat_messages_${chatId}`) || '[]');

    while (hasMore) {
      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

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

    const formatted = allMessages.map((msg) => {
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

    const merged = mergeAndDeduplicate(cached, formatted);
    const trimmed = merged.slice(-100); 
    localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(trimmed));
    setMessages(trimmed);
    setPage(page);
    setHasMoreMessages(true);

    

    setChatSession({
      item_id: chatId,
      user_anonymous: chatRoom.user_anonymous ?? false,
    });

    localStorage.setItem('lastChatId', chatId);

    if (isStudent) {
      const savedAnonymous = getAnonymousForChat(chatId);
      setAnonymous(savedAnonymous);
    }

    setMobileView(false);
  } catch (err) {
    console.error('Failed to fetch messages for selected chat:', err);
  } finally {
    setLoadingMessages(false);
  }
}, [isStudent, token, userType, getAnonymousForChat]);

// const handleChatSelect = useCallback(async (chatRoom) => {
//   if (!chatRoom?.item_id || !token) return;

//   const chatId = chatRoom.item_id;
//   setLoadingMessages(true);

//   try {
//     // 🚀 Hydrate from all cached pages
//     const cachedMessages = mergeAllCachedPages(chatId);
//     const formattedCached = cachedMessages.map((msg) => {
//       const isFromCurrentUser = msg.from_counselor
//         ? userType === 'counsellor'
//         : userType === 'student';

//       const sender = msg.from_counselor ? msg.sender_counselor : msg.sender_user;
//       const lastname = sender?.fullname?.split(' ').slice(-1)[0] || '';

//       return {
//         ...msg,
//         isFromCurrentUser,
//         file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
//         fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
//         text: msg.text || '',
//         time: new Date(msg.created_at).toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//         groupDate: formatMessageDate(msg.created_at),
//         studentAnonymous: msg.anonymous ?? false,
//         senderLastName: lastname,
//       };
//     });

//     setMessages(formattedCached);
//     setPage(formattedCached.length ? Math.ceil(formattedCached.length / 20) : 1); // Start loading from next page

//     // Optionally fetch latest page 0 if cache is empty
//     if (formattedCached.length === 0) {
//       const res = await axiosClient.get(`/vpc/get-messages/${chatId}/?page=0&limit=20`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const freshMessages = Array.isArray(res.data?.messages) ? res.data.messages : [];
//       localStorage.setItem(`chat_messages_${chatId}_page_0`, JSON.stringify(freshMessages));

//       const formatted = freshMessages.map(/* same formatting as above */);
//       setMessages(formatted);
//     }

//     const unread = formattedCached
//       .filter((msg) => !msg.read && msg.sender !== userType)
//       .map((msg) => msg.item_id);
//     setUnreadIds(unread);
//     setUnreadCounts((prev) => ({ ...prev, [chatId]: unread.length }));

//     const partnerData = isStudent ? chatRoom.counselor_data : chatRoom.user_data;
//     setPartnerInfo(partnerData);
//     setChatSession({ item_id: chatId, user_anonymous: chatRoom.user_anonymous ?? false });

//     localStorage.setItem('lastChatId', chatId);
//     if (isStudent) setAnonymous(getAnonymousForChat(chatId));
//     setMobileView(false);
//   } catch (err) {
//     console.error('Failed to fetch messages for selected chat:', err);
//   } finally {
//     setLoadingMessages(false);
//   }
// }, [isStudent, token, userType, getAnonymousForChat]);


useEffect(() => {
  if (!chatIdToUse || !chatRooms.length || chatSession?.item_id === chatIdToUse) return;

  const match = chatRooms.find(c => c.item_id === chatIdToUse);
  if (match) {
    handleChatSelect(match);
  }
}, [chatIdToUse, chatRooms, chatSession?.item_id, handleChatSelect]);



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
  // setAnonymousForChat(chatId, newAnonymousState);
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

 const hasSeen = (msg) =>
  Array.isArray(msg.seen_users) &&
  msg.seen_users.map(String).includes(String(currentUserId));

const unseenMessages = messages.filter(
  (msg) => !msg.isFromCurrentUser && !hasSeen(msg)
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
  unreadIds={unreadIds}
  chatRooms={chatRooms}
  getAnonymousForChat={getAnonymousForChat} 
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
    <div
  id="scrollableDiv"
  ref={scrollContainerRef}
  className="flex-1 px-3 py-2 overflow-y-auto space-y-2 bg-gray-50 relative"
>
  <InfiniteScroll
    dataLength={messages.length}
    next={loadOlderMessages}
    hasMore={hasMoreMessages}
    inverse={true}
    scrollableTarget="scrollableDiv"
    loader={
      <div className="text-center text-xs text-gray-400 py-2">
        Loading older messages...
      </div>
    }
    style={{ display: 'flex', flexDirection: 'column-reverse' }}
  >
   {Object.entries(groupedMessages)
  .sort(([a], [b]) => new Date(a) - new Date(b)) // Ensure date group order ascending
  .reverse() // Invert for inverse scroll
  .map(([date, msgs]) => (
    <div key={`group-${date}-${msgs[0]?.id || date}`}>
      <div className="text-center text-xs text-gray-500 my-3">{date}</div>

      {msgs
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at)) // Ensure message order within date
        .map((msg, index) => (
          <div
            key={msg.id || `msg-${index}`}
            className={`flex ${
              msg.isFromCurrentUser ? 'justify-end' : 'justify-start'
            } items-start gap-1 mb-1`}
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
                <strong title={getSenderName(msg)}>{getSenderName(msg)}:</strong>{' '}
                {msg.text}
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
    msg.isFromCurrentUser ? 'text-green-600' : 'text-gray-500'
  }`}
>
  {msg.isFromCurrentUser && (
    Array.isArray(msg.seen_users) && msg.seen_users.includes(contextUser?.item_id)
      ? '✓✓'
      : '✓'
  )}{' '}
  {msg.time}
</span>

            </div>
          </div>
        ))}
    </div>
))}

  </InfiniteScroll>

  {/* Typing Indicator */}
  {typing && typing.sender && typing.sender !== userType && (
    <div className="text-sm italic text-gray-500">
      {typing.sender === 'student'
        ? typing.anonymous
          ? 'Anonymous'
          : 'Student'
        : 'Counsellor'}{' '}
      is typing...
    </div>
  )}

  {/* Scroll to bottom button */}
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
   if (!typing) setTyping(true);  
clearTimeout(typingTimer);
typingTimer = setTimeout(() => {
  sendTypingStatus(websocketRef, chatSession, userType, isStudent, anonymous);
  setTyping(false); 
}, 1200);

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