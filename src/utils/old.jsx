// import React, { useState, useEffect, useRef,useMemo,useCallback } from 'react';
// import { useLocation,useNavigate,useSearchParams } from 'react-router-dom';
// import { FiSend, FiPaperclip, FiUser, FiUserX, FiMenu } from 'react-icons/fi';
// import { useStateValue } from '../../Context/UseStateValue';
// import { useChatContext } from "../../Auth/ChatContex"
// import axiosClient from '../../utils/axios-client-analytics';
// import ChatSidepanel from '../ChatSidepanel';
// import { dedupeMessages } from '../../utils/message';
// import {formatMessageDate} from "../../utils/time"
// import Avatar from 'react-avatar';
// const getAnonymousMap = () => {

//   try {
//     const stored = localStorage.getItem('anonymous_map');
//     return stored ? JSON.parse(stored) : {};
//   } catch {
//     return {};
//   }
// };

// const setAnonymousForChat = (chatId, value) => {
//   const map = getAnonymousMap();
//   map[chatId] = value;
//   localStorage.setItem('anonymous_map', JSON.stringify(map));
// };

// const getAnonymousForChat = (chatId) => {
//   const map = getAnonymousMap();
//   return map[chatId] ?? false;
// };

// const isUserNearBottom = (container, threshold = 120) => {
//   return (
//     container.scrollHeight - container.scrollTop - container.clientHeight < threshold
//   );
// };


// const ChatPage = ({ initialRole = 'student' }) => {
  
// const {
//   chatSession,
//   setChatSession,
//   chatMap,
//   setChatMap,
//   sendMessage,
//   fetchChatMessages,
//   updateSeenUsers,
// } = useChatContext();

//   const scrollContainerRef = useRef(null);
// const [hasMoreMessages, setHasMoreMessages] = useState(true);
// const [userIsNearBottom, setUserIsNearBottom] = useState(true);

//    const navigate = useNavigate();
//   const websocketRef = useRef(null);
//   const location = useLocation();
//   const chatIdFromURL = new URLSearchParams(location.search).get('chatId');
// const storedChatId = localStorage.getItem('lastChatId');
// const chatIdToUse = chatIdFromURL || storedChatId; 
//   const [{ student, counsellor, studentToken, counsellorToken }] = useStateValue();
//  const [anonLoading, setAnonLoading] = useState(false);
//   const contextUser = student || counsellor;
//   const userType = contextUser?.user_type;
//   const token = userType === 'student' ? studentToken : counsellorToken;
//   const isStudent = userType === 'student';
//   const [unreadIds, setUnreadIds] = useState([]);
//   const [partnerInfo, setPartnerInfo] = useState(null);
//   const [anonymous, setAnonymous] = useState(false);
//   const [newMessage, setNewMessage] = useState('');
//   const [typing, setTyping] = useState(false);
//   const [file, setFile] = useState(null);
//   const [mobileView, setMobileView] = useState(() => !chatIdFromURL);
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [unreadCounts, setUnreadCounts] = useState({});
//   const [messageUpdateCounter, setMessageUpdateCounter] = useState(0); 
//    const messagesEndRef = useRef(null);


//   const normalizeProfilePhoto = (photo) => typeof photo === 'object' ? photo?.best : photo;

// const messages = useMemo(() => chatMap[chatSession?.item_id] || [], [chatMap, chatSession?.item_id, messageUpdateCounter]); 

// const normalizeFileType = (type) => {
//   if (!type) return null;
//   const t = type.toLowerCase();
//   if (t.includes('image')) return 'image';
//   if (t.includes('pdf')) return 'pdf';
//   if (t.includes('doc')) return 'doc';
//   if (t.includes('video')) return 'video';
//   if (t.includes('audio')) return 'audio';
//   return 'file'; 
// };

// const extractFileData = (data) => {
//   if (Array.isArray(data.attachments) && data.attachments.length > 0) {
//     const a = data.attachments[0];
//     return {
//       file: a?.location || null,
//       fileType: normalizeFileType(a?.attachments_type),
//     };
//   }
//   if (Array.isArray(data.media) && data.media.length > 0) {
//     const m = data.media[0];
//     return {
//       file: m?.location || null,
//       fileType: normalizeFileType(m?.media_type),
//     };
//   }
//   return { file: null, fileType: null };
// };

// const loadOlderMessages = async () => {
//   if (!chatSession?.item_id || !token || loadingMessages) return;

//   const offset = chatMap[chatSession.item_id]?.length || 0;
//   setLoadingMessages(true);

//   try {
//     const res = await axiosClient.get(
//       `/vpc/get-messages/${chatSession.item_id}/?offset=${offset}&limit=10`,
//       { headers: { Authorization: `Bearer ${token}` } }
//     );

//     const olderMessages = res.data?.messages || [];

//     if (olderMessages.length === 0 || !res.data?.has_more) {
//       setHasMoreMessages(false);
//       return;
//     }

//     const formatted = olderMessages.map(msg => ({
//       ...msg,
//       file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
//       fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
//       time: new Date(msg.created_at).toLocaleTimeString([], {
//         hour: '2-digit',
//         minute: '2-digit',
//       }),
//       groupDate: formatMessageDate(msg.created_at),
//       seen_users: msg.seen_users || [],
//     }));

//     setChatMap(prev => {
//       const updated = dedupeMessages([
//         ...formatted,
//         ...(prev[chatSession.item_id] || []),
//       ]);

//       // 🔐 Persist updated message list to localStorage
//       localStorage.setItem(
//         `chat_messages_${chatSession.item_id}`,
//         JSON.stringify(updated.slice(-200))
//       );

//       return {
//         ...prev,
//         [chatSession.item_id]: updated,
//       };
//     });
//   } catch (err) {
//     console.error('Failed to load older messages:', err);
//   } finally {
//     setLoadingMessages(false);
//   }
// };


