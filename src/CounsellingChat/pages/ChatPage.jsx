import React, { useState, useEffect } from 'react';
import { FiSend, FiPaperclip, FiUser, FiUserX } from 'react-icons/fi';
import { useStateValue } from '../../Context/UseStateValue';
import axiosClient from '../../utils/axios-client-analytics';
import ChatSidepanel from '../ChatSidepanel';

const ChatPage = ({ initialRole = 'student' }) => {
  const [{ student, counsellor }] = useStateValue();
  const contextUser = student || counsellor;
  const userType = contextUser?.user_type;

  // unauthorized users can't access chat
  if (!['student', 'counsellor'].includes(userType)) {
    return <p className="text-center text-red-500">Unauthorized user</p>;
  }

  // ✅ NEW: State to store fetched chat session
  const [chatSession, setChatSession] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'counselor',
      partner: 'Counselor',
      text: 'Hi there, how can I help you today?',
      time: '9:00 AM',
      date: new Date().toLocaleDateString(),
      read: false,
      studentAnonymous: false,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const [user, setUser] = useState({
    name: initialRole === 'student' ? 'You' : 'Counselor',
    role: initialRole,
    anonymous: false,
  });

  // ✅ Fetch chat session on load
  useEffect(() => {
    const fetchChatSession = async () => {
      try {
        const res = await axiosClient.post(`/vpc/start-chat/${mentor_id}/`, {
          user_id: contextUser?.item_id,
        });
        setChatSession(res.data);
      } catch (err) {
        console.error('Error fetching chat session:', err);
      }
    };

    if (contextUser?.item_id) {
      fetchChatSession();
    }
  }, [contextUser]);


  // ✅ Update partner info dynamically based on fetched chat session
  const partner =
    user.role === 'student'
      ? chatSession?.counselor_data?.fullname || 'Counselor'
      : `${chatSession?.user_data?.firstname || 'Student'} ${chatSession?.user_data?.fullname || ''}`;

  const partnersList = [partner];



  const toggleAnonymous = () => {
    if (user.role === 'student') {
      setUser((prev) => ({
        ...prev,
        anonymous: !prev.anonymous,
        name: !prev.anonymous ? 'Anonymous' : 'You',
      }));
    }
  };

  useEffect(() => {
    if (typing) {
      const timer = setTimeout(() => setTyping(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [typing]);

  useEffect(() => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.sender === 'counselor' && !msg.read && msg.partner === partner
          ? { ...msg, read: true }
          : msg
      )
    );
  }, [partner]);

  const handleSend = () => {
    if (newMessage.trim() || file) {
      const now = new Date();
      const newMsg = {
        id: messages.length + 1,
        sender: user.role,
        partner,
        text: newMessage,
        time: now.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        date: now.toLocaleDateString(),
        file: file ? file.name : null,
        read: false,
        studentAnonymous: user.role === 'student' ? user.anonymous : false,
      };
      setMessages([...messages, newMsg]);
      setNewMessage('');
      setFile(null);
      setTyping(false);
      setEditingId(null);
      setEditText('');
    }
  };

  const startEditing = (id, currentText) => {
    setEditingId(id);
    setEditText(currentText);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

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
    if (msg.sender === user.role) {
      if (user.role === 'student') {
        return user.anonymous ? 'Anonymous' : 'You';
      } else {
        return 'You';
      }
    } else {
      if (msg.sender === 'student') {
        return msg.studentAnonymous ? 'Anonymous' : 'Student';
      } else if (msg.sender === 'counselor') {
        return 'Counselor';
      }
    }
    return '';
  };

  return (
    <div className="overflow-auto mx-auto h-screen flex bg-gray-100">
      {/* Sidebar */}
    <ChatSidepanel setMessages={setMessages}
  partnersList={partnersList}
  partner={partner} />
      {/* Chat Panel */}
      <div className="flex flex-col flex-1 max-w-4xl bg-white shadow-md border-l overflow-hidden">
        {/* Chat Header */}
      <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
  {/* Partner avatar and name */}
  <div className="flex items-center gap-2">
    {contextUser?.user_type === 'student' && chatSession?.counselor_data?.avatar && (
      <img
        src={chatSession.counselor_data.avatar}
        alt="Counselor Avatar"
        className="w-8 h-8 rounded-full object-cover"
      />
    )}
    <span className="font-semibold text-gray-700">{partner}</span>
  </div>

  {/* Right Side: Dropdown + Anonymous Toggle (only for student user_type) */}
  <div className="flex items-center gap-4 ml-auto">
    <select
      value={partner}
      onChange={() => {}}
      className="text-sm border p-1 rounded bg-white"
      disabled
    >
      <option value={partner}>{partner}</option>
    </select>

    {/* ✅ Show toggle only for student user_type */}
    {contextUser?.user_type === 'student' && (
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-700 flex items-center gap-1">
          {user.anonymous ? <FiUserX /> : <FiUser />}
          {user.anonymous ? 'Anonymous' : 'Visible'}
        </span>
        <div
          onClick={toggleAnonymous}
          className={`w-14 h-7 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300 ${
            user.anonymous ? 'bg-gray-600' : 'bg-purple-500'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
              user.anonymous ? 'translate-x-0' : 'translate-x-7'
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
              <div key={msg.id} className={`flex ${msg.sender === user.role ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-3 rounded-2xl max-w-xs ${msg.sender === user.role ? 'bg-green-100' : 'bg-white border'}`}>
                  {editingId === msg.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end text-xs">
                        <button onClick={() => saveEdit(msg.id)} className="text-green-600">Save</button>
                        <button onClick={cancelEdit} className="text-red-600">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm">
                        <strong>{getSenderName(msg)}:</strong> {msg.text}
                      </div>
                      {msg.file && <p className="text-xs text-blue-600 mt-1">📎 {msg.file}</p>}
                      <span className="text-[10px] text-gray-500 block mt-1 text-right">
                        {msg.sender !== user.role && msg.read ? '✓✓ ' : '✓ '}
                        {msg.time} | {msg.date}
                      </span>
                      {msg.sender === user.role && (
                        <div className="flex gap-2 justify-end text-xs mt-1">
                          <button onClick={() => startEditing(msg.id, msg.text)} className="text-blue-500">Edit</button>
                          <button onClick={() => handleDelete(msg.id)} className="text-red-500">Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          {typing && <div className="text-sm italic text-gray-500">{partner} is typing...</div>}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
          <label className="cursor-pointer text-gray-500">
            <FiPaperclip size={20} />
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          </label>

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
  );
};

export default ChatPage;




















// import React, { useState, useEffect } from 'react';

// import { FiSend, FiPaperclip, FiChevronRight, FiUser, FiUserX } from 'react-icons/fi';

// import { useStateValue } from "../../Context/UseStateValue";

// const ChatPage = ({ initialRole = 'student' }) => {

//   const [{ student, counsellor }] = useStateValue();
//   const contextUser = student || counsellor;
//   const userType = contextUser?.user_type;

//   if (!["student", "counsellor"].includes(userType)) {
//     return <p className="text-center text-red-500">Unauthorized user</p>;
//   }

//   const [usersOpen, setUsersOpen] = useState(true);
//   const [chatsOpen, setChatsOpen] = useState(true);

//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       sender: 'counselor',
//       partner: 'Counselor',
//       text: 'Hi there, how can I help you today?',
//       time: '9:00 AM',
//       date: new Date().toLocaleDateString(),
//       read: false,
//       studentAnonymous: false,
//     },
//   ]);
//   const [newMessage, setNewMessage] = useState('');
//   const [typing, setTyping] = useState(false);
//   const [file, setFile] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   // Your local user state (chat user)
//   const [user, setUser] = useState({
//     name: initialRole === 'student' ? 'You' : 'Counselor',
//     role: initialRole,
//     anonymous: false,
//   });

//   const partner = user.role === 'student' ? 'Counselor' : 'Student';

//   const partnersList = [partner];

//   const toggleAnonymous = () => {
//     if (user.role === 'student') {
//       setUser((prev) => ({
//         ...prev,
//         anonymous: !prev.anonymous,
//         name: !prev.anonymous ? 'Anonymous' : 'You',
//       }));
//     }
//   };   

//   useEffect(() => {
//     if (typing) {
//       const timer = setTimeout(() => setTyping(false), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [typing]);

//   useEffect(() => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.sender === 'counselor' && !msg.read && msg.partner === partner
//           ? { ...msg, read: true }
//           : msg
//       )
//     );
//   }, [partner]);

//   const handleSend = () => {
//     if (newMessage.trim() || file) {
//       const now = new Date();
//       const newMsg = {
//         id: messages.length + 1,
//         sender: user.role,
//         partner,
//         text: newMessage,
//         time: now.toLocaleTimeString([], {
//           hour: '2-digit',
//           minute: '2-digit',
//         }),
//         date: now.toLocaleDateString(),
//         file: file ? file.name : null,
//         read: false,
//         studentAnonymous: user.role === 'student' ? user.anonymous : false,
//       };
//       setMessages([...messages, newMsg]);
//       setNewMessage('');
//       setFile(null);
//       setTyping(false);
//       setEditingId(null);
//       setEditText('');
//     }
//   };

//   const startEditing = (id, currentText) => {
//     setEditingId(id);
//     setEditText(currentText);
//   };

//   const handleEditChange = (e) => {
//     setEditText(e.target.value);
//   };

//   const saveEdit = (id) => {
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === id ? { ...msg, text: editText } : msg))
//     );
//     setEditingId(null);
//     setEditText('');
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditText('');
//   };

//   const handleDelete = (id) => {
//     setMessages((prev) => prev.filter((msg) => msg.id !== id));
//   };

//   const getSenderName = (msg) => {
//     if (msg.sender === user.role) {
//       if (user.role === 'student') {
//         return user.anonymous ? 'Anonymous' : 'You';
//       } else {
//         return 'You';
//       }
//     } else {
//       if (msg.sender === 'student') {
//         return msg.studentAnonymous ? 'Anonymous' : 'Student';
//       } else if (msg.sender === 'counselor') {
//         return 'Counselor';
//       }
//     }
//     return '';
//   };

//   return (
//     <div className="overflow-auto mx-auto h-screen flex bg-gray-100">
//       {/* Left Sidebar */}
//       <aside className="w-64 bg-white border-r p-4 space-y-6">
//         {/* Users List */}
//         <div>
//           <button
//             onClick={() => setUsersOpen(!usersOpen)}
//             className="flex items-center justify-between w-full text-left"
//           >
//             <h2 className="text-lg font-semibold text-violet-500">Users</h2>
//             <FiChevronRight
//               className={`transition-transform duration-300 ${usersOpen ? 'rotate-90' : ''}`}
//             />
//           </button>

//           {usersOpen && (
//             <ul className="mt-2 space-y-1 text-sm text-gray-800">
//               {partnersList.map((p) => (
//                 <li
//                   key={p}
//                   onClick={() => {}}
//                   className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
//                     p === partner ? 'bg-gray-100 font-semibold' : ''
//                   }`}
//                 >
//                   {p}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         <div>
//           <button
//             onClick={() => setChatsOpen(!chatsOpen)}
//             className="flex items-center justify-between w-full text-left"
//           >
//             <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
//             <FiChevronRight
//               className={`transition-transform duration-300 ${chatsOpen ? 'rotate-90' : ''}`}
//             />
//           </button>

//           {chatsOpen && (
//             <ul className="mt-2 space-y-1 text-sm text-gray-600">
//               <li className="p-2 rounded-md hover:bg-gray-100 cursor-pointer">
//                 <strong>{partner}:</strong>{' '}
//                 {messages.length > 0
//                   ? messages[messages.length - 1].text.slice(0, 25) +
//                     (messages[messages.length - 1].text.length > 25 ? '...' : '')
//                   : 'No messages yet'}
//               </li>
//             </ul>
//           )}
//         </div>
//       </aside>

//       {/* Main Chat Panel */}
//       <div className="flex flex-col flex-1 max-w-4xl bg-white shadow-md border-l overflow-hidden">
//         {/* Chat Header */}
//     <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
//   {/* Left: Partner name */}
//   <div className="font-semibold text-gray-700">{partner}</div>

//   {/* Right: Dropdown + (if student) toggle */}
//   <div className="flex items-center gap-4 ml-auto">
//     <select
//       value={partner}
//       onChange={() => {}}
//       className="text-sm border p-1 rounded bg-white"
//       disabled
//     >
//       <option value={partner}>{partner}</option>
//     </select>

//     {user.role === 'student' && (
//       <div className="flex items-center gap-2">
//         <span className="text-sm text-gray-700 flex items-center gap-1">
//           {user.anonymous ? <FiUserX /> : <FiUser />}
//           {user.anonymous ? 'Anonymous' : 'Visible'}
//         </span>
//         <div
//           onClick={toggleAnonymous}
//           className={`w-14 h-7 flex items-center rounded-full px-1 cursor-pointer transition-colors duration-300
//             ${user.anonymous ? 'bg-gray-600' : 'bg-purple-500'}`}
//         >
//           <div
//             className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
//               ${user.anonymous ? 'translate-x-0' : 'translate-x-7'}`}
//           />
//         </div>
//       </div>
//     )}
//   </div>
// </div>
//      {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
//           {messages
//             .filter((msg) => msg.partner === partner)
//             .map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${
//                   msg.sender === user.role ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 <div
//                   className={`p-3 rounded-2xl max-w-xs ${
//                     msg.sender === user.role ? 'bg-green-100' : 'bg-white border'
//                   }`}
//                 >
//                   {editingId === msg.id ? (
//                     <div>
//                       <textarea
//                         value={editText}
//                         onChange={handleEditChange}
//                         className="w-full p-2 border rounded mb-2"
//                         rows={3}
//                       />
//                       <div className="flex gap-2 justify-end text-xs">
//                         <button
//                           onClick={() => saveEdit(msg.id)}
//                           className="text-green-600"
//                         >
//                           Save
//                         </button>
//                         <button onClick={cancelEdit} className="text-red-600">
//                           Cancel
//                         </button>
//                       </div>
//                     </div>
//                   ) : (
//                     <>
//                       <div className="whitespace-pre-wrap text-sm">
//                         <strong>{getSenderName(msg)}:</strong> {msg.text}
//                       </div>
//                       {msg.file && (
//                         <p className="text-xs text-blue-600 mt-1">📎 {msg.file}</p>
//                       )}
//                       <span className="text-[10px] text-gray-500 block mt-1 text-right">
//                         {msg.sender !== user.role && msg.read ? '✓✓ ' : '✓ '}
//                         {msg.time} | {msg.date}
//                       </span>
//                       {msg.sender === user.role && (
//                         <div className="flex gap-2 justify-end text-xs mt-1">
//                           <button
//                             onClick={() => startEditing(msg.id, msg.text)}
//                             className="text-blue-500"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(msg.id)}
//                             className="text-red-500"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           {typing && (
//             <div className="text-sm italic text-gray-500">{partner} is typing...</div>
//           )}
//         </div>

//         {/* Message input */}
//         <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
//           <label className="cursor-pointer text-gray-500">
//             <FiPaperclip size={20} />
//             <input
//               type="file"
//               className="hidden"
//               onChange={(e) => setFile(e.target.files[0])}
//             />
//           </label>

//           <input
//             type="text"
//             value={newMessage}
//             onChange={(e) => {
//               setNewMessage(e.target.value);
//               setTyping(true);
//             }}
//             onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//             placeholder="Type a message..."
//             className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
//           />

//           <button
//             onClick={handleSend}
//             className="text-purple-700 hover:text-purple-900"
//           >
//             <FiSend size={20} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatPage;
