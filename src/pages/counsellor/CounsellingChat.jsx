import React, { useState } from 'react';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
  const [selectedClient, setSelectedClient] = useState(null);

  const dummyClients = [
    { uid: 'client1_uid', name: 'John Doe' },
    { uid: 'client2_uid', name: 'Jane Smith' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <ChatList clients={dummyClients} onSelect={setSelectedClient} />
      <div className="flex-1 p-6">
        {selectedClient ? (
          <ChatWindow receiverId={selectedClient} />
        ) : (
          <p className="text-gray-500">Select a client to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
