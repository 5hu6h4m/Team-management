import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Modal } from '../common/Modal';
import { getDeadlineStatus } from '../../utils/deadlineHelper';
import { Play, Check, AlertTriangle, ArrowRight, CheckCircle2, Flame, AlertCircle, Clock, Send, Eye } from 'lucide-react';

export function TaskCard({ 
  task, 
  onOpenDetail, 
  onSubmitClick, 
  onVerifyClick,
  onDelegateClick 
}) {
  const { users, currentUser } = useAuth();
  const { startTask, completeTask } = useTasks();

  const [isStartConfirmOpen, setIsStartConfirmOpen] = useState(false);
  const [isCompleteConfirmOpen, setIsCompleteConfirmOpen] = useState(false);

  const assignee = users.find(u => u.id === task.assignedToId);
  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const totalSubtasks = (task.subtasks || []).length;
  const subtaskProgress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS' || currentUser?.role === 'General Secretary';
  const isLead = currentUser?.role === 'Lead' || currentUser?.role === 'Department Lead';

  // Check if current user is the actual assigned worker / department member
  const isDirectAssignee = currentUser?.id === task.assignedToId ||
    users.find(u => u.id === task.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
    users.find(u => u.id === task.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();

  const isDeptMember = currentUser?.department && task.department &&
    currentUser.department.trim().toLowerCase() === task.department.trim().toLowerCase();

  // Workers (Leads/Members) who can start/complete
  const isWorkerAssigned = !isPresident && (isDirectAssignee || (isDeptMember && !isGS));

  const handleConfirmStart = () => {
    startTask(task.id);
    setIsStartConfirmOpen(false);
  };

  const handleConfirmComplete = () => {
    completeTask(task.id);
    setIsCompleteConfirmOpen(false);
  };

  const isHotRed = deadlineInfo.urgencyLevel === 'HOT_RED';
  const isOverdue = deadlineInfo.urgencyLevel === 'OVERDUE';
  const isApproaching = deadlineInfo.urgencyLevel === 'APPROACHING';

  return (
    <>
      <div 
        onClick={() => onOpenDetail(task.id)}
        className={`rounded-2xl p-4.5 transition-all duration-200 cursor-pointer group flex flex-col justify-between relative overflow-hidden border ${
          deadlineInfo.cardStyle
        }`}
      >
        {/* Top ambient glow for hot red / overdue items */}
        {isHotRed && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        )}
        {isOverdue && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-700/25 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        )}

        <div>
          {/* Header Strip: Priority, Status, and Hot Deadline Urgency */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <PriorityBadge priority={task.priority} size="xs" />
              <StatusBadge status={task.status} size="xs" />
            </div>

            {/* Urgency Badge */}
            {task.status !== 'COMPLETED' && (
              <div>
                {isHotRed && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-red-600 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)] animate-pulse tracking-wide uppercase">
                    <Flame className="w-3.5 h-3.5 fill-current animate-bounce" />
                    <span>{deadlineInfo.label}</span>
                  </span>
                )}
                {isOverdue && (
                  <span className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-red-950 text-red-300 border border-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.4)] animate-pulse tracking-wide uppercase">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{deadlineInfo.label}</span>
                  </span>
                )}
                {isApproaching && (
                  <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>{deadlineInfo.label}</span>
                  </span>
                )}
                {!isHotRed && !isOverdue && !isApproaching && task.deadline && (
                  <span className="text-[10px] font-mono text-zinc-400">
                    {deadlineInfo.label}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Clean Title */}
          <h4 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-1.5">
            {task.title}
          </h4>

          {task.description && (
            <p className="text-xs text-zinc-400 line-clamp-2 mb-2 font-normal leading-relaxed">
              {task.description}
            </p>
          )}
        </div>

        {/* Footer Info: Department, Assignee, Deadline & Progress */}
        <div className="pt-3 mt-2 border-t border-[#222228] space-y-3">
          
          <div className="flex items-center justify-between text-xs">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
              {task.department} Team
            </span>
            
            <span className="text-zinc-300 font-medium truncate max-w-[150px] text-right text-[11px]">
              {assignee ? (
                <span className="text-zinc-200 font-semibold">{assignee.name}</span>
              ) : (
                <span className="text-zinc-400 italic">Entire {task.department} Team</span>
              )}
            </span>
          </div>

          {/* Progress Bar (if subtasks or active) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
              <span>{totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks} subtasks` : (task.status === 'COMPLETED' ? '100% Finalized' : 'Progress')}</span>
              <span className={task.status === 'COMPLETED' ? 'text-emerald-400 font-bold' : (isHotRed ? 'text-red-400 font-bold' : 'text-zinc-400')}>
                {task.status === 'COMPLETED' ? '100%' : `${subtaskProgress || (task.status === 'IN_PROGRESS' ? 50 : 0)}%`}
              </span>
            </div>
            <div className="w-full bg-[#1e1e24] h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  task.status === 'COMPLETED' ? 'bg-emerald-500' :
                  isHotRed || isOverdue ? 'bg-red-500' :
                  isApproaching ? 'bg-amber-500' : 'bg-[#D61F36]'
                }`}
                style={{ width: `${task.status === 'COMPLETED' ? 100 : (subtaskProgress || (task.status === 'IN_PROGRESS' ? 50 : 0))}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-1 flex gap-2" onClick={e => e.stopPropagation()}>
            
            {/* Action: Worker - Start Task */}
            {isWorkerAssigned && task.status === 'PENDING' && (
              <button
                onClick={() => setIsStartConfirmOpen(true)}
                className="w-full py-2 text-xs font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Task (Kaam Shuru Karo)</span>
              </button>
            )}

            {/* Action: Worker - Submit / Complete */}
            {isWorkerAssigned && task.status === 'IN_PROGRESS' && (
              <button
                onClick={() => {
                  if (onSubmitClick) onSubmitClick(task);
                  else setIsCompleteConfirmOpen(true);
                }}
                className="w-full py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all transform active:scale-95"
              >
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Submit Deliverable (Kaam Khatam)</span>
              </button>
            )}

            {/* Action: Submitted / Review State for Leads / President / GS */}
            {task.status === 'SUBMITTED' && (
              <button
                onClick={() => onVerifyClick ? onVerifyClick(task) : onOpenDetail(task.id)}
                className="w-full py-2 text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Review Deliverable →</span>
              </button>
            )}

            {/* GS Delegation Quick Action */}
            {isGS && task.status === 'PENDING' && onDelegateClick && (
              <button
                onClick={() => onDelegateClick(task)}
                className="w-full py-2 text-xs font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Handover to Lead / Team →</span>
              </button>
            )}

            {/* Completed State Badge */}
            {task.status === 'COMPLETED' && (
              <div className="w-full py-1.5 text-center text-xs font-bold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-800/40 flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Finalized & Closed</span>
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
              Starting this task will update its status to <strong className="text-blue-400 font-bold">In Progress</strong>. 
              President & GS will see your live status immediately on their command centers.
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

      {/* POPUP 2: COMPLETE TASK CONFIRMATION MODAL */}
      {isCompleteConfirmOpen && (
        <Modal
          isOpen={isCompleteConfirmOpen}
          onClose={() => setIsCompleteConfirmOpen(false)}
          title="Finish & Complete Task"
          subtitle={`Are you sure you want to mark "${task.title}" as complete?`}
          maxWidth="max-w-sm"
        >
          <div className="space-y-4 text-xs">
            <p className="text-zinc-300">
              This will submit or finalize the task and notify the President and GS.
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
