import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { 
  Bell, 
  ChevronDown, 
  LogOut,
  UserCheck
} from 'lucide-react';

export function Navbar({ onOpenTaskDetail }) {
  const { currentUser, users, setCurrentUser, logout } = useAuth();
  const { unreadCount } = useNotifications();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const notifRef = useRef(null);
  const userMenuRef = useRef(null);
  const roleSwitcherRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) setIsNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) setIsUserMenuOpen(false);
      if (roleSwitcherRef.current && !roleSwitcherRef.current.contains(event.target)) setIsRoleSwitcherOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#080808]/95 backdrop-blur-md border-b border-[#252525] h-14">
      <div className="w-full px-4 sm:px-6 flex items-center justify-between h-full">
        
        {/* Left: Minimal Brand Logo */}
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-xs tracking-wider text-white uppercase">
            E-CELL MET
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            TASKHUB
          </span>
        </div>

        {/* Right Actions: Clean & Minimal (Role Switcher + Notifications + Profile) */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher */}
          <div className="relative" ref={roleSwitcherRef}>
            <button
              onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#141414] text-zinc-300 border border-[#252525] hover:border-zinc-700 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="font-medium">
                Role: <strong>{currentUser?.name}</strong> ({currentUser?.role})
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isRoleSwitcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#111111] rounded-xl shadow-2xl border border-[#252525] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[#222226]">
                  Switch Active Role
                </div>
                <div className="max-h-60 overflow-y-auto py-1">
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setIsRoleSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs hover:bg-[#181818] transition-colors ${
                        currentUser?.id === u.id ? 'bg-[#181818] font-bold text-red-400' : 'text-zinc-300'
                      }`}
                    >
                      <div className="truncate pr-2">
                        <p className="truncate">{u.name}</p>
                        <p className="text-[10px] text-zinc-500">{u.department} • {u.role}</p>
                      </div>
                      {currentUser?.id === u.id && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-[#151515] transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onSelectTask={onOpenTaskDetail}
            />
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#151515] transition-colors"
            >
              <Avatar user={currentUser} size="xs" />
              <span className="text-xs font-semibold text-zinc-200 hidden sm:inline">
                {currentUser?.name}
              </span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-[#111111] rounded-xl shadow-2xl border border-[#252525] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-[#222226]">
                  <p className="text-xs font-bold text-white truncate">{currentUser?.name}</p>
                  <p className="text-[10px] text-zinc-400 truncate">{currentUser?.email}</p>
                  <p className="text-[10px] text-red-400 font-semibold mt-0.5">{currentUser?.role} • {currentUser?.department}</p>
                </div>

                <div className="pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-400 hover:bg-[#181818] transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
