import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_MESSAGES } from '../mock/seedData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const { currentUser, users } = useAuth();
  const [messages, setMessages] = useState(() => loadFromStorage('messages', INITIAL_MESSAGES));
  const [activeContactId, setActiveContactId] = useState(null);

  useEffect(() => {
    saveToStorage('messages', messages);
  }, [messages]);

  // If no contact selected, default to first available contact
  useEffect(() => {
    if (!activeContactId && currentUser) {
      const otherUser = users.find(u => u.id !== currentUser.id);
      if (otherUser) {
        setActiveContactId(otherUser.id);
      }
    }
  }, [currentUser, activeContactId, users]);

  // Send direct message
  const sendMessage = (receiverId, messageText) => {
    if (!currentUser || !messageText.trim()) return;

    const newMsg = {
      id: `m-${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      message: messageText.trim(),
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [...prev, newMsg]);
    return newMsg;
  };

  // Get conversation between current user and a target contact
  const getConversation = (contactId) => {
    if (!currentUser || !contactId) return [];
    return messages.filter(
      m => (m.senderId === currentUser.id && m.receiverId === contactId) ||
           (m.senderId === contactId && m.receiverId === currentUser.id)
    ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  // Unread count for current user
  const totalUnreadMessages = messages.filter(
    m => currentUser && m.receiverId === currentUser.id && !m.read
  ).length;

  return (
    <ChatContext.Provider
      value={{
        messages,
        activeContactId,
        setActiveContactId,
        sendMessage,
        getConversation,
        totalUnreadMessages
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
