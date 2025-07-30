import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import { useLocation,useNavigate,useSearchParams } from 'react-router-dom';
import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import { useChatContext } from "../../Auth/ChatContex"
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
import { dedupeMessages } from '../../utils/message';
import {formatMessageDate} from "../../utils/time"
import Avatar from 'react-avatar';
const getAnonymousMap = () => {

  try {
    const stored = localStorage.getItem('anonymous_map');
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
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

const isUserNearBottom = (container, threshold = 120) => {
  return (
    container.scrollHeight - container.scrollTop - container.clientHeight < threshold
  );
};


const ChatPage = ({ initialRole = 'student' }) => {
  
const {
  chatSession,
  setChatSession,
  chatMap,
  setChatMap,
  sendMessage,
  fetchChatMessages,
  updateSeenUsers,
} = useChatContext();

  const scrollContainerRef = useRef(null);
const [hasMoreMessages, setHasMoreMessages] = useState(true);
const [userIsNearBottom, setUserIsNearBottom] = useState(true);

   const navigate = useNavigate();
  const websocketRef = useRef(null);
  const location = useLocation();
  const chatIdFromURL = new URLSearchParams(location.search).get('chatId');
const storedChatId = localStorage.getItem('lastChatId');
const chatIdToUse = chatIdFromURL || storedChatId; 
  const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();
 const [anonLoading, setAnonLoading] = useState(false);
  const contextUser = student || counsellor;
  const userType = contextUser?.user_type;
  const token = userType === 'student' ? studentToken : counsellorToken;
  const isStudent = userType === 'student';
  const [unreadIds, setUnreadIds] = useState([]);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [mobileView, setMobileView] = useState(() => !chatIdFromURL);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [messageUpdateCounter, setMessageUpdateCounter] = useState(0); 
   const messagesEndRef = useRef(null);


  const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;

const messages = useMemo(() => chatMap[chatSession?.item_id] || [], [chatMap, chatSession?.item_id, messageUpdateCounter]); 

const normalizeFileType = (type) => {
  if (!type) return null;
  const t = type.toLowerCase();
  if (t.includes('image')) return 'image';
  if (t.includes('pdf')) return 'pdf';
  if (t.includes('doc')) return 'doc';
  if (t.includes('video')) return 'video';
  if (t.includes('audio')) return 'audio';
  return 'file'; 
};

const extractFileData = (data) => {
  if (Array.isArray(data.attachments) && data.attachments.length > 0) {
    const a = data.attachments[0];
    return {
      file: a?.location || null,
      fileType: normalizeFileType(a?.attachments_type),
    };
  }
  if (Array.isArray(data.media) && data.media.length > 0) {
    const m = data.media[0];
    return {
      file: m?.location || null,
      fileType: normalizeFileType(m?.media_type),
    };
  }
  return { file: null, fileType: null };
};

const loadOlderMessages = async () => {
  if (!chatSession?.item_id || !token || loadingMessages) return;

  const offset = chatMap[chatSession.item_id]?.length || 0;
  setLoadingMessages(true);

  try {
    const res = await axiosClient.get(
      `/vpc/get-messages/${chatSession.item_id}/?offset=${offset}&limit=10`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const olderMessages = res.data?.messages || [];

    if (olderMessages.length === 0 || !res.data?.has_more) {
      setHasMoreMessages(false);
      return;
    }

    const formatted = olderMessages.map(msg => ({
      ...msg,
      file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
      fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
      time: new Date(msg.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      groupDate: formatMessageDate(msg.created_at),
      seen_users: msg.seen_users || [],
    }));

    setChatMap(prev => {
      const updated = dedupeMessages([
        ...formatted,
        ...(prev[chatSession.item_id] || []),
      ]);

      // 🔐 Persist updated message list to localStorage
      localStorage.setItem(
        `chat_messages_${chatSession.item_id}`,
        JSON.stringify(updated.slice(-200))
      );

      return {
        ...prev,
        [chatSession.item_id]: updated,
      };
    });
  } catch (err) {
    console.error('Failed to load older messages:', err);
  } finally {
    setLoadingMessages(false);
  }
};


useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container) return;

 
  if (userIsNearBottom) {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }
}, [messages, userIsNearBottom]);


useEffect(() => {
  const container = scrollContainerRef.current;
  if (!container || !chatSession?.item_id) return;

  const handleScroll = () => {
    if (container.scrollTop === 0 && hasMoreMessages && !loadingMessages) {
      loadOlderMessages();
    }
  };

  container.addEventListener('scroll', handleScroll);
  return () => container.removeEventListener('scroll', handleScroll);
}, [chatSession?.item_id, hasMoreMessages, loadingMessages]);




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
   setChatMap(prev => ({ ...prev, [sessionData.item_id]: msgList }));
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

  const fetchChatFromQueryParam = async () => {
    if (!chatIdToUse || !token) return;

    setLoadingMessages(true);
    try {
      const localKey = `chat_messages_${chatIdToUse}`;
      const cached = localStorage.getItem(localKey);
      let localMessages = [];

      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            localMessages = parsed;
          }
        } catch (err) {
          console.warn('Corrupt localStorage messages:', err);
        }
      }

      const res = await axiosClient.get(`/vpc/get-messages/${chatIdToUse}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const rawMessages = Array.isArray(res.data) ? res.data : [];

      const formattedMessages = rawMessages.map((msg) => {
        const isFromCurrentUser = msg.from_counselor
          ? userType === 'counsellor'
          : userType === 'student';

        const sender = msg.from_counselor
          ? msg.sender_counselor
          : msg.sender_user;

        const lastname = msg.from_counselor
          ? sender?.fullname?.split(' ').slice(-1)[0] || ''
          : sender?.lastname || '';

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
          seen_users: msg.seen_users || [],
        };
      });

      const merged = dedupeMessages([...localMessages, ...formattedMessages]);

      setChatMap(prev => ({
        ...prev,
        [chatIdToUse]: merged,
      }));

      localStorage.setItem(localKey, JSON.stringify(merged.slice(-200)));

      const unread = merged
        .filter(msg => !msg.read && msg.sender !== userType)
        .map(msg => msg.item_id);
      setUnreadIds(unread);

      const partnerData = merged.length
        ? isStudent
          ? merged[0]?.sender_counselor
          : merged[0]?.sender_user
        : null;

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
      console.error('Failed to auto-load chat:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  fetchChatFromQueryParam();
}, [chatIdToUse, isStudent, userType, token]); 






useEffect(() => {
  if (!chatSession) return;

  const data = isStudent ? chatSession.counselor_data : chatSession.user_data;
  if (data) {
    setPartnerInfo(data);
  }
}, [chatSession, isStudent]);


useEffect(() => { 
  if (!chatSession?.item_id || !Array.isArray(messages)) return;

  const key = `chat_messages_${chatSession.item_id}`;
  const uniqueMessages = dedupeMessages(messages).slice(-200);
  localStorage.setItem(key, JSON.stringify(uniqueMessages));
}, [messages, chatSession]);



  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

useEffect(() => {
  if (chatSession?.item_id && token) {
 fetchChatMessages(chatSession.item_id, token, true);
  }
}, [chatSession?.item_id, token]);


useEffect(() => {
  const handleVisibilityChange = () => {
    if (
      document.visibilityState === 'visible' &&        
      chatSession?.item_id &&                          
      token                                            
    ) {
    fetchChatMessages(chatSession.item_id, token, true);  
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [chatSession?.item_id, token, fetchChatMessages]);
useEffect(() => {
  const interval = setInterval(() => {
    if (
      document.visibilityState === 'visible' &&
      chatSession?.item_id &&
      token
    ) {
     fetchChatMessages(chatSession.item_id, token, true);  
    }
  }, 15000); 

  return () => clearInterval(interval);
}, [chatSession?.item_id, token, fetchChatMessages]);




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

    ws.onopen = () => console.log('[WebSocket] Connected');
    ws.onerror = (e) => console.error('[WebSocket] Error:', e);
    ws.onclose = () => console.log('[WebSocket] Disconnected');

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    const hasContent =
      !!data.text ||
      (Array.isArray(data.attachments) && data.attachments.length > 0) ||
      (Array.isArray(data.media) && data.media.length > 0);

    if (hasContent && data.item_id) {
      const createdAt = new Date(data.created_at || Date.now()); 
      const sender = data.sender || (data.from_counselor ? 'counsellor' : 'student');
      const isFromCurrentUser = sender === userType;
      const { file, fileType } = extractFileData(data);

      const newMsg = {
        id: data.item_id,
        clientMessageId: data.clientMessageId || null,
        sender,
        text: data.text || '',
        file,
        fileType,
        time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groupDate: formatMessageDate(createdAt),
        read: false,
        studentAnonymous: data.anonymous ?? false,
        isFromCurrentUser,
        senderFullname: data.sender_counselor?.fullname || data.sender_user?.fullname,
        senderAvatar: data.sender_counselor?.profilePhoto?.best || data.sender_user?.profilePhoto,
      };

setChatMap((prev) => {
  const existing = prev[chatSession.item_id] || [];

  const filtered = existing.filter((msg) => {
    if (data.clientMessageId && msg.clientMessageId) {
      return msg.clientMessageId !== data.clientMessageId;
    }
    const isTemp = msg.id?.startsWith('temp');
    const isTextMatch = !!msg.text && msg.text === data.text && !msg.file && !data.file;
    const isFileMatch = !!msg.file && msg.file.startsWith('blob:') && msg.fileType === fileType;
    return !(isTemp && (isTextMatch || isFileMatch));
  });

  const updated = [...filtered, newMsg];

  
  const key = `chat_messages_${chatSession.item_id}`;
  const unique = dedupeMessages(updated).slice(-200);
  localStorage.setItem(key, JSON.stringify(unique));

  return {
    ...prev,
    [chatSession.item_id]: unique,
  };
});



      setMessageUpdateCounter((c) => c + 1);
    }
    if (data?.type === 'seen_update' && data.userId && Array.isArray(data.messageIds)) {
      setChatMap(prev => ({
        ...prev,
        [chatSession.item_id]: (prev[chatSession.item_id] || []).map(msg =>
          data.messageIds.includes(msg.item_id)
            ? {
                ...msg,
                seen_users: [...new Set([...(msg.seen_users || []), data.userId])]
              }
            : msg
        )
      }));
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
const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
const tempId = `temp-${now.getTime()}`;


  setNewMessage('');
  setFile(null);
  setTyping(false);


  try {
    await sendMessage({
      chatId: chatSession.item_id,
      text: newMessage.trim(),
      file,
      userType,
      token,
      contextUser,
      isStudent,
      anonymous,
      clientMessageId, 
    });
  } catch (error) {
    console.error('[handleSend] Message send failed:', error?.response?.data || error.message);
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

  setChatMap(prev => ({
  ...prev,
  [chatSession.item_id]: (prev[chatSession.item_id] || []).map(msg =>
    unseenIds.includes(msg.item_id)
      ? { ...msg, seen_users: [...new Set([...(msg.seen_users || []), currentUserId])] }
      : msg
  ),
}));
}, [messages, contextUser, chatSession]);

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
<div  ref={scrollContainerRef}
className="flex-1 px-3 py-2 overflow-y-auto space-y-2 bg-gray-50 relative">
{hasMoreMessages && (
  <div className="text-center my-2">
    <button
      onClick={loadOlderMessages}
      disabled={loadingMessages}
      className="px-3 py-1 bg-gray-200 rounded text-sm"
    >
      {loadingMessages ? "Loading..." : "Load older messages"}
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
          {msg.text && (
          <div className="whitespace-pre-wrap break-words text-sm overflow-hidden">
            <strong title={getSenderName(msg)}>{getSenderName(msg)}:</strong> {msg.text}
          </div>)}
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
         {msg.isFromCurrentUser
  ? msg.seen_users?.includes(partnerInfo?.item_id)
    ? '✓✓'
    : '✓'
  : ''}
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

  {!userIsNearBottom && (
  <button
    onClick={() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }}
    className="fixed bottom-24 right-4 z-50 bg-purple-600 text-white px-3 py-1 rounded-full shadow-md text-sm"
  >
    ↓ New messages
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
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                const value = e.target.value;
                setNewMessage(value);
                setTyping(true);
                if (
                  websocketRef.current &&
                  websocketRef.current.readyState === WebSocket.OPEN &&
                  chatSession?.item_id
                ) {
                  websocketRef.current.send(
                    JSON.stringify({
                      type: 'typing',
                      sender: userType,
                      chatId: chatSession.item_id,
                      anonymous: isStudent ? anonymous : false,
                    })
                  );
                }
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
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