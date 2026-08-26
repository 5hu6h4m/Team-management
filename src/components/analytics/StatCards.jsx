import React from 'react';
import { useTasks } from '../../context/TaskContext';
import { useAuth } from '../../context/AuthContext';
import { getDeadlineStatus } from '../../utils/deadlineHelper';

export function StatCards({ onFilterClick }) {
  const { tasks } = useTasks();
  const { users } = useAuth();

  const totalMembers = users.length;
  const activeTasks = tasks.filter(t => t.status !== 'COMPLETED').length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const d = getDeadlineStatus(t.deadline, t.status);
    return d.status === 'overdue';
  }).length;

  const padZero = (n) => (n < 10 ? `0${n}` : `${n}`);

  const cards = [
    {
      id: 'members',
      label: 'MEMBERS',
      count: padZero(totalMembers),
      isOverdue: false,
    },
    {
      id: 'active',
      label: 'ACTIVE',
      count: padZero(activeTasks),
      isOverdue: false,
    },
    {
      id: 'completed',
      label: 'COMPLETED',
      count: padZero(completedTasks),
      isOverdue: false,
    },
    {
      id: 'overdue',
      label: 'OVERDUE',
      count: padZero(overdueTasks),
      isOverdue: true,
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((c) => (
        <div
          key={c.id}
          onClick={() => onFilterClick && onFilterClick(c.id)}
          className={`p-4 sm:p-5 rounded-xl border transition-all cursor-pointer select-none ${
            c.isOverdue && parseInt(c.count) > 0
              ? 'bg-[#181112] border-red-900/60 hover:border-red-700/80'
              : 'bg-[#151515] border-[#252525] hover:border-[#353535]'
          }`}
        >
          <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
            {c.count}
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${
              c.isOverdue && parseInt(c.count) > 0 ? 'text-red-400' : 'text-zinc-500'
            }`}>
              {c.label}
            </span>
            {c.isOverdue && parseInt(c.count) > 0 && (
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
