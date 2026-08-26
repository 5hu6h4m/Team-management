import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useTasks } from '../../context/TaskContext';
import { useNotifications } from '../../context/NotificationContext';
import { useAuth } from '../../context/AuthContext';
import { Send, Link as LinkIcon } from 'lucide-react';

export function TaskSubmissionModal({ task, isOpen, onClose }) {
  const { submitTask } = useTasks();
  const { addNotification } = useNotifications();
  const { currentUser, users } = useAuth();

  const [deliverableUrl, setDeliverableUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');

  if (!task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitTask(task.id, {
      deliverableUrl: deliverableUrl.trim(),
      submissionNotes: submissionNotes.trim()
    });

    const president = users.find(u => u.role === 'President');
    const lead = users.find(u => u.role === 'Lead' && u.department === task.department);

    if (president) {
      addNotification({
        userId: president.id,
        type: 'submission',
        title: 'Task Submitted for Review',
        message: `${currentUser?.name} submitted "${task.title}".`,
        taskId: task.id
      });
    }

    if (lead && lead.id !== president?.id) {
      addNotification({
        userId: lead.id,
        type: 'submission',
        title: 'Deliverables Submitted',
        message: `${currentUser?.name} submitted "${task.title}" for verification.`,
        taskId: task.id
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Deliverables"
      subtitle={`Submitting "${task.title}" for lead verification`}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <p className="text-xs text-zinc-400 bg-[#181818] p-3 rounded-lg border border-[#252525]">
          Your deliverable link will be reviewed by your department lead and the President before completion.
        </p>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Deliverable Link (Figma, Drive, GitHub, Doc) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="url"
              required
              placeholder="https://figma.com/file/... or https://drive.google.com/..."
              value={deliverableUrl}
              onChange={(e) => setDeliverableUrl(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
            Submission Notes
          </label>
          <textarea
            rows={3}
            placeholder="Details about completed components, dimensions, checks performed..."
            value={submissionNotes}
            onChange={(e) => setSubmissionNotes(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252525]">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span>Submit Deliverables</span>
          </button>
        </div>

      </form>
    </Modal>
  );
}