// useEffect(() => {
//   const container = scrollContainerRef.current;
//   if (!container) return;

 
//   if (userIsNearBottom) {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }
// }, [messages, userIsNearBottom]);


// useEffect(() => {
//   const container = scrollContainerRef.current;
//   if (!container || !chatSession?.item_id) return;

//   const handleScroll = () => {
//     if (container.scrollTop === 0 && hasMoreMessages && !loadingMessages) {
//       loadOlderMessages();
//     }
//   };

//   container.addEventListener('scroll', handleScroll);
//   return () => container.removeEventListener('scroll', handleScroll);
// }, [chatSession?.item_id, hasMoreMessages, loadingMessages]);




//   const isStudentAnonymous = chatSession?.user_anonymous;

//  const displayName = useMemo(() => {
//   if (!partnerInfo) return isStudent ? 'Counselor' : (isStudentAnonymous ? 'Anonymous' : 'Student');

//   const name = partnerInfo.fullname || `${partnerInfo.firstname || ''} ${partnerInfo.lastname || ''}`.trim();
//   return isStudent ? name || 'Counselor' : (isStudentAnonymous ? 'Anonymous' : name || 'Student');
// }, [partnerInfo, isStudent, isStudentAnonymous]);


//  const displayAvatar = useMemo(() => {
//   const rawPhoto = normalizeProfilePhoto(partnerInfo?.profilePhoto) || partnerInfo?.avatar || null;
//   if (!rawPhoto) return null;
//   if (isStudent) return rawPhoto;
//   return isStudentAnonymous ? null : rawPhoto;
// }, [partnerInfo, isStudent, isStudentAnonymous]);


//   if (!['student', 'counsellor'].includes(userType)) {
//     return <p className="text-center text-red-500">Unauthorized user</p>;
//   }

//    const handleChatSelect = useCallback((fullMessages, partnerData, messages, sessionData) => {
//     setPartnerInfo(partnerData);
//     const msgList = fullMessages || messages || [];
//    setChatMap(prev => ({ ...prev, [sessionData.item_id]: msgList }));
//     localStorage.setItem('lastChatId', sessionData.item_id);
//     setChatSession(sessionData);
//     const unread = msgList.filter(msg => !msg.read && msg.sender !== userType).map(msg => msg.id);
//     setUnreadIds(unread);
//     setUnreadCounts(prev => ({ ...prev, [sessionData.item_id]: unread.length }));
//     if (isStudent && sessionData?.item_id) {
//       const savedAnonymous = getAnonymousForChat(sessionData.item_id);
//       setAnonymous(savedAnonymous);
//     }
//     setMobileView(false);
    
//   }, [isStudent, userType]);

//   const partner = useMemo(() => userType === 'student'
//     ? chatSession?.counselor_data?.fullname || 'Counselor'
//     : `${chatSession?.user_data?.lastname || 'Student'} ${chatSession?.user_data?.lastname || ''}`
//   , [userType, chatSession]);

//   useEffect(() => {
//     if (typing) {
//       const timer = setTimeout(() => setTyping(false), 1500);
//       return () => clearTimeout(timer);
//     }
//   }, [typing, userType, chatSession]);

// useEffect(() => {

//   const fetchChatFromQueryParam = async () => {
//     if (!chatIdToUse || !token) return;

//     setLoadingMessages(true);
//     try {
//       const localKey = `chat_messages_${chatIdToUse}`;
//       const cached = localStorage.getItem(localKey);
//       let localMessages = [];

//       if (cached) {
//         try {
//           const parsed = JSON.parse(cached);
//           if (Array.isArray(parsed)) {
//             localMessages = parsed;
//           }
//         } catch (err) {
//           console.warn('Corrupt localStorage messages:', err);
//         }
//       }

//       const res = await axiosClient.get(`/vpc/get-messages/${chatIdToUse}/`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const rawMessages = Array.isArray(res.data) ? res.data : [];

//       const formattedMessages = rawMessages.map((msg) => {
//         const isFromCurrentUser = msg.from_counselor
//           ? userType === 'counsellor'
//           : userType === 'student';

//         const sender = msg.from_counselor
//           ? msg.sender_counselor
//           : msg.sender_user;

//         const lastname = msg.from_counselor
//           ? sender?.fullname?.split(' ').slice(-1)[0] || ''
//           : sender?.lastname || '';

//         return {
//           ...msg,
//           isFromCurrentUser,
//           file: msg.attachments?.[0]?.location || msg.media?.[0]?.location || null,
//           fileType: msg.attachments?.[0]?.attachments_type || msg.media?.[0]?.media_type || null,
//           text: msg.text || '',
//           time: new Date(msg.created_at).toLocaleTimeString([], {
//             hour: '2-digit',
//             minute: '2-digit',
//           }),
//           groupDate: formatMessageDate(msg.created_at),
//           studentAnonymous: msg.anonymous ?? false,
//           senderLastName: lastname,
//           seen_users: msg.seen_users || [],
//         };
//       });

//       const merged = dedupeMessages([...localMessages, ...formattedMessages]);

//       setChatMap(prev => ({
//         ...prev,
//         [chatIdToUse]: merged,
//       }));

//       localStorage.setItem(localKey, JSON.stringify(merged.slice(-200)));

//       const unread = merged
//         .filter(msg => !msg.read && msg.sender !== userType)
//         .map(msg => msg.item_id);
//       setUnreadIds(unread);

//       const partnerData = merged.length
//         ? isStudent
//           ? merged[0]?.sender_counselor
//           : merged[0]?.sender_user
//         : null;

//       if (!chatSession) {
//         setPartnerInfo(partnerData);
//       }

//       setChatSession({
//         item_id: chatIdToUse,
//         user_anonymous: false,
//       });

//       localStorage.setItem('lastChatId', chatIdToUse);

//       if (isStudent) {
//         const savedAnonymous = getAnonymousForChat(chatIdToUse);
//         setAnonymous(savedAnonymous);
//       }

