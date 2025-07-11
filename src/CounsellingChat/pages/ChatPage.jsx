import React, { useState, useEffect } from 'react';
import { FiSend, FiPaperclip, FiUser, FiUserX } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';
import Avatar from 'react-avatar';

const ChatPage = ({ initialRole = 'student' }) => {
  const [{ student, counsellor }] = useStateValue();
  const contextUser = student || counsellor;
  const userType = contextUser?.user_type;
  const [chatSession, setChatSession] = useState(null);

  const [partnerInfo, setPartnerInfo] = useState(null);
  const [anonymous, setAnonymous] = useState(false);
  const isStudent = userType === 'student';
  const currentUserName = `${contextUser?.firstname || ''} ${contextUser?.lastname || ''}`.trim();


  const normalizeProfilePhoto = (photo) =>
    typeof photo === 'object' ? photo?.best : photo;

  const displayName =
    isStudent && anonymous
      ? 'Anonymous'
      : partnerInfo?.fullname || `${contextUser?.firstname || ''} ${contextUser?.lastname || ''}` || 'Unknown';

  const displayAvatar =
    isStudent && anonymous
      ? null
      : normalizeProfilePhoto(partnerInfo?.profilePhoto) ||
        partnerInfo?.avatar ||
        normalizeProfilePhoto(contextUser?.profilePhoto) ||
        null;

  if (!['student', 'counsellor'].includes(userType)) {
    return <p className="text-center text-red-500">Unauthorized user</p>;
  }

 const handleChatSelect = (fullMessages, partnerData, messages, sessionData) => {
  setPartnerInfo(partnerData);
  setMessages(fullMessages || messages || []);
  setChatSession(sessionData); 
};


  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

const partner =
  userType === 'student'
    ? chatSession?.counselor_data?.fullname || 'Counselor'
    : `${chatSession?.user_data?.lastname || 'Student'} ${chatSession?.user_data?.lastname || ''}`;

const partnersList = [partner];
// Step 2: now use partner safely in useEffect
useEffect(() => {
  // ✅ Part 1: Mark messages as read
  setMessages((prev) =>
    prev.map((msg) =>
      msg.sender !== userType && !msg.read && msg.partner === partner
        ? { ...msg, read: true }
        : msg
    )
  );

  if (typing) {
    const timer = setTimeout(() => setTyping(false), 1500);
    return () => clearTimeout(timer);
  }
}, [partner, typing]);


  const toggleAnonymous = () => {
    if (isStudent) setAnonymous((prev) => !prev);
  };

const handleSend = async () => {
  if (!newMessage.trim() && !file) return;

  const chatroomId = chatSession?.item_id;
  if (!chatroomId) {
    console.error('Chatroom ID is missing');
    return;
  }

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
    const sentMsg = {
      id: result.item_id,
      sender: userType,
      partner,
      text: result.text,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toLocaleDateString(),
      file: result.media?.[0] || null,
      read: false,
      studentAnonymous: isStudent ? anonymous : false,
    };

    setMessages((prev) => [...prev, sentMsg]);
    setNewMessage('');
    setFile(null);
    setTyping(false);
    setEditingId(null);
    setEditText('');
  } catch (error) {
    console.error('Failed to send message', error.response?.data || error.message);
  }
};




  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleEditChange = (e) => setEditText(e.target.value);

  const saveEdit = (id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, text: editText } : msg))
    );
    setEditingId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
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
    <div className="overflow-auto mx-auto h-screen flex bg-gray-100">
      {/* Sidebar */}
      <ChatSidepanel
        partner={partner}
        partnersList={partnersList}
          onChatSelect={handleChatSelect}
        setMessages={setMessages}
        isStudent={contextUser?.user_type === 'student'}
      />

      {/* Chat Panel */}
      <div className="flex flex-col flex-1 max-w-4xl bg-white shadow-md border-l overflow-hidden">
        {/* Chat Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center gap-2">
            {displayAvatar ? (
              <img src={displayAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
            ) : (
              <Avatar name={displayName} size="32" round className="w-8 h-8" />
            )}
            <span className="font-semibold text-gray-700">{displayName}</span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <select
              value={partner}
              onChange={() => {}}
              className="text-sm border p-1 rounded bg-white"
              disabled
            >
              <option value={partner}>{partner}</option>
            </select>

            {isStudent && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  {anonymous ? <FiUserX /> : <FiUser />}
                  {anonymous ? 'Anonymous' : 'Visible'}
                </span>
                <div
                  onClick={toggleAnonymous}
                  className={`w-14 h-7 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
                    anonymous ? 'bg-gray-600' : 'bg-purple-500'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      anonymous ? 'translate-x-0' : 'translate-x-7'
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages
            .filter((msg) => msg.partner === partner)
            .map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === userType ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`p-3 rounded-2xl max-w-xs ${
                    msg.sender === userType ? 'bg-green-100' : 'bg-white border'
                  }`}
                >
                  {editingId === msg.id ? (
                    <>
                      <textarea
                        value={editText}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end text-xs">
                        <button onClick={() => saveEdit(msg.id)} className="text-green-600">
                          Save
                        </button>
                        <button onClick={cancelEdit} className="text-red-600">
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm">
                        <strong>{getSenderName(msg)}:</strong> {msg.text}
                      </div>
                      {msg.file && <p className="text-xs text-blue-600 mt-1">📎 {msg.file}</p>}
                      <span className="text-[10px] text-gray-500 block mt-1 text-right">
                        {msg.sender !== userType && msg.read ? '✓✓ ' : '✓ '}
                        {msg.time} | {msg.date}
                      </span>
                      {msg.sender === userType && (
                        <div className="flex gap-2 justify-end text-xs mt-1">
                          <button onClick={() => startEditing(msg.id, msg.text)} className="text-blue-500">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(msg.id)} className="text-red-500">
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
       {typing && (
  <div className="text-sm italic text-gray-500">
    {currentUserName || 'User'} is typing...
  </div>
)}
        </div>

        {/* Input */}
     <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
  {/* File Input */}
  <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
    <FiPaperclip size={20} />
  </label>
  <input
    id="file-upload"
    type="file"
    className="hidden"
    onChange={(e) => setFile(e.target.files[0])}
  />

  {/* Message Input */}
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

  {/* Send Button */}
  <button onClick={handleSend} className="text-purple-700 hover:text-purple-900">
    <FiSend size={20} />
  </button>
</div>
      </div>
    </div>
  );
};

export default ChatPage;
