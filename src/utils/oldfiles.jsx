// import React, { useState } from 'react';
// import Avatar from 'react-avatar'; 
// import { Link } from 'react-router-dom'; 

// const CounsellorProfileCard = () => {
  
//   const storedUserType = localStorage.getItem("user_type");
//   const allowedUserTypes = ["student", "counsellor"];
//   const userType = allowedUserTypes.includes(storedUserType) ? storedUserType : null;

//   const [counselors, setCounselors] = useState(
//     Array.from({ length: 6 }).map((_, i) => ({
//       id: i,
//       name: 'Ini Johnson',
//       experience: '7 Years',
//       specialties: ['Anxiety', 'Depression', 'Mental Health', 'Trauma'],
//       languages: ['English', 'Yoruba'],
//       image: '', 
//       profileUrl: `/profile/toluse-${i + 1}` 
//     }))
//   );

//   const handleImageUpload = (e, index) => {
//     const file = e.target.files[0];
//     if (file) {
//       const newImageURL = URL.createObjectURL(file); 
//       const updatedCounselors = [...counselors];
//       updatedCounselors[index].image = newImageURL;
//       setCounselors(updatedCounselors); 
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 py-10 px-4">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
//         {counselors.map((counselor, index) => (
//           <div key={counselor.id} className="bg-white shadow-md rounded-xl p-6 space-y-4 w-full">
//             {/* Avatar and Top Info */}
//            <div className="flex items-center justify-between">
//   <div className="flex items-center gap-4">
//     {/* Counselor Image or Avatar */}
//     <label htmlFor={`image-upload-${index}`} className="cursor-pointer relative">
//       {counselor.image ? (
//         <img
//           src={counselor.image}
//           alt={counselor.name}
//           className="w-12 h-12 rounded-full object-cover border border-gray-300"
//         />
//       ) : (
//         <Avatar
//           name={counselor.name}
//           size="48"
//           round={true}
//           className="w-12 h-12"
//         />
//       )}
//       <input
//         type="file"
//         id={`image-upload-${index}`}
//         accept="image/*"
//         onChange={(e) => handleImageUpload(e, index)}
//         className="hidden"
//       />
//     </label>

//     {/* Name and Experience */}
//     <div>
//       <h2 className="text-base font-semibold text-gray-800">{counselor.name}</h2>
//       <p className="text-sm text-gray-500">Experience: {counselor.experience}</p>
//     </div>
//   </div>
// </div>
//   {/* Specialties */}
//             <div>
//               <p className="text-sm font-medium text-gray-800 mb-2">Specialties:</p>
//               <div className="flex flex-wrap gap-2">
//                 {counselor.specialties.map((tag, i) => (
//                   <span
//                     key={i}
//                     className="text-xs px-3  rounded-full bg-purple-100 text-purple-600"
//                   >
//                     {tag}
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Languages */}
//             <div>
//               <p className="text-sm font-medium text-gray-800 mb-2">Languages:</p>
//               <div className="flex gap-3 text-xs text-purple-600">
//                 {counselor.languages.map((lang, i) => (
//                   <span key={i}>{lang}</span>
//                 ))}
//               </div>
//             </div>

//             {/* Status Button */}
//             <div className="pt-2">
//               <button className="w-full bg-purple-500 hover:bg-purple-700 text-white text-sm font-semibold py-2 rounded-lg">
//                   <Link
//                 to={userType ? `/${userType}/Counsellor/profile` : "/unauthorized"}
//               >
//                 View profile <span>→</span>
//               </Link>
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default CounsellorProfileCard;

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const CounselorProfile = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="overflow-auto mx-auto shadow-lg rounded-lg font-sans px-4 sm:px-6 lg:px-8 py-8 w-full bg-white">
//       {/* Avatar + Info */}
//       <div className="flex items-center space-x-6">
//         <img
//           src="https://ui-avatars.com/api/?name=Olayemi+Smith&background=4F46E5&color=fff&size=128"
//           alt="Dr. Olayemi Smith"
//           className="w-28 h-28 rounded-full object-cover shadow-md"
//         />
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800">Dr. Olayemi Smith</h2>
//           <p className="text-sm text-gray-600">Licensed Clinical Psychologist (Ph.D.)</p>
//           <p className="text-sm text-gray-500">New York, NY • 10+ years experience</p>
//         </div>
//       </div>

//       {/* Bio */}
//       <div className="mt-6">
//         <h3 className="text-lg font-medium text-gray-700">About</h3>
//         <p className="text-gray-600 mt-1 text-sm">
//           Dr. Smith specializes in cognitive behavioral therapy (CBT) for anxiety, depression, and trauma.
//           She has over a decade of experience helping individuals improve emotional well-being.
//         </p>
//       </div>

//       {/* Specializations */}
//       <div className="mt-4">
//         <h3 className="text-lg font-medium text-gray-700">Specializations</h3>
//         <div className="flex flex-wrap gap-2 mt-2">
//           {["Anxiety & Depression", "Trauma & PTSD", "Adolescent Counseling", "Grief & Loss"].map((item, i) => (
//             <span key={i} className="bg-purple-100 text-purple-600 text-sm px-3 py-1 rounded-full">
//               {item}
//             </span>
//           ))}
//         </div>
//       </div>

//       {/* Statistics */}
//       <div className="mt-6">
//         <h3 className="text-lg font-medium text-gray-700">Statistics</h3>
//         <div className="grid grid-cols-3 gap-4 mt-2">
//           <div className="bg-gray-50 p-3 rounded-l-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Clients</h4>
//             <p className="text-gray-600 text-base">34 Active</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Sessions</h4>
//             <p className="text-gray-600 text-base">87 this month</p>
//           </div>
//           <div className="bg-gray-50 p-3 rounded-lg text-center shadow-sm">
//             <h4 className="text-sm font-semibold text-gray-700">Rating</h4>
//             <p className="text-yellow-500 text-base">4.9 ★</p>
//           </div>
//         </div>
//       </div>

//       {/* Availability */}
//       <div className="mt-4">
//         <h3 className="text-lg font-medium text-gray-700">Availability</h3>
//         <p className="text-sm text-gray-600 mt-1">Mon - Fri: 9 AM – 5 PM</p>
//       </div>

//       {/* Footer Actions */}
//       <div className="flex justify-between mt-6 gap-3">
//         <button
//           className="flex-1 bg-blue-500 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-blue-700"
//           onClick={() => navigate('/chat')}
//         >
//           Message
//         </button>
//         <button
//           className="flex-1 bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded hover:bg-green-700"
//           onClick={() => navigate('/calendar')}
//         >
//           Schedule
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CounselorProfile;


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
