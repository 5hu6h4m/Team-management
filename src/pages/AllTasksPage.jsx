import React, { useState, useMemo } from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { TaskList } from '../components/tasks/TaskList';
import { getDeadlineStatus } from '../utils/deadlineHelper';
import { Search, Plus, Grid, List, RotateCcw } from 'lucide-react';

export function AllTasksPage({ onOpenCreateTask, onOpenTaskDetail, onSubmitClick, onVerifyClick }) {
  const { tasks, departments } = useTasks();
  const { users, currentUser } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid');

  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(query);
        const matchesDesc = (t.description || '').toLowerCase().includes(query);
        const matchesDept = t.department.toLowerCase().includes(query);
        const assignee = users.find(u => u.id === t.assignedToId);
        const matchesAssignee = assignee ? assignee.name.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesDesc && !matchesDept && !matchesAssignee) return false;
      }

      if (selectedDept !== 'ALL' && t.department !== selectedDept) return false;
      if (selectedAssignee !== 'ALL' && t.assignedToId !== selectedAssignee) return false;
      if (selectedPriority !== 'ALL' && t.priority !== selectedPriority) return false;

      if (selectedStatus !== 'ALL') {
        if (selectedStatus === 'OVERDUE') {
          if (t.status === 'COMPLETED') return false;
          const deadline = getDeadlineStatus(t.deadline, t.status);
          if (deadline.status !== 'overdue') return false;
        } else if (selectedStatus === 'DUE_SOON') {
          if (t.status === 'COMPLETED') return false;
          const deadline = getDeadlineStatus(t.deadline, t.status);
          if (deadline.status !== 'due_soon') return false;
        } else if (t.status !== selectedStatus) {
          return false;
        }
      }

      return true;
    });
  }, [tasks, searchQuery, selectedDept, selectedAssignee, selectedPriority, selectedStatus, users]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedAssignee('ALL');
    setSelectedPriority('ALL');
    setSelectedStatus('ALL');
  };

  const isFiltered = searchQuery || selectedDept !== 'ALL' || selectedAssignee !== 'ALL' || selectedPriority !== 'ALL' || selectedStatus !== 'ALL';

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Task Directory</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Operational task directory across all E-Cell departments
          </p>
        </div>

        {currentUser?.role !== 'Member' && (
          <button
            onClick={onOpenCreateTask}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Assign Task</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#151515] p-4 rounded-xl border border-[#252525] space-y-3">
        
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter tasks by name, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#181818] p-1 rounded-lg self-end md:self-auto border border-[#252525]">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-[#252525] text-white' : 'text-zinc-500'}`}
              title="Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-[#252525] text-white' : 'text-zinc-500'}`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-[#222226]">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Department
            </label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Departments</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
              <option value="Executive">Executive</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="SUBMITTED">Submitted</option>
              <option value="COMPLETED">Completed</option>
              <option value="DUE_SOON">Due Soon</option>
              <option value="OVERDUE">Overdue</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Assignee
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Members</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Priority
            </label>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Priorities</option>
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {isFiltered && (
          <div className="flex items-center justify-between pt-2 border-t border-[#222226] text-xs">
            <span className="text-zinc-500">
              Showing {filteredTasks.length} of {tasks.length} tasks
            </span>
            <button
              onClick={resetFilters}
              className="text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Filters
            </button>
          </div>
        )}

      </div>

      <TaskList
        tasks={filteredTasks}
        onOpenDetail={onOpenTaskDetail}
        onSubmitClick={onSubmitClick}
        onVerifyClick={onVerifyClick}
        viewMode={viewMode}
      />

    </div>
  );
}