//       setMobileView(false);
//     } catch (err) {
//       console.error('Failed to auto-load chat:', err);
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   fetchChatFromQueryParam();
// }, [chatIdToUse, isStudent, userType, token]); 






// useEffect(() => {
//   if (!chatSession) return;

//   const data = isStudent ? chatSession.counselor_data : chatSession.user_data;
//   if (data) {
//     setPartnerInfo(data);
//   }
// }, [chatSession, isStudent]);


// useEffect(() => { 
//   if (!chatSession?.item_id || !Array.isArray(messages)) return;

//   const key = `chat_messages_${chatSession.item_id}`;
//   const uniqueMessages = dedupeMessages(messages).slice(-200);
//   localStorage.setItem(key, JSON.stringify(uniqueMessages));
// }, [messages, chatSession]);



//   useEffect(() => {
//     if (messagesEndRef.current) {
//       messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
//     }
//   }, [messages]);

// useEffect(() => {
//   if (chatSession?.item_id && token) {
//  fetchChatMessages(chatSession.item_id, token, true);
//   }
// }, [chatSession?.item_id, token]);


// useEffect(() => {
//   const handleVisibilityChange = () => {
//     if (
//       document.visibilityState === 'visible' &&        
//       chatSession?.item_id &&                          
//       token                                            
//     ) {
//     fetchChatMessages(chatSession.item_id, token, true);  
//     }
//   };

//   document.addEventListener('visibilitychange', handleVisibilityChange);
//   return () => {
//     document.removeEventListener('visibilitychange', handleVisibilityChange);
//   };
// }, [chatSession?.item_id, token, fetchChatMessages]);
// useEffect(() => {
//   const interval = setInterval(() => {
//     if (
//       document.visibilityState === 'visible' &&
//       chatSession?.item_id &&
//       token
//     ) {
//      fetchChatMessages(chatSession.item_id, token, true);  
//     }
//   }, 15000); 

//   return () => clearInterval(interval);
// }, [chatSession?.item_id, token, fetchChatMessages]);




// const toggleAnonymous = async () => {
//   if (!isStudent || !chatSession?.item_id || !token) return;
//   const chatId = chatSession.item_id;
//   const newAnonymousState = !anonymous;
//   setAnonLoading(true);
//   setAnonymous(newAnonymousState);
//   setAnonymousForChat(chatId, newAnonymousState);
//   setChatSession((prev) => ({ ...prev, user_anonymous: newAnonymousState }));

//   try {
//     await axiosClient.put(
//       `/vpc/update-anonymous/${chatId}/`,
//       { user_anonymous: newAnonymousState },
//       { headers: { Authorization: `Bearer ${token}` } }
//     );
//   } catch (error) {
//     setAnonymous(!newAnonymousState);
//     setAnonymousForChat(chatId, !newAnonymousState);
//     setChatSession((prev) => ({ ...prev, user_anonymous: !newAnonymousState }));
//     console.error('Failed to toggle anonymous mode:', error.response?.data || error.message);
//   } finally {
//     setAnonLoading(false);
//   }
// };


//   useEffect(() => {
//     if (!chatSession?.item_id || !token) return;

//     const wsUrl = `wss://cbt.neofin.ng/vpc/message-feed/${chatSession.item_id}/ws?auth_token=${token}`;
//     const ws = new WebSocket(wsUrl);
//     websocketRef.current = ws;

//     ws.onopen = () => console.log('[WebSocket] Connected');
//     ws.onerror = (e) => console.error('[WebSocket] Error:', e);
//     ws.onclose = () => console.log('[WebSocket] Disconnected');

// ws.onmessage = (event) => {
//   try {
//     const data = JSON.parse(event.data);

//     const hasContent =
//       !!data.text ||
//       (Array.isArray(data.attachments) && data.attachments.length > 0) ||
//       (Array.isArray(data.media) && data.media.length > 0);

//     if (hasContent && data.item_id) {
//       const createdAt = new Date(data.created_at || Date.now()); 
//       const sender = data.sender || (data.from_counselor ? 'counsellor' : 'student');
//       const isFromCurrentUser = sender === userType;
//       const { file, fileType } = extractFileData(data);

//       const newMsg = {
//         id: data.item_id,
//         clientMessageId: data.clientMessageId || null,
//         sender,
//         text: data.text || '',
//         file,
//         fileType,
//         time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//         groupDate: formatMessageDate(createdAt),
//         read: false,
//         studentAnonymous: data.anonymous ?? false,
//         isFromCurrentUser,
//         senderFullname: data.sender_counselor?.fullname || data.sender_user?.fullname,
//         senderAvatar: data.sender_counselor?.profilePhoto?.best || data.sender_user?.profilePhoto,
//       };

// setChatMap((prev) => {
//   const existing = prev[chatSession.item_id] || [];

//   const filtered = existing.filter((msg) => {
//     if (data.clientMessageId && msg.clientMessageId) {
//       return msg.clientMessageId !== data.clientMessageId;
//     }
//     const isTemp = msg.id?.startsWith('temp');
//     const isTextMatch = !!msg.text && msg.text === data.text && !msg.file && !data.file;
//     const isFileMatch = !!msg.file && msg.file.startsWith('blob:') && msg.fileType === fileType;
//     return !(isTemp && (isTextMatch || isFileMatch));
//   });

//   const updated = [...filtered, newMsg];

  
//   const key = `chat_messages_${chatSession.item_id}`;
//   const unique = dedupeMessages(updated).slice(-200);
//   localStorage.setItem(key, JSON.stringify(unique));

//   return {
//     ...prev,
//     [chatSession.item_id]: unique,
//   };
// });



//       setMessageUpdateCounter((c) => c + 1);
//     }
//     if (data?.type === 'seen_update' && data.userId && Array.isArray(data.messageIds)) {
//       setChatMap(prev => ({
//         ...prev,
//         [chatSession.item_id]: (prev[chatSession.item_id] || []).map(msg =>
//           data.messageIds.includes(msg.item_id)
//             ? {
//                 ...msg,
//                 seen_users: [...new Set([...(msg.seen_users || []), data.userId])]
//               }
//             : msg
//         )
//       }));
//     }

