import React, { useState } from 'react';
import { Drawer } from '../common/Drawer';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { getDeadlineStatus, formatDeadline, formatTimeAgo } from '../../utils/deadlineHelper';
import { 
  Calendar, 
  CheckCircle2, 
  CheckSquare, 
  ExternalLink, 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  Send,
  Trash2
} from 'lucide-react';

export function TaskDetailDrawer({ taskId, isOpen, onClose, onOpenSubmitModal }) {
  const { tasks, toggleSubtask, addSubtask, verifyAndApproveTask, requestRevision, delegateTask, deleteTask } = useTasks();
  const { users, currentUser } = useAuth();
  const { addNotification } = useNotifications();

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedDelegateeId, setSelectedDelegateeId] = useState('');

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const assignee = users.find(u => u.id === task.assignedToId);
  const assignor = users.find(u => u.id === task.assignedById);
  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

  const isAssignedToMe = currentUser?.id === task.assignedToId;
  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS';
  const isLead = currentUser?.role === 'Lead' && currentUser?.department === task.department;
  const canVerify = isPresident || isGS || isLead;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    addSubtask(task.id, newSubtaskText.trim());
    setNewSubtaskText('');
  };

  const handleApprove = () => {
    verifyAndApproveTask(task.id, feedbackText);
    addNotification({
      userId: task.assignedToId,
      type: 'completed',
      title: 'Task Verified & Approved',
      message: `Your task "${task.title}" was approved by ${currentUser?.name}.`,
      taskId: task.id
    });
    setFeedbackText('');
  };

  const handleRequestRevision = () => {
    if (!feedbackText.trim()) {
      alert('Please enter revision feedback notes.');
      return;
    }
    requestRevision(task.id, feedbackText);
    addNotification({
      userId: task.assignedToId,
      type: 'reminder',
      title: 'Revision Requested',
      message: `${currentUser?.name} requested changes on "${task.title}": "${feedbackText}"`,
      taskId: task.id
    });
    setFeedbackText('');
  };

  const handleDelegateSubmit = () => {
    if (!selectedDelegateeId) return;
    delegateTask(task.id, selectedDelegateeId, '');
    addNotification({
      userId: selectedDelegateeId,
      type: 'assigned',
      title: 'Task Delegated',
      message: `${currentUser?.name} delegated "${task.title}" to you.`,
      taskId: task.id
    });
    setIsDelegating(false);
    setSelectedDelegateeId('');
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={`${task.department} Department • Task Details`}
      width="max-w-xl"
    >
      <div className="space-y-6">
        
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 p-3 bg-[#151515] rounded-xl border border-[#252525]">
          <div className="flex items-center gap-2">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          <div className={`px-2.5 py-1 rounded text-xs font-semibold border ${deadlineInfo.bgClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 ${deadlineInfo.dotClass}`}></span>
            <span>{deadlineInfo.label} ({formatDeadline(task.deadline)})</span>
          </div>
        </div>

        {/* Verification Alert if SUBMITTED */}
        {task.status === 'SUBMITTED' && (
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-800/40 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Deliverable Awaiting Verification
              </span>
              <span className="text-[10px] text-zinc-500 font-mono">
                Submitted {formatTimeAgo(task.submittedAt)}
              </span>
            </div>

            {task.deliverableUrl && (
              <div className="text-xs">
                <span className="text-zinc-400">Link: </span>
                <a
                  href={task.deliverableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-400 hover:text-red-300 font-bold underline inline-flex items-center gap-1 ml-1"
                >
                  <span>{task.deliverableUrl}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {task.submissionNotes && (
              <p className="text-xs text-zinc-300 bg-[#151515] p-2.5 rounded-lg border border-[#252525] italic">
                "{task.submissionNotes}"
              </p>
            )}

            {canVerify && (
              <div className="pt-2 border-t border-red-900/30 space-y-2">
                <input
                  type="text"
                  placeholder="Optional review feedback..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={handleRequestRevision}
                    className="px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-lg"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                  >
                    Approve & Complete
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div>
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
            Description
          </h4>
          <p className="text-xs text-zinc-300 leading-relaxed bg-[#151515] p-3 rounded-xl border border-[#252525]">
            {task.description || 'No detailed instructions.'}
          </p>
        </div>

        {/* Assignee Card */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-[#151515] rounded-xl border border-[#252525]">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Assignee</span>
            <div className="flex items-center gap-2">
              <Avatar user={assignee} size="xs" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{assignee?.name || 'Unassigned'}</p>
                <p className="text-[10px] text-zinc-500">{assignee?.role}</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#151515] rounded-xl border border-[#252525]">
            <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Created By</span>
            <div className="flex items-center gap-2">
              <Avatar user={assignor} size="xs" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{assignor?.name || 'President'}</p>
                <p className="text-[10px] text-zinc-500">{assignor?.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Subtasks Checklist */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-zinc-400" />
              Milestones & Subtasks
            </h4>
            <span className="text-[11px] text-zinc-400 font-mono">
              {(task.subtasks || []).filter(s => s.completed).length}/{(task.subtasks || []).length}
            </span>
          </div>

          <div className="space-y-1.5 mb-2">
            {(task.subtasks || []).map((subtask) => (
              <label
                key={subtask.id}
                className={`flex items-start gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                  subtask.completed 
                    ? 'bg-[#121212] border-[#222226] text-zinc-500 line-through' 
                    : 'bg-[#151515] border-[#252525] text-zinc-200 hover:border-zinc-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => toggleSubtask(task.id, subtask.id)}
                  className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-red-600 focus:ring-0"
                />
                <span className="font-medium leading-tight select-none">{subtask.title}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleAddSubtask} className="flex gap-2">
            <input
              type="text"
              placeholder="+ Add subtask milestone..."
              value={newSubtaskText}
              onChange={(e) => setNewSubtaskText(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white focus:outline-none"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg"
            >
              Add
            </button>
          </form>
        </div>

        {/* Vertical Activity Timeline (Point 11) */}
        <div className="pt-4 border-t border-[#252525]">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
            Activity Timeline
          </h4>
          <div className="relative pl-5 space-y-4 before:absolute before:left-1.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#252525]">
            {(task.activityLog || []).map((log, idx) => {
              const logUser = users.find(u => u.id === log.userId);
              return (
                <div key={log.id || idx} className="relative">
                  <span className="absolute -left-5 top-1.5 w-2 h-2 rounded-full bg-red-500 ring-4 ring-[#111111]" />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-semibold text-zinc-200">{log.action}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        by {logUser ? logUser.name : 'System'} ({logUser?.role || 'Executive'})
                      </p>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                      {formatTimeAgo(log.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Member Action: Submit deliverable */}
        {isAssignedToMe && task.status !== 'COMPLETED' && (
          <div className="pt-2 border-t border-[#252525]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubmitModal && onOpenSubmitModal(task);
              }}
              className="w-full py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Deliverables for Review</span>
            </button>
          </div>
        )}

      </div>
    </Drawer>
  );
}
