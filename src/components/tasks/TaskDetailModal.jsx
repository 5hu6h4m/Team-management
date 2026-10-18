import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { getDeadlineStatus, formatDeadline, formatTimeAgo } from '../../utils/deadlineHelper';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  CheckSquare, 
  ExternalLink, 
  Paperclip, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  UserCheck, 
  MessageSquare,
  Plus,
  Send,
  Trash2
} from 'lucide-react';

export function TaskDetailModal({ taskId, isOpen, onClose, onOpenSubmitModal }) {
  const { tasks, toggleSubtask, addSubtask, verifyAndApproveTask, requestRevision, delegateTask, deleteTask } = useTasks();
  const { users, currentUser } = useAuth();
  const { addNotification } = useNotifications();

  const [newSubtaskText, setNewSubtaskText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isDelegating, setIsDelegating] = useState(false);
  const [selectedDelegateeId, setSelectedDelegateeId] = useState('');
  const [delegateNote, setDelegateNote] = useState('');

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
  const canDelegate = isPresident || isGS || isLead;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskText.trim()) return;
    addSubtask(task.id, newSubtaskText.trim());
    setNewSubtaskText('');
  };

  const handleApprove = () => {
    verifyAndApproveTask(task.id, feedbackText);
    
    // Notify member
    addNotification({
      userId: task.assignedToId,
      type: 'completed',
      title: 'Task Verified & Completed! 🎉',
      message: `Your task "${task.title}" was verified and approved by ${currentUser?.name}.`,
      taskId: task.id
    });
    setFeedbackText('');
  };

  const handleRequestRevision = () => {
    if (!feedbackText.trim()) {
      alert('Please provide feedback explaining what revisions are needed.');
      return;
    }
    requestRevision(task.id, feedbackText);

    // Notify member
    addNotification({
      userId: task.assignedToId,
      type: 'reminder',
      title: 'Revision Requested on Task',
      message: `${currentUser?.name} requested changes on "${task.title}": "${feedbackText}"`,
      taskId: task.id
    });
    setFeedbackText('');
  };

  const handleDelegateSubmit = () => {
    if (!selectedDelegateeId) return;
    delegateTask(task.id, selectedDelegateeId, delegateNote);

    addNotification({
      userId: selectedDelegateeId,
      type: 'assigned',
      title: 'Task Delegated to You',
      message: `${currentUser?.name} delegated "${task.title}" to you.`,
      taskId: task.id
    });
    setIsDelegating(false);
    setSelectedDelegateeId('');
    setDelegateNote('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      subtitle={`Task in ${task.department} Department`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        
        {/* Top Badges Bar */}
        <div className="flex items-center justify-between gap-3 p-3.5 bg-[#141416] rounded-2xl border border-[#222226] flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider bg-[#1f1f23] text-zinc-200 rounded-lg border border-[#2c2c32] shadow-xs">
              {task.department}
            </span>
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
          </div>

          {/* Deadline Health Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold border ${deadlineInfo.bgClass}`}>
            <span className={`w-2 h-2 rounded-full ${deadlineInfo.dotClass}`}></span>
            <span>{deadlineInfo.label}</span>
            <span className="text-zinc-400 font-normal">({formatDeadline(task.deadline)})</span>
          </div>
        </div>

        {/* Verification Alert Banner if in Submitted state */}
        {task.status === 'SUBMITTED' && (
          <div className="p-4 rounded-2xl bg-[#1c1712] border border-amber-500/40 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400 animate-bounce" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Deliverable Awaiting Verification
                </h4>
              </div>
              <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/30">
                Submitted {formatTimeAgo(task.submittedAt)}
              </span>
            </div>

            {task.deliverableUrl && (
              <div className="mb-2">
                <span className="text-xs text-zinc-400 font-medium">Deliverable Link: </span>
                <a
                  href={task.deliverableUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 underline ml-1"
                >
                  <span>{task.deliverableUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {task.submissionNotes && (
              <p className="text-xs text-zinc-200 bg-[#121214] p-2.5 rounded-xl border border-[#252528] font-normal italic">
                &ldquo;{task.submissionNotes}&rdquo;
              </p>
            )}

            {/* Verification Controls for Lead/President */}
            {canVerify && (
              <div className="mt-3 pt-3 border-t border-amber-500/20 space-y-2">
                <input
                  type="text"
                  placeholder="Optional review feedback or revision note..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#141416] border border-[#2a2a30] text-white rounded-xl focus:outline-none focus:border-amber-500"
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={handleRequestRevision}
                    className="px-3 py-1.5 text-xs font-bold text-rose-400 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 rounded-xl transition-colors"
                  >
                    Request Revision
                  </button>
                  <button
                    onClick={handleApprove}
                    className="px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve & Mark Completed
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Two-Column Details layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column (2 Cols): Description, Subtasks, Deliverables, Activity Timeline */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Description & Instructions
              </h4>
              <div className="text-xs text-zinc-200 leading-relaxed whitespace-pre-line bg-[#141416] p-3.5 rounded-2xl border border-[#222226] font-normal">
                {task.description || 'No detailed instructions added.'}
              </div>
            </div>

            {/* Subtasks Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-blue-400" />
                  Subtasks & Deliverables Checklist
                </h4>
                <span className="text-[11px] text-zinc-400 font-semibold">
                  {(task.subtasks || []).filter(s => s.completed).length} of {(task.subtasks || []).length} completed
                </span>
              </div>

              <div className="space-y-1.5 mb-2">
                {(task.subtasks || []).map((subtask) => (
                  <label
                    key={subtask.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer ${
                      subtask.completed 
                        ? 'bg-[#121214] border-[#1e1e22] text-zinc-500 line-through' 
                        : 'bg-[#161618] border-[#252528] text-zinc-200 hover:border-blue-500/40'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      onChange={() => toggleSubtask(task.id, subtask.id)}
                      className="mt-0.5 rounded border-zinc-700 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-xs font-medium leading-tight select-none">
                      {subtask.title}
                    </span>
                  </label>
                ))}
              </div>

              {/* Add Subtask Input */}
              <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
                <input
                  type="text"
                  placeholder="+ Add subtask checklist item..."
                  value={newSubtaskText}
                  onChange={(e) => setNewSubtaskText(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#141416] border border-[#252528] rounded-xl text-white focus:outline-none focus:border-zinc-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded-xl transition-colors"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Activity Timeline */}
            <div className="border-t border-[#222226] pt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-3">
                Audit Trail & Activity Timeline
              </h4>
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#252528]">
                {(task.activityLog || []).map((log, idx) => {
                  const logUser = users.find(u => u.id === log.userId);
                  return (
                    <div key={log.id || idx} className="relative group">
                      <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-[#111111]" />
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-xs font-medium text-zinc-200">
                            {log.action}
                          </p>
                          <p className="text-[10px] text-zinc-400 mt-0.5">
                            by {logUser ? logUser.name : 'System'} ({logUser?.role || 'Executive'})
                          </p>
                        </div>
                        <span className="text-[10px] text-zinc-400 shrink-0 font-mono">
                          {formatTimeAgo(log.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column (1 Col): Meta, Assignee, Delegate, Actions */}
          <div className="space-y-5 bg-[#141416] p-4 rounded-2xl border border-[#222226]">
            
            {/* Assignee Card */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Current Assignee
              </span>
              <div className="flex items-center gap-2.5 p-2.5 bg-[#18181a] rounded-xl border border-[#252528]">
                <Avatar user={assignee} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{assignee?.name || 'Unassigned'}</p>
                  <p className="text-[10px] text-zinc-400">{assignee?.role} • {assignee?.department}</p>
                </div>
              </div>
            </div>

            {/* Created By Card */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-zinc-400 block mb-1.5">
                Assigned By
              </span>
              <div className="flex items-center gap-2.5 p-2.5 bg-[#18181a] rounded-xl border border-[#252528]">
                <Avatar user={assignor} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{assignor?.name || 'President'}</p>
                  <p className="text-[10px] text-zinc-400">{assignor?.role}</p>
                </div>
              </div>
            </div>

            {/* Delegation Tool (GS / Lead / President) */}
            {canDelegate && (
              <div className="pt-2 border-t border-[#222226]">
                {!isDelegating ? (
                  <button
                    type="button"
                    onClick={() => setIsDelegating(true)}
                    className="w-full py-1.5 px-3 text-xs font-semibold text-zinc-200 bg-[#1e1e22] hover:bg-[#26262b] rounded-xl border border-[#2e2e34] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Delegate / Reassign Task</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#18181a] rounded-xl border border-[#2e2e34] space-y-2 text-xs">
                    <p className="font-bold text-white">Select New Assignee</p>
                    <select
                      value={selectedDelegateeId}
                      onChange={(e) => setSelectedDelegateeId(e.target.value)}
                      className="w-full p-2 bg-[#121214] border border-[#2a2a30] text-white rounded-lg text-xs font-medium"
                    >
                      <option value="">-- Choose Member --</option>
                      {users.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role} - {u.department})
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Note for delegatee..."
                      value={delegateNote}
                      onChange={(e) => setDelegateNote(e.target.value)}
                      className="w-full p-1.5 bg-[#121214] border border-[#2a2a30] text-white rounded-lg text-xs"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setIsDelegating(false)}
                        className="px-2 py-1 text-zinc-400 hover:bg-zinc-800 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleDelegateSubmit}
                        disabled={!selectedDelegateeId}
                        className="px-3 py-1 bg-[#B11226] hover:bg-[#D61F36] text-white font-bold rounded disabled:opacity-50"
                      >
                        Confirm Reassign
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Member Action: Submit for Review */}
            {isAssignedToMe && task.status !== 'COMPLETED' && (
              <div className="pt-2 border-t border-[#222226]">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenSubmitModal && onOpenSubmitModal(task);
                  }}
                  className="w-full py-2 px-3 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Deliverable for Review</span>
                </button>
              </div>
            )}

            {/* Delete button for President */}
            {isPresident && (
              <div className="pt-2 border-t border-[#222226]">
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      deleteTask(task.id);
                      onClose();
                    }
                  }}
                  className="w-full py-1.5 px-3 text-xs font-medium text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Task</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>
    </Modal>
  );
}
