import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadFromStorage, saveToStorage } from '../utils/storage';
import { INITIAL_USERS } from '../mock/seedData';
import { api } from '../services/api';

const AuthContext = createContext();

const STORAGE_KEY = 'ecell_users_v3';

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    return loadFromStorage(STORAGE_KEY, INITIAL_USERS);
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ecell_current_user_id');
    if (saved) {
      const found = loadFromStorage(STORAGE_KEY, INITIAL_USERS).find(u => u.id === saved);
      return found || null;
    }
    return null; // Always show clean professional login screen first
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
        setUsers(data);
        if (currentUser) {
          const updated = data.find(u => u.id === currentUser.id);
          if (updated) setCurrentUser(updated);
        }
      }
    }).catch(() => {});
  }, []);

  // Professional Gmail + Password/Key login
  const login = (emailOrGmail, enteredPassword) => {
    if (!emailOrGmail || !emailOrGmail.trim()) {
      return { success: false, message: 'Please enter your registered Gmail or Email address.' };
    }

    if (!enteredPassword || !enteredPassword.trim()) {
      return { success: false, message: 'Please enter your access password / key.' };
    }

    const query = emailOrGmail.trim().toLowerCase();
    const found = users.find(
      u => u.email.toLowerCase() === query || 
           u.name.toLowerCase() === query ||
           u.id.toLowerCase() === query
    );

    if (!found) {
      return { 
        success: false, 
        message: 'No account found with this Gmail/Email. Please contact E-Cell President to register your profile.' 
      };
    }

    if (found.status === 'inactive') {
      return { 
        success: false, 
        message: 'Your account has been deactivated. Please contact the President.' 
      };
    }

    const expectedKey = found.accessKey || 'shubham123';
    if (expectedKey !== enteredPassword.trim()) {
      return { 
        success: false, 
        message: 'Incorrect Access Password / Key. Please verify with President.' 
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
