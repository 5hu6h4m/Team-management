import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { INITIAL_USERS } from '../mock/seedData';
import { api } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY = 'ecell_users_v7';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = loadFromStorage(STORAGE_KEY, []);
    if (!saved || saved.length === 0) {
      // Also check v6 or older keys
      const oldV6 = loadFromStorage('ecell_users_v6', null);
      if (oldV6 && Array.isArray(oldV6)) {
        const existingIds = new Set(oldV6.map(u => u.id));
        const missing = INITIAL_USERS.filter(u => !existingIds.has(u.id));
        return [...oldV6, ...missing];
      }
      return INITIAL_USERS;
    }
    const existingIds = new Set(saved.map(u => u.id));
    const missing = INITIAL_USERS.filter(u => !existingIds.has(u.id));
    return [...saved, ...missing];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecell_current_user_id');
    if (saved) {
      const found = users.find(u => u.id === saved);
      return found || users[0] || null;
    }
    return users[0] || null;
  });

  // Keep storage synced
  useEffect(() => {
    saveToStorage(STORAGE_KEY, users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ecell_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('ecell_current_user_id');
    }
  }, [currentUser]);

  // Load from MongoDB backend if available
  useEffect(() => {
    api.getUsers().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setUsers(prev => {
          const existingIds = new Set(data.map(u => u.id));
          const missing = prev.filter(u => !existingIds.has(u.id));
          return [...data, ...missing];
        });
        if (currentUser) {
          const updated = data.find(u => u.id === currentUser.id);
          if (updated) setCurrentUser(updated);
        }
      }
    }).catch(() => {});
  }, []);

  // Standard secure login
  const login = (email, enteredPassword) => {
    if (!email || !email.trim()) {
      return { success: false, message: 'Please enter your email.' };
    }

    if (!enteredPassword || !enteredPassword.trim()) {
      return { success: false, message: 'Please enter your password.' };
    }

    const query = email.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === query || 
           u.name.toLowerCase() === query ||
           u.id.toLowerCase() === query
    );

    if (!found) {
      return { 
        success: false, 
        message: 'No account found with this email.' 
      };
    }

    if (found.status === 'inactive') {
      return { 
        success: false, 
        message: 'Your account has been deactivated.' 
      };
    }

    const expectedKey = found.accessKey || 'shubham8686@#';
    if (expectedKey !== enteredPassword.trim()) {
      return { 
        success: false, 
        message: 'Incorrect password.' 
      };
    }

    setCurrentUser(found);
    return { success: true, user: found };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ecell_current_user_id');
  };

  // Add Member (President only)
  const addUser = (userData) => {
    const defaultKey = userData.accessKey?.trim() || `${userData.name.toLowerCase().split(' ')[0]}123`;
    const newUser = {
      id: `u-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      role: userData.role || 'Member',
      department: userData.department || 'General',
      branch: userData.branch || 'Computer Engineering',
      year: userData.year || '2nd Year (SE)',
      accessKey: defaultKey,
      phone: userData.phone?.trim() || '',
      avatar: userData.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      status: 'active',
      completionRate: 100,
      joinedDate: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [newUser, ...prev]);
    api.createUser(newUser).catch(() => {});
    return newUser;
  };

  // Update Member
  const updateUser = (userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
    api.updateUser(userId, updates).catch(() => {});
  };

  // Toggle Active/Inactive status
  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    api.toggleUserStatus(userId).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      setCurrentUser,
      login,
      logout,
      addUser,
      updateUser,
      toggleUserStatus
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
