import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useChat } from '../../context/ChatContext';
import { Avatar } from '../common/Avatar';
import { NotificationDropdown } from '../notifications/NotificationDropdown';
import { 
  Bell, 
  MessageSquare, 
  Search, 
  ChevronDown, 
  Command,
  Sparkles,
  LogOut,
  Users
} from 'lucide-react';

export function Navbar({ 
  onOpenTaskDetail, 
  searchQuery, 
  setSearchQuery, 
  onNavigate,
  onOpenCommandCenter 
}) {
  const { currentUser, users, switchUser, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const { totalUnreadMessages } = useChat();

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
      <div className="w-full px-4 sm:px-6 flex items-center justify-between h-full gap-4">
        
        {/* Left: Minimal Brand Text */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs tracking-wider text-white uppercase">
              E-CELL MET
            </span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              TASKHUB
            </span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tasks, deliverables, members..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-12 py-1.5 text-xs bg-[#111111] border border-[#252525] rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#444444] transition-all"
            />
            <button
              onClick={onOpenCommandCenter}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 bg-zinc-850 px-1.5 py-0.5 rounded border border-zinc-700 font-mono"
            >
              ⌘K
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          
          {/* ⌘ Quick Actions Button (Point 24) */}
          <button
            onClick={onOpenCommandCenter}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-[#151515] text-zinc-300 border border-[#252525] hover:border-zinc-700 hover:text-white transition-colors"
          >
            <Command className="w-3 h-3 text-red-400" />
            <span>Quick Actions</span>
          </button>

          {/* Quick Role Switcher preview */}
          <div className="relative" ref={roleSwitcherRef}>
            <button
              onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#151515] text-zinc-300 border border-[#252525] hover:border-zinc-700 transition-colors"
              title="Test another role perspective"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
              <span className="text-zinc-400 hidden lg:inline">Role:</span>
              <span className="font-semibold text-white">{currentUser?.name} ({currentUser?.role})</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isRoleSwitcherOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-[#111111] rounded-xl shadow-2xl border border-[#252525] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-[#252525]">
                  <p className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Switch Role Preview</p>
                </div>
                <div className="max-h-60 overflow-y-auto py-1 divide-y divide-[#1e1e1e]">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsRoleSwitcherOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-[#181818] transition-colors ${
                        currentUser?.id === u.id ? 'bg-zinc-850' : ''
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar user={u} size="xs" />
                        <div>
                          <p className="text-xs font-semibold text-zinc-200">{u.name}</p>
                          <p className="text-[10px] text-zinc-500">{u.department}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        {u.role}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <button
            onClick={() => onNavigate && onNavigate('messages')}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors relative"
            title="Messages"
          >
            <MessageSquare className="w-4 h-4" />
            {totalUnreadMessages > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>

            <NotificationDropdown
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
              onSelectTask={onOpenTaskDetail}
            />
          </div>

          {/* User Profile */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-zinc-850 transition-colors"
            >
              <Avatar user={currentUser} size="xs" />
              <span className="text-xs font-semibold text-zinc-300 hidden sm:inline">{currentUser?.name}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-[#111111] rounded-xl shadow-2xl border border-[#252525] py-2 z-50">
                <div className="px-4 py-2 border-b border-[#252525]">
                  <p className="text-xs font-bold text-white">{currentUser?.name}</p>
                  <p className="text-[10px] text-zinc-400">{currentUser?.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.5 text-[9px] font-bold uppercase bg-zinc-800 text-zinc-300 rounded border border-zinc-700">
                    {currentUser?.role}
                  </span>
                </div>
                <div className="py-1">
                  <button
                    onClick={() => { onNavigate('team'); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    <Users className="w-3.5 h-3.5 text-zinc-500" />
                    Team Directory
                  </button>
                  <button
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-1.5 text-xs text-red-400 hover:bg-red-950/30"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
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
