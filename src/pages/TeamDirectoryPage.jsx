import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { MemberCard } from '../components/team/MemberCard';
import { getWorkloadStatus } from '../utils/deadlineHelper';
import { Search, UserPlus, FilterX } from 'lucide-react';

export function TeamDirectoryPage({ onSelectUser, onMessageUser, onOpenAdminAddMember }) {
  const { users, currentUser } = useAuth();
  const { getUserActiveTaskCount, departments } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedWorkload, setSelectedWorkload] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');

  const isPresident = currentUser?.role === 'President';

  const filteredUsers = useMemo(() => {
    return users.filter(u => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesDept = (u.department || '').toLowerCase().includes(q);
        const matchesRole = (u.role || '').toLowerCase().includes(q);
        const matchesEmail = (u.email || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDept && !matchesRole && !matchesEmail) return false;
      }

      // Department filter (Case-insensitive & relaxed match)
      if (selectedDept !== 'ALL') {
        if (!u.department) return false;
        const uDept = u.department.toLowerCase().trim();
        const sDept = selectedDept.toLowerCase().trim();
        if (!uDept.includes(sDept) && !sDept.includes(uDept)) return false;
      }

      // Role filter (Case-insensitive & relaxed match)
      if (selectedRole !== 'ALL') {
        const uRole = (u.role || '').toLowerCase().trim();
        const sRole = selectedRole.toLowerCase().trim();

        if (sRole === 'lead') {
          if (uRole !== 'lead' && uRole !== 'department lead') return false;
        } else if (sRole === 'member') {
          if (uRole !== 'member' && uRole !== 'team member') return false;
        } else if (sRole === 'gs') {
          if (uRole !== 'gs' && uRole !== 'general secretary') return false;
        } else {
          if (uRole !== sRole) return false;
        }
      }

      // Workload filter
      if (selectedWorkload !== 'ALL') {
        const activeCount = getUserActiveTaskCount(u.id);
        const status = getWorkloadStatus(activeCount);
        if (status.level !== selectedWorkload) return false;
      }

      return true;
    });
  }, [users, searchQuery, selectedDept, selectedRole, selectedWorkload, getUserActiveTaskCount]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedDept('ALL');
    setSelectedWorkload('ALL');
    setSelectedRole('ALL');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252525] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Team Directory</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Members bandwidth, active workload, and department assignments
          </p>
        </div>

        {isPresident && (
          <button
            onClick={onOpenAdminAddMember}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Member</span>
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-[#151515] p-4 rounded-xl border border-[#252525] space-y-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member by name, department, role, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-[#222226]">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Workload Status
            </label>
            <select
              value={selectedWorkload}
              onChange={(e) => setSelectedWorkload(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Workload Levels</option>
              <option value="AVAILABLE">Available (0 tasks)</option>
              <option value="NORMAL">Normal (1-3 tasks)</option>
              <option value="BUSY">Busy (4-5 tasks)</option>
              <option value="OVERLOADED">Overloaded (6+ tasks)</option>
            </select>
          </div>

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
              <option value="Executive">Executive</option>
              {departments.map(d => (
                <option key={d.id} value={d.name}>{d.name} Team</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
              Role / Position
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs bg-[#181818] border border-[#252525] rounded-lg text-zinc-200 focus:outline-none"
            >
              <option value="ALL">All Roles</option>
              <option value="President">President</option>
              <option value="GS">General Secretary (GS)</option>
              <option value="Lead">Department Lead</option>
              <option value="Member">Team Member</option>
            </select>
          </div>
        </div>
      </div>

      {/* Member Cards Grid */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center bg-[#141414] rounded-2xl border border-dashed border-[#252525] space-y-3">
          <p className="text-xs text-zinc-400">No members matched the selected filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="px-3 py-1.5 bg-[#1e1e24] hover:bg-[#282830] text-zinc-200 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
          >
            <FilterX className="w-3.5 h-3.5" />
            <span>Reset Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredUsers.map(user => (
            <MemberCard
              key={user.id}
              user={user}
              onSelect={() => onSelectUser && onSelectUser(user)}
              onMessage={() => onMessageUser && onMessageUser(user.id)}
            />
          ))}
        </div>
      )}

    </div>
  );
}
