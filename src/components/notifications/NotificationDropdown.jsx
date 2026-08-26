import React from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { formatTimeAgo } from '../../utils/deadlineHelper';
import { Bell, CheckCheck, Clock, Send, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export function NotificationDropdown({ isOpen, onClose, onSelectTask }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-[#111111] rounded-xl shadow-2xl border border-[#252525] py-3 z-50 animate-in fade-in zoom-in-95 duration-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2 border-b border-[#252525]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-zinc-200 text-xs uppercase tracking-wider">Notifications</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-[#B11226] text-white rounded">
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white font-medium"
          >
            <CheckCheck className="w-3 h-3" />
            Mark read
          </button>
        )}
      </div>

      {/* List */}
      <div className="max-h-72 overflow-y-auto divide-y divide-[#1e1e1e]">
        {notifications.length === 0 ? (
          <div className="py-8 text-center text-zinc-500 text-xs">
            No notifications right now
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                markAsRead(notif.id);
                if (notif.taskId && onSelectTask) {
                  onSelectTask(notif.taskId);
                  onClose();
                }
              }}
              className={`flex items-start gap-3 p-3 hover:bg-[#151515] cursor-pointer transition-colors ${
                !notif.read ? 'bg-[#181112]/50' : ''
              }`}
            >
              {/* Unread Left Red Dot (Point 19) */}
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${!notif.read ? 'bg-red-500' : 'bg-transparent'}`} />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-xs truncate ${!notif.read ? 'font-bold text-white' : 'text-zinc-300'}`}>
                    {notif.title}
                  </p>
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {formatTimeAgo(notif.timestamp)}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                  {notif.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
