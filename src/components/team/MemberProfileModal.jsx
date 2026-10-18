import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { WorkloadBadge } from '../common/WorkloadBadge';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { formatDeadline } from '../../utils/deadlineHelper';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare, KeyRound, Copy, Check, RefreshCw } from 'lucide-react';

export function MemberProfileModal({ user, isOpen, onClose, onMessageUser, onOpenTaskDetail }) {
  const { tasks, getUserActiveTaskCount } = useTasks();
  const { currentUser, updateUser } = useAuth();

  const [newPassword, setNewPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  if (!user) return null;

  const isPresident = currentUser?.role === 'President';
  const userTasks = tasks.filter(t => t.assignedToId === user.id);
  const activeTasks = userTasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = userTasks.filter(t => t.status === 'COMPLETED');

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(user.accessKey || 'mohit@123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;

    updateUser(user.id, {
      accessKey: newPassword.trim()
    });

    navigator.clipboard.writeText(newPassword.trim());
    setIsResetSuccess(true);
    setTimeout(() => setIsResetSuccess(false), 3000);
    setNewPassword('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user.name}
      subtitle={`${user.department} • ${user.role}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5 text-xs">
        
        {/* Profile Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#151515] rounded-xl border border-[#252525] gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Avatar user={user} size="lg" />
            <div className="min-w-0">
              <h4 className="text-sm font-bold text-white truncate">{user.name}</h4>
              <p className="text-xs text-zinc-400 truncate">{user.email}</p>
              <p className="text-[11px] text-zinc-500 mt-0.5">{user.branch} ({user.year})</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => {
                onClose();
                onMessageUser && onMessageUser(user.id);
              }}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
          </div>
        </div>

        {/* President Login Password & Reset Section */}
        {isPresident && (
          <div className="p-4 bg-[#181512] rounded-xl border border-amber-900/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold uppercase tracking-wider text-[10px]">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Login Credentials (President Access)</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-amber-300 bg-[#121212] px-2 py-0.5 rounded border border-amber-900/50 text-[11px]">
                  {user.accessKey || 'mohit@123'}
                </span>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="p-1 text-zinc-400 hover:text-white"
                  title="Copy Password"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Quick Reset Form */}
            <form onSubmit={handleResetPassword} className="flex gap-2 pt-1 border-t border-amber-900/30">
              <input
                type="text"
                placeholder="Enter new password to reset..."
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-[#121212] border border-amber-900/50 rounded-lg text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={() => setNewPassword(`${user.name.toLowerCase().split(' ')[0]}@${Math.floor(100 + Math.random() * 900)}`)}
                className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs flex items-center gap-1 shrink-0"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Random</span>
              </button>
              <button
                type="submit"
                disabled={!newPassword.trim()}
                className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white rounded-lg font-bold text-xs shrink-0"
              >
                Reset & Copy
              </button>
            </form>

            {isResetSuccess && (
              <p className="text-[10px] text-emerald-400 font-medium">
                ✓ Password updated and copied to clipboard!
              </p>
            )}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 bg-[#151515] rounded-xl border border-[#252525]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Active Tasks</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{activeTasks.length}</span>
          </div>
          <div className="p-3 bg-[#151515] rounded-xl border border-[#252525]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Completed</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">{completedTasks.length}</span>
          </div>
          <div className="p-3 bg-[#151515] rounded-xl border border-[#252525]">
            <span className="text-[10px] uppercase font-bold text-zinc-500 block">Completion</span>
            <span className="text-lg font-bold text-zinc-200 mt-0.5 block">{user.completionRate || 100}%</span>
          </div>
        </div>

        {/* Active Tasks list */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Current Assigned Tasks ({activeTasks.length})
          </h4>
          {activeTasks.length === 0 ? (
            <p className="text-xs text-zinc-500 bg-[#151515] p-3 rounded-lg text-center">
              No active tasks currently assigned.
            </p>
          ) : (
            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {activeTasks.map(t => (
                <div
                  key={t.id}
                  onClick={() => {
                    onClose();
                    onOpenTaskDetail && onOpenTaskDetail(t.id);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-[#151515] hover:bg-[#181818] border border-[#252525] cursor-pointer text-xs"
                >
                  <span className="font-semibold text-zinc-200 truncate">{t.title}</span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={t.priority} size="xs" />
                    <StatusBadge status={t.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </Modal>
  );
}
