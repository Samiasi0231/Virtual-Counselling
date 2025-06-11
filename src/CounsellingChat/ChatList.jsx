// ChatList.jsx
import React from 'react';

const ChatList = ({ clients, onSelect }) => (
  <div className="w-1/4 p-4 border-r">
    <h3 className="text-xl font-bold mb-4">Clients</h3>
    {clients.map((client) => (
      <button
        key={client.uid}
        onClick={() => onSelect(client.uid)}
        className="block w-full text-left py-2 px-4 rounded hover:bg-gray-100"
      >
        {client.name}
      </button>
    ))}
  </div>
);

export default ChatList;
