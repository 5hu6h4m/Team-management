import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_NOTIFICATIONS } from '../mock/seedData';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { useAuth } from './AuthContext';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState(() => loadFromStorage('notifications', INITIAL_NOTIFICATIONS));

  useEffect(() => {
    saveToStorage('notifications', notifications);
  }, [notifications]);

  // Current user's notifications
  const userNotifications = notifications.filter(
    n => !currentUser || n.userId === currentUser.id
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const markAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    if (!currentUser) return;
    setNotifications(prev => prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n));
  };

  const addNotification = ({ userId, type, title, message, taskId }) => {
    const newNotif = {
      id: `n-${Date.now()}`,
      userId,
      type: type || 'assigned',
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      taskId
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
