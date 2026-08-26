import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { INITIAL_USERS } from '../mock/seedData';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    return loadFromStorage('ecell_users', INITIAL_USERS);
  });

  // Current logged in user (null on fresh visit so Login Page appears first)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecell_current_user_id');
    if (saved) {
      const found = loadFromStorage('ecell_users', INITIAL_USERS).find(u => u.id === saved);
      return found || null;
    }
    return null; // Login page shows first!
  });

  // Keep local storage synced
  useEffect(() => {
    saveToStorage('ecell_users', users);
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
        setUsers(data);
        if (currentUser) {
          const updated = data.find(u => u.id === currentUser.id);
          if (updated) setCurrentUser(updated);
        }
      }
    }).catch(() => {});
  }, []);

  // Login handler
  const login = (identifier, enteredKey) => {
    const query = identifier.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === query || 
           u.name.toLowerCase() === query ||
           u.id.toLowerCase() === query
    );

    if (!found) {
      return { success: false, message: 'Member account not found with this Name or Email.' };
    }

    if (found.status === 'inactive') {
      return { success: false, message: 'This member account is deactivated. Contact President.' };
    }

    // Check accessKey if provided
    if (enteredKey && enteredKey.trim()) {
      if (found.accessKey && found.accessKey !== enteredKey.trim()) {
        return { success: false, message: 'Invalid Access Key / Password provided for this member.' };
      }
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
      name: userData.name,
      email: userData.email,
      role: userData.role || 'Member',
      department: userData.department || 'General',
      branch: userData.branch || 'Engineering',
      year: userData.year || '1st Year (FE)',
      accessKey: defaultKey,
      phone: userData.phone || '',
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
