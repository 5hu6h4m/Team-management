import React, { useState, useEffect } from 'react';
import { Drawer } from '../common/Drawer';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { getWorkloadStatus } from '../../utils/deadlineHelper';

export function TaskCreateDrawer({ isOpen, onClose }) {
  const { currentUser, users } = useAuth();
  const { createTask, departments, getUserActiveTaskCount } = useTasks();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('Design');
  const [assignedToId, setAssignedToId] = useState('');
  const [priority, setPriority] = useState('High');

  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 3);
  const [deadline, setDeadline] = useState(defaultDeadline.toISOString().split('T')[0]);

  // Candidates list — President sees all except self, GS sees all except President & self, Lead sees own dept
  const candidates = users.filter(u => {
    if (currentUser?.role === 'President') return u.role !== 'President';
    if (currentUser?.role === 'GS') return u.id !== currentUser.id && u.role !== 'President';
    if (currentUser?.role === 'Lead') return u.department === currentUser.department;
    return true;
  });

  // Auto-select first candidate on open
  useEffect(() => {
    if (isOpen) {
      if (currentUser?.role === 'President') {
        const gsUser = users.find(u => u.role === 'GS' || u.role === 'General Secretary');
        setAssignedToId(gsUser ? gsUser.id : candidates[0]?.id || '');
      } else if (!assignedToId && candidates.length > 0) {
        setAssignedToId(candidates[0].id);
      }
    }
  }, [isOpen, currentUser, users]);

  // Selected candidate live details
  const selectedAssignee = users.find(u => u.id === assignedToId);
  const activeCount = selectedAssignee ? getUserActiveTaskCount(selectedAssignee.id) : 0;
  const workload = getWorkloadStatus(activeCount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !assignedToId) return;

    const newTask = createTask({
      title: title.trim(),
      description: description.trim(),
      department,
      assignedToId,
      priority,
      deadline: `${deadline}T18:00:00`,
      subtasks: [],
      attachments: []
    });

    addNotification({
      userId: assignedToId,
      type: 'assigned',
      title: 'New Task Assigned',
      message: `${currentUser?.name} assigned you "${title.trim()}". Deadline: ${deadline}`,
      taskId: newTask.id
    });

    setTitle('');
    setDescription('');
    onClose();
  };

  // Priority color helper
  const priorityColor = {
    Low: 'text-green-400',
    Medium: 'text-yellow-400',
    High: 'text-orange-400',
    Urgent: 'text-red-400',
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Task"
      subtitle="Fill in the details to assign a task to a team member"
      width="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* Task Title */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Eureka Social Media Campaign"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-[#181818] border border-[#252525] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          />
        </div>

        {/* Department & Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-zinc-200 focus:outline-none focus:border-[#3a3a3a] transition-colors"
            >
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name} Team</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-zinc-200 focus:outline-none focus:border-[#3a3a3a] transition-colors"
            >
              <option value="Low">🟢 Low</option>
              <option value="Medium">🟡 Medium</option>
              <option value="High">🟠 High</option>
              <option value="Urgent">🔴 Urgent</option>
            </select>
          </div>
        </div>

        {/* Assignee Selection */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Assign To <span className="text-red-500">*</span>
          </label>
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="w-full px-3 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-zinc-200 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          >
            {candidates.map(u => (
              <option key={u.id} value={u.id}>
                {u.name} — {u.role}
              </option>
            ))}
          </select>
        </div>

        {/* Live Assignee Workload Card */}
        {selectedAssignee && (
          <div className="p-3 bg-[#141414] border border-[#262626] rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar user={selectedAssignee} size="sm" />
              <div>
                <p className="text-xs font-bold text-white">{selectedAssignee.name}</p>
                <p className="text-[10px] text-zinc-500">{selectedAssignee.role} • {selectedAssignee.department}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[11px] font-semibold block ${
                workload.level === 'OVERLOADED' ? 'text-red-400' : 'text-zinc-400'
              }`}>
                {activeCount} Active Tasks
              </span>
              <span className={`text-[10px] font-mono ${
                workload.level === 'OVERLOADED' ? 'text-red-500' : 'text-zinc-500'
              }`}>
                {workload.label}
              </span>
            </div>
          </div>
        )}

        {/* Deadline */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Deadline
          </label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-zinc-200 focus:outline-none focus:border-[#3a3a3a] transition-colors"
          />
        </div>

        {/* Description / Instructions */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Instructions / Scope of Work
          </label>
          <textarea
            rows={4}
            placeholder="Key deliverables, design guidelines, or requirements..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-[#3a3a3a] transition-colors resize-none"
          />
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#222226]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            Assign Task
          </button>
        </div>

      </form>
    </Drawer>
  );
}
