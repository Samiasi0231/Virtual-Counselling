
import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../utils/axios-client-analytics';
import {formatMessageDate} from "../utils/time"
import { dedupeMessages } from '../utils/message';
const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [chatMap, setChatMap] = useState({});
  const [chatSession, setChatSession] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [unreadIds, setUnreadIds] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

 const fetchChatMessages = async (chatId, token) => {
  if (!chatId || !token) return [];

  const localKey = `chat_messages_${chatId}`;
  const cached = localStorage.getItem(localKey);
  let localMessages = [];

  if (cached) {
    try {
      localMessages = JSON.parse(cached);
      setChatMap(prev => ({
        ...prev,
        [chatId]: dedupeMessages([...(prev[chatId] || []), ...localMessages]),
      }));
    } catch (e) {
      console.error('Invalid cache for', chatId);
    }
  }

  try {
    const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const raw = res.data.messages || res.data.fullMessages || res.data || [];
    const serverMessages = raw.map(msg => ({
      ...msg,
      groupDate: formatMessageDate(msg.created_at),
      seen_users: msg.seen_users || [],
    }));

    const merged = dedupeMessages([...localMessages, ...serverMessages]);

    setChatMap(prev => ({
      ...prev,
      [chatId]: merged,
    }));

    localStorage.setItem(localKey, JSON.stringify(merged.slice(-200)));

    return merged;
  } catch (err) {
    console.error('[ChatContext] fetchChatMessages failed:', err);
    return [];
  }
};


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

  const sendMessage = async ({ chatId, text, file, userType, token, contextUser, isStudent, anonymous,clientMessageId }) => {
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
        fetchChatMessages,
        updateSeenUsers,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};


export default ChatProvider;