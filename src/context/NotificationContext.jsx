import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const { currentUser } = useAuth();
  const [allNotifications, setAllNotifications] = useState([]);

  // Load notifications from MongoDB on mount
  useEffect(() => {
    api.getNotifications().then(data => {
      if (data && Array.isArray(data)) {
        setAllNotifications(data);
      }
    }).catch(() => {});
  }, []);

  // Current user's notifications only
  const userNotifications = allNotifications.filter(
    n => !currentUser || n.userId === currentUser.id
  );

  const unreadCount = userNotifications.filter(n => !n.read).length;

  const markAsRead = async (notifId) => {
    setAllNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
    await api.markNotificationRead(notifId).catch(() => {});
  };

  const markAllAsRead = async () => {
    if (!currentUser) return;
    setAllNotifications(prev =>
      prev.map(n => n.userId === currentUser.id ? { ...n, read: true } : n)
    );
    await api.markAllNotificationsRead(currentUser.id).catch(() => {});
  };

  const addNotification = async ({ userId, type, title, message, taskId }) => {
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
    setAllNotifications(prev => [newNotif, ...prev]);
    await api.createNotification(newNotif).catch(() => {});
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
