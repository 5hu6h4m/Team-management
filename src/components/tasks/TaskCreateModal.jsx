import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { Avatar } from '../common/Avatar';
import { getWorkloadStatus } from '../../utils/deadlineHelper';
import { Plus, Trash2, Paperclip, AlertCircle, Sparkles, User, Calendar, Flag, Layers } from 'lucide-react';

export function TaskCreateModal({ isOpen, onClose }) {
  const { currentUser, users } = useAuth();
  const { createTask, departments, getUserActiveTaskCount } = useTasks();
  const { addNotification } = useNotifications();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState(
    currentUser?.role === 'Lead' ? currentUser.department : 'Design'
  );
  const [assignedToId, setAssignedToId] = useState('');
  const [priority, setPriority] = useState('High');
  
  // Default deadline: 3 days from today in YYYY-MM-DD format
  const defaultDeadline = new Date();
  defaultDeadline.setDate(defaultDeadline.getDate() + 3);
  const [deadline, setDeadline] = useState(defaultDeadline.toISOString().split('T')[0]);

  // Subtasks list
  const [subtasks, setSubtasks] = useState([
    { id: 'st-temp-1', title: 'Content & specifications finalized', completed: false },
    { id: 'st-temp-2', title: 'First draft deliverable', completed: false }
  ]);
  const [newSubtaskInput, setNewSubtaskInput] = useState('');

  // Attachments
  const [attachmentName, setAttachmentName] = useState('');
  const [attachments, setAttachments] = useState([]);

  // Filter candidates based on department (or all for President/GS)
  const isPresidentOrGS = currentUser?.role === 'President' || currentUser?.role === 'GS';
  const candidates = users.filter(u => {
    if (isPresidentOrGS) return true;
    if (currentUser?.role === 'Lead') {
      return u.department === currentUser.department || u.role === 'Member';
    }
    return true;
  });

  // Set default assignee if none chosen
  React.useEffect(() => {
    if (isOpen && !assignedToId && candidates.length > 0) {
      setAssignedToId(candidates[0].id);
    }
  }, [isOpen, candidates, assignedToId]);

  const handleAddSubtask = (e) => {
    e.preventDefault();
    if (!newSubtaskInput.trim()) return;
    setSubtasks(prev => [
      ...prev,
      { id: `st-temp-${Date.now()}`, title: newSubtaskInput.trim(), completed: false }
    ]);
    setNewSubtaskInput('');
  };

  const handleRemoveSubtask = (id) => {
    setSubtasks(prev => prev.filter(st => st.id !== id));
  };

  const handleAddAttachment = () => {
    if (!attachmentName.trim()) return;
    setAttachments(prev => [
      ...prev,
      { name: attachmentName.trim(), size: '1.2 MB', url: '#' }
    ]);
    setAttachmentName('');
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
      attachments
    });

    // Send notification to assignee
    addNotification({
      userId: assignedToId,
      type: 'assigned',
      title: 'New Task Assigned',
      message: `${currentUser?.name} assigned you "${title.trim()}". Deadline: ${deadline}`,
      taskId: newTask.id
    });

    // Reset & Close
    setTitle('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create & Assign New Task"
      subtitle="Define deliverables, assign responsibility, set deadline, and inspect member workload"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Task Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Task Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Eureka 2026 Instagram Creatives & Posters"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Description & Objective
          </label>
          <textarea
            rows={3}
            placeholder="Outline the exact expectations, dimensions, copy guidelines, or submission links needed..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800 leading-relaxed"
          />
        </div>

        {/* Grid: Department, Assign To (with Workload indicator), Priority, Deadline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Department */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Department
            </label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800"
            >
              {departments.map((dept) => (
                <option key={dept.id} value={dept.name}>
                  {dept.name}
                </option>
              ))}
              <option value="Executive">Executive</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Priority Level
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800"
            >
              <option value="Urgent">🔴 Urgent (Immediate Action)</option>
              <option value="High">🟠 High</option>
              <option value="Medium">🔵 Medium</option>
              <option value="Low">⚪ Low</option>
            </select>
          </div>

          {/* Assign To (With Workload Indicator) */}
          <div className="sm:col-span-2 bg-indigo-50/40 p-3.5 rounded-2xl border border-indigo-100">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900">
                Assignee & Workload Balancer <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-indigo-600 font-semibold">
                Live workload indicators shown below
              </span>
            </div>
            
            <select
              value={assignedToId}
              onChange={(e) => setAssignedToId(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-white border border-indigo-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-semibold text-slate-900"
            >
              {candidates.map((cand) => {
                const activeCount = getUserActiveTaskCount(cand.id);
                const workload = getWorkloadStatus(activeCount);
                return (
                  <option key={cand.id} value={cand.id}>
                    {cand.name} ({cand.role} - {cand.department}) — [{workload.label}: {activeCount} active tasks]
                  </option>
                );
              })}
            </select>

            <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-600 flex-wrap">
              <span className="font-semibold text-slate-500">Legend:</span>
              <span className="inline-flex items-center gap-1 text-emerald-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Available (0 tasks)
              </span>
              <span className="inline-flex items-center gap-1 text-amber-700">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Normal (1-3)
              </span>
              <span className="inline-flex items-center gap-1 text-orange-700">
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Busy (4-5)
              </span>
              <span className="inline-flex items-center gap-1 text-rose-700">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Overloaded (6+)
              </span>
            </div>
          </div>

          {/* Deadline */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Deadline Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800"
            />
          </div>

        </div>

        {/* Subtasks Builder */}
        <div className="border-t border-slate-100 pt-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Breakdown Subtasks & Milestones
          </label>
          <div className="space-y-2 mb-2">
            {subtasks.map((st, idx) => (
              <div key={st.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-800">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{st.title}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveSubtask(st.id)}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Add next checklist item (e.g. Dimensions decided, Review step)..."
              value={newSubtaskInput}
              onChange={(e) => setNewSubtaskInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(e)}
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
            >
              + Add
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-500/25 transition-all transform active:scale-95 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Create & Assign Task</span>
          </button>
        </div>

      </form>
    </Modal>
  );
}
