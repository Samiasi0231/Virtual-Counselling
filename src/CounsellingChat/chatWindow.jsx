// ChatWindow.jsx
import React, { useEffect, useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

const ChatWindow = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const senderId = auth.currentUser?.uid;

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map((doc) => doc.data())
        .filter(
          (msg) =>
            (msg.senderId === senderId && msg.receiverId === receiverId) ||
            (msg.senderId === receiverId && msg.receiverId === senderId)
        );
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [receiverId, senderId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMsg.trim() === '') return;

    await addDoc(collection(db, 'messages'), {
      text: newMsg,
      senderId,
      receiverId,
      timestamp: serverTimestamp(),
    });

    setNewMsg('');
  };

  return (
    <div className="flex flex-col h-[500px] w-full border rounded bg-white shadow-lg">
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 max-w-xs px-3 py-2 rounded ${
              msg.senderId === senderId
                ? 'bg-blue-500 text-white self-end ml-auto'
                : 'bg-gray-200 text-gray-800 self-start mr-auto'
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="flex p-2 border-t">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-grow p-2 border rounded-l focus:outline-none"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
