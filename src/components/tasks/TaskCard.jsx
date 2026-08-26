import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { getDeadlineStatus, formatDeadline } from '../../utils/deadlineHelper';
import { Send, CheckCircle2 } from 'lucide-react';

export function TaskCard({ task, onOpenDetail, onSubmitClick, onVerifyClick }) {
  const { users, currentUser } = useAuth();
  const { startTask } = useTasks();

  const assignee = users.find(u => u.id === task.assignedToId);
  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const isAssignedToMe = currentUser?.id === task.assignedToId;
  const canVerify = currentUser?.role === 'President' || 
    currentUser?.role === 'GS' || 
    (currentUser?.role === 'Lead' && currentUser?.department === task.department);

  return (
    <div 
      onClick={() => onOpenDetail(task.id)}
      className="ecell-card rounded-xl p-4.5 bg-[#151515] border border-[#252525] hover:border-[#3a3a3a] transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top: Priority & Status */}
        <div className="flex items-center justify-between mb-2">
          <PriorityBadge priority={task.priority} size="xs" />
          <StatusBadge status={task.status} size="xs" />
        </div>

        {/* Title */}
        <h4 className="text-sm font-bold text-zinc-100 group-hover:text-white transition-colors line-clamp-1 mb-1">
          {task.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer Info: Department, Assignee, Deadline & Progress */}
      <div className="pt-3 border-t border-[#222226] space-y-2.5">
        
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400 font-medium">{task.department} Team</span>
          
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
            <span className="text-zinc-200 font-medium">{assignee ? assignee.name : 'Unassigned'}</span>
          </div>
        </div>

        {/* Deadline & Subtask progress */}
        <div className="flex items-center justify-between text-[11px] text-zinc-500">
          <span className={`font-medium ${deadlineInfo.status === 'overdue' ? 'text-red-400' : 'text-zinc-400'}`}>
            {deadlineInfo.label}
          </span>
          <span className="font-mono text-zinc-400">{subtaskProgress}%</span>
        </div>

        {/* Thin Red Progress Bar */}
        <div className="w-full bg-[#252525] h-1 rounded-full overflow-hidden">
          <div
            className="bg-[#D61F36] h-full rounded-full transition-all duration-300"
            style={{ width: `${subtaskProgress}%` }}
          />
        </div>

        {/* Interactive Action Buttons */}
        <div className="pt-1 flex gap-2" onClick={e => e.stopPropagation()}>
          {isAssignedToMe && task.status === 'PENDING' && (
            <button
              onClick={() => startTask(task.id)}
              className="w-full py-1.5 text-xs font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700 transition-colors"
            >
              Start Working
            </button>
          )}

          {isAssignedToMe && task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onSubmitClick && onSubmitClick(task)}
              className="w-full py-1.5 text-xs font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3 h-3" />
              <span>Submit for Verification</span>
            </button>
          )}

          {canVerify && task.status === 'SUBMITTED' && (
            <button
              onClick={() => onVerifyClick ? onVerifyClick(task) : onOpenDetail(task.id)}
              className="w-full py-1.5 text-xs font-bold text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 rounded-lg transition-colors"
            >
              Verify Submission →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
