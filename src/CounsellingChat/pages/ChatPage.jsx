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
  const location = useLocation();
  const chatIdFromURL = new URLSearchParams(location.search).get('chatId');
  const [{ student, counsellor }] = useStateValue();
  const contextUser = student || counsellor;
  const userType = contextUser?.user_type;
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

  const currentUserName = `${contextUser?.firstname || ''} ${contextUser?.lastname || ''}`.trim();
  const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;

  const isStudentAnonymous = chatSession?.user_anonymous;

const displayName = (() => {
  // If the user is a student, they should always see their counselor's name
  if (isStudent) {
    return partnerInfo?.fullname || `${partnerInfo?.firstname || ''} ${partnerInfo?.lastname || ''}`.trim() || 'Counselor';
  }

  // If the user is a counselor, and student is anonymous
  if (!isStudent) {
    return isStudentAnonymous ? 'Anonymous' : partnerInfo?.fullname || `${partnerInfo?.firstname || ''} ${partnerInfo?.lastname || ''}`.trim() || 'Student';
  }

  return 'Unknown';
})();
const displayAvatar = (() => {
  const photo = normalizeProfilePhoto(partnerInfo?.profilePhoto) || partnerInfo?.avatar || null;

  if (isStudent) {
    return photo; // Always show counselor's avatar
  }

  if (!isStudent) {
    return isStudentAnonymous ? null : photo;
  }

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
      if (!chatIdFromURL) return;
      try {
        const token = localStorage.getItem('auth_token');
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
  }, [chatIdFromURL, isStudent, userType]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const toggleAnonymous = async () => {
    if (!isStudent || !chatSession?.item_id) return;
    const chatId = chatSession.item_id;
    const token = localStorage.getItem('auth_token');
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

  const handleSend = async () => {
    if (!newMessage.trim() && !file) return;
    const chatroomId = chatSession?.item_id;
    if (!chatroomId) return;
    try {
      const formData = new FormData();
      if (newMessage.trim()) formData.append('text', newMessage.trim());
      if (file) formData.append('file', file);
      const token = localStorage.getItem('auth_token');
      const response = await axiosClient.post(
        `/vpc/create-message/${chatroomId}/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const result = response.data;
      const now = new Date();
      const BASE_MEDIA_URL = 'https://your-domain.com/media/';
      const mediaUrl = result.media?.[0]
        ? result.media[0].startsWith('http')
          ? result.media[0]
          : `${BASE_MEDIA_URL}${result.media[0]}`
        : null;
      setMessages((prev) => [
        ...prev,
        {
          id: result.item_id,
          sender: userType,
          partner,
          text: result.text,
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          date: now.toLocaleDateString(),
          file: mediaUrl,
          read: false,
          studentAnonymous: isStudent ? anonymous : false,
        },
      ]);
      setNewMessage('');
      setFile(null);
      setTyping(false);
    } catch (error) {
      console.error('Failed to send message', error.response?.data || error.message);
    }
  };

  const getSenderName = (msg) => {
    if (msg.sender === userType) {
      return userType === 'student' ? (anonymous ? 'Anonymous' : 'You') : 'You';
    } else {
      if (msg.sender === 'student') return msg.studentAnonymous ? 'Anonymous' : 'Student';
      if (msg.sender === 'counselor') return 'Counselor';
    }
    return '';
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
          {messages
            .filter((msg) => msg.partner === partner)
            .map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-2xl max-w-xs transition-all duration-300 ${
                    msg.sender === userType ? 'bg-green-100' : 'bg-white border'
                  } ${unreadIds.includes(msg.id) ? 'ring-2 ring-purple-400' : ''}`}
                >
                  <div className="whitespace-pre-wrap text-sm">
                    <strong>{getSenderName(msg)}:</strong> {msg.text}
                  </div>
                  {msg.file && <p className="text-xs text-blue-600 mt-1">📎 {msg.file}</p>}
                  <span className="text-[10px] text-gray-500 block mt-1 text-right">
                    {msg.sender !== userType && msg.read ? '✓✓ ' : '✓ '}
                    {msg.time} | {msg.date}
                  </span>
                </div>
              </div>
            ))}
          {typing && (
            <div className="text-sm italic text-gray-500">
              {(isStudent && anonymous ? 'Anonymous' : currentUserName || 'User')} is typing...
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
              onChange={(e) => setFile(e.target.files[0])}
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setTyping(true);
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
      </div>
    </div>
  );
};

export default ChatPage;
