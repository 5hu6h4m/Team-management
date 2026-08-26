import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatCards } from '../components/analytics/StatCards';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { TaskList } from '../components/tasks/TaskList';
import { TaskCard } from '../components/tasks/TaskCard';
import { Avatar } from '../components/common/Avatar';
import { getWorkloadStatus, getDeadlineStatus, formatTimeAgo } from '../utils/deadlineHelper';
import { Plus } from 'lucide-react';

export function DashboardPage({ 
  onOpenCreateTask, 
  onOpenTaskDetail, 
  onSubmitClick, 
  onVerifyClick,
  onSelectUser,
  onNavigate
}) {
  const { currentUser, users } = useAuth();
  const { tasks, getUserActiveTaskCount } = useTasks();

  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS';
  const isLead = currentUser?.role === 'Lead';
  const isMember = currentUser?.role === 'Member';

  // Overdue count
  const overdueCount = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const d = getDeadlineStatus(t.deadline, t.status);
    return d.status === 'overdue';
  }).length;

  // Verification queue count
  const reviewQueue = tasks.filter(t => {
    if (isLead) return t.department === currentUser?.department && t.status === 'SUBMITTED';
    return t.status === 'SUBMITTED';
  });

  // Overloaded members count
  const overloadedCount = users.filter(u => getUserActiveTaskCount(u.id) >= 6).length;

  // Workload categories
  const availableCount = users.filter(u => getUserActiveTaskCount(u.id) === 0).length;
  const normalCount = users.filter(u => {
    const c = getUserActiveTaskCount(u.id);
    return c >= 1 && c <= 3;
  }).length;
  const busyCount = users.filter(u => {
    const c = getUserActiveTaskCount(u.id);
    return c >= 4 && c <= 5;
  }).length;

  // Role tasks
  let activeRoleTasks = tasks.filter(t => t.status !== 'COMPLETED');
  if (isMember) {
    activeRoleTasks = tasks.filter(t => t.assignedToId === currentUser?.id);
  } else if (isLead) {
    activeRoleTasks = tasks.filter(t => t.department === currentUser?.department && t.status !== 'COMPLETED');
  }

  // Recent activity aggregated from all tasks
  const recentActivities = tasks
    .flatMap(t => (t.activityLog || []).map(a => ({ ...a, taskTitle: t.title, taskId: t.id })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  // -------------------------------------------------------------
  // MEMBER DASHBOARD
  // -------------------------------------------------------------
  if (isMember) {
    const memberTasks = tasks.filter(t => t.assignedToId === currentUser?.id);
    const memberActive = memberTasks.filter(t => t.status !== 'COMPLETED');
    const memberCompleted = memberTasks.filter(t => t.status === 'COMPLETED');

    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">MY WORK</p>
            <h1 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Good afternoon, {currentUser?.name}.
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span><strong>{memberActive.length}</strong> ACTIVE</span>
            <span><strong>{memberCompleted.length}</strong> DONE</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Assigned Deliverables
          </h3>

          {memberTasks.length === 0 ? (
            <div className="p-8 text-center bg-[#141414] rounded-xl border border-[#222226] text-zinc-500 text-xs">
              No tasks currently assigned.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {memberTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpenDetail={onOpenTaskDetail}
                  onSubmitClick={onSubmitClick}
                  onVerifyClick={onVerifyClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LEAD DASHBOARD
  // -------------------------------------------------------------
  if (isLead) {
    const deptMembers = users.filter(u => u.department === currentUser?.department);
    const deptTasks = tasks.filter(t => t.department === currentUser?.department);
    const deptActive = deptTasks.filter(t => t.status !== 'COMPLETED');

    return (
      <div className="space-y-5 pb-8">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-500">{currentUser?.department} TEAM</span>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Good afternoon, {currentUser?.name}.
            </h1>
          </div>

          <button
            onClick={onOpenCreateTask}
            className="px-3 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        </div>

        {/* Pending Reviews Queue */}
        {reviewQueue.length > 0 && (
          <div className="bg-[#181112] border border-red-900/60 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-red-400 uppercase tracking-wider">
                Verification Queue ({reviewQueue.length})
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Action Needed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {reviewQueue.map(task => {
                const assignee = users.find(u => u.id === task.assignedToId);
                return (
                  <div
                    key={task.id}
                    onClick={() => onOpenTaskDetail(task.id)}
                    className="p-2.5 bg-[#141414] rounded-lg border border-[#252525] hover:border-red-800/60 cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{task.title}</p>
                      <p className="text-[10px] text-zinc-400">by {assignee?.name}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onVerifyClick(task); }}
                      className="px-2 py-0.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-[10px] font-bold rounded"
                    >
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Active Tasks ({deptActive.length})
            </h3>
            <TaskList
              tasks={deptActive}
              onOpenDetail={onOpenTaskDetail}
              onSubmitClick={onSubmitClick}
              onVerifyClick={onVerifyClick}
            />
          </div>

          <div className="lg:col-span-4 space-y-3">
            <div className="bg-[#141414] p-4 rounded-xl border border-[#222226]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                Team Workload
              </h4>
              <div className="space-y-2">
                {deptMembers.map(m => {
                  const count = getUserActiveTaskCount(m.id);
                  const status = getWorkloadStatus(count);
                  return (
                    <div key={m.id} className="flex items-center justify-between text-xs py-1 border-b border-[#1f1f23] last:border-0">
                      <span className="text-zinc-200 font-medium">{m.name}</span>
                      <span className={`text-[10px] font-semibold ${
                        status.level === 'OVERLOADED' ? 'text-red-400' :
                        status.level === 'BUSY' ? 'text-orange-400' : 'text-zinc-400'
                      }`}>
                        {status.label} ({count})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // GS DASHBOARD
  // -------------------------------------------------------------
  if (isGS) {
    const initiatives = [
      { name: 'Eureka 2026 Campaign', percent: 82 },
      { name: 'NEC Annual Audit Track', percent: 61 },
      { name: 'Website Announcement Portal', percent: 100 },
      { name: 'Corporate Sponsorship Outreach', percent: 43 }
    ];

    return (
      <div className="space-y-5 pb-8">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">GENERAL SECRETARY</p>
            <h1 className="text-lg font-bold text-white tracking-tight">Good afternoon, {currentUser?.name}.</h1>
          </div>
          <button
            onClick={onOpenCreateTask}
            className="px-3 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg"
          >
            + Delegate Task
          </button>
        </div>

        <div className="bg-[#141414] p-4.5 rounded-xl border border-[#222226] space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">President Initiatives</h3>
          <div className="space-y-3">
            {initiatives.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-200">{item.name}</span>
                  <span className="font-mono text-zinc-400 font-semibold">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#202024] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#D61F36] h-full rounded-full" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <DepartmentChart />
      </div>
    );
  }

  // -------------------------------------------------------------
  // PRESIDENT DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="space-y-5 pb-8">
      
      {/* Top Heading */}
      <div className="flex items-center justify-between border-b border-[#222226] pb-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Good afternoon, {currentUser?.name}.
          </h1>
          <p className="text-xs text-zinc-400">E-Cell central command overview</p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Assign Task</span>
        </button>
      </div>

      {/* Large Numbers Stats Row */}
      <StatCards onFilterClick={(id) => {
        if (id === 'members') onNavigate('team');
        if (id === 'overdue' || id === 'active') onNavigate('tasks');
      }} />

      {/* Compact Needs Your Attention */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-medium">
        <div 
          onClick={() => onNavigate('tasks')}
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 ${
            overdueCount > 0 ? 'bg-red-950/30 border-red-800/50 text-red-300' : 'bg-[#141414] border-[#222226] text-zinc-400'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
          <span>{overdueCount} Overdue {overdueCount === 1 ? 'Task' : 'Tasks'}</span>
        </div>

        <div 
          onClick={() => onNavigate('tasks')}
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 ${
            reviewQueue.length > 0 ? 'bg-amber-950/30 border-amber-800/50 text-amber-300' : 'bg-[#141414] border-[#222226] text-zinc-400'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
          <span>{reviewQueue.length} Awaiting Verification</span>
        </div>

        <div 
          onClick={() => onNavigate('team')}
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer flex items-center gap-2 ${
            overloadedCount > 0 ? 'bg-red-950/30 border-red-800/50 text-red-300' : 'bg-[#141414] border-[#222226] text-zinc-400'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
          <span>{overloadedCount} Overloaded {overloadedCount === 1 ? 'Member' : 'Members'}</span>
        </div>
      </div>

      {/* 2-Column Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left Column (65%): Active Tasks & Activity Feed */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Active Tasks ({activeRoleTasks.length})
              </h3>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                All Tasks →
              </button>
            </div>

            <TaskList
              tasks={activeRoleTasks.slice(0, 4)}
              onOpenDetail={onOpenTaskDetail}
              onSubmitClick={onSubmitClick}
              onVerifyClick={onVerifyClick}
            />
          </div>

          {/* Clean Activity Feed */}
          <div className="bg-[#141414] p-4 rounded-xl border border-[#222226] space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Recent Activity
            </h4>

            <div className="space-y-2 text-xs">
              {recentActivities.map((act, i) => (
                <div key={act.id || i} className="flex items-center justify-between gap-2 border-b border-[#1f1f23] pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                    <span className="text-zinc-200 font-medium truncate">{act.action}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                    {formatTimeAgo(act.timestamp)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (35%): Department Workload % & Team Availability */}
        <div className="lg:col-span-4 space-y-4">
          
          <DepartmentChart />

          {/* Clean Team Availability */}
          <div className="bg-[#141414] p-4 rounded-xl border border-[#222226] space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Team Availability
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-lg bg-[#181818] border border-[#222226] text-center">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Available</span>
                <span className="font-mono font-bold text-white text-base">{availableCount}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#181818] border border-[#222226] text-center">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Normal</span>
                <span className="font-mono font-bold text-white text-base">{normalCount}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#181818] border border-[#222226] text-center">
                <span className="text-[10px] text-zinc-500 block uppercase font-bold">Busy</span>
                <span className="font-mono font-bold text-white text-base">{busyCount}</span>
              </div>
              <div className="p-2 rounded-lg bg-[#181818] border border-[#222226] text-center">
                <span className="text-[10px] text-red-400 block uppercase font-bold">Overload</span>
                <span className="font-mono font-bold text-red-400 text-base">{overloadedCount}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
