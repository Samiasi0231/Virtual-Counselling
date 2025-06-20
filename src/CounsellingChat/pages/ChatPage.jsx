import React, { useState, useEffect } from 'react';
import { FiSend, FiPaperclip, FiChevronRight } from 'react-icons/fi';

const ChatPage = () => {
  const [usersOpen, setUsersOpen] = useState(true);
  const [chatsOpen, setChatsOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'counselor',
      partner: 'Counselor',
      text: 'Hi there, how can I help you today?',
      time: '9:00 AM',
      date: new Date().toLocaleDateString(),
      read: false,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [typing, setTyping] = useState(false);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [user, setUser] = useState({ name: 'You', role: 'student' });
  const [partner, setPartner] = useState('Counselor');

  const partnersList = ['Counselor', 'Peer1', 'Peer2'];

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
  }, [messages, partner]);

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

  return (
    <div className="overflow-auto  mx-auto h-screen flex bg-gray-100">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r p-4 space-y-6">
        {/* Users List */}
        <div>
          <button
            onClick={() => setUsersOpen(!usersOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-violet-500">Users</h2>
            <FiChevronRight
              className={`transition-transform duration-300 ${
                usersOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {usersOpen && (
            <ul className="mt-2 space-y-1 text-sm text-gray-800">
              {partnersList.map((p) => (
                <li
                  key={p}
                  onClick={() => setPartner(p)}
                  className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    p === partner ? 'bg-gray-100 font-semibold' : ''
                  }`}
                >
                  {p}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent Chats */}
        <div>
          <button
            onClick={() => setChatsOpen(!chatsOpen)}
            className="flex items-center justify-between w-full text-left"
          >
            <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
            <FiChevronRight
              className={`transition-transform duration-300 ${
                chatsOpen ? 'rotate-90' : ''
              }`}
            />
          </button>

          {chatsOpen && (
            <ul className="mt-2 space-y-1 text-sm text-gray-600">
              {partnersList.map((p) => {
                const last = messages
                  .filter((m) => m.partner === p)
                  .slice(-1)[0];
                return (
                  <li
                    key={p}
                    onClick={() => setPartner(p)}
                    className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <strong>{p}:</strong>{' '}
                    {last
                      ? last.text.slice(0, 25) + (last.text.length > 25 ? '...' : '')
                      : 'No messages yet'}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Chat Panel */}
      <div className="flex flex-col flex-1 max-w-4xl bg-white shadow-md border-l overflow-hidden">
        {/* Chat Header */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div className="font-semibold text-gray-700">{partner}</div>
          <select
            value={partner}
            onChange={(e) => setPartner(e.target.value)}
            className="text-sm border p-1 rounded"
          >
            {partnersList.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
          {messages
            .filter((msg) => msg.partner === partner)
            .map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === user.role ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`p-3 rounded-2xl max-w-xs ${
                    msg.sender === user.role ? 'bg-green-100' : 'bg-white border'
                  }`}
                >
                  {editingId === msg.id ? (
                    <div>
                      <textarea
                        value={editText}
                        onChange={handleEditChange}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                      />
                      <div className="flex gap-2 justify-end text-xs">
                        <button
                          onClick={() => saveEdit(msg.id)}
                          className="text-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-red-600"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap text-sm">
                        {msg.text}
                      </div>
                      {msg.file && (
                        <p className="text-xs text-blue-600 mt-1">
                          📎 {msg.file}
                        </p>
                      )}
                      <span className="text-[10px] text-gray-500 block mt-1 text-right">
                        {msg.sender !== user.role && msg.read ? '✓✓ ' : '✓ '}
                        {msg.time} | {msg.date}
                      </span>
                      {msg.sender === user.role && (
                        <div className="flex gap-2 justify-end text-xs mt-1">
                          <button
                            onClick={() => startEditing(msg.id, msg.text)}
                            className="text-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(msg.id)}
                            className="text-red-500"
                          >
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
              {partner} is typing...
            </div>
          )}
        </div>

        {/* Message input */}
        <div className="flex items-center gap-2 px-4 py-3 border-t bg-white">
          <label className="cursor-pointer text-gray-500">
            <FiPaperclip size={20} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => setFile(e.target.files[0])}
            />
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

          <button
            onClick={handleSend}
            className="text-purple-700 hover:text-purple-900"
          >
            <FiSend size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;


// import React, { useState, useEffect } from 'react';
// import { FiSend, FiPaperclip, FiChevronRight } from 'react-icons/fi';

// const ChatPage = () => {
//   const [loggedInUser, setLoggedInUser] = useState(null);      // { name: '...', role: '...' }
//   const [partnersList, setPartnersList] = useState([]);        // ['Counselor', 'Student A']
//   const [partner, setPartner] = useState('');
//   const [messages, setMessages] = useState([]);

//   const [newMessage, setNewMessage] = useState('');
//   const [typing, setTyping] = useState(false);
//   const [file, setFile] = useState(null);
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState('');

//   const [usersOpen, setUsersOpen] = useState(true);
//   const [chatsOpen, setChatsOpen] = useState(true);

//   // Simulate backend fetch
//   useEffect(() => {
//     // Fetch user role from backend (replace with real API call)
//     const fetchUser = async () => {
//       const userFromAPI = { name: 'Counselor', role: 'counselor' }; // Or student
//       setLoggedInUser(userFromAPI);
//     };

//     // Fetch available chat partners from backend
//     const fetchPartners = async () => {
//       const partnersFromAPI = ['Student A', 'Student B']; // If counselor
//       setPartnersList(partnersFromAPI);
//       setPartner(partnersFromAPI[0]);
//     };

//     fetchUser();
//     fetchPartners();
//   }, []);

//   useEffect(() => {
//     if (typing) {
//       const timer = setTimeout(() => setTyping(false), 1000);
//       return () => clearTimeout(timer);
//     }
//   }, [typing]);

//   useEffect(() => {
//     setMessages((prev) =>
//       prev.map((msg) =>
//         msg.sender !== loggedInUser?.role && !msg.read && msg.partner === partner
//           ? { ...msg, read: true }
//           : msg
//       )
//     );
//   }, [partner, loggedInUser]);

//   const handleSend = () => {
//     if (!loggedInUser || (!newMessage.trim() && !file)) return;

//     const now = new Date();
//     const newMsg = {
//       id: messages.length + 1,
//       sender: loggedInUser.role,
//       partner,
//       text: newMessage,
//       time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       date: now.toLocaleDateString(),
//       file: file ? file.name : null,
//       read: false,
//     };
//     setMessages([...messages, newMsg]);
//     setNewMessage('');
//     setFile(null);
//     setTyping(false);
//   };

//   const startEditing = (id, currentText) => {
//     setEditingId(id);
//     setEditText(currentText);
//   };

//   const saveEdit = (id) => {
//     setMessages((prev) =>
//       prev.map((msg) => (msg.id === id ? { ...msg, text: editText } : msg))
//     );
//     cancelEdit();
//   };

//   const cancelEdit = () => {
//     setEditingId(null);
//     setEditText('');
//   };

//   const handleDelete = (id) => {
//     setMessages((prev) => prev.filter((msg) => msg.id !== id));
//   };

//   if (!loggedInUser || !partner) {
//     return <div className="p-4 text-gray-600">Loading chat interface...</div>;
//   }

//   return (
//     <div className="h-screen flex bg-gray-100">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r p-4 space-y-6">
//         {/* Users */}
//         <div>
//           <button
//             onClick={() => setUsersOpen(!usersOpen)}
//             className="flex justify-between items-center w-full"
//           >
//             <h2 className="text-lg font-semibold text-purple-600">Users</h2>
//             <FiChevronRight className={`transition-transform ${usersOpen ? 'rotate-90' : ''}`} />
//           </button>
//           {usersOpen && (
//             <ul className="mt-2 text-sm space-y-1">
//               {partnersList.map((p) => (
//                 <li
//                   key={p}
//                   onClick={() => setPartner(p)}
//                   className={`p-2 rounded cursor-pointer ${
//                     p === partner ? 'bg-purple-100 font-semibold' : 'hover:bg-gray-100'
//                   }`}
//                 >
//                   {p}
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>

//         {/* Chats */}
//         <div>
//           <button
//             onClick={() => setChatsOpen(!chatsOpen)}
//             className="flex justify-between items-center w-full"
//           >
//             <h2 className="text-lg font-semibold text-purple-600">Recent Chats</h2>
//             <FiChevronRight className={`transition-transform ${chatsOpen ? 'rotate-90' : ''}`} />
//           </button>
//           {chatsOpen && (
//             <ul className="mt-2 text-sm space-y-1">
//               {partnersList.map((p) => {
//                 const last = messages.filter((m) => m.partner === p).slice(-1)[0];
//                 return (
//                   <li
//                     key={p}
//                     onClick={() => setPartner(p)}
//                     className="p-2 rounded-md hover:bg-gray-100 cursor-pointer"
//                   >
//                     <strong>{p}:</strong>{' '}
//                     {last ? last.text.slice(0, 25) + (last.text.length > 25 ? '...' : '') : 'No messages'}
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>
//       </aside>

//       {/* Chat Panel */}
//       <main className="flex-1 flex flex-col bg-white shadow-md border-l">
//         {/* Header */}
//         <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
//           <div className="font-semibold">{partner}</div>
//           <select
//             value={partner}
//             onChange={(e) => setPartner(e.target.value)}
//             className="text-sm border px-2 py-1 rounded"
//           >
//             {partnersList.map((p) => (
//               <option key={p} value={p}>
//                 {p}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Messages */}
//         <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
//           {messages
//             .filter((msg) => msg.partner === partner)
//             .map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${msg.sender === loggedInUser.role ? 'justify-end' : 'justify-start'}`}
//               >
//                 <div
//                   className={`p-3 rounded-xl max-w-xs ${
//                     msg.sender === loggedInUser.role ? 'bg-green-100' : 'bg-white border'
//                   }`}
//                 >
//                   {editingId === msg.id ? (
//                     <>
//                       <textarea
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                         className="w-full p-2 border rounded mb-2"
//                         rows={3}
//                       />
//                       <div className="flex gap-2 justify-end text-xs">
//                         <button onClick={() => saveEdit(msg.id)} className="text-green-600">Save</button>
//                         <button onClick={cancelEdit} className="text-red-600">Cancel</button>
//                       </div>
//                     </>
//                   ) : (
//                     <>
//                       <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
//                       {msg.file && <p className="text-xs text-blue-600 mt-1">📎 {msg.file}</p>}
//                       <span className="text-[10px] text-gray-500 mt-1 block text-right">
//                         {msg.sender !== loggedInUser.role && msg.read ? '✓✓ ' : '✓ '}
//                         {msg.time} | {msg.date}
//                       </span>
//                       {msg.sender === loggedInUser.role && (
//                         <div className="flex gap-2 justify-end text-xs mt-1">
//                           <button onClick={() => startEditing(msg.id, msg.text)} className="text-blue-500">Edit</button>
//                           <button onClick={() => handleDelete(msg.id)} className="text-red-500">Delete</button>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               </div>
//             ))}
//           {typing && <div className="text-sm italic text-gray-500">{partner} is typing...</div>}
//         </div>

//         {/* Message Input */}
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
//       </main>
//     </div>
//   );
// };

// export default ChatPage;
