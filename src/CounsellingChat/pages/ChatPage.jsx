import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
import { useLocation,useNavigate,useSearchParams } from 'react-router-dom';
import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
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

const ChatPage = ({ initialRole = 'student' }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
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
  const messagesEndRef = useRef(null);

  const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;

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
  const fetchChatFromQueryParam = async () => {
    if (!chatIdToUse || !token) return;

    setLoadingMessages(true);

    try {
      // ✅ 1. Load from cache and keep them until real data arrives
      const cached = localStorage.getItem(`chat_messages_${chatIdToUse}`);
      if (cached) {
        const parsedCached = JSON.parse(cached);
        if (Array.isArray(parsedCached)) {
          setMessages(parsedCached); // ✅ Set cached messages immediately
        }
      }

      // ✅ 2. Fetch fresh messages
      const res = await axiosClient.get(`/vpc/get-messages/${chatIdToUse}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      const msgArray = Array.isArray(data)
        ? data.map((msg) => {
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
              file: msg.media?.[0]?.url || null,
              fileType: msg.media?.[0]?.type || null,
              text: msg.text || '',
              time: new Date(msg.created_at).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              }),
              groupDate: formatMessageDate(msg.created_at),
              studentAnonymous: msg.anonymous ?? false,
              senderLastName: lastname,
            };
          })
        : [];

      // ✅ 3. Save latest fetched messages to state and localStorage
      setMessages(msgArray); // ✅ This replaces the cached messages
      localStorage.setItem(
        `chat_messages_${chatIdToUse}`,
        JSON.stringify(msgArray)
      );

      const unread = msgArray
        .filter((msg) => !msg.read && msg.sender !== userType)
        .map((msg) => msg.item_id);

      const partnerData = msgArray.length
        ? isStudent
          ? msgArray[0]?.sender_counselor
          : msgArray[0]?.sender_user
        : null;

      setUnreadIds(unread);
      setPartnerInfo(partnerData);

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
      console.error('❌ Failed to auto-load chat:', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  fetchChatFromQueryParam();
}, [chatIdToUse, isStudent, userType, token]);


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

    ws.onopen = () => console.log('[WebSocket] Connected');
    ws.onerror = (e) => console.error('[WebSocket] Error:', e);
    ws.onclose = () => console.log('[WebSocket] Disconnected');

  ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);

    if (data?.text && data?.item_id) {
      const now = new Date();
      const sender = data.sender || (data.from_counselor ? 'counsellor' : 'student');
      const isFromCurrentUser = sender === userType;

      const newMsg = {
        id: data.item_id || now.getTime(),
        sender,
        text: data.text,
        file: data.media?.[0]?.url || null,
        fileType: data.media?.[0]?.type || null,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        groupDate: formatMessageDate(now),
        read: false,
        studentAnonymous: data.anonymous ?? false,
        isFromCurrentUser,
        senderFullname: data.sender_counselor?.fullname || data.sender_user?.fullname,
        senderAvatar: data.sender_counselor?.profilePhoto?.best || data.sender_user?.profilePhoto,
      };

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) =>
            msg.id !== newMsg.id &&
            !(msg.id?.startsWith('temp') && msg.text === data.text)
        );
        return [...filtered, newMsg];
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

  setMessages((prev) => [
  ...prev,
  {
    id: tempId,
    sender: userType,
    text: newMessage,
    file: file ? URL.createObjectURL(file) : null,
    fileType: file?.type || null,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    groupDate: formatMessageDate(now), 
    read: false,
    isFromCurrentUser: true,     
    studentAnonymous: isStudent ? anonymous : false,
    senderFullname: contextUser?.fullname || '', 
    senderAvatar: normalizeProfilePhoto(contextUser?.profilePhoto),
  },
]);


    setNewMessage('');
    setFile(null);
    setTyping(false);

    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append('text', newMessage.trim());
   if (file) formData.append('media', file);
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
const groupedMessages = messages.reduce((groups, msg) => {
const label = msg.groupDate || formatMessageDate(msg.created_at);
 if (!groups[label]) groups[label] = [];
  groups[label].push(msg);
  return groups;
}, {});


  return (
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
  <div className={`w-full md:w-64 ${mobileView ? 'block' : 'hidden'} md:block`}>
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

   <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 relative">
  {loadingMessages && (
    <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white/60 z-10">
      <span className="text-sm text-gray-500">Loading messages...</span>
    </div>
  )}

  {Object.entries(groupedMessages).map(([date, msgs]) => (
    <div key={date}>
      <div className="text-center text-xs text-gray-500 my-3">{date}</div>
      {msgs.map(msg => (
        <div
          key={msg.id}
          className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'} items-start gap-2 mb-2`}
        >
          {/* Avatar for received messages only */}
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
            className={`p-3 rounded-2xl max-w-xs transition-all duration-300 ${
              msg.isFromCurrentUser ? 'bg-green-100' : 'bg-white border'
            } ${unreadIds.includes(msg.id) ? 'ring-2 ring-purple-400' : ''}`}
          >
            <div className="whitespace-pre-wrap text-sm">
              <strong title={getSenderName(msg)}>{getSenderName(msg)}:</strong> {msg.text}
            </div>

            {/* Media preview */}
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

            {/* Read Status + Time */}
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

  );
};

export default ChatPage;
