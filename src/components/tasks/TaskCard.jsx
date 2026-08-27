import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import { getDeadlineStatus } from '../../utils/deadlineHelper';
import { Play, Check, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export function TaskCard({ task, onOpenDetail }) {
  const { users, currentUser } = useAuth();
  const { startTask, completeTask } = useTasks();

  const [isStartConfirmOpen, setIsStartConfirmOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);

  const assignee = users.find(u => u.id === task.assignedToId);
  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  // Check if current user is directly assigned or belongs to the target department
  const isDirectAssignee = currentUser?.id === task.assignedToId ||
    users.find(u => u.id === task.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
    users.find(u => u.id === task.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();

  const isDeptMember = currentUser?.department && task.department &&
    currentUser.department.trim().toLowerCase() === task.department.trim().toLowerCase();

  const isMyTask = isDirectAssignee || isDeptMember;

  const handleConfirmStart = () => {
    startTask(task.id);
    setIsStartConfirmOpen(false);
  };

  const handleConfirmComplete = () => {
    completeTask(task.id);
    setIsCompleteConfirmOpen(false);
  };

  return (
    <>
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
        <div className="pt-2.5 mt-2 border-t border-[#1f1f23] space-y-2.5">
          
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-zinc-400 font-semibold">{task.department} Team</span>
            
            <span className="text-zinc-300 font-medium truncate max-w-[140px]">
              {assignee ? assignee.name : `${task.department} Team`}
            </span>
          </div>

          {/* Live Deadline Warning & Progress */}
          <div className="flex items-center justify-between text-[10px] font-mono">
            <span className={`flex items-center gap-1 font-semibold ${
              deadlineInfo.status === 'overdue' ? 'text-red-400' :
              deadlineInfo.status === 'due-today' || deadlineInfo.status === 'due-tomorrow' ? 'text-amber-400' :
              'text-zinc-400'
            }`}>
              {deadlineInfo.status === 'overdue' && <AlertTriangle className="w-3 h-3 text-red-400" />}
              {deadlineInfo.label}
            </span>
            <span className="text-zinc-500">{subtaskProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#202024] h-1 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#D61F36]'
              }`}
              style={{ width: `${task.status === 'COMPLETED' ? 100 : (subtaskProgress || (task.status === 'IN_PROGRESS' ? 50 : 0))}%` }}
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex gap-2" onClick={e => e.stopPropagation()}>
            
            {/* Button 1: Start Task Trigger */}
            {isMyTask && task.status === 'PENDING' && (
              <button
                onClick={() => setIsStartConfirmOpen(true)}
                className="w-full py-1.5 text-xs font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Start Task</span>
              </button>
            )}

            {/* Button 2: Complete Task Trigger */}
            {isMyTask && task.status === 'IN_PROGRESS' && (
              <button
                onClick={() => setIsCompleteConfirmOpen(true)}
                className="w-full py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Complete Task</span>
              </button>
            )}

            {/* Status 3: Completed */}
            {task.status === 'COMPLETED' && (
              <div className="w-full py-1.5 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded-lg border border-emerald-800/40 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Completed</span>
              </div>
            )}

          </div>

        </div>
      </div>

      {/* POPUP 1: START TASK CONFIRMATION MODAL */}
      {isStartConfirmOpen && (
        <Modal
          isOpen={isStartConfirmOpen}
          onClose={() => setIsStartConfirmOpen(false)}
          title="Start Work on Task"
          subtitle={`Are you starting work on "${task.title}"?`}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-300">
              Starting this task will update its status to <strong className="text-amber-300 font-bold">In Progress</strong>. 
              President & GS will be notified in real-time that work has started.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setIsStartConfirmOpen(false)}
                className="px-3 py-1.5 text-zinc-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmStart}
                className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Play className="w-3 h-3 fill-current" />
                <span>Confirm & Start</span>
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* POPUP 2: FINISH / COMPLETE TASK CONFIRMATION MODAL */}
      {isCompleteConfirmOpen && (
        <Modal
          isOpen={isCompleteConfirmOpen}
          onClose={() => setIsCompleteConfirmOpen(false)}
          title="Finish & Complete Task"
          subtitle={`Are you sure you want to finalize "${task.title}"?`}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-300">
              This will mark the task as <strong className="text-emerald-400 font-bold">Completed</strong> and archive it across President and GS dashboards.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setIsCompleteConfirmOpen(false)}
                className="px-3 py-1.5 text-zinc-400 hover:text-white font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmComplete}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Confirm & Complete</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
