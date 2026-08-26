import React from 'react';
import { Modal } from '../common/Modal';
import { Avatar } from '../common/Avatar';
import { WorkloadBadge } from '../common/WorkloadBadge';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { useTasks } from '../../context/TaskContext';
import { formatDeadline } from '../../utils/deadlineHelper';
import { Mail, Phone, Clock, CheckCircle2, MessageSquare } from 'lucide-react';

export function MemberProfileModal({ user, isOpen, onClose, onMessageUser, onOpenTaskDetail }) {
  const { tasks, getUserActiveTaskCount } = useTasks();

  if (!user) return null;

  const userTasks = tasks.filter(t => t.assignedToId === user.id);
  const activeTasks = userTasks.filter(t => t.status !== 'COMPLETED');
  const completedTasks = userTasks.filter(t => t.status === 'COMPLETED');
  const activeCount = getUserActiveTaskCount(user.id);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={user.name}
      subtitle={`${user.department} • ${user.role}`}
      maxWidth="max-w-xl"
    >
      <div className="space-y-5">
        
        {/* Profile Card */}
        <div className="flex items-center justify-between p-4 bg-[#151515] rounded-xl border border-[#252525]">
          <div className="flex items-center gap-3">
            <Avatar user={user} size="lg" />
            <div>
              <h4 className="text-sm font-bold text-white">{user.name}</h4>
              <p className="text-xs text-zinc-400">{user.email}</p>
              {user.phone && <p className="text-[11px] text-zinc-500">{user.phone}</p>}
            </div>
          </div>

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
            <span className="text-lg font-bold text-zinc-200 mt-0.5 block">{user.completionRate || 95}%</span>
          </div>
        </div>

        {/* Active Tasks list */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Current Tasks ({activeTasks.length})
          </h4>
          {activeTasks.length === 0 ? (
            <p className="text-xs text-zinc-500 bg-[#151515] p-3 rounded-lg text-center">
              No active tasks. Available for new assignments.
            </p>
          ) : (
            <div className="space-y-1.5">
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
