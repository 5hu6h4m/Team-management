import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';
import { PriorityBadge } from '../common/PriorityBadge';
import { formatTimeAgo, getDeadlineStatus } from '../../utils/deadlineHelper';
import { Activity, Clock, CheckSquare, ArrowRight, Play, Sparkles } from 'lucide-react';

export function LiveActiveTasksTracker({ tasks, onOpenTaskDetail }) {
  const { users } = useAuth();

  // Filter tasks that are currently IN_PROGRESS
  const inProgressTasks = (tasks || []).filter(t => t.status === 'IN_PROGRESS');

  return (
    <div className="p-4 sm:p-5 bg-gradient-to-br from-[#161618] to-[#121214] rounded-2xl border border-blue-950/40 shadow-lg relative overflow-hidden">
      {/* Decorative ambient background accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-[#222226] pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute opacity-75" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 relative" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <span>Live Active Work Tracker</span>
              <span className="text-[10px] font-semibold text-blue-400 normal-case bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                Kaam Chal Raha Hai
              </span>
            </h2>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Real-time monitoring of tasks currently being actively worked on by team members
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-[#1e2330] text-blue-300 border border-blue-800/40">
            {inProgressTasks.length} {inProgressTasks.length === 1 ? 'Task In-Progress' : 'Tasks In-Progress'}
          </span>
        </div>
      </div>

      {/* Task Cards Grid */}
      {inProgressTasks.length === 0 ? (
        <div className="p-6 text-center bg-[#101012] rounded-xl border border-dashed border-[#222226] space-y-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-500">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold text-zinc-300">
            No tasks are currently active right now
          </p>
          <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
            When Mohit or any team member clicks &ldquo;Start Task&rdquo;, their real-time progress, time elapsed, and deliverable state will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {inProgressTasks.map(task => {
            // Find assignee user or startedBy user
            const assignee = users.find(u => u.id === task.assignedToId) || { name: `${task.department} Team`, role: 'Member', department: task.department };
            const startedByUser = users.find(u => u.id === task.startedById);
            const workerName = task.startedByName || (startedByUser ? startedByUser.name : assignee.name);
            const workerUser = startedByUser || (assignee.id ? assignee : null);

            const deadlineInfo = getDeadlineStatus(task.deadline, task.status);
            const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
            const totalSubtasks = (task.subtasks || []).length;
            const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 50;

            // Compute started text
            const startedText = task.startedAt 
              ? `Started ${formatTimeAgo(task.startedAt)}` 
              : 'Started recently';

            return (
              <div
                key={task.id}
                onClick={() => onOpenTaskDetail(task.id)}
                className="p-4 bg-[#14161d] hover:bg-[#181b24] rounded-xl border border-blue-900/30 hover:border-blue-700/60 cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 group shadow-sm hover:shadow-md"
              >
                {/* Card Top: Department + Priority + Live Badge */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider rounded bg-blue-500/10 text-blue-300 border border-blue-500/20">
                      {task.department} Team
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-bold text-emerald-400 font-mono">
                        {startedText}
                      </span>
                    </div>
                  </div>

                  {/* Task Title */}
                  <h4 className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                    {task.title}
                  </h4>
                </div>

                {/* Card Middle: Active Worker Info */}
                <div className="p-2.5 bg-[#0f1117] rounded-lg border border-[#1e2230] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Avatar user={workerUser} size="xs" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-100 truncate">
                        {workerName}
                      </p>
                      <p className="text-[10px] text-zinc-400 truncate">
                        Active on this task
                      </p>
                    </div>
                  </div>

                  <PriorityBadge priority={task.priority} size="xs" />
                </div>

                {/* Card Bottom: Progress & Deadline */}
                <div className="pt-2 border-t border-[#1e2230] space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-zinc-400 flex items-center gap-1">
                      <CheckSquare className="w-3 h-3 text-blue-400" />
                      {totalSubtasks > 0 ? `${completedSubtasks}/${totalSubtasks} Subtasks` : 'In Progress'}
                    </span>
                    <span className="text-blue-400 font-semibold">{progress}%</span>
                  </div>

                  <div className="w-full bg-[#1e2230] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] pt-1">
                    <span className="text-zinc-500 font-mono">
                      {deadlineInfo.label}
                    </span>
                    <span className="text-blue-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
