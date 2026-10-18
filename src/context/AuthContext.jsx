import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: load all users from MongoDB, then restore session
  useEffect(() => {
    api.getUsers().then(data => {
      if (data && Array.isArray(data) && data.length > 0) {
        setUsers(data);
        // Restore logged-in session from sessionStorage
        const savedId = sessionStorage.getItem('ecell_current_user_id');
        if (savedId) {
          const found = data.find(u => u.id === savedId);
          if (found) setCurrentUser(found);
        }
      }
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  // Persist session when user changes
  useEffect(() => {
    if (currentUser) {
      sessionStorage.setItem('ecell_current_user_id', currentUser.id);
    } else {
      sessionStorage.removeItem('ecell_current_user_id');
    }
  }, [currentUser]);

  // Login
  const login = (email, enteredPassword) => {
    if (!email?.trim()) return { success: false, message: 'Please enter your email.' };
    if (!enteredPassword?.trim()) return { success: false, message: 'Please enter your password.' };

    const query = email.trim().toLowerCase();
    const found = users.find(
      u => u.email?.toLowerCase() === query ||
           u.name?.toLowerCase() === query ||
           u.id?.toLowerCase() === query
    );

    if (!found) return { success: false, message: 'No account found with this email.' };
    if (found.status === 'inactive') return { success: false, message: 'Your account has been deactivated.' };

    const expectedKey = found.accessKey || 'shubham8686@#';
    if (expectedKey !== enteredPassword.trim()) return { success: false, message: 'Incorrect password.' };

    setCurrentUser(found);
    return { success: true, user: found };
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('ecell_current_user_id');
  };

  // Add Member — save to MongoDB
  const addUser = async (userData) => {
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

    // Save to backend first
    const saved = await api.createUser(newUser).catch(() => null);
    const userToAdd = saved || newUser;
    setUsers(prev => [userToAdd, ...prev]);
    return userToAdd;
  };

  // Update Member — save to MongoDB
  const updateUser = async (userId, updates) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => ({ ...prev, ...updates }));
    }
    await api.updateUser(userId, updates).catch(() => {});
  };

  // Toggle Active/Inactive — save to MongoDB
  const toggleUserStatus = async (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: nextStatus };
      }
      return u;
    }));
    await api.toggleUserStatus(userId).catch(() => {});
  };

  // Refresh users from backend
  const refreshUsers = async () => {
    const data = await api.getUsers().catch(() => null);
    if (data && Array.isArray(data)) setUsers(data);
  };

  return (
    <AuthContext.Provider value={{
      users,
      currentUser,
      setCurrentUser,
      loading,
      login,
      logout,
      addUser,
      updateUser,
      toggleUserStatus,
      refreshUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
