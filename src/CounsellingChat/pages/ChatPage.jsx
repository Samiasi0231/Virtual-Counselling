import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
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
  const websocketRef = useRef(null);
  const location = useLocation();
  const chatIdFromURL = new URLSearchParams(location.search).get('chatId');
  const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();

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
  const messagesEndRef = useRef(null);

  const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;

  const isStudentAnonymous = chatSession?.user_anonymous;

  const displayName = (() => {
    if (isStudent) {
      return partnerInfo?.fullname || `${partnerInfo?.firstname || ''} ${partnerInfo?.lastname || ''}`.trim() || 'Counselor';
    }
    if (!isStudent) {
      return isStudentAnonymous ? 'Anonymous' : partnerInfo?.fullname || `${partnerInfo?.firstname || ''} ${partnerInfo?.lastname || ''}`.trim() || 'Student';
    }
    return 'Unknown';
  })();

  const displayAvatar = (() => {
    const photo = normalizeProfilePhoto(partnerInfo?.profilePhoto) || partnerInfo?.avatar || null;
    if (isStudent) return photo;
    if (!isStudent) return isStudentAnonymous ? null : photo;
    return null;
  })();

  if (!['student', 'counsellor'].includes(userType)) {
    return <p className="text-center text-red-500">Unauthorized user</p>;
  }

  const handleChatSelect = (fullMessages, partnerData, messages, sessionData) => {
    setPartnerInfo(partnerData);
    setMessages(fullMessages || messages || []);
    setChatSession(sessionData);
    const unread = (fullMessages || messages || []).filter((msg) => !msg.read && msg.sender !== userType).map((msg) => msg.id);
    setUnreadIds(unread);
    if (isStudent && sessionData?.item_id) {
      const savedAnonymous = getAnonymousForChat(sessionData.item_id);
      setAnonymous(savedAnonymous);
    }
    setMobileView(false);
  };

  const partner = userType === 'student'
    ? chatSession?.counselor_data?.fullname || 'Counselor'
    : `${chatSession?.user_data?.lastname || 'Student'} ${chatSession?.user_data?.lastname || ''}`;

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => setTyping(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  useEffect(() => {
    const fetchChatFromQueryParam = async () => {
      if (!chatIdFromURL || !token) return;
      try {
        const res = await axiosClient.get(`/vpc/get-messages/${chatIdFromURL}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = res.data;
        const partnerData = isStudent ? data.counselor_data : data.user_data;
        const fullMessages = data.fullMessages || data.messages || [];
        const unread = fullMessages.filter((msg) => !msg.read && msg.sender !== userType).map((msg) => msg.id);
        setUnreadIds(unread);
        setPartnerInfo(partnerData);
        setMessages(fullMessages);
        setChatSession({
          item_id: chatIdFromURL,
          user_anonymous: data.user_anonymous ?? false,
        });
        if (isStudent) {
          const savedAnonymous = getAnonymousForChat(chatIdFromURL);
          setAnonymous(savedAnonymous);
        }
        setMobileView(false);
      } catch (err) {
        console.error('Failed to auto-load chat:', err);
      }
    };
    fetchChatFromQueryParam();
  }, [chatIdFromURL, isStudent, userType, token]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleAnonymous = async () => {
    if (!isStudent || !chatSession?.item_id || !token) return;
    const chatId = chatSession.item_id;
    const newAnonymousState = !anonymous;
    try {
      const response = await axiosClient.put(
        `/vpc/update-anonymous/${chatId}/`,
        { user_anonymous: newAnonymousState },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updated = response.data?.user_anonymous;
      if (typeof updated === 'boolean') {
        setAnonymous(updated);
        setAnonymousForChat(chatId, updated);
        setChatSession((prev) => ({ ...prev, user_anonymous: updated }));
      }
    } catch (error) {
      console.error('Failed to toggle anonymous mode:', error.response?.data || error.message);
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
    console.log('[WebSocket Payload]', data);

    if (data.media?.length) {
      console.log('[WebSocket Incoming Media]', data.media);
    }

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
        date: now.toLocaleDateString(),
        read: false,
        studentAnonymous: data.anonymous ?? false,
        isFromCurrentUser,
      };

      console.log('[Adding Message]', newMsg);

      setMessages((prev) => {
        const filtered = prev.filter(
          (msg) => !(msg.id?.startsWith('temp') && msg.text === data.text)
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
        date: now.toLocaleDateString(),
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        file: file ? URL.createObjectURL(file) : null,
        read: false,
        studentAnonymous: isStudent ? anonymous : false,
      },
    ]);

    setNewMessage('');
    setFile(null);
    setTyping(false);

    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append('text', newMessage.trim());
      if (file) formData.append('file', file);
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
    if (msg.isFromCurrentUser) return isStudent ? (anonymous ? 'Anonymous' : 'You') : 'You';
    if (msg.sender === 'student') return msg.studentAnonymous ? 'Anonymous' : 'Student';
    if (msg.sender === 'counsellor') return 'Counsellor';
    return 'Unknown';
  };



  return (
    <div className="h-screen flex flex-col md:flex-row bg-gray-100">
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => setMobileView(true)} className="text-purple-600">
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
        />
      </div>
      <div className={`flex flex-col flex-1 bg-white shadow-md border-l ${mobileView ? 'hidden md:flex' : 'flex'}`}>
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
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
{messages.map((msg) => (
  <div key={msg.id} className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'}`}>
    <div
      className={`p-3 rounded-2xl max-w-xs transition-all duration-300 
        ${msg.isFromCurrentUser ? 'bg-green-100' : 'bg-white border'} 
        ${unreadIds.includes(msg.id) ? 'ring-2 ring-purple-400' : ''}`}
    >
      <div className="whitespace-pre-wrap text-sm">
        <strong>{getSenderName(msg)}:</strong> {msg.text}
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
        📎 <a href={msg.file} target="_blank" rel="noopener noreferrer">{msg.file}</a>
      </p>
    )}
  </>
)}

      <span className="text-[10px] text-gray-500 block mt-1 text-right">
        {msg.isFromCurrentUser ? '✓' : (msg.read ? '✓✓' : '✓')} {msg.time} | {msg.date}
      </span>
    </div>
  </div>
))}

{typing && typing.sender && typing.sender !== userType && (
  <div className="text-sm italic text-gray-500">
    {typing.sender === 'student'
      ? (typing.anonymous ? 'Anonymous' : 'Student')
      : 'Counsellor'} is typing...
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
  {/* File Upload Icon */}
  <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
    <FiPaperclip size={20} />
  </label>

  {/* Hidden File Input */}
  <input
    id="file-upload"
    type="file"
    accept="image/*"
    className="hidden"
  onChange={(e) => {
  const selected = e.target.files[0];
  console.log('[Selected Image File]', selected);
  setFile(selected);
}}
  />

  {/* Chat Text Input with WebSocket Typing Event */}
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

  {/* Send Button */}
  <button onClick={handleSend} className="text-purple-700 hover:text-purple-900">
    <FiSend size={20} />
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ChatPage;
