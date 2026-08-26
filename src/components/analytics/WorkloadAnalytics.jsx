import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Avatar } from '../common/Avatar';

export function WorkloadAnalytics() {
  const { users } = useAuth();
  const { getUserActiveTaskCount } = useTasks();

  const membersWithCounts = users.map(u => ({
    ...u,
    activeCount: getUserActiveTaskCount(u.id)
  })).sort((a, b) => b.activeCount - a.activeCount);

  return (
    <div className="bg-[#151515] p-5 rounded-xl border border-[#252525]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Member Workload</h4>
        <span className="text-[10px] font-mono text-zinc-500">ACTIVE TASKS</span>
      </div>

      <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
        {membersWithCounts.map(u => {
          const maxTasks = 6;
          const barPercent = Math.min(100, (u.activeCount / maxTasks) * 100);
          const isOverloaded = u.activeCount >= 6;
          return (
            <div key={u.id} className="flex items-center gap-3 text-xs">
              <Avatar user={u} size="xs" />
              <div className="w-24 truncate font-medium text-zinc-200">
                {u.name}
              </div>
              <div className="flex-1 bg-[#252525] h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOverloaded ? 'bg-[#D61F36]' :
                    u.activeCount >= 4 ? 'bg-orange-500' :
                    u.activeCount > 0 ? 'bg-zinc-400' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.max(6, barPercent)}%` }}
                />
              </div>
              <div className="w-12 text-right font-mono text-zinc-400 text-[11px]">
                {u.activeCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
