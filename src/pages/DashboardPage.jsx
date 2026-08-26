import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatCards } from '../components/analytics/StatCards';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { WorkloadAnalytics } from '../components/analytics/WorkloadAnalytics';
import { TaskList } from '../components/tasks/TaskList';
import { TaskCard } from '../components/tasks/TaskCard';
import { Avatar } from '../components/common/Avatar';
import { getWorkloadStatus, getDeadlineStatus, formatTimeAgo } from '../utils/deadlineHelper';
import { 
  AlertTriangle, 
  Sparkles, 
  Send, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Plus
} from 'lucide-react';

export function DashboardPage({ 
  onOpenCreateTask, 
  onOpenTaskDetail, 
  onSubmitClick, 
  onVerifyClick,
  onSelectUser,
  onNavigate
}) {
  const { currentUser, users } = useAuth();
  const { tasks, getUserActiveTaskCount, departments } = useTasks();

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
    .slice(0, 6);

  // -------------------------------------------------------------
  // 1. MEMBER DASHBOARD (Points 12, 13)
  // -------------------------------------------------------------
  if (isMember) {
    const memberTasks = tasks.filter(t => t.assignedToId === currentUser?.id);
    const memberActive = memberTasks.filter(t => t.status !== 'COMPLETED');
    const memberCompleted = memberTasks.filter(t => t.status === 'COMPLETED');

    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="border-b border-[#252525] pb-4">
          <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
            MY WORK
          </p>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Good afternoon, {currentUser?.name}.
          </h1>
          <div className="flex items-center gap-4 mt-2 text-xs text-zinc-400">
            <span><strong>{memberActive.length}</strong> Active Tasks</span>
            <span className="text-zinc-600">•</span>
            <span><strong>{memberCompleted.length}</strong> Completed</span>
          </div>
        </div>

        {/* Member Tasks */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Assigned Deliverables
          </h3>

          {memberTasks.length === 0 ? (
            <div className="p-8 text-center bg-[#151515] rounded-xl border border-[#252525] text-zinc-400 text-xs">
              No tasks currently assigned to you. Enjoy your downtime!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  // 2. LEAD DASHBOARD (Point 15)
  // -------------------------------------------------------------
  if (isLead) {
    const deptMembers = users.filter(u => u.department === currentUser?.department);
    const deptTasks = tasks.filter(t => t.department === currentUser?.department);
    const deptActive = deptTasks.filter(t => t.status !== 'COMPLETED');

    return (
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#252525] pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-red-500 mb-1">
              {currentUser?.department?.toUpperCase()} TEAM
            </p>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Good afternoon, {currentUser?.name}.
            </h1>
            <div className="flex items-center gap-4 mt-1.5 text-xs text-zinc-400">
              <span><strong>{deptMembers.length}</strong> Members</span>
              <span className="text-zinc-600">•</span>
              <span><strong>{deptActive.length}</strong> Active Tasks</span>
              <span className="text-zinc-600">•</span>
              <span className="text-red-400 font-bold"><strong>{reviewQueue.length}</strong> Pending Reviews</span>
            </div>
          </div>

          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        </div>

        {/* Pending Reviews Queue (Point 15) */}
        {reviewQueue.length > 0 && (
          <div className="bg-[#181112] border border-red-900/60 rounded-xl p-4.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                Pending Verification Queue ({reviewQueue.length})
              </span>
              <span className="text-[10px] text-zinc-400 font-mono">Action Required</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {reviewQueue.map(task => {
                const assignee = users.find(u => u.id === task.assignedToId);
                return (
                  <div
                    key={task.id}
                    onClick={() => onOpenTaskDetail(task.id)}
                    className="p-3 bg-[#151515] rounded-lg border border-[#252525] hover:border-red-800/60 cursor-pointer flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{task.title}</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">by {assignee?.name}</p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onVerifyClick(task); }}
                      className="px-2.5 py-1 bg-[#B11226] hover:bg-[#D61F36] text-white text-[11px] font-bold rounded"
                    >
                      Review
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2-Column: Department Active Tasks & Team Workload */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Department Active Tasks
            </h3>
            <TaskList
              tasks={deptActive}
              onOpenDetail={onOpenTaskDetail}
              onSubmitClick={onSubmitClick}
              onVerifyClick={onVerifyClick}
            />
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#151515] p-4.5 rounded-xl border border-[#252525]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 mb-3">
                Team Workload
              </h4>
              <div className="space-y-2.5">
                {deptMembers.map(m => {
                  const count = getUserActiveTaskCount(m.id);
                  const status = getWorkloadStatus(count);
                  return (
                    <div key={m.id} className="flex items-center justify-between text-xs py-1 border-b border-[#222226] last:border-0">
                      <div className="flex items-center gap-2">
                        <Avatar user={m} size="xs" />
                        <span className="text-zinc-200 font-medium">{m.name}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                        status.level === 'OVERLOADED' ? 'text-red-400' :
                        status.level === 'BUSY' ? 'text-orange-400' :
                        status.level === 'NORMAL' ? 'text-zinc-300' : 'text-emerald-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${status.dotClass}`}></span>
                        {status.label}
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
  // 3. GS DASHBOARD (Point 14)
  // -------------------------------------------------------------
  if (isGS) {
    const initiatives = [
      { name: 'Eureka 2026 B-Plan Campaign', percent: 82 },
      { name: 'NEC Annual Audit & Progress Track', percent: 61 },
      { name: 'Website Announcement & Registration Portal', percent: 100 },
      { name: 'E-Summit Corporate Sponsorship Outreach', percent: 43 }
    ];

    return (
      <div className="space-y-6 pb-12">
        <div className="flex items-center justify-between border-b border-[#252525] pb-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 mb-1">
              GENERAL SECRETARY (GS) OPERATIONS
            </p>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Good afternoon, {currentUser?.name}.
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Track President initiatives and cross-departmental delegation
            </p>
          </div>
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg"
          >
            + Delegate Task
          </button>
        </div>

        {/* President Initiatives (Point 14) */}
        <div className="bg-[#151515] p-5 rounded-xl border border-[#252525] space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
            President Initiatives
          </h3>
          <div className="space-y-3">
            {initiatives.map(item => (
              <div key={item.name}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-zinc-200">{item.name}</span>
                  <span className="font-mono text-zinc-400 font-semibold">{item.percent}%</span>
                </div>
                <div className="w-full bg-[#252525] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#D61F36] h-full rounded-full transition-all"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DepartmentChart />
          <WorkloadAnalytics />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 4. PRESIDENT DASHBOARD (Points 4, 5, 8, 25)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Good afternoon, {currentUser?.name}.
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Here's what's happening across E-Cell today.
          </p>
        </div>

        <button
          onClick={onOpenCreateTask}
          className="px-4 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Assign Task</span>
        </button>
      </div>

      {/* Stats Numbers Row (Point 4) */}
      <StatCards onFilterClick={(id) => {
        if (id === 'members') onNavigate('team');
        if (id === 'overdue' || id === 'active') onNavigate('tasks');
      }} />

      {/* Needs Your Attention Section (Point 25) */}
      <div className="bg-[#151515] p-4.5 rounded-xl border border-[#252525] space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Needs Your Attention
          </span>
          <span className="text-[10px] text-zinc-500 font-mono">PRIORITY ITEMS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-medium">
          {/* Overdue */}
          <div 
            onClick={() => onNavigate('tasks')}
            className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center gap-2.5 ${
              overdueCount > 0 
                ? 'bg-red-950/30 border-red-800/60 text-red-300 hover:bg-red-950/50' 
                : 'bg-[#181818] border-[#252525] text-zinc-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
            <span>{overdueCount} overdue {overdueCount === 1 ? 'task' : 'tasks'}</span>
          </div>

          {/* Verification */}
          <div 
            onClick={() => onNavigate('tasks')}
            className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center gap-2.5 ${
              reviewQueue.length > 0 
                ? 'bg-amber-950/30 border-amber-800/60 text-amber-300 hover:bg-amber-950/50' 
                : 'bg-[#181818] border-[#252525] text-zinc-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
            <span>{reviewQueue.length} {reviewQueue.length === 1 ? 'task' : 'tasks'} awaiting verification</span>
          </div>

          {/* Overloaded Members */}
          <div 
            onClick={() => onNavigate('team')}
            className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center gap-2.5 ${
              overloadedCount > 0 
                ? 'bg-red-950/30 border-red-800/60 text-red-300 hover:bg-red-950/50' 
                : 'bg-[#181818] border-[#252525] text-zinc-400'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 shrink-0"></span>
            <span>{overloadedCount} overloaded {overloadedCount === 1 ? 'member' : 'members'}</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Layout (Point 5: Active Tasks & Recent Activity Left, Workload Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (65%): Active Tasks & Activity Feed */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Tasks Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                Active Tasks ({activeRoleTasks.length})
              </h3>
              <button
                onClick={() => onNavigate('tasks')}
                className="text-xs text-red-400 hover:text-red-300 font-semibold"
              >
                View All Tasks →
              </button>
            </div>

            <TaskList
              tasks={activeRoleTasks.slice(0, 4)}
              onOpenDetail={onOpenTaskDetail}
              onSubmitClick={onSubmitClick}
              onVerifyClick={onVerifyClick}
            />
          </div>

          {/* Recent Activity Feed (Point 5) */}
          <div className="bg-[#151515] p-5 rounded-xl border border-[#252525] space-y-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Recent Activity Feed
            </h4>

            <div className="space-y-3">
              {recentActivities.map((act, i) => (
                <div key={act.id || i} className="flex items-start justify-between gap-3 text-xs border-b border-[#222226] pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-start gap-2 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                    <div className="min-w-0">
                      <p className="text-zinc-200 font-medium truncate">{act.action}</p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">{act.taskTitle}</p>
                    </div>
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
        <div className="lg:col-span-4 space-y-6">
          
          {/* Team Workload by Department */}
          <DepartmentChart />

          {/* Team Availability Card (Point 8) */}
          <div className="bg-[#151515] p-5 rounded-xl border border-[#252525] space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Team Availability
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181818] border border-[#252525]">
                <span className="flex items-center gap-2 text-zinc-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Available
                </span>
                <span className="font-mono font-bold text-white">{availableCount < 10 ? `0${availableCount}` : availableCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181818] border border-[#252525]">
                <span className="flex items-center gap-2 text-zinc-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Normal
                </span>
                <span className="font-mono font-bold text-white">{normalCount < 10 ? `0${normalCount}` : normalCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181818] border border-[#252525]">
                <span className="flex items-center gap-2 text-zinc-300 font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  Busy
                </span>
                <span className="font-mono font-bold text-white">{busyCount < 10 ? `0${busyCount}` : busyCount}</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-[#181818] border border-[#252525]">
                <span className="flex items-center gap-2 text-red-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>
                  Overloaded
                </span>
                <span className="font-mono font-bold text-red-400">{overloadedCount < 10 ? `0${overloadedCount}` : overloadedCount}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('team')}
              className="w-full py-1.5 bg-[#181818] hover:bg-[#202020] text-zinc-300 hover:text-white text-xs font-semibold rounded-lg border border-[#252525] transition-colors"
            >
              Open Workload Balancer
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
