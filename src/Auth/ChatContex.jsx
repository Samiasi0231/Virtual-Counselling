
import React, { createContext, useContext, useState } from 'react';
import axiosClient from '../utils/axios-client-analytics';
import {formatMessageDate} from "../utils/time"
const ChatContext = createContext();
export const useChatContext = () => useContext(ChatContext);

const ChatProvider = ({ children }) => {
  const [chatMap, setChatMap] = useState({});
  const [chatSession, setChatSession] = useState(null);
  const [partnerInfo, setPartnerInfo] = useState(null);
  const [unreadIds, setUnreadIds] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);

  const fetchChatMessages = async (chatId, token) => {
    if (!chatId || !token || chatMap[chatId]) return chatMap[chatId];

    setLoadingChats(true);
    try {
      const res = await axiosClient.get(`/vpc/get-messages/${chatId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const raw = res.data.messages || res.data.fullMessages || res.data || [];

      const messages = raw.map((msg) => ({
        ...msg,
        seen_users: msg.seen_users || [],
          groupDate: formatMessageDate(msg.created_at),
      }));

      setChatMap(prev => ({ ...prev, [chatId]: messages }));

      const unread = messages
  .filter(msg => !msg.read && !msg.seen_users?.includes(contextUser?.item_id))
  .map(msg => msg.item_id);


      return messages;
    } catch (err) {
      console.error('[ChatContext] Failed to fetch chat:', err);
      return [];
    } finally {
      setLoadingChats(false);
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

    setChatMap(prev => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), optimisticMessage],
    }));

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
