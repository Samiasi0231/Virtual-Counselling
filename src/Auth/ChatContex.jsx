// ChatContext.js

import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../utils/axios-client-analytics';
import { formatMessageDate } from '../utils/time';
import { dedupeMessages } from '../utils/message';

const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [chatMap, setChatMap] = useState({});
  const [chatSession, setChatSession] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [unreadIds, setUnreadIds] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [recentChats, setRecentChats] = useState([]);

 
  const fetchRecentChats = async () => {
    setLoadingChats(true);
    try {
      const res = await axiosClient.get("/vpc/get-chat-rooms/");
      const rooms = res.data || [];

      setRecentChats(rooms);
      localStorage.setItem("cached_chat_rooms", JSON.stringify(rooms));
      return rooms;
    } catch (err) {
      console.error("[fetchRecentChats] Failed:", err);
      try {
        const fallback = JSON.parse(localStorage.getItem("cached_chat_rooms")) || [];
        setRecentChats(fallback);
        return fallback;
      } catch {
        return [];
      }
    } finally {
      setLoadingChats(false);
    }
  };

const fetchChatMessages = async (chatId, token, force = false) => {
  if (!chatId || !token) return [];

  try {
    const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const serverMessages = (res.data.messages || res.data.fullMessages || res.data || []).map(msg => ({
      ...msg,
      groupDate: formatMessageDate(msg.created_at),
      seen_users: msg.seen_users || [],
    }));

    const merged = dedupeMessages([
      ...(chatMap[chatId] || []),
      ...serverMessages,
    ]);

    // ✅ Save last 200 messages only
    localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(merged.slice(-200)));

    setChatMap(prev => ({
      ...prev,
      [chatId]: merged,
    }));

    return merged;
  } catch (err) {
    console.error('[fetchChatMessages] failed:', err);

   
    const localKey = `chat_messages_${chatId}`;
    const cached = localStorage.getItem(localKey);
    let localMessages = [];

    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          localMessages = parsed;
        }
      } catch (e) {
        console.warn('[fetchChatMessages] corrupted localStorage for', localKey);
      }
    }

    return localMessages;
  }
};



  const selectChatSession = async ({ chatId, token, userType, isStudent, onSelect }) => {
    const messages = await fetchChatMessages(chatId, token, true);
    const lastMsg = messages[messages.length - 1];
    const partner = isStudent ? lastMsg?.sender_counselor : lastMsg?.sender_user;

    setChatSession({ item_id: chatId, user_anonymous: false });
    setPartnerInfo(partner);
    localStorage.setItem('lastChatId', chatId);

    if (onSelect) {
      onSelect(messages, partner, messages, { item_id: chatId, user_anonymous: false });
    }

    return messages;
  };

  // ✅ 4. Update seen state
  const updateSeenUsers = (chatId, messageIds, userId) => {
    if (!chatMap[chatId]) return;

    setChatMap(prev => ({
      ...prev,
      [chatId]: prev[chatId].map(msg =>
        messageIds.includes(msg.item_id)
          ? {
              ...msg,
              seen_users: [...new Set([...(msg.seen_users || []), userId])],
            }
          : msg
      ),
    }));

    setUnreadIds(prev => prev.filter(id => !messageIds.includes(id)));
  };

  const sendMessage = async ({
    chatId,
    text,
    file,
    userType,
    token,
    contextUser,
    isStudent,
    anonymous,
    clientMessageId,
  }) => {
    if (!chatId || !token || (!text && !file)) return;

    const now = new Date();
    const tempId = `temp-${now.getTime()}`;
    const fileType = file?.type?.startsWith('image') ? 'image' : 'file';

    const optimisticMessage = {
      id: tempId,
      clientMessageId,
      sender: userType,
      text,
      file: file ? URL.createObjectURL(file) : null,
      fileType: file ? fileType : null,
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groupDate: formatMessageDate(now),
      read: false,
      isFromCurrentUser: true,
      studentAnonymous: isStudent ? anonymous : false,
      senderFullname: contextUser?.fullname || '',
      senderAvatar: contextUser?.profilePhoto?.best || contextUser?.profilePhoto || null,
    };

    setChatMap(prev => {
      const updated = dedupeMessages([...(prev[chatId] || []), optimisticMessage]).slice(-200);
      localStorage.setItem(`chat_messages_${chatId}`, JSON.stringify(updated));
      return {
        ...prev,
        [chatId]: updated,
      };
    });

    try {
      const formData = new FormData();
      if (text) formData.append('text', text);
      if (file) formData.append('attachments', file);
      if (clientMessageId) formData.append('clientMessageId', clientMessageId);

      await axiosClient.post(`/vpc/create-message/${chatId}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error('[ChatContext] sendMessage failed:', error);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chatMap,
        setChatMap,
        chatSession,
        setChatSession,
        partnerInfo,
        setPartnerInfo,
        unreadIds,
        setUnreadIds,
        loadingChats,
        fetchRecentChats,   
        recentChats,          
        fetchChatMessages,
        updateSeenUsers,
        sendMessage,
        selectChatSession    
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