//     if (data?.type === 'typing' && data.sender !== userType) {
//       setTyping(data);
//       setTimeout(() => setTyping(false), 1500);
//     }
//   } catch (err) {
//     console.error('[WebSocket] Parse error:', err);
//   }
// };


//   return () => {
//       ws.close();
//     };
//   }, [chatSession?.item_id, userType, token]);

// const handleSend = async () => {
//   if ((!newMessage.trim() && !file) || !chatSession?.item_id || !token) return;

//  const now = new Date();
// const clientMessageId = `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
// const tempId = `temp-${now.getTime()}`;


//   setNewMessage('');
//   setFile(null);
//   setTyping(false);


//   try {
//     await sendMessage({
//       chatId: chatSession.item_id,
//       text: newMessage.trim(),
//       file,
//       userType,
//       token,
//       contextUser,
//       isStudent,
//       anonymous,
//       clientMessageId, 
//     });
//   } catch (error) {
//     console.error('[handleSend] Message send failed:', error?.response?.data || error.message);
//   }
// };

// const getSenderName = (msg) => {
//   if (msg.isFromCurrentUser) return 'You';
//   if (!msg.from_counselor) {
//     if (msg.studentAnonymous) return 'Anonymous';
//     return msg.senderFullname || msg.senderLastName || 'Student';
//   }
//   return msg.senderFullname || msg.senderLastName || 'Counselor';
// }
// const groupedMessages = (messages || []).reduce((groups, msg) => {
// const label = msg.groupDate || formatMessageDate(msg.created_at);
//  if (!groups[label]) groups[label] = [];
//   groups[label].push(msg);
//   return groups;
// }, {});

// useEffect(() => {
//   if (!messages || !Array.isArray(messages) || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) return;

//   const currentUserId = contextUser?.item_id;
//   if (!currentUserId || !chatSession?.item_id) return;

//   const unseenMessages = messages.filter(
//     (msg) => !msg.isFromCurrentUser && !msg.seen_users?.includes(currentUserId)
//   );

//   if (unseenMessages.length === 0) return;

//   const unseenIds = unseenMessages.map((msg) => msg.item_id);

//   websocketRef.current.send(JSON.stringify({
//     type: 'mark_seen',
//     chatId: chatSession.item_id,
//     userId: currentUserId,
//     messageIds: unseenIds,
//   }));

//   setChatMap(prev => ({
//   ...prev,
//   [chatSession.item_id]: (prev[chatSession.item_id] || []).map(msg =>
//     unseenIds.includes(msg.item_id)
//       ? { ...msg, seen_users: [...new Set([...(msg.seen_users || []), currentUserId])] }
//       : msg
//   ),
// }));
// }, [messages, contextUser, chatSession]);

// return (
//   <div className='h-screen bg-gray-100'>
//      <div className="mb-6">
//   <button
//     onClick={() => navigate(-1)}
//     className="flex items-center text-purple-600 hover:text-purple-800 font-medium"
//   >
//     ← Back
//   </button>
// </div>
//   <div className="h-screen flex flex-col md:flex-row bg-gray-100">

//   <div className="md:hidden flex items-center justify-between p-4 bg-white border-b">
//    <button
//   onClick={() => setMobileView(prev => !prev)}
//   className={`text-purple-600 transition-transform duration-300 transform ${
//     mobileView ? 'rotate-90 scale-110' : ''
//   }`}
// >
//   <FiMenu size={22} />
// </button>

//     <span className="font-semibold">{displayName}</span>
//     {isStudent && (
//       <button onClick={toggleAnonymous} className="text-sm px-2 py-1 border rounded-full text-gray-600">
//         {anonymous ? <FiUserX /> : <FiUser />}
//       </button>
//     )}
//   </div>
//   <div className={`w-full md:w-80 ${mobileView ? 'block' : 'hidden'} md:block`}>
//     <ChatSidepanel
//       partner={partner}
//       onChatSelect={handleChatSelect}
//       isStudent={isStudent}
//       activeChatId={chatSession?.item_id || chatIdFromURL}
//       unreadCounts={unreadCounts}
//     />
//   </div>
//   <div className={`flex flex-col flex-1 bg-white shadow-md border-l ${mobileView ? 'hidden md:flex' : 'flex'}`}>
//     {loadingMessages ? (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
//       </div>
//     ) : (
//       <>
//         <div className="hidden md:flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
//           <div className="flex items-center gap-2">
//             {displayAvatar ? (
//               <img src={displayAvatar} alt="User Avatar" className="w-8 h-8 rounded-full object-cover" />
//             ) : (
//               <Avatar name={displayName} size="32" round className="w-8 h-8" />
//             )}
//             <span className="font-semibold text-gray-700">{displayName}</span>
//             {!isStudent && isStudentAnonymous && (
//               <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
//                 Anonymous Student
//               </span>
//             )}
//           </div>
//           {isStudent && (
//             <div className="flex items-center gap-2 ml-auto">
//               <span className="text-sm text-gray-700 flex items-center gap-1">
//                 {anonymous ? <FiUserX /> : <FiUser />} {anonymous ? 'Anonymous' : 'Visible'}
//               </span>
//               <button
//                 onClick={toggleAnonymous}
//                 disabled={!chatSession?.item_id}
//                 className={`w-14 h-7 flex items-center rounded-full px-1 transition-colors duration-300 ${
//                   anonymous ? 'bg-gray-600' : 'bg-purple-500'
//                 } ${!chatSession?.item_id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
//               >
//                 <div
//                   className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
//                     anonymous ? 'translate-x-7' : 'translate-x-0'
//                   }`}
//                 />
//               </button>
//             </div>
//           )}
//         </div>
// <div  ref={scrollContainerRef}
// className="flex-1 px-3 py-2 overflow-y-auto space-y-2 bg-gray-50 relative">
// {hasMoreMessages && (
//   <div className="text-center my-2">
//     <button
//       onClick={loadOlderMessages}
//       disabled={loadingMessages}
//       className="px-3 py-1 bg-gray-200 rounded text-sm"
//     >
//       {loadingMessages ? "Loading..." : "Load older messages"}
//     </button>
//   </div>
// )}

//   {loadingMessages && (
//     <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white/60 z-10">
//       <span className="text-sm text-gray-500">Loading messages...</span>
//     </div>
//   )}

//  {Object.entries(groupedMessages).map(([date, msgs]) => (
//   <div key={`group-${date}-${msgs[0]?.id || date}`}>
//     <div className="text-center text-xs text-gray-500 my-3">{date}</div>

//     {msgs.map((msg,index)=> (
//       <div
//      key={msg.id || `msg-${index}`}
//         className={`flex ${msg.isFromCurrentUser ? 'justify-end' : 'justify-start'} items-start gap-1 mb-1`}
//       >
//         {!msg.isFromCurrentUser && (
//           <div className="shrink-0">
//             {msg.senderAvatar && !msg.studentAnonymous ? (
//               <img
//                 src={msg.senderAvatar}
//                 alt={getSenderName(msg)}
//                 className="w-6 h-6 rounded-full object-cover"
//                 title={getSenderName(msg)}
//               />
//             ) : (
//               <Avatar
//                 name={getSenderName(msg)}
//                 size="24"
//                 round
//                 title={getSenderName(msg)}
//               />
//             )}
//           </div>
//         )}

//         <div
//           className={`p-4 rounded-2xl max-w-md md:max-w-[75%] transition-all duration-300 ${
//             msg.isFromCurrentUser ? 'bg-green-200' : 'bg-white border'
//           } ${unreadIds.includes(msg.id) ? 'ring-2 ring-purple-400' : ''}`}
//         >
//           {msg.text && (
//           <div className="whitespace-pre-wrap break-words text-sm overflow-hidden">
//             <strong title={getSenderName(msg)}>{getSenderName(msg)}:</strong> {msg.text}
//           </div>)}
//           {msg.file && (
//             <>
//               {msg.fileType === 'image' ? (
//                 <img
//                   src={msg.file}
//                   alt="Uploaded"
//                   className="mt-2 rounded max-w-xs max-h-40 object-cover"
//                 />
//               ) : (
//                 <p className="text-xs text-blue-600 mt-1 break-all">
//                   📎{' '}
//                   <a href={msg.file} target="_blank" rel="noopener noreferrer">
//                     {msg.file}
//                   </a>
//                 </p>
//               )}
//             </>
//           )}

//           <span
//             className={`text-[10px] block mt-1 text-right ${
//               msg.isFromCurrentUser && msg.read ? 'text-green-600' : 'text-gray-500'
//             }`}
//           >
//          {msg.isFromCurrentUser
//   ? msg.seen_users?.includes(partnerInfo?.item_id)
//     ? '✓✓'
//     : '✓'
//   : ''}
//             {msg.time}
//           </span>
//         </div>
//       </div>
//     ))}
//   </div>
// ))}


//   {typing && typing.sender && typing.sender !== userType && (
//     <div className="text-sm italic text-gray-500">
//       {typing.sender === 'student' ? (typing.anonymous ? 'Anonymous' : 'Student') : 'Counsellor'} is typing...
//     </div>
//   )}

//   <div ref={messagesEndRef} />

//   {!userIsNearBottom && (
//   <button
//     onClick={() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }}
//     className="fixed bottom-24 right-4 z-50 bg-purple-600 text-white px-3 py-1 rounded-full shadow-md text-sm"
//   >
//     ↓ New messages
//   </button>
// )}

// </div>
//         <div className="flex flex-col px-4 py-3 border-t bg-white gap-2">
//           {file && (
//             <div className="flex items-center justify-between bg-gray-100 p-2 rounded border">
//               <div className="flex items-center gap-3">
//                 <img src={URL.createObjectURL(file)} alt="Preview" className="w-16 h-16 object-cover rounded" />
//                 <span className="text-sm text-gray-700">{file.name}</span>
//               </div>
//               <button onClick={() => setFile(null)} className="text-red-500 text-xs hover:underline">
//                 Remove
//               </button>
//             </div>
//           )}

