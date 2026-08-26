import React, { useState, useEffect } from 'react';
import { Drawer } from '../common/Drawer';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { getWorkloadStatus } from '../../utils/deadlineHelper';
import { Plus, Trash2, AlertTriangle, CheckCircle2, User, Sparkles } from 'lucide-react';

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

  const [subtasks, setSubtasks] = useState([
    { id: 'st-1', title: 'Content specifications finalized', completed: false },
    { id: 'st-2', title: 'First review draft ready', completed: false }
  ]);
  const [newSubtask, setNewSubtask] = useState('');

  const candidates = users.filter(u => {
    if (currentUser?.role === 'President' || currentUser?.role === 'GS') return true;
    if (currentUser?.role === 'Lead') return u.department === currentUser.department || u.role === 'Member';
    return true;
  });

  useEffect(() => {
    if (isOpen && !assignedToId && candidates.length > 0) {
      setAssignedToId(candidates[0].id);
    }
  }, [isOpen, candidates, assignedToId]);

  // Selected candidate live details (Signature Feature - Point 10)
  const selectedAssignee = users.find(u => u.id === assignedToId);
  const activeCount = selectedAssignee ? getUserActiveTaskCount(selectedAssignee.id) : 0;
  const workload = getWorkloadStatus(activeCount);
  const isOverloaded = activeCount >= 6;

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { id: `st-${Date.now()}`, title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

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
      subtasks,
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

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Assign New Task"
      subtitle="Define operational requirements and verify assignee bandwidth"
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
            className="w-full px-3.5 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-[#444444]"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Description & Instructions
          </label>
          <textarea
            rows={3}
            placeholder="Specify deliverables, dimensions, copy guidelines..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-[#444444]"
          />
        </div>

        {/* Department & Priority Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none font-semibold"
            >
              <option value="Urgent">🔴 URGENT</option>
              <option value="High">🟠 HIGH</option>
              <option value="Medium">⚪ MEDIUM</option>
              <option value="Low">⚫ LOW</option>
            </select>
          </div>
        </div>

        {/* Signature Assignee Picker (Point 10) */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Assignee & Bandwidth Check <span className="text-red-500">*</span>
          </label>
          
          <select
            value={assignedToId}
            onChange={(e) => setAssignedToId(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-medium focus:outline-none mb-3"
          >
            {candidates.map(c => {
              const count = getUserActiveTaskCount(c.id);
              const status = getWorkloadStatus(count);
              return (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.department} • {c.role}) — [{status.label}: {count} tasks]
                </option>
              );
            })}
          </select>

          {/* Live Assignee Insight Card */}
          {selectedAssignee && (
            <div className="p-3.5 bg-[#151515] rounded-xl border border-[#252525] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Avatar user={selectedAssignee} size="sm" />
                  <div>
                    <p className="text-xs font-bold text-white">{selectedAssignee.name}</p>
                    <p className="text-[10px] text-zinc-500">{selectedAssignee.department} • {selectedAssignee.role}</p>
                  </div>
                </div>

                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${workload.bgClass}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${workload.dotClass}`}></span>
                  {workload.label}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-[#222226]">
                <span>Active Tasks: <strong className="text-white">{activeCount}</strong></span>
                <span>Completion Rate: <strong className="text-emerald-400">{selectedAssignee.completionRate || 95}%</strong></span>
              </div>

              {isOverloaded && (
                <div className="p-2 bg-red-950/40 border border-red-800/60 rounded-lg text-[11px] text-red-400 flex items-center gap-2 font-medium">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>⚠️ Consider another member (7+ active tasks already assigned)</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Deadline */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Deadline Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3.5 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white focus:outline-none"
          />
        </div>

        {/* Subtasks checklist builder */}
        <div className="pt-2 border-t border-[#252525]">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
            Subtask Milestones
          </label>
          <div className="space-y-1.5 mb-2">
            {subtasks.map((st, idx) => (
              <div key={st.id} className="flex items-center justify-between p-2 rounded-lg bg-[#181818] border border-[#252525] text-xs text-zinc-300">
                <span className="truncate">{idx + 1}. {st.title}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  className="text-zinc-500 hover:text-red-400 p-0.5"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="+ Add milestone checklist item..."
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(e)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-600 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-1.5 text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
            >
              Add
            </button>
          </div>
        </div>

        {/* CTA Footer */}
        <div className="pt-4 border-t border-[#252525] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-[#B11226] hover:bg-[#D61F36] rounded-lg shadow-sm transition-all"
          >
            Create Task
          </button>
        </div>

      </form>
    </Drawer>
  );
}
