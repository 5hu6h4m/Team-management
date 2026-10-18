import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
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
  Briefcase,
  Play,
  Check,
  Sparkles,
  FileCheck,
  ListTodo,
  Flame,
  Search,
  CheckCircle,
  Eye,
  SlidersHorizontal
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
  const { tasks, getUserActiveTaskCount, departments, delegateTask } = useTasks();

  // Role detection
  const isPresident = currentUser?.role === 'President';
  const isGS = currentUser?.role === 'GS' || currentUser?.role === 'General Secretary';
  const isLead = currentUser?.role === 'Lead' || currentUser?.role === 'Department Lead';
  const isMember = !isPresident && !isGS && !isLead;

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');

  // President Navigation: 'INCOMPLETE' | 'IN_PROGRESS' | 'SUBMITTED' | 'FINALIZED' | 'TEAM' | 'ACTIVITY'
  const [presidentNav, setPresidentNav] = useState('INCOMPLETE');

  // GS Navigation: 'PRESIDENT_TASKS' | 'HANDOVER_TASKS' | 'SUBMISSIONS' | 'FINALIZED'
  const [gsNav, setGsNav] = useState('PRESIDENT_TASKS');
  // GS Handover Sub-filter: 'ALL' | 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  const [gsHandoverStatus, setGsHandoverStatus] = useState('ALL');

  // Lead / Member Navigation: 'NEW' | 'IN_PROGRESS' | 'REVIEW' | 'FINALIZED'
  const [leadNav, setLeadNav] = useState('NEW');

  // GS Delegation Modal State
  const [delegatingTask, setDelegatingTask] = useState(null);
  const [selectedTarget, setSelectedTarget] = useState('');
  const [delegationNote, setDelegationNote] = useState('');

  const canAssignTask = isPresident || isGS || isLead;

  const handleDelegateSubmit = (e) => {
    e.preventDefault();
    if (!delegatingTask || !selectedTarget) return;

    delegateTask(delegatingTask.id, selectedTarget, delegationNote);
    setDelegatingTask(null);
    setSelectedTarget('');
    setDelegationNote('');
  };

  // Assignable users for delegation
  const assignableUsers = users.filter(u => u.id !== currentUser?.id && u.role !== 'President');

  // Recent activity aggregated from all tasks
  const recentActivities = useMemo(() => {
    return tasks
      .flatMap(t => (t.activityLog || []).map(a => ({ ...a, taskTitle: t.title, taskId: t.id })))
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 15);
  }, [tasks]);

  // Generic filter function for tasks
  const applyFilters = (taskList) => {
    return taskList.filter(t => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title?.toLowerCase().includes(q);
        const matchesDesc = t.description?.toLowerCase().includes(q);
        const matchesDept = t.department?.toLowerCase().includes(q);
        const assignee = users.find(u => u.id === t.assignedToId);
        const matchesAssignee = assignee?.name?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesDept && !matchesAssignee) return false;
      }
      if (selectedDepartment !== 'ALL' && t.department !== selectedDepartment) {
        return false;
      }
      if (selectedPriority !== 'ALL' && (t.priority || 'Medium').toUpperCase() !== selectedPriority.toUpperCase()) {
        return false;
      }
      return true;
    });
  };

  // =========================================================================
  // 1. PRESIDENT VIEW (E-CELL EXECUTIVE COMMAND CENTER)
  // =========================================================================
  if (isPresident) {
    // 1st Category: Tasks that are NOT complete (Pending + In-Progress + Submitted).
    // Finalized/Completed tasks are STRICTLY NOT counted here!
    const incompleteTasks = tasks.filter(t => t.status !== 'COMPLETED');
    const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS');
    const reviewTasks = tasks.filter(t => t.status === 'SUBMITTED');
    const finalizedTasks = tasks.filter(t => t.status === 'COMPLETED');

    // Filter tasks based on active navigation tab
    let displayTasks = [];
    if (presidentNav === 'INCOMPLETE') displayTasks = incompleteTasks;
    else if (presidentNav === 'IN_PROGRESS') displayTasks = inProgressTasks;
    else if (presidentNav === 'SUBMITTED') displayTasks = reviewTasks;
    else if (presidentNav === 'FINALIZED') displayTasks = finalizedTasks;

    const filteredDisplayTasks = applyFilters(displayTasks);

    return (
      <div className="space-y-5 pb-16 w-full max-w-full">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222226] pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-white tracking-tight">
                E-Cell Executive Command Center
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                President View
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Organization-wide task lifecycle, real-time pipeline monitoring & executive control
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Assign New Task</span>
            </button>
          </div>
        </div>

        {/* MODERN UNIFIED HORIZONTAL NAVIGATION BAR WITH LIVE METRIC BADGES */}
        <div className="bg-[#121215] p-1.5 rounded-2xl border border-[#222228] flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
          
          {/* Tab 1: Incomplete / Remaining Tasks */}
          <button
            type="button"
            onClick={() => setPresidentNav('INCOMPLETE')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              presidentNav === 'INCOMPLETE'
                ? 'bg-[#222228] text-white ring-1 ring-white/10 shadow-sm border-l-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <ListTodo className="w-4 h-4 text-red-400" />
            <span>1. Active Pipeline (Incomplete)</span>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
              incompleteTasks.length > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {incompleteTasks.length}
            </span>
          </button>

          {/* Tab 2: In-Progress / Kaam Chal Raha Hai */}
          <button
            type="button"
            onClick={() => setPresidentNav('IN_PROGRESS')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              presidentNav === 'IN_PROGRESS'
                ? 'bg-[#141b28] text-blue-300 ring-1 ring-blue-500/30 shadow-sm border-l-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
            <span>2. Kaam Chal Raha Hai (In-Progress)</span>
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
              {inProgressTasks.length}
            </span>
          </button>

          {/* Tab 3: Completed by Leads - Review Karna Baki Hai */}
          <button
            type="button"
            onClick={() => setPresidentNav('SUBMITTED')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              presidentNav === 'SUBMITTED'
                ? 'bg-[#221c12] text-amber-300 ring-1 ring-amber-500/30 shadow-sm border-l-2 border-amber-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>3. Review Karna Baki Hai</span>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
              reviewTasks.length > 0 ? 'bg-amber-500 text-black animate-bounce' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {reviewTasks.length}
            </span>
          </button>

          {/* Tab 4: Direct Final / Khel Khatam */}
          <button
            type="button"
            onClick={() => setPresidentNav('FINALIZED')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              presidentNav === 'FINALIZED'
                ? 'bg-[#122018] text-emerald-300 ring-1 ring-emerald-500/30 shadow-sm border-l-2 border-emerald-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>4. Direct Final (Khatam Hua)</span>
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              {finalizedTasks.length}
            </span>
          </button>

          {/* Tab 5: Team Members */}
          <button
            type="button"
            onClick={() => setPresidentNav('TEAM')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ml-auto ${
              presidentNav === 'TEAM'
                ? 'bg-[#222228] text-white ring-1 ring-white/10 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Users className="w-4 h-4 text-zinc-400" />
            <span>Team ({users.length})</span>
          </button>

          {/* Tab 6: Activity Feed */}
          <button
            type="button"
            onClick={() => setPresidentNav('ACTIVITY')}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              presidentNav === 'ACTIVITY'
                ? 'bg-[#222228] text-white ring-1 ring-white/10 shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Activity className="w-4 h-4 text-zinc-400" />
            <span>Activity</span>
          </button>

        </div>

        {/* TASK VIEWS: SEARCH & FILTER BAR */}
        {['INCOMPLETE', 'IN_PROGRESS', 'SUBMITTED', 'FINALIZED'].includes(presidentNav) && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141417] p-2.5 rounded-xl border border-[#222228]">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-400 ml-1.5" />
              <input
                type="text"
                placeholder="Search tasks by title, lead, department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-2.5 py-1.5 bg-[#1c1c22] border border-[#2c2c34] rounded-lg text-xs text-zinc-300 focus:outline-none"
              >
                <option value="ALL">All Departments</option>
                {departments.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="px-2.5 py-1.5 bg-[#1c1c22] border border-[#2c2c34] rounded-lg text-xs text-zinc-300 focus:outline-none"
              >
                <option value="ALL">All Priorities</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>
        )}

        {/* CONTENT AREA: TASK CARDS GRID */}
        {['INCOMPLETE', 'IN_PROGRESS', 'SUBMITTED', 'FINALIZED'].includes(presidentNav) && (
          <div className="space-y-4">
            
            {/* Header info */}
            <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
              <span>
                Showing <strong className="text-white">{filteredDisplayTasks.length}</strong> task(s) in{' '}
                <strong className="text-red-400 font-semibold">
                  {presidentNav === 'INCOMPLETE' && 'Active Pipeline (Pending + In-Progress + Review)'}
                  {presidentNav === 'IN_PROGRESS' && 'Currently In-Progress'}
                  {presidentNav === 'SUBMITTED' && 'Submitted for Review'}
                  {presidentNav === 'FINALIZED' && 'Finalized & Closed'}
                </strong>
              </span>

              {presidentNav === 'INCOMPLETE' && reviewTasks.length > 0 && (
                <button
                  onClick={() => setPresidentNav('SUBMITTED')}
                  className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 animate-pulse"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{reviewTasks.length} task(s) awaiting review →</span>
                </button>
              )}
            </div>

            {filteredDisplayTasks.length === 0 ? (
              <div className="p-16 text-center bg-[#141416] rounded-2xl border border-dashed border-[#222226] space-y-2">
                <FileCheck className="w-9 h-9 text-zinc-600 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-300">No tasks in this section</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                  {presidentNav === 'INCOMPLETE' && 'All organizational tasks have been completed and finalized!'}
                  {presidentNav === 'IN_PROGRESS' && 'No team members are currently actively working on tasks.'}
                  {presidentNav === 'SUBMITTED' && 'No deliverables currently waiting for verification.'}
                  {presidentNav === 'FINALIZED' && 'No finalized tasks yet.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredDisplayTasks.map(task => (
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
        )}

        {/* SECTION: DEPARTMENTS & TEAM ROSTER */}
        {presidentNav === 'TEAM' && (
          <div className="space-y-6">
            <div className="p-5 bg-[#141416] rounded-2xl border border-[#222228] space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-zinc-400" />
                <span>All E-Cell Team Members ({users.length})</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {users.map(u => {
                  const activeCount = getUserActiveTaskCount(u.id);
                  const workload = getWorkloadStatus(activeCount);

                  return (
                    <div
                      key={u.id}
                      onClick={() => onSelectUser && onSelectUser(u)}
                      className="p-3.5 bg-[#18181c] rounded-xl border border-[#26262e] hover:border-[#383842] cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar user={u} size="md" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate hover:text-red-400">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-zinc-400 truncate">
                            {u.role} &bull; <span className="text-zinc-500">{u.department}</span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          workload.level === 'OVERLOADED' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          workload.level === 'BUSY' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}>
                          {activeCount} Active
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Department Breakdown Chart */}
            <div className="p-5 bg-[#141416] rounded-2xl border border-[#222228]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-zinc-400" />
                <span>Department Operations Breakdown</span>
              </h3>
              <DepartmentChart tasks={tasks} departments={departments} />
            </div>
          </div>
        )}

        {/* SECTION: LIVE ACTIVITY FEED */}
        {presidentNav === 'ACTIVITY' && (
          <div className="p-5 bg-[#141416] rounded-2xl border border-[#222228] space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 border-b border-[#222228] pb-2.5">
              <Activity className="w-4 h-4 text-zinc-400" />
              <span>Live System Activity & Audit Trail</span>
            </h3>

            {recentActivities.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs">
                No logged activities recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-[#222228]">
                {recentActivities.map((act) => {
                  const actor = users.find(u => u.id === act.userId);
                  return (
                    <div key={act.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Avatar user={actor} size="xs" />
                        <div>
                          <p className="text-zinc-200">
                            <strong className="text-white">{actor ? actor.name : 'User'}</strong> {act.action}
                          </p>
                          <p 
                            onClick={() => onOpenTaskDetail(act.taskId)}
                            className="text-[11px] text-red-400 hover:underline cursor-pointer font-medium mt-0.5"
                          >
                            Task: &quot;{act.taskTitle}&quot;
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                        {formatTimeAgo(act.timestamp)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>
    );
  }

  // =========================================================================
  // 2. GENERAL SECRETARY (GS / BHUSHAN) VIEW
  // =========================================================================
  if (isGS) {
    const presidentUser = users.find(u => u.role === 'President');
    const presidentId = presidentUser?.id || 'u-president';

    // 1st Tab: Tasks Assigned FROM E-Cell President
    const tasksFromPresident = tasks.filter(t => {
      if (t.status === 'COMPLETED') return false;
      return t.assignedById === presidentId;
    });

    // 2nd Tab: Handover Tasks (Tasks GS delegated to Leads/Members)
    const handoverTasks = tasks.filter(t => {
      const isNotGS = t.assignedToId !== currentUser?.id;
      const assigneeUser = users.find(u => u.id === t.assignedToId);
      const assigneeIsNotGS = !assigneeUser || (assigneeUser.role !== 'GS' && assigneeUser.role !== 'General Secretary');
      const isDelegatedByGSOrPres = t.assignedById === currentUser?.id || t.assignedById === presidentId;
      return isNotGS && assigneeIsNotGS && isDelegatedByGSOrPres;
    });

    // 3 Status Sub-options for Handover Tasks
    const handoverNotStarted = handoverTasks.filter(t => t.status === 'PENDING');
    const handoverInProgress = handoverTasks.filter(t => t.status === 'IN_PROGRESS');
    const handoverCompleted = handoverTasks.filter(t => t.status === 'COMPLETED' || t.status === 'SUBMITTED');

    // Submissions waiting review
    const submittedTasks = tasks.filter(t => t.status === 'SUBMITTED');
    const finalizedTasks = tasks.filter(t => t.status === 'COMPLETED');

    // Filter display tasks according to GS tabs
    let gsDisplayTasks = [];
    if (gsNav === 'PRESIDENT_TASKS') {
      gsDisplayTasks = tasksFromPresident;
    } else if (gsNav === 'HANDOVER_TASKS') {
      if (gsHandoverStatus === 'NOT_STARTED') gsDisplayTasks = handoverNotStarted;
      else if (gsHandoverStatus === 'IN_PROGRESS') gsDisplayTasks = handoverInProgress;
      else if (gsHandoverStatus === 'COMPLETED') gsDisplayTasks = handoverCompleted;
      else gsDisplayTasks = handoverTasks;
    } else if (gsNav === 'SUBMISSIONS') {
      gsDisplayTasks = submittedTasks;
    } else if (gsNav === 'FINALIZED') {
      gsDisplayTasks = finalizedTasks;
    }

    const filteredGsTasks = applyFilters(gsDisplayTasks);

    return (
      <div className="space-y-5 pb-16 w-full max-w-full">
        
        {/* Clean Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222226] pb-3">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black text-white tracking-tight">
                General Secretary Command Center
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                {currentUser?.name}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Delegation hub: Handover presidential directives to leads, track active working states & reviews
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenCreateTask}
              className="px-4 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add & Assign Task</span>
            </button>
          </div>
        </div>

        {/* MODERN UNIFIED GS HORIZONTAL NAVIGATION BAR */}
        <div className="bg-[#121215] p-1.5 rounded-2xl border border-[#222228] flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
          
          {/* Tab 1: Task Assign from E-Cell President */}
          <button
            type="button"
            onClick={() => setGsNav('PRESIDENT_TASKS')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gsNav === 'PRESIDENT_TASKS'
                ? 'bg-[#222228] text-white ring-1 ring-white/10 shadow-sm border-l-2 border-red-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Share2 className="w-4 h-4 text-red-400" />
            <span>1. Tasks from President</span>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
              tasksFromPresident.length > 0 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {tasksFromPresident.length}
            </span>
          </button>

          {/* Tab 2: Handover Tasks (Delegated to Leads) */}
          <button
            type="button"
            onClick={() => setGsNav('HANDOVER_TASKS')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gsNav === 'HANDOVER_TASKS'
                ? 'bg-[#141b28] text-blue-300 ring-1 ring-blue-500/30 shadow-sm border-l-2 border-blue-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Send className="w-4 h-4 text-blue-400" />
            <span>2. Handover Tasks (To Leads)</span>
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
              {handoverTasks.length}
            </span>
          </button>

          {/* Tab 3: Submitted for Verification */}
          <button
            type="button"
            onClick={() => setGsNav('SUBMISSIONS')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gsNav === 'SUBMISSIONS'
                ? 'bg-[#221c12] text-amber-300 ring-1 ring-amber-500/30 shadow-sm border-l-2 border-amber-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <Eye className="w-4 h-4 text-amber-400" />
            <span>3. Submitted Deliverables</span>
            <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
              submittedTasks.length > 0 ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-500'
            }`}>
              {submittedTasks.length}
            </span>
          </button>

          {/* Tab 4: Finalized Deliverables */}
          <button
            type="button"
            onClick={() => setGsNav('FINALIZED')}
            className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              gsNav === 'FINALIZED'
                ? 'bg-[#122018] text-emerald-300 ring-1 ring-emerald-500/30 shadow-sm border-l-2 border-emerald-500'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
            }`}
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>4. Finalized Tasks</span>
            <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
              {finalizedTasks.length}
            </span>
          </button>

        </div>

        {/* GS SUB-FILTER BAR & HANDOVER SUB-OPTIONS */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#141417] p-2.5 rounded-xl border border-[#222228]">
          
          {/* Handover Status Sub-tabs (When on Handover Tab) */}
          {gsNav === 'HANDOVER_TASKS' ? (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="text-[11px] font-bold uppercase text-zinc-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Status:</span>
              </span>
              
              <button
                type="button"
                onClick={() => setGsHandoverStatus('ALL')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  gsHandoverStatus === 'ALL'
                    ? 'bg-[#25252c] text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                All ({handoverTasks.length})
              </button>

              <button
                type="button"
                onClick={() => setGsHandoverStatus('NOT_STARTED')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  gsHandoverStatus === 'NOT_STARTED'
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                1. Start Nahi Hua ({handoverNotStarted.length})
              </button>

              <button
                type="button"
                onClick={() => setGsHandoverStatus('IN_PROGRESS')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  gsHandoverStatus === 'IN_PROGRESS'
                    ? 'bg-blue-950/60 text-blue-300 border border-blue-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                2. Kaam Chal Raha Hai ({handoverInProgress.length})
              </button>

              <button
                type="button"
                onClick={() => setGsHandoverStatus('COMPLETED')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  gsHandoverStatus === 'COMPLETED'
                    ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                3. Task Khatam Hue ({handoverCompleted.length})
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-zinc-400 ml-1.5" />
              <input
                type="text"
                placeholder="Search tasks, deliverables, leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>
          )}

          {/* Department and Priority dropdown filter */}
          <div className="flex items-center gap-2 shrink-0">
            {gsNav === 'HANDOVER_TASKS' && (
              <div className="flex items-center gap-2 bg-[#1c1c22] px-2 py-1 rounded-lg border border-[#2c2c34]">
                <Search className="w-3.5 h-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter lead/task..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none w-28 sm:w-36"
                />
              </div>
            )}

            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-2.5 py-1.5 bg-[#1c1c22] border border-[#2c2c34] rounded-lg text-xs text-zinc-300 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

        </div>

        {/* GS TASK GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
            <span>
              Showing <strong className="text-white">{filteredGsTasks.length}</strong> task(s)
            </span>
          </div>

          {filteredGsTasks.length === 0 ? (
            <div className="p-16 text-center bg-[#141416] rounded-2xl border border-dashed border-[#222226] space-y-2">
              <FileCheck className="w-9 h-9 text-zinc-600 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-300">No tasks in this category</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                {gsNav === 'PRESIDENT_TASKS' && 'No pending tasks assigned by the President.'}
                {gsNav === 'HANDOVER_TASKS' && 'No handover tasks matching this filter.'}
                {gsNav === 'SUBMISSIONS' && 'No deliverables waiting for GS review.'}
                {gsNav === 'FINALIZED' && 'No completed deliverables yet.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredGsTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onOpenDetail={onOpenTaskDetail}
                  onSubmitClick={onSubmitClick}
                  onVerifyClick={onVerifyClick}
                  onDelegateClick={(t) => {
                    setDelegatingTask(t);
                    setSelectedTarget(`dept:${t.department}`);
                    setDelegationNote('');
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* GS DELEGATION MODAL */}
        {delegatingTask && (
          <Modal
            isOpen={Boolean(delegatingTask)}
            onClose={() => setDelegatingTask(null)}
            title="Handover / Delegate Task to Lead or Member"
            subtitle={`Assigning "${delegatingTask.title}"`}
            maxWidth="max-w-md"
          >
            <form onSubmit={handleDelegateSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-400 mb-1.5">
                  Select Target Lead / Member / Department *
                </label>
                <select
                  required
                  value={selectedTarget}
                  onChange={(e) => setSelectedTarget(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-white font-semibold focus:outline-none focus:border-red-500"
                >
                  <option value="">-- Choose Lead or Team --</option>
                  <optgroup label="⚡ Assign to Department / Team">
                    {departments.map(dept => (
                      <option key={dept.id} value={`dept:${dept.name}`}>
                        {dept.name} Team (All {dept.name} Members)
                      </option>
                    ))}
                  </optgroup>
                  {assignableUsers.length > 0 && (
                    <optgroup label="👤 Specific Leads & Members">
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
                  Handover Instructions / Notes (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Specific requirements or guidance for the lead..."
                  value={delegationNote}
                  onChange={(e) => setDelegationNote(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs bg-[#181818] border border-[#252525] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#252525]">
                <button
                  type="button"
                  onClick={() => setDelegatingTask(null)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedTarget}
                  className="px-5 py-2 bg-[#B11226] hover:bg-[#D61F36] disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Confirm Handover</span>
                </button>
              </div>
            </form>
          </Modal>
        )}

      </div>
    );
  }

  // =========================================================================
  // 3. LEADS (MOHIT / DOMAIN LEADS) & TEAM MEMBERS VIEW
  // =========================================================================
  const myTasks = tasks.filter(t => {
    const isDeptMatch = t.department && currentUser?.department && 
      t.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase();
    
    const isDirectAssignee = t.assignedToId === currentUser?.id ||
      users.find(u => u.id === t.assignedToId)?.email?.toLowerCase() === currentUser?.email?.toLowerCase() ||
      users.find(u => u.id === t.assignedToId)?.name?.toLowerCase() === currentUser?.name?.toLowerCase();
    
    return isDeptMatch || isDirectAssignee;
  });

  const newTasks = myTasks.filter(t => t.status === 'PENDING');
  const inProgressTasks = myTasks.filter(t => t.status === 'IN_PROGRESS');
  const reviewTasks = myTasks.filter(t => t.status === 'SUBMITTED');
  const finalizedTasks = myTasks.filter(t => t.status === 'COMPLETED');

  // Filter tasks based on 4-step pipeline
  let leadDisplayTasks = [];
  if (leadNav === 'NEW') leadDisplayTasks = newTasks;
  else if (leadNav === 'IN_PROGRESS') leadDisplayTasks = inProgressTasks;
  else if (leadNav === 'REVIEW') leadDisplayTasks = reviewTasks;
  else if (leadNav === 'FINALIZED') leadDisplayTasks = finalizedTasks;

  const filteredLeadTasks = applyFilters(leadDisplayTasks);

  const deptMembers = users.filter(u => 
    u.department && currentUser?.department &&
    u.department.trim().toLowerCase() === currentUser.department.trim().toLowerCase()
  );

  return (
    <div className="space-y-5 pb-16 w-full max-w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#222226] pb-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-black text-white tracking-tight">
              {currentUser?.name}
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {currentUser?.department} {isLead ? 'Lead' : 'Member'}
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Execute deliverables, manage working statuses, submit completed tasks & track deadlines
          </p>
        </div>

        {canAssignTask && (
          <button
            onClick={onOpenCreateTask}
            className="px-4 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Assign New Task</span>
          </button>
        )}
      </div>

      {/* 4-STEP HORIZONTAL PIPELINE NAVIGATION BAR */}
      <div className="bg-[#121215] p-1.5 rounded-2xl border border-[#222228] flex items-center gap-2 overflow-x-auto scrollbar-none shadow-sm">
        
        {/* Tab 1: New Tasks (Start Nahi Hua) */}
        <button
          type="button"
          onClick={() => setLeadNav('NEW')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            leadNav === 'NEW'
              ? 'bg-[#241315] text-red-300 ring-1 ring-red-500/40 shadow-sm border-l-2 border-red-500'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
          }`}
        >
          {newTasks.length > 0 && <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />}
          <span>1. New Tasks (Shuru Karna Hai)</span>
          <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
            newTasks.length > 0 ? 'bg-red-500 text-white font-bold' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {newTasks.length}
          </span>
        </button>

        {/* Tab 2: In-Progress (Kaam Chal Raha Hai) */}
        <button
          type="button"
          onClick={() => setLeadNav('IN_PROGRESS')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            leadNav === 'IN_PROGRESS'
              ? 'bg-[#141b28] text-blue-300 ring-1 ring-blue-500/40 shadow-sm border-l-2 border-blue-500'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
          }`}
        >
          <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
          <span>2. Kaam Chal Raha Hai (Active)</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
            {inProgressTasks.length}
          </span>
        </button>

        {/* Tab 3: Under Review (Kaam Khatam Hua - Review Me Hai) */}
        <button
          type="button"
          onClick={() => setLeadNav('REVIEW')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            leadNav === 'REVIEW'
              ? 'bg-[#221c12] text-amber-300 ring-1 ring-amber-500/40 shadow-sm border-l-2 border-amber-500'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
          }`}
        >
          <Eye className="w-4 h-4 text-amber-400" />
          <span>3. Review Me Hai (Submitted)</span>
          <span className={`px-2 py-0.5 text-[11px] rounded-full font-mono font-bold ${
            reviewTasks.length > 0 ? 'bg-amber-500 text-black font-bold' : 'bg-zinc-800 text-zinc-500'
          }`}>
            {reviewTasks.length}
          </span>
        </button>

        {/* Tab 4: Finalized (Khel Khatam - Direct Final) */}
        <button
          type="button"
          onClick={() => setLeadNav('FINALIZED')}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            leadNav === 'FINALIZED'
              ? 'bg-[#122018] text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm border-l-2 border-emerald-500'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#18181c]'
          }`}
        >
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>4. Khel Khatam (Finalized)</span>
          <span className="px-2 py-0.5 text-[11px] rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold">
            {finalizedTasks.length}
          </span>
        </button>

      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#141417] p-2.5 rounded-xl border border-[#222228]">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-zinc-400 ml-1.5" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 bg-[#1c1c22] border border-[#2c2c34] rounded-lg text-xs text-zinc-300 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* TASK CARDS GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs px-1 text-zinc-400">
          <span>
            Showing <strong className="text-white">{filteredLeadTasks.length}</strong> task(s) in{' '}
            <strong className="text-red-400 font-semibold">
              {leadNav === 'NEW' && '1. New Tasks (Ready to Start)'}
              {leadNav === 'IN_PROGRESS' && '2. Kaam Chal Raha Hai (Active)'}
              {leadNav === 'REVIEW' && '3. Review Me Hai (Submitted Deliverables)'}
              {leadNav === 'FINALIZED' && '4. Khel Khatam (Finalized)'}
            </strong>
          </span>

          {newTasks.length > 0 && leadNav !== 'NEW' && (
            <button
              onClick={() => setLeadNav('NEW')}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1 animate-pulse"
            >
              ⚡ {newTasks.length} new task(s) ready to start →
            </button>
          )}
        </div>

        {filteredLeadTasks.length === 0 ? (
          <div className="p-16 text-center bg-[#141416] rounded-2xl border border-dashed border-[#222226] space-y-2">
            <FileCheck className="w-9 h-9 text-zinc-600 mx-auto" />
            <h4 className="text-sm font-bold text-zinc-300">No tasks in this pipeline stage</h4>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              {leadNav === 'NEW' && 'You have started all assigned incoming tasks!'}
              {leadNav === 'IN_PROGRESS' && 'No tasks are currently ongoing.'}
              {leadNav === 'REVIEW' && 'No tasks currently awaiting review.'}
              {leadNav === 'FINALIZED' && 'No completed deliverables yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLeadTasks.map(task => (
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

      {/* COMPACT TEAM ROSTER STRIP */}
      {deptMembers.length > 0 && (
        <div className="mt-8 p-4 bg-[#141416] rounded-2xl border border-[#222228] flex items-center justify-between gap-4 flex-wrap text-xs">
          <div className="flex items-center gap-2 text-zinc-400 font-bold uppercase text-[10px] tracking-wider shrink-0">
            <Users className="w-4 h-4 text-zinc-400" />
            <span>{currentUser?.department} Team Roster ({deptMembers.length}):</span>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {deptMembers.map(m => {
              const count = getUserActiveTaskCount(m.id);
              const status = getWorkloadStatus(count);
              return (
                <div 
                  key={m.id}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#1c1c22] rounded-xl border border-[#2c2c34] text-xs"
                >
                  <Avatar user={m} size="xs" />
                  <span className="text-zinc-200 font-medium">{m.name}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                    status.level === 'OVERLOADED' ? 'bg-red-500/20 text-red-400' :
                    status.level === 'BUSY' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {count} active
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
