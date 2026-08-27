import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { StatCards } from '../components/analytics/StatCards';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { TaskList } from '../components/tasks/TaskList';
import { TaskCard } from '../components/tasks/TaskCard';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
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
  Filter, 
  Send, 
  Share2, 
  ArrowRight,
  Briefcase
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
  const { tasks, getUserActiveTaskCount, departments, delegateTask, startTask } = useTasks();

  // President Section Tabs: 'tasks', 'team', 'activity'
  const [presidentSection, setPresidentSection] = useState('tasks');
  const [taskFilter, setTaskFilter] = useState('ALL');

  // GS Filter Tab: 'ALL' | 'PENDING' | 'ONGOING' | 'SUBMITTED' | 'FINALIZED'
  const [gsFilterTab, setGsFilterTab] = useState('ALL');

  // GS Delegation Modal State
  const [delegatingTask, setDelegatingTask] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [delegationNote, setDelegationNote] = useState('');

  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS' || currentUser?.role === 'General Secretary';
  const isLead = currentUser?.role === 'Lead' || currentUser?.role === 'Department Lead';
  const isMember = currentUser?.role === 'Member' || currentUser?.role === 'Team Member' || (!isPresident && !isGS && !isLead);

  // Can assign task: President, GS, and Lead ONLY
  const canAssignTask = isPresident || isGS || isLead;

  // Overdue count
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const d = getDeadlineStatus(t.deadline, t.status);
    return d.status === 'overdue';
  });

  // Verification queue count
  const reviewQueue = tasks.filter(t => {
    if (isLead) {
      const isDeptMatch = t.department && currentUser?.department &&
        t.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase();
      return isDeptMatch && t.status === 'SUBMITTED';
    }
    return t.status === 'SUBMITTED';
  });

  // Overloaded members
  const overloadedMembers = users.filter(u => getUserActiveTaskCount(u.id) >= 6);
  const availableMembers = users.filter(u => getUserActiveTaskCount(u.id) === 0);

  // Filter tasks based on President's sub-filter (President sees ALL tasks across all teams)
  const filteredPresidentTasks = tasks.filter(t => {
    if (taskFilter === 'SUBMITTED') return t.status === 'SUBMITTED';
    if (taskFilter === 'IN_PROGRESS') return t.status === 'IN_PROGRESS';
    if (taskFilter === 'PENDING') return t.status === 'PENDING';
    if (taskFilter === 'OVERDUE') {
      if (t.status === 'COMPLETED') return false;
      const d = getDeadlineStatus(t.deadline, t.status);
      return d.status === 'overdue';
    }
    if (taskFilter === 'COMPLETED') return t.status === 'COMPLETED';
    return true; // 'ALL' shows all organization tasks
  });

  // Recent activity aggregated from all tasks
  const recentActivities = tasks
    .flatMap(t => (t.activityLog || []).map(a => ({ ...a, taskTitle: t.title, taskId: t.id })))
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 10);

  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    if (!delegatingTask || !selectedTarget) return;

    delegateTask(delegatingTask.id, selectedTarget, delegationNote);
    setDelegatingTask(null);
    setSelectedTarget('');
    setDelegationNote('');
  };

  // Other users available to delegate to
  const assignableUsers = users.filter(u => u.id !== currentUser?.id && u.role !== 'President');

  // -------------------------------------------------------------
  // 1. GS DASHBOARD
  // -------------------------------------------------------------
  if (isGS) {
    const gsPendingTasks = tasks.filter(t => {
      const isAssignedToMe = t.assignedToId === currentUser?.id ||
        users.find(u => u.id === t.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        users.find(u => u.id === t.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();

      return isAssignedToMe && t.status !== 'COMPLETED';
    });

    const gsDelegatedTasks = tasks.filter(t => {
      const isCreator = t.assignedById === currentUser?.id || 
        users.find(u => u.id === t.assignedById)?.email?.toLowerCase() === currentUser?.email?.toLowerCase();
      
      const isSelf = t.assignedToId === currentUser?.id ||
        users.find(u => u.id === t.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase();

      return isCreator && !isSelf;
    });

    const ongoingTeamTasks = gsDelegatedTasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'PENDING');
    const submittedTasks = [...gsPendingTasks, ...gsDelegatedTasks].filter(t => t.status === 'SUBMITTED');
    const finalizedTasks = [...gsPendingTasks, ...gsDelegatedTasks].filter(t => t.status === 'COMPLETED');

    return (
      <div className="space-y-6 pb-12">
        
        {/* Clean Header */}
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              General Secretary Command
            </h1>
          </div>

          {canAssignTask && (
            <button
              onClick={onOpenCreateTask}
              className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Assign Task</span>
            </button>
          )}
        </div>

        {/* 4 Clean Aligned KPI Boxes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-left">
          <button
            type="button"
            onClick={() => setGsFilterTab(gsFilterTab === 'PENDING' ? 'ALL' : 'PENDING')}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[88px] ${
              gsFilterTab === 'PENDING'
                ? 'bg-[#181818] border-white shadow-sm'
                : 'bg-[#141414] border-[#222226] hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider leading-tight">
              Pending Delegation
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-white font-mono">{gsPendingTasks.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium">From President</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setGsFilterTab(gsFilterTab === 'ONGOING' ? 'ALL' : 'ONGOING')}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[88px] ${
              gsFilterTab === 'ONGOING'
                ? 'bg-[#181818] border-white shadow-sm'
                : 'bg-[#141414] border-[#222226] hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider leading-tight">
              Ongoing in Teams
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-white font-mono">{ongoingTeamTasks.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium">With Leads</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setGsFilterTab(gsFilterTab === 'SUBMITTED' ? 'ALL' : 'SUBMITTED')}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[88px] ${
              gsFilterTab === 'SUBMITTED'
                ? 'bg-[#181818] border-white shadow-sm'
                : 'bg-[#141414] border-[#222226] hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider leading-tight">
              Submitted Reviews
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-white font-mono">{submittedTasks.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium">Under Review</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setGsFilterTab(gsFilterTab === 'FINALIZED' ? 'ALL' : 'FINALIZED')}
            className={`p-4 rounded-xl border transition-all flex flex-col justify-between min-h-[88px] ${
              gsFilterTab === 'FINALIZED'
                ? 'bg-[#181818] border-white shadow-sm'
                : 'bg-[#141414] border-[#222226] hover:border-zinc-700'
            }`}
          >
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider leading-tight">
              Finalized Tasks
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-bold text-white font-mono">{finalizedTasks.length}</span>
              <span className="text-[10px] text-zinc-500 font-medium">Completed</span>
            </div>
          </button>
        </div>

        {/* SECTION 1: TASKS FROM PRESIDENT */}
        {(gsFilterTab === 'ALL' || gsFilterTab === 'PENDING') && (
          <div className="p-5 bg-[#141414] rounded-2xl border border-[#222226] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#B11226]"></span>
                Tasks from President ({gsPendingTasks.length})
              </h3>
            </div>

            {gsPendingTasks.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs">
                No pending tasks from President.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gsPendingTasks.map(task => {
                  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

                  return (
                    <div
                      key={task.id}
                      className="p-4 bg-[#181818] rounded-xl border border-[#262626] flex flex-col justify-between gap-3.5"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                            {task.priority || 'Medium'}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono">
                            {deadlineInfo.label}
                          </span>
                        </div>

                        <h4 
                          onClick={() => onOpenTaskDetail(task.id)}
                          className="text-xs font-bold text-white hover:text-red-400 cursor-pointer transition-colors leading-snug"
                        >
                          {task.title}
                        </h4>

                        <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                          <span>Target Team: <strong className="text-zinc-200">{task.department}</strong></span>
                        </div>
                      </div>

                      <div className="pt-2.5 border-t border-[#222226]">
                        <button
                          onClick={() => {
                            setDelegatingTask(task);
                            setSelectedTarget(`dept:${task.department}`);
                            setDelegationNote('');
                          }}
                          className="w-full py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Delegate to Team Lead →</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: ONGOING TEAM TASKS */}
        {(gsFilterTab === 'ALL' || gsFilterTab === 'ONGOING') && (
          <div className="p-5 bg-[#141414] rounded-2xl border border-[#222226] space-y-4">
            <div className="flex items-center justify-between border-b border-[#1f1f23] pb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-400"></span>
                Ongoing Team Tasks ({ongoingTeamTasks.length})
              </h3>

              {canAssignTask && (
                <button
                  onClick={onOpenCreateTask}
                  className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                >
                  + Assign Directly
                </button>
              )}
            </div>

            {ongoingTeamTasks.length === 0 ? (
              <div className="p-6 text-center text-zinc-500 text-xs">
                No active tasks delegated to teams yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ongoingTeamTasks.map(task => {
                  const assignee = users.find(u => u.id === task.assignedToId);
                  const deadlineInfo = getDeadlineStatus(task.deadline, task.status);

                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskDetail(task.id)}
                      className="p-4 bg-[#181818] rounded-xl border border-[#262626] hover:border-[#353535] cursor-pointer transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                          {task.department} Team
                        </span>
                        <span className="text-[10px] text-zinc-400">
                          Assignee: <strong className="text-white">{assignee ? assignee.name : `${task.department} Team`}</strong>
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white hover:text-red-400 transition-colors leading-snug">
                        {task.title}
                      </h4>

                      <div className="flex items-center justify-between text-[10px] text-zinc-500 border-t border-[#222226] pt-2 font-mono">
                        <span>{deadlineInfo.label}</span>
                        <span className="capitalize">{task.status.toLowerCase().replace('_', ' ')}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* GS Delegate Modal */}
        {delegatingTask && (
          <Modal
            isOpen={Boolean(delegatingTask)}
            onClose={() => setDelegatingTask(null)}
            title="Delegate Task to Department / Member"
            subtitle={`Assigning "${delegatingTask.title}"`}
            maxWidth="max-w-md"
          >
            <form onSubmit={handleDelegateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5">
                  Select Target Department or Member *
                </label>
                <select
                  required
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white font-semibold focus:outline-none focus:border-zinc-500"
                >
                  <option value="">-- Choose Team or Member --</option>
                  <optgroup label="⚡ Assign to Department / Team">
                    {departments.map(dept => (
                      <option key={dept.id} value={`dept:${dept.name}`}>
                        {dept.name} Team (All {dept.name} Members)
                      </option>
                    ))}
                  </optgroup>
                  {assignableUsers.length > 0 && (
                    <optgroup label="👤 Specific Members & Leads">
                      {assignableUsers.map(u => (
                        <option key={u.id} value={u.id}>
                          {u.name} ({u.role} - {u.department})
                        </option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1">
                  Delegation Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Instructions for the team..."
                  value={delegationNote}
                  onChange={(e) => setDelegationNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#252525]">
                <button
                  type="button"
                  onClick={() => setDelegatingTask(null)}
                  className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTarget}
                  className="px-4 py-1.5 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Assign to Team</span>
                </button>
              </div>
            </form>
          </Modal>
        )}

      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. MEMBER DASHBOARD (NO ASSIGN TASK BUTTON)
  // -------------------------------------------------------------
  if (isMember) {
    const memberTasks = tasks.filter(t => {
      const isDirectAssignee = t.assignedToId === currentUser?.id ||
        t.assignedToId === `team-${currentUser?.department?.toLowerCase()}` ||
        users.find(u => u.id === t.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        users.find(u => u.id === t.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();
      
      const isDeptTask = t.department && currentUser?.department &&
        t.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase();

      return isDirectAssignee || isDeptTask;
    });

    const memberActive = memberTasks.filter(t => t.status !== 'COMPLETED');
    const memberCompleted = memberTasks.filter(t => t.status === 'COMPLETED');

    return (
      <div className="space-y-6 pb-8">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              My Assigned Deliverables ({currentUser?.department} Team)
            </h1>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span><strong>{memberActive.length}</strong> ACTIVE</span>
            <span><strong>{memberCompleted.length}</strong> DONE</span>
          </div>
        </div>

        <div className="space-y-3">
          {memberTasks.length === 0 ? (
            <div className="p-8 text-center bg-[#141414] rounded-xl border border-[#222226] text-zinc-500 text-xs">
              No tasks currently assigned to you or {currentUser?.department} Team.
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
  // 3. LEAD DASHBOARD
  // -------------------------------------------------------------
  if (isLead) {
    const deptMembers = users.filter(u => 
      u.department && currentUser?.department &&
      u.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase()
    );

    const deptTasks = tasks.filter(t => {
      const isDeptMatch = t.department && currentUser?.department && 
        t.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase();
      
      const isDirectAssignee = t.assignedToId === currentUser?.id ||
        users.find(u => u.id === t.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
        users.find(u => u.id === t.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();
      
      return isDeptMatch || isDirectAssignee;
    });

    const deptActive = deptTasks.filter(t => t.status !== 'COMPLETED');

    return (
      <div className="space-y-5 pb-8">
        <div className="flex items-center justify-between border-b border-[#222226] pb-3">
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              {currentUser?.department} Team Operations
            </h1>
          </div>

          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg flex items-center gap-1.5"
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
                      <p className="text-[10px] text-zinc-400">by {assignee ? assignee.name : `${task.department} Team`}</p>
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
  // 4. PRESIDENT DASHBOARD (SHOWS ALL ORGANIZATION TASKS & MEMBERS)
  // -------------------------------------------------------------
  return (
    <div className="space-y-6 pb-12">
      
      {/* Clean Top Header */}
      <div className="flex items-center justify-between border-b border-[#222226] pb-3">
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">
            President Command Center
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
            <span>1. Organization Tasks ({tasks.length})</span>
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
            <span>2. Departments & Members ({users.length})</span>
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
            <span>3. Activity Stream</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: TASKS & VERIFICATION QUEUE */}
      {presidentSection === 'tasks' && (
        <div className="space-y-5">
          {reviewQueue.length > 0 && (
            <div className="bg-[#181112] border border-red-900/60 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-red-400">
                  Deliverables Awaiting Approval ({reviewQueue.length})
                </span>
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
                          <span className="text-[10px] text-zinc-400">by {assignee ? assignee.name : `${task.department} Team`}</span>
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

          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              {[
                { id: 'ALL', label: `All Tasks (${tasks.length})` },
                { id: 'IN_PROGRESS', label: `In Progress (${tasks.filter(t => t.status === 'IN_PROGRESS').length})` },
                { id: 'PENDING', label: `Pending (${tasks.filter(t => t.status === 'PENDING').length})` },
                { id: 'SUBMITTED', label: `Under Review (${tasks.filter(t => t.status === 'SUBMITTED').length})` },
                { id: 'COMPLETED', label: `Completed (${tasks.filter(t => t.status === 'COMPLETED').length})` }
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
              onClick={() => onNavigate('hierarchy')}
              className="text-xs text-red-400 hover:text-red-300 font-bold"
            >
              View Team Hierarchy →
            </button>
          </div>

          <TaskList
            tasks={filteredPresidentTasks}
            onOpenDetail={onOpenTaskDetail}
            onSubmitClick={onSubmitClick}
            onVerifyClick={onVerifyClick}
          />
        </div>
      )}

      {/* SECTION 2: DEPARTMENTS & ALL REGISTERED MEMBERS */}
      {presidentSection === 'team' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 space-y-4">
            <DepartmentChart />
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#141414] p-4.5 rounded-xl border border-[#222226] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Team Members & Workload ({users.length})
                </span>
              </div>

              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                {users.map(m => {
                  const count = getUserActiveTaskCount(m.id);
                  const workload = getWorkloadStatus(count);

                  return (
                    <div
                      key={m.id}
                      onClick={() => onSelectUser(m)}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#181818] hover:bg-[#202020] border border-[#222226] cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar user={m} size="xs" />
                        <div>
                          <p className="text-zinc-200 font-bold">{m.name}</p>
                          <p className="text-[10px] text-zinc-500">{m.role} • {m.department}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-semibold ${
                        workload.level === 'OVERLOADED' ? 'text-red-400' :
                        workload.level === 'BUSY' ? 'text-orange-400' : 'text-zinc-400'
                      }`}>
                        {count} Active
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {overloadedMembers.length > 0 && (
              <div className="bg-[#181112] p-4 rounded-xl border border-red-900/60 space-y-2 text-xs">
                <span className="text-red-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Overloaded Members ({overloadedMembers.length})
                </span>
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

      {/* SECTION 3: RECENT ACTIVITY LOG */}
      {presidentSection === 'activity' && (
        <div className="bg-[#141414] p-5 rounded-xl border border-[#222226] space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-300">
              Activity Stream
            </h3>
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
