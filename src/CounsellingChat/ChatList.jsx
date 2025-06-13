import React, { useState, useEffect, useRef } from 'react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sender, setSender] = useState('Student');
  const chatEndRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMsg = {
      sender,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput('');
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-purple-800">
      <div className="w-full max-w-md h-[600px] bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-purple-900 text-white text-center p-4 text-lg font-semibold">
          💬 Counselor-Student Chat
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'Student' ? 'items-start' : 'items-end'
              }`}
            >
              <div
                className={`p-3 rounded-xl shadow text-sm whitespace-pre-line max-w-[80%]
                  ${msg.sender === 'Student' ? 'bg-purple-100 text-left' : 'bg-purple-200 text-right'}
                `}
              >
                <div className="font-semibold mb-1">{msg.sender}</div>
                <div>{msg.text}</div>
                <div className="text-gray-500 text-xs mt-1">{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-3 bg-gray-50 flex items-center gap-2">
          <select
            value={sender}
            onChange={(e) => setSender(e.target.value)}
            className="border text-sm rounded px-2 py-1"
          >
            <option value="Student">Student</option>
            <option value="Counselor">Counselor</option>
          </select>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message with emoji 😊"
            className="flex-1 border px-3 py-2 rounded text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-900 text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;

