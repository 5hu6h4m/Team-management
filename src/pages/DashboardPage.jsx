import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatCards } from '../components/analytics/StatCards';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { TaskList } from '../components/tasks/TaskList';
import { TaskCard } from '../components/tasks/TaskCard';
import { Avatar } from '../components/common/Avatar';
import { getWorkloadStatus, getDeadlineStatus, formatTimeAgo } from '../utils/deadlineHelper';
import { 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Users, 
  Layers, 
  Activity, 
  CheckSquare,
  Sparkles,
  Filter
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

  // President Section Tabs: 'tasks', 'team', 'activity'
  const [presidentSection, setPresidentSection] = useState('tasks');
  const [taskFilter, setTaskFilter] = useState('ALL'); // 'ALL', 'SUBMITTED', 'IN_PROGRESS', 'OVERDUE'

  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS';
  const isLead = currentUser?.role === 'Lead';
  const isMember = currentUser?.role === 'Member';

  // Overdue count
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const d = getDeadlineStatus(t.deadline, t.status);
    return d.status === 'overdue';
  });

  // Verification queue count
  const reviewQueue = tasks.filter(t => {
    if (isLead) return t.department === currentUser?.department && t.status === 'SUBMITTED';
    return t.status === 'SUBMITTED';
  });

  // Overloaded members
  const overloadedMembers = users.filter(u => getUserActiveTaskCount(u.id) >= 6);
  const availableMembers = users.filter(u => getUserActiveTaskCount(u.id) === 0);

  // Filter tasks based on President's sub-filter
  const filteredPresidentTasks = tasks.filter(t => {
    if (taskFilter === 'SUBMITTED') return t.status === 'SUBMITTED';
    if (taskFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (taskFilter === 'OVERDUE') {
      if (t.status === 'COMPLETED') return false;
      const d = getDeadlineStatus(t.deadline, t.status);
      return d.status === 'overdue';
    }
    if (taskFilter === 'COMPLETED') return t.status === 'COMPLETED';
    return t.status !== 'COMPLETED'; // Default 'ALL' shows active tasks
  });

  // Recent activity aggregated from all tasks
  const recentActivities = tasks
    .flatMap(t => (t.activityLog || []).map(a => ({ ...a, taskTitle: t.title, taskId: t.id })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  // -------------------------------------------------------------
  // 1. MEMBER DASHBOARD
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
  // 2. LEAD DASHBOARD
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
  // 3. GS DASHBOARD
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
  // 4. PRESIDENT DASHBOARD (NEW SECTIONED & UNCLUTTERED LAYOUT)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      
      {/* Clean Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222226] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-[#B11226] text-white rounded">
              President Command Room
            </span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Good afternoon, {currentUser?.name}.
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('admin')}
            className="px-3 py-1.5 bg-[#181818] hover:bg-[#222222] text-zinc-300 hover:text-white text-xs font-semibold rounded-lg border border-[#252525] transition-colors"
          >
            ⚙ Admin Panel
          </button>
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        </div>
      </div>

      {/* 4 Big Clear KPI Cards */}
      <StatCards onFilterClick={(id) => {
        if (id === 'members') {
          setPresidentSection('team');
        } else if (id === 'overdue') {
          setPresidentSection('tasks');
          setTaskFilter('OVERDUE');
        } else if (id === 'completed') {
          setPresidentSection('tasks');
          setTaskFilter('COMPLETED');
        } else {
          setPresidentSection('tasks');
          setTaskFilter('ALL');
        }
      }} />

      {/* 3 Main Sections Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#222226] pb-1 gap-2 flex-wrap">
        
        {/* Section Picker Tabs */}
        <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-xl border border-[#222226]">
          <button
            onClick={() => setPresidentSection('tasks')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              presidentSection === 'tasks'
                ? 'bg-[#222226] text-white shadow-xs border-b-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-red-400" />
            <span>1. Tasks & Verification Queue</span>
            {reviewQueue.length > 0 && (
              <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-400 text-black rounded-full">
                {reviewQueue.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setPresidentSection('team')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              presidentSection === 'team'
                ? 'bg-[#222226] text-white shadow-xs border-b-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-zinc-400" />
            <span>2. Departments & Team Bandwidth</span>
          </button>

          <button
            onClick={() => setPresidentSection('activity')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              presidentSection === 'activity'
                ? 'bg-[#222226] text-white shadow-xs border-b-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-zinc-400" />
            <span>3. Recent Activity Log</span>
          </button>
        </div>

      </div>

      {/* ========================================================= */}
      {/* SECTION 1: TASKS & VERIFICATION QUEUE */}
      {/* ========================================================= */}
      {presidentSection === 'tasks' && (
        <div className="space-y-5">
          
          {/* Sub-section: Pending Verification Queue (High Priority) */}
          {reviewQueue.length > 0 && (
            <div className="bg-[#181112] border border-red-900/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                    Deliverables Awaiting Your Approval ({reviewQueue.length})
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400">Members submitted deliverables for sign-off</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {reviewQueue.map(task => {
                  const assignee = users.find(u => u.id === task.assignedToId);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskDetail(task.id)}
                      className="p-3 bg-[#141414] rounded-lg border border-[#252525] hover:border-red-800/60 cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase bg-[#202024] text-zinc-300 rounded">
                            {task.department}
                          </span>
                          <span className="text-[10px] text-zinc-400">by {assignee?.name}</span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{task.title}</p>
                      </div>

                      <button
                        onClick={(e) => { e.stopPropagation(); onVerifyClick(task); }}
                        className="px-3 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded shrink-0 shadow-xs"
                      >
                        Verify Deliverable →
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Filters for Tasks */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'ALL', label: 'Active Tasks' },
                { id: 'SUBMITTED', label: 'Under Review' },
                { id: 'IN_PROGRESS', label: 'In Progress' },
                { id: 'OVERDUE', label: '🔴 Overdue' },
                { id: 'COMPLETED', label: 'Completed' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setTaskFilter(f.id)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    taskFilter === f.id
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#141414] text-zinc-400 hover:text-zinc-200 border border-[#222226]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-red-400 hover:text-red-300 font-bold"
            >
              Open Full Task Explorer →
            </button>
          </div>

          {/* Clean Grid of Tasks */}
          <TaskList
            tasks={filteredPresidentTasks}
            onOpenDetail={onOpenTaskDetail}
            onSubmitClick={onSubmitClick}
            onVerifyClick={onVerifyClick}
          />
        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 2: DEPARTMENTS & TEAM BANDWIDTH */}
      {/* ========================================================= */}
      {presidentSection === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Department Completion Bars (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <DepartmentChart />
          </div>

          {/* Team Bandwidth: Available vs Overloaded (5 Cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Free Members Roster */}
            <div className="bg-[#141414] p-4.5 rounded-xl border border-[#222226] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Free / Available Members ({availableMembers.length})
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">0 active tasks</span>
              </div>

              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {availableMembers.map(m => (
                  <div
                    key={m.id}
                    onClick={() => onSelectUser(m)}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#222226] cursor-pointer text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Avatar user={m} size="xs" />
                      <span className="text-zinc-200 font-medium">{m.name}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400">{m.department}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Overloaded Members Warning */}
            {overloadedMembers.length > 0 && (
              <div className="bg-[#181112] p-4 rounded-xl border border-red-900/60 space-y-2 text-xs">
                <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Overloaded Members ({overloadedMembers.length})
                </span>
                <p className="text-zinc-400 text-[11px]">
                  Avoid assigning new tasks to these members until their active workload reduces.
                </p>
                <div className="space-y-1 pt-1">
                  {overloadedMembers.map(m => (
                    <div key={m.id} className="flex items-center justify-between text-zinc-300 py-0.5">
                      <span>{m.name} ({m.department})</span>
                      <span className="text-red-400 font-bold">{getUserActiveTaskCount(m.id)} tasks</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SECTION 3: RECENT ACTIVITY LOG */}
      {/* ========================================================= */}
      {presidentSection === 'activity' && (
        <div className="bg-[#141414] p-5 rounded-xl border border-[#222226] space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Audit & Activity Stream
            </h3>
            <span className="text-[10px] text-zinc-500 font-mono">Live operational timestamps</span>
          </div>

          <div className="divide-y divide-[#1f1f23]">
            {recentActivities.map((act, i) => (
              <div key={act.id || i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  <div className="min-w-0">
                    <p className="text-zinc-200 font-medium truncate">{act.action}</p>
                    <p className="text-[10px] text-zinc-500 truncate">Task: {act.taskTitle}</p>
                  </div>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                  {formatTimeAgo(act.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
