import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_USERS } from '../mock/seedData';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => loadFromStorage('users', INITIAL_USERS));
  
  // Default to President Shubham for easy exploration
  const [currentUser, setCurrentUser] = useState(() => {
    const savedId = loadFromStorage('current_user_id', 'u-president');
    const found = users.find(u => u.id === savedId);
    return found || users[0];
  });

  useEffect(() => {
    saveToStorage('users', users);
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      saveToStorage('current_user_id', currentUser.id);
    }
  }, [currentUser]);

  // Fast switch to another user role
  const switchUser = (userId) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const login = (emailOrUsername) => {
    const found = users.find(
      u => u.email.toLowerCase() === emailOrUsername.toLowerCase() ||
           u.name.toLowerCase() === emailOrUsername.toLowerCase()
    );
    if (found) {
      setCurrentUser(found);
      return { success: true, user: found };
    }
    return { success: false, message: 'User not found. Try president@ecell.org or select a quick profile.' };
  };

  const logout = () => {
    // Switch to null or back to login screen
    setCurrentUser(null);
  };

  const addUser = (userData) => {
    const newUser = {
      ...userData,
      id: `u-${Date.now()}`,
      status: 'active',
      completionRate: 100,
      joinedDate: new Date().toISOString().split('T')[0],
      avatar: userData.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`
    };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const updateUserRole = (userId, newRole, newDepartment) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          role: newRole,
          department: newDepartment || u.department
        };
      }
      return u;
    }));
  };

  const toggleUserStatus = (userId) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        return {
          ...u,
          status: u.status === 'active' ? 'inactive' : 'active'
        };
      }
      return u;
    }));
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        switchUser,
        login,
        logout,
        addUser,
        updateUserRole,
        toggleUserStatus,
        deleteUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
