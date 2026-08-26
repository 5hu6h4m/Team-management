import React from 'react';
import { useTasks } from '../../context/TaskContext';

export function DepartmentChart() {
  const { departments, tasks } = useTasks();

  const deptStats = departments.map(dept => {
    const deptTasks = tasks.filter(t => t.department === dept.name);
    const completed = deptTasks.filter(t => t.status === 'COMPLETED').length;
    const total = deptTasks.length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 100;

    return {
      name: dept.name,
      total,
      completed,
      rate
    };
  }).filter(d => d.total > 0);

  return (
    <div className="bg-[#151515] p-5 rounded-xl border border-[#252525]">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Department Performance</h4>
        <span className="text-[10px] font-mono text-zinc-500">COMPLETION</span>
      </div>

      <div className="space-y-3.5">
        {deptStats.map(dept => (
          <div key={dept.name}>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-zinc-200">{dept.name}</span>
              <span className="font-mono text-zinc-400 font-semibold">
                {dept.rate}%
              </span>
            </div>
            <div className="w-full bg-[#252525] h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#D61F36] h-full rounded-full transition-all duration-500"
                style={{ width: `${dept.rate}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
