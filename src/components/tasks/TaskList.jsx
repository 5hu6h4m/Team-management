import React from 'react';
import { TaskCard } from './TaskCard';
import { StatusBadge } from '../common/StatusBadge';
import { PriorityBadge } from '../common/PriorityBadge';
import { Avatar } from '../common/Avatar';
import { useAuth } from '../../context/AuthContext';
import { formatDeadline, getDeadlineStatus } from '../../utils/deadlineHelper';
import { Clock } from 'lucide-react';

export function TaskList({ tasks, onOpenDetail, onSubmitClick, onVerifyClick, viewMode = 'grid' }) {
  const { users } = useAuth();

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-[#111111] rounded-xl border border-dashed border-[#252525]">
        <Clock className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-zinc-300">No tasks found</h4>
        <p className="text-[11px] text-zinc-500 mt-0.5">
          No tasks match the active filters or assignments.
        </p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onOpenDetail={onOpenDetail}
            onSubmitClick={onSubmitClick}
            onVerifyClick={onVerifyClick}
          />
        ))}
      </div>
    );
  }

  // Table view
  return (
    <div className="bg-[#151515] rounded-xl border border-[#252525] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#111111] text-zinc-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#252525]">
            <tr>
              <th className="py-3 px-4">Task Name</th>
              <th className="py-3 px-4">Department</th>
              <th className="py-3 px-4">Assignee</th>
              <th className="py-3 px-4">Priority</th>
              <th className="py-3 px-4">Deadline</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222226]">
            {tasks.map(task => {
              const assignee = users.find(u => u.id === task.assignedToId);
              const deadlineInfo = getDeadlineStatus(task.deadline, task.status);
              return (
                <tr
                  key={task.id}
                  onClick={() => onOpenDetail(task.id)}
                  className="hover:bg-[#181818] cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4 font-semibold text-zinc-100 max-w-xs truncate">
                    {task.title}
                  </td>
                  <td className="py-3 px-4 text-zinc-400">
                    {task.department}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <Avatar user={assignee} size="xs" />
                      <span className="text-zinc-200">{assignee?.name || 'Unassigned'}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <PriorityBadge priority={task.priority} size="xs" />
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-[11px] font-medium ${deadlineInfo.status === 'overdue' ? 'text-red-400' : 'text-zinc-400'}`}>
                      {formatDeadline(task.deadline)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={task.status} size="xs" />
                  </td>
                  <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => onOpenDetail(task.id)}
                      className="text-xs font-semibold text-red-400 hover:text-red-300"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