//           <div className="flex items-center gap-2">
//             <label htmlFor="file-upload" className="cursor-pointer text-gray-500">
//               <FiPaperclip size={20} />
//             </label>
//             <input
//               id="file-upload"
//               type="file"
//               accept="image/*"
//               className="hidden"
//               onChange={(e) => {
//                 const selected = e.target.files[0];
//                 setFile(selected);
//               }}
//             />
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => {
//                 const value = e.target.value;
//                 setNewMessage(value);
//                 setTyping(true);
//                 if (
//                   websocketRef.current &&
//                   websocketRef.current.readyState === WebSocket.OPEN &&
//                   chatSession?.item_id
//                 ) {
//                   websocketRef.current.send(
//                     JSON.stringify({
//                       type: 'typing',
//                       sender: userType,
//                       chatId: chatSession.item_id,
//                       anonymous: isStudent ? anonymous : false,
//                     })
//                   );
//                 }
//               }}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               placeholder="Type a message..."
//               className="flex-1 px-4 py-2 text-sm border rounded-full focus:outline-none focus:ring-1 focus:ring-purple-500"
//             />
//             <button onClick={handleSend} className="text-purple-700 hover:text-purple-900">
//               <FiSend size={20} />
//             </button>
//           </div>
//         </div>
//       </>
//     )}
//   </div>
// </div>
// </div>
//   );
// };

// export default ChatPage;


// import React, { useEffect, useState } from "react";
// import { FiChevronRight } from "react-icons/fi";
// import Avatar from "react-avatar";
// import getRelativeTime from "../utils/time";
// import { useChatContext } from "../Auth/ChatContex";

// const ChatSidepanel = ({ onChatSelect, isStudent, activeChatId, unreadCounts = {} }) => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [usersOpen, setUsersOpen] = useState(true);
//   const [chatsOpen, setChatsOpen] = useState(true);

//   const {
//     chatSession,
//     setChatSession,
//     recentChats,
//     fetchRecentChats,
//     selectChatSession,
//     chatMap
//   } = useChatContext();

//   // ✅ Fetch chat rooms from context on load
//   useEffect(() => {
//     fetchRecentChats();
//   }, []);

//   const filteredChats = recentChats.filter(chat => {
//     const partner = isStudent ? chat.counselor_data : chat.user_data;
//     const fullname = partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`.trim();
//     return fullname.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   const handleChatSelect = async (chatId) => {
//     if (chatId === activeChatId) return;
//     try {
//       const chat = recentChats.find((c) => c.item_id === chatId);
//       await selectChatSession({
//         chatId,
//         token: localStorage.getItem("token"),
//         userType: isStudent ? "user" : "counselor",
//         isStudent,
//         onSelect: onChatSelect,
//       });

//       setChatSession({
//         item_id: chatId,
//         user_anonymous: chat?.user_anonymous ?? false,
//       });
//     } catch (err) {
//       console.error("Chat select failed:", err);
//     }
//   };

//   return (
//     <aside className="w-full md:w-80 bg-white border-r p-4 space-y-4 h-full overflow-y-auto">
//       <input
//         type="text"
//         placeholder="Search chats..."
//         className="w-full p-2 border rounded text-sm"
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//       />

//       <div>
//         <button
//           onClick={() => setUsersOpen(!usersOpen)}
//           className="flex items-center justify-between w-full text-left mt-2"
//         >
//           <h2 className="text-lg font-semibold text-violet-500">Users</h2>
//           <FiChevronRight className={`transition-transform duration-300 ${usersOpen ? "rotate-90" : ""}`} />
//         </button>

//         {usersOpen && (
//           <ul className="mt-2 space-y-1 text-sm text-gray-800">
//             {recentChats.map((chat) => {
//               const partner =
//                 chat.counselor_data?.fullname?.trim() ||
//                 `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
//                 "Unknown";

//               return (
//                 <li
//                   key={chat.item_id}
//                   className={`p-2 rounded-md ${chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""}`}
//                 >
//                   {partner}
//                 </li>
//               );
//             })}
//           </ul>
//         )}
//       </div>
//       <div>
//         <button
//           onClick={() => setChatsOpen(!chatsOpen)}
//           className="flex items-center justify-between w-full text-left"
//         >
//           <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
//           <FiChevronRight className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`} />
//         </button>

//         {chatsOpen && (
//           <ul className="mt-2 space-y-2 text-sm text-gray-600">
//             {filteredChats.length === 0 ? (
//               <li className="p-2 text-gray-400">No recent chats</li>
//             ) : (
//               filteredChats.map((chat) => {
//                 const partner = isStudent ? chat.counselor_data : chat.user_data;
//                 const fullname =
//                   partner?.fullname || `${partner?.firstname || ""} ${partner?.lastname || ""}`.trim();

//                 const lastMessage = (chatMap[chat.item_id] || []).slice(-1)[0];

//                 let preview = "[no current chat]";
//                 if (lastMessage?.text?.trim()) {
//                   preview = lastMessage.text.slice(0, 30);
//                 } else if (lastMessage?.fileType === "image") {
//                   preview = "📷 Image";
//                 } else if (lastMessage?.fileType === "file") {
//                   preview = "📎 File";
//                 }

//                 const createdAt = lastMessage?.created_at || lastMessage?.time || null;
//                 const timePreview = createdAt ? getRelativeTime(new Date(createdAt)) : "";

//                 const avatarUrl =
//                   partner?.profilePhoto?.best || partner?.profilePhoto || partner?.avatar || null;

//                 const unreadCount = unreadCounts[chat.item_id] || 0;

//                 return (
//                   <li
//                     key={chat.item_id}
//                     onClick={() => handleChatSelect(chat.item_id)}
//                     className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
//                       activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
//                     }`}
//                   >
//                     <div className="shrink-0">
//                       {avatarUrl ? (
//                         <img src={avatarUrl} alt={fullname} className="w-8 h-8 rounded-full object-cover" />
//                       ) : (
//                         <Avatar name={fullname} size="32" round />
//                       )}
//                     </div>

//                     <div className="flex-1">
//                       <div className="flex justify-between items-center">
//                         <div className="font-medium text-gray-800 truncate">{fullname}</div>
//                         <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
//                       </div>
//                       <div className="text-xs text-gray-600 truncate">{preview}</div>
//                     </div>

//                     {unreadCount > 0 && (
//                       <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
//                         {unreadCount}
//                       </span>
//                     )}
//                   </li>
//                 );
//               })
//             )}
//           </ul>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default ChatSidepanel;


// // ChatContext.js

// import React, { createContext, useContext, useState } from 'react';
// import axiosClient from '../utils/axios-client-analytics';
// import { formatMessageDate } from '../utils/time';
// import { dedupeMessages } from '../utils/message';

// const ChatContext = createContext();
// export const useChatContext = () => useContext(ChatContext);

// const ChatProvider = ({ children }) => {
//   const [chatMap, setChatMap] = useState({});
//   const [chatSession, setChatSession] = useState(null);
//   const [partnerInfo, setPartnerInfo] = useState(null);
//   const [unreadIds, setUnreadIds] = useState([]);
//   const [loadingChats, setLoadingChats] = useState(false);
//   const [recentChats, setRecentChats] = useState([]);

 
//   const fetchRecentChats = async () => {
//     setLoadingChats(true);
//     try {
//       const res = await axiosClient.get("/vpc/get-chat-rooms/");
//       const rooms = res.data || [];

//       setRecentChats(rooms);
//       localStorage.setItem("cached_chat_rooms", JSON.stringify(rooms));
//       return rooms;
//     } catch (err) {
//       console.error("[fetchRecentChats] Failed:", err);
//       try {
//         const fallback = JSON.parse(localStorage.getItem("cached_chat_rooms")) || [];
//         setRecentChats(fallback);
//         return fallback;
//       } catch {
//         return [];
//       }
//     } finally {
//       setLoadingChats(false);
//     }
//   };

// const fetchChatMessages = async (chatId, token, force = false) => {
//   if (!chatId || !token) return [];

//   try {
//     const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });

//     const serverMessages = (res.data.messages || res.data.fullMessages || res.data || []).map(msg => ({
//       ...msg,
//       groupDate: formatMessageDate(msg.created_at),
//       seen_users: msg.seen_users || [],
//     }));

//     const merged = dedupeMessages([
//       ...(chatMap[chatId] || []),
//       ...serverMessages,
//     ]);

//     // ✅ Save last 200 messages only
//     localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(merged.slice(-200)));

//     setChatMap(prev => ({
//       ...prev,
//       [chatId]: merged,
//     }));

//     return merged;
//   } catch (err) {
//     console.error('[fetchChatMessages] failed:', err);

   
//     const localKey = `chat_messages_${chatId}`;
//     const cached = localStorage.getItem(localKey);
//     let localMessages = [];

//     if (cached) {
//       try {
//         const parsed = JSON.parse(cached);
//         if (Array.isArray(parsed)) {
//           localMessages = parsed;
//         }
//       } catch (e) {
//         console.warn('[fetchChatMessages] corrupted localStorage for', localKey);
//       }
//     }

//     return localMessages;
//   }
// };



//   const selectChatSession = async ({ chatId, token, userType, isStudent, onSelect }) => {
//     const messages = await fetchChatMessages(chatId, token, true);
//     const lastMsg = messages[messages.length - 1];
//     const partner = isStudent ? lastMsg?.sender_counselor : lastMsg?.sender_user;

//     setChatSession({ item_id: chatId, user_anonymous: false });
//     setPartnerInfo(partner);
//     localStorage.setItem('lastChatId', chatId);

//     if (onSelect) {
//       onSelect(messages, partner, messages, { item_id: chatId, user_anonymous: false });
//     }

//     return messages;
//   };

//   // ✅ 4. Update seen state
//   const updateSeenUsers = (chatId, messageIds, userId) => {
//     if (!chatMap[chatId]) return;

//     setChatMap(prev => ({
//       ...prev,
//       [chatId]: prev[chatId].map(msg =>
//         messageIds.includes(msg.item_id)
//           ? {
//               ...msg,
//               seen_users: [...new Set([...(msg.seen_users || []), userId])],
//             }
//           : msg
//       ),
//     }));

//     setUnreadIds(prev => prev.filter(id => !messageIds.includes(id)));
//   };

//   const sendMessage = async ({
//     chatId,
//     text,
//     file,
//     userType,
//     token,
//     contextUser,
//     isStudent,
//     anonymous,
//     clientMessageId,
//   }) => {
//     if (!chatId || !token || (!text && !file)) return;

//     const now = new Date();
//     const tempId = `temp-${now.getTime()}`;
//     const fileType = file?.type?.startsWith('image') ? 'image' : 'file';

//     const optimisticMessage = {
//       id: tempId,
//       clientMessageId,
//       sender: userType,
//       text,
//       file: file ? URL.createObjectURL(file) : null,
//       fileType: file ? fileType : null,
//       time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
//       groupDate: formatMessageDate(now),
//       read: false,
//       isFromCurrentUser: true,
//       studentAnonymous: isStudent ? anonymous : false,
//       senderFullname: contextUser?.fullname || '',
//       senderAvatar: contextUser?.profilePhoto?.best || contextUser?.profilePhoto || null,
//     };

//     setChatMap(prev => {
//       const updated = dedupeMessages([...(prev[chatId] || []), optimisticMessage]).slice(-200);
//       localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(updated));
//       return {
//         ...prev,
//         [chatId]: updated,
//       };
//     });

//     try {
//       const formData = new FormData();
//       if (text) formData.append('text', text);
//       if (file) formData.append('attachments', file);
//       if (clientMessageId) formData.append('clientMessageId', clientMessageId);

//       await axiosClient.post(`/vpc/create-message/${chatId}/`, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data',
//           Authorization: `Bearer ${token}`,
//         },
//       });
//     } catch (error) {
//       console.error('[ChatContext] sendMessage failed:', error);
//     }
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         chatMap,
//         setChatMap,
//         chatSession,
//         setChatSession,
//         partnerInfo,
//         setPartnerInfo,
//         unreadIds,
//         setUnreadIds,
//         loadingChats,
//         fetchRecentChats,   
//         recentChats,          
//         fetchChatMessages,
//         updateSeenUsers,
//         sendMessage,
//         selectChatSession    
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export default ChatProvider;






















// //  import React, { useEffect, useState } from "react";
// // import axiosClient from "../utils/axios-client-analytics";
// // import { FiChevronRight } from "react-icons/fi";
// // import Avatar from 'react-avatar'; 
// // import getRelativeTime from "../utils/time";
// // import { useChatContext } from "../Auth/ChatContex";

// // const ChatSidepanel = ({ onChatSelect, partner, isStudent, activeChatId, unreadCounts = {} }) => {
// //   const [recentChats, setRecentChats] = useState([]);
// //   const [searchTerm, setSearchTerm] = useState('');
// //   const [usersOpen, setUsersOpen] = useState(true);
// //   const [chatsOpen, setChatsOpen] = useState(true);

// // const {
// //   setChatSession,      
// //   chatSession,
// //   chatMap,
// //   setChatMap,
// //   fetchChatMessages,
// //   ...rest 
// // } = useChatContext();
// //   useEffect(() => {
// //     const fetchRecentChats = async () => {
// //       try {
// //         const res = await axiosClient.get("/vpc/get-chat-rooms/");
// //         const rooms = res.data;
// //         setRecentChats(rooms);
// //       } catch (err) {
// //         console.error("Error fetching chat rooms:", err);
// //       }
// //     };

// //     fetchRecentChats();
// //   }, []);

// //   const filteredChats = recentChats.filter((chat) => {
// //     const partnerData = isStudent ? chat.counselor_data : chat.user_data;
// //     const fullname = partnerData?.fullname || `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();
// //     return fullname.toLowerCase().includes(searchTerm.toLowerCase());
// //   });

// //   const handleChatSelect = async (chatId) => {
// //     if (chatId === activeChatId) return;

// //     try {
// //       const messages = await fetchChatMessages(chatId); 

// //       const chat = recentChats.find((c) => c.item_id === chatId);
// //       const partnerData = isStudent
// //         ? chat?.counselor_data
// //         : chat?.user_data;

// //       onChatSelect?.(
// //         messages,
// //         partnerData,
// //         messages,
// //         {
// //           item_id: chatId,
// //           user_anonymous: chat.user_anonymous ?? false,
// //         }
// //       );

// //       setChatSession({
// //       item_id: chatId,
// //       user_anonymous: chat.user_anonymous ?? false})
// //     } catch (err) {
// //       console.error("Error selecting chat:", err);
// //     }
// //   };

// //   return (
// //     <aside className="w-full md:w-80 bg-white border-r p-4 space-y-4 h-full overflow-y-auto">
// //       <input
// //         type="text"
// //         placeholder="Search chats..."
// //         className="w-full p-2 border rounded text-sm"
// //         value={searchTerm}
// //         onChange={(e) => setSearchTerm(e.target.value)}
// //       />

// //       <div>
// //         <button
// //           onClick={() => setUsersOpen(!usersOpen)}
// //           className="flex items-center justify-between w-full text-left mt-2"
// //         >
// //           <h2 className="text-lg font-semibold text-violet-500">Users</h2>
// //           <FiChevronRight className={`transition-transform duration-300 ${usersOpen ? "rotate-90" : ""}`} />
// //         </button>

// //         {usersOpen && (
// //           <ul className="mt-2 space-y-1 text-sm text-gray-800">
// //             {recentChats.map((chat) => {
// //               const fullname =
// //                 chat.counselor_data?.fullname?.trim() ||
// //                 `${chat.user_data?.firstname || ""} ${chat.user_data?.lastname || ""}`.trim() ||
// //                 "Unknown";
// //               return (
// //                 <li
// //                   key={chat.item_id}
// //                   className={`p-2 rounded-md ${chat.item_id === activeChatId ? "bg-gray-100 font-semibold" : ""}`}
// //                 >
// //                   {fullname}
// //                 </li>
// //               );
// //             })}
// //           </ul>
// //         )}
// //       </div>

// //       <div>
// //         <button
// //           onClick={() => setChatsOpen(!chatsOpen)}
// //           className="flex items-center justify-between w-full text-left"
// //         >
// //           <h2 className="text-lg font-semibold text-violet-500">Recent Chats</h2>
// //           <FiChevronRight className={`transition-transform duration-300 ${chatsOpen ? "rotate-90" : ""}`} />
// //         </button>

// //         {chatsOpen && (
// //           <ul className="mt-2 space-y-2 text-sm text-gray-600">
// //             {filteredChats.length === 0 ? (
// //               <li className="p-2 text-gray-400">No recent chats</li>
// //             ) : (
// //               filteredChats.map((chat) => {
// //                 const partnerData = isStudent ? chat.counselor_data : chat.user_data;
// //                 const fullname =
// //                   partnerData?.fullname ||
// //                   `${partnerData?.firstname || ""} ${partnerData?.lastname || ""}`.trim();

// //                 const lastMessage = (chatMap[chat.item_id] || []).slice(-1)[0];
// // let preview = "[no current chat]";
// // if (lastMessage?.text?.trim()) {
// //   preview = lastMessage.text.slice(0, 30);
// // } else if (lastMessage?.fileType === "image") {
// //   preview = "📷 Image";
// // } else if (lastMessage?.fileType === "file") {
// //   preview = "📎 File";
// // }

// //                 const createdAt = lastMessage?.created_at || lastMessage?.time;
// //                 const timePreview = createdAt ? getRelativeTime(new Date(createdAt)) : "";
// //                 const avatarUrl =
// //                   partnerData?.profilePhoto?.best || partnerData?.profilePhoto || partnerData?.avatar || null;

// //                 const unreadCount = unreadCounts[chat.item_id] || 0;

// //                 return (
// //                   <li
// //                     key={chat.item_id}
// //                     onClick={() => handleChatSelect(chat.item_id)}
// //                     className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 flex items-start gap-2 ${
// //                       activeChatId === chat.item_id ? "bg-gray-100 font-semibold" : ""
// //                     }`}
// //                   >
// //                     <div className="shrink-0">
// //                       {avatarUrl ? (
// //                         <img src={avatarUrl} alt={fullname} className="w-8 h-8 rounded-full object-cover" />
// //                       ) : (
// //                         <Avatar name={fullname} size="32" round />
// //                       )}
// //                     </div>

// //                     <div className="flex-1">
// //                       <div className="flex justify-between items-center">
// //                         <div className="font-medium text-gray-800 truncate">{fullname}</div>
// //                         <div className="text-[10px] text-gray-400 whitespace-nowrap">{timePreview}</div>
// //                       </div>
// //                       <div className="text-xs text-gray-600 truncate">{preview}</div>
// //                     </div>

// //                     {unreadCount > 0 && (
// //                       <span className="ml-2 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white bg-red-500 rounded-full">
// //                         {unreadCount}
// //                       </span>
// //                     )}
// //                   </li>
// //                 );
// //               })
// //             )}
// //           </ul>
// //         )}
// //       </div>
// //     </aside>
// //   );
// // };

// // export default ChatSidepanel;