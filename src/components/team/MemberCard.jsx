import React from 'react';
import { Avatar } from '../common/Avatar';
import { useTasks } from '../../context/TaskContext';
import { getWorkloadStatus } from '../../utils/deadlineHelper';
import { MessageSquare, GraduationCap } from 'lucide-react';

export function MemberCard({ user, onSelectUser, onMessageUser }) {
  const { getUserActiveTaskCount } = useTasks();
  const activeCount = getUserActiveTaskCount(user.id);
  const workload = getWorkloadStatus(activeCount);

  return (
    <div 
      onClick={() => onSelectUser && onSelectUser(user)}
      className="ecell-card rounded-xl p-4 bg-[#141414] border border-[#222226] hover:border-[#353535] transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* User Info & Avatar */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar user={user} size="md" />
            <div className="min-w-0">
              <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors truncate">
                {user.name}
              </h4>
              <p className="text-[10px] text-zinc-400 font-medium truncate">
                {user.role} • {user.department} Team
              </p>
              <p className="text-[10px] text-zinc-500 truncate flex items-center gap-1 mt-0.5">
                <GraduationCap className="w-3 h-3 text-red-400 shrink-0" />
                <span className="truncate">{user.branch || 'Engg'} ({user.year || 'SE'})</span>
              </p>
            </div>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${workload.bgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${workload.dotClass}`}></span>
            {workload.label}
          </span>
        </div>

        {/* Stats Line */}
        <div className="flex items-center justify-between text-xs py-1.5 px-2.5 bg-[#181818] rounded-lg border border-[#222226] text-zinc-400 mb-3">
          <span>Active Tasks: <strong className="text-white">{activeCount}</strong></span>
          <span>Completion: <strong className="text-emerald-400">{user.completionRate || 95}%</strong></span>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="pt-2 border-t border-[#1f1f23] flex items-center justify-between gap-2" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => onMessageUser && onMessageUser(user.id)}
          className="flex-1 py-1 px-2 text-[11px] font-semibold text-zinc-300 bg-[#181818] hover:bg-[#252525] rounded border border-[#252525] flex items-center justify-center gap-1"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Message</span>
        </button>
        <button
          onClick={() => onSelectUser && onSelectUser(user)}
          className="py-1 px-2.5 text-[11px] font-semibold text-red-400 hover:text-red-300"
        >
          Profile →
        </button>
      </div>
    </div>
  );
}
