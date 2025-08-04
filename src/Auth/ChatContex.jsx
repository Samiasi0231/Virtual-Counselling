
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axiosClient from '../utils/axios-client-analytics';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [chatRooms, setChatRooms] = useState([]);
  const [messages, setMessages] = useState({}); 
  const [loading, setLoading] = useState(false);
  const [websocket, setWebsocket] = useState(null);
  const [activeChatId, setActiveChatId] = useState(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [offlineQueue, setOfflineQueue] = useState([]);

 
  const fetchChatRooms = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get("/vpc/get-chat-rooms/");
      const rooms = res.data;
      
     
      const counts = {};
      rooms.forEach(room => {
        counts[room.item_id] = room.unread_count || 0;
      });
      
      setUnreadCounts(counts);
      setChatRooms(rooms);
      return rooms;
    } catch (err) {
      console.error("Error fetching chat rooms:", err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);


  const fetchMessages = useCallback(async (chatId, page = 1) => {
    if (!chatId || messages[chatId]?.loading) return;
    
    try {
      setMessages(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          loading: true,
          hasMore: prev[chatId]?.hasMore !== false
        }
      }));

      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/?page=${page}`);
      const newMessages = Array.isArray(res.data) ? res.data : res.data.messages || [];

      setMessages(prev => {
        const existing = prev[chatId]?.messages || [];
        const merged = page === 1 
          ? newMessages 
          : [...newMessages, ...existing.filter(m => !newMessages.some(nm => nm.id === m.id))];
        
        return {
          ...prev,
          [chatId]: {
            messages: merged,
            loading: false,
            hasMore: newMessages.length > 0,
            lastFetched: Date.now()
          }
        };
      });

     
      if (page === 1) {
        updateUnreadCount(chatId, 0);
      }

      return newMessages;
    } catch (err) {
      console.error(`Error fetching messages for chat ${chatId}:`, err);
      setMessages(prev => ({
        ...prev,
        [chatId]: {
          ...prev[chatId],
          loading: false,
          error: err.message
        }
      }));
      return [];
    }
  }, [messages]);

  const initWebSocket = useCallback((chatId, token, onMessage) => {
    if (websocket) {
      websocket.close();
    }

    const wsUrl = `wss://cbt.neofin.ng/vpc/message-feed/${chatId}/ws?auth_token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('[WebSocket] Connected');
 
      if (offlineQueue.length > 0) {
        offlineQueue.forEach(msg => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(msg));
          }
        });
        setOfflineQueue([]);
      }
    };

    ws.onerror = (e) => console.error('[WebSocket] Error:', e);
    ws.onclose = () => console.log('[WebSocket] Disconnected');
    ws.onmessage = onMessage;

    setWebsocket(ws);
    setActiveChatId(chatId);
    return ws;
  }, [websocket, offlineQueue]);


  const sendMessage = useCallback((message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
    } else {

      setOfflineQueue(prev => [...prev, message]);
    }
  }, [websocket]);


  const updateUnreadCount = useCallback((chatId, count) => {
    setUnreadCounts(prev => ({
      ...prev,
      [chatId]: count
    }));
  }, []);


  const markMessagesAsRead = useCallback((chatId, messageIds) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      sendMessage({
        type: 'mark_seen',
        chatId,
        messageIds
      });
    }
  }, [websocket, sendMessage]);

  useEffect(() => {
    return () => {
      if (websocket) {
        websocket.close();
      }
    };
  }, [websocket]);

  return (
    <ChatContext.Provider value={{
      chatRooms,
      messages,
      loading,
      fetchChatRooms,
      fetchMessages,
      initWebSocket,
      sendMessage,
      activeChatId,
      unreadCounts,
      updateUnreadCount,
      markMessagesAsRead,
      websocket
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};