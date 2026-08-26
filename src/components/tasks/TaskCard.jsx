import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { getDeadlineStatus } from '../../utils/deadlineHelper';
import { Send, ArrowRight } from 'lucide-react';

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
      className="ecell-card rounded-xl p-4 bg-[#141414] border border-[#222226] hover:border-[#353535] transition-all cursor-pointer group flex flex-col justify-between"
    >
      <div>
        {/* Top: Priority & Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <PriorityBadge priority={task.priority} size="xs" />
          <StatusBadge status={task.status} size="xs" />
        </div>

        {/* Clean Title */}
        <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
          {task.title}
        </h4>
      </div>

      {/* Footer Info: Department, Assignee, Deadline & Progress */}
      <div className="pt-2.5 mt-2 border-t border-[#1f1f23] space-y-2">
        
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400 font-medium">{task.department}</span>
          
          <span className="text-zinc-300 font-medium truncate max-w-[120px]">
            {assignee ? assignee.name : 'Unassigned'}
          </span>
        </div>

        {/* Deadline & Subtask progress */}
        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span className={deadlineInfo.status === 'overdue' ? 'text-red-400 font-bold' : 'text-zinc-400'}>
            {deadlineInfo.label}
          </span>
          <span>{subtaskProgress}%</span>
        </div>

        {/* Thin Red Progress Bar */}
        <div className="w-full bg-[#202024] h-1 rounded-full overflow-hidden">
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
              className="w-full py-1 text-[11px] font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded border border-zinc-700"
            >
              Start
            </button>
          )}

          {isAssignedToMe && task.status === 'IN_PROGRESS' && (
            <button
              onClick={() => onSubmitClick && onSubmitClick(task)}
              className="w-full py-1 text-[11px] font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded shadow-sm flex items-center justify-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Submit for Review</span>
            </button>
          )}

          {canVerify && task.status === 'SUBMITTED' && (
            <button
              onClick={() => onVerifyClick ? onVerifyClick(task) : onOpenDetail(task.id)}
              className="w-full py-1 text-[11px] font-bold text-red-300 bg-red-950/40 hover:bg-red-900/50 border border-red-800/60 rounded"
            >
              Verify Deliverable →
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
