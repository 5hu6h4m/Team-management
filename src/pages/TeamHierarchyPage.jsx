import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { Avatar } from '../components/common/Avatar';
import { Modal } from '../components/common/Modal';
import { getWorkloadStatus } from '../utils/deadlineHelper';
import { 
  Shield, 
  Briefcase, 
  Users, 
  GraduationCap, 
  UserPlus, 
  Crown, 
  ChevronRight,
  Layers,
  ChevronDown
} from 'lucide-react';

export function TeamHierarchyPage({ onSelectUser, onOpenAdminAddMember }) {
  const { users, currentUser } = useAuth();
  const { departments, getUserActiveTaskCount } = useTasks();

  // State to view members of a specific department in a clean modal
  const [viewingDeptMembers, setViewingDeptMembers] = useState(null);

  const isPresident = currentUser?.role === 'President';

  const president = users.find(u => u.role === 'President') || users[0];
  const gsList = users.filter(u => u.role === 'GS' || u.role === 'General Secretary');

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#222226] pb-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Team Hierarchy & Department Rosters
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Full organization view: Executive Leadership ➔ Department Leads ➔ Team Members
          </p>
        </div>

        {isPresident && (
          <button
            onClick={onOpenAdminAddMember}
            className="px-3.5 py-1.5 bg-[#B11226] hover:bg-[#D61F36] text-white rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ Add Member / Leader</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* TIER 1: EXECUTIVE COMMAND (PRESIDENT & GS) */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Executive Leadership ({1 + gsList.length})</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* President Card */}
          {president && (
            <div 
              onClick={() => onSelectUser && onSelectUser(president)}
              className="p-4 bg-[#141414] border-2 border-red-800/60 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-red-600 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar user={president} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.2 text-[9px] font-extrabold uppercase bg-[#B11226] text-white rounded">
                      President
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors truncate">
                    {president.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">{president.email}</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3 h-3 text-red-400" />
                    <span>{president.branch} ({president.year})</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Command</span>
                <span className="text-xs text-red-400 font-mono font-bold">Admin</span>
              </div>
            </div>
          )}

          {/* General Secretary Card */}
          {gsList.map(gs => (
            <div 
              key={gs.id}
              onClick={() => onSelectUser && onSelectUser(gs)}
              className="p-4 bg-[#141414] border border-amber-800/50 rounded-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-amber-600 transition-all group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Avatar user={gs} size="md" />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="px-2 py-0.2 text-[9px] font-extrabold uppercase bg-amber-950 text-amber-300 border border-amber-800/60 rounded">
                      General Secretary
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors truncate">
                    {gs.name}
                  </h3>
                  <p className="text-[11px] text-zinc-400 truncate">{gs.email}</p>
                  <p className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                    <GraduationCap className="w-3 h-3 text-amber-400" />
                    <span>{gs.branch} ({gs.year})</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-[10px] uppercase font-bold text-zinc-500 block">Coordination</span>
                <span className="text-xs text-amber-300 font-mono font-bold">Delegation</span>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* ========================================================= */}
      {/* TIER 2: DEPARTMENT ROSTERS */}
      {/* ========================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-zinc-400" />
            <span>Department Rosters & Leads ({departments.length})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {departments.map(dept => {
            const deptNameLower = dept.name.toLowerCase();

            // Find Lead in this department (matches role lead/department lead or mohit borse in design)
            const deptLead = users.find(u => {
              const uRole = (u.role || '').toLowerCase();
              const isLead = uRole === 'lead' || uRole === 'department lead' || uRole.includes('lead');
              const uDept = (u.department || '').toLowerCase();
              const isDept = uDept === deptNameLower || uDept.includes(deptNameLower) || deptNameLower.includes(uDept);
              return (isLead && isDept) || (deptNameLower.includes('design') && u.name?.toLowerCase().includes('mohit'));
            });

            // Find all members in this department (excluding Lead, President, GS)
            const deptMembers = users.filter(u => {
              if (u.id === deptLead?.id || u.role === 'President' || u.role === 'GS' || u.role === 'General Secretary') return false;
              const uDept = (u.department || '').toLowerCase();
              return uDept === deptNameLower || uDept.includes(deptNameLower) || deptNameLower.includes(uDept);
            });

            const totalTeamCount = (deptLead ? 1 : 0) + deptMembers.length;

            return (
              <div
                key={dept.id}
                className="bg-[#141414] rounded-2xl border border-[#222226] overflow-hidden flex flex-col justify-between"
              >
                {/* Department Header */}
                <div className="p-4 bg-[#181818] border-b border-[#222226] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      {dept.name} Team
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#141414] text-zinc-300 rounded border border-[#252525]">
                    {totalTeamCount} {totalTeamCount === 1 ? 'Person' : 'People'}
                  </span>
                </div>

                <div className="p-4 space-y-4 flex-1">
                  
                  {/* Lead Section */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1.5">
                      Department Lead
                    </span>

                    {deptLead ? (
                      <div
                        onClick={() => onSelectUser && onSelectUser(deptLead)}
                        className="p-3 bg-[#181818] rounded-xl border border-purple-900/40 hover:border-purple-600/60 cursor-pointer transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar user={deptLead} size="sm" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-white truncate">{deptLead.name}</span>
                              <span className="px-1.5 py-0.2 text-[8px] font-extrabold uppercase bg-purple-950 text-purple-300 border border-purple-800/40 rounded">
                                Lead
                              </span>
                            </div>
                            <p className="text-[10px] text-zinc-400 truncate">{deptLead.email}</p>
                            <p className="text-[9px] text-zinc-500">{deptLead.branch} ({deptLead.year})</p>
                          </div>
                        </div>

                        <span className="text-[10px] text-purple-300 font-mono shrink-0">
                          {getUserActiveTaskCount(deptLead.id)} Active Tasks
                        </span>
                      </div>
                    ) : (
                      <div className="p-3 bg-[#181818]/60 rounded-xl border border-dashed border-[#282828] text-center text-zinc-500 text-xs">
                        No Lead assigned to {dept.name} yet.
                      </div>
                    )}
                  </div>

                  {/* Members Clickable Count */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setViewingDeptMembers({ deptName: dept.name, members: deptMembers })}
                      className="w-full p-2.5 bg-[#181818] hover:bg-[#202020] rounded-xl border border-[#222226] text-left transition-all flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-xs font-semibold text-zinc-300">
                          Team Members: <strong className="text-white">{deptMembers.length}</strong>
                        </span>
                      </div>

                      <span className="text-[10px] text-red-400 hover:text-red-300 font-bold flex items-center gap-1">
                        <span>Click to view</span>
                        <ChevronRight className="w-3 h-3" />
                      </span>
                    </button>
                  </div>

                </div>

                {/* Card Footer: Add Member Action */}
                {isPresident && (
                  <div className="p-3 bg-[#161616] border-t border-[#222226] flex justify-end">
                    <button
                      onClick={onOpenAdminAddMember}
                      className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"
                    >
                      + Add to {dept.name} →
                    </button>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: VIEW DEPARTMENT MEMBERS ON CLICK */}
      {viewingDeptMembers && (
        <Modal
          isOpen={Boolean(viewingDeptMembers)}
          onClose={() => setViewingDeptMembers(null)}
          title={`${viewingDeptMembers.deptName} Team Members (${viewingDeptMembers.members.length})`}
          subtitle={`All team members assigned to ${viewingDeptMembers.deptName}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3">
            {viewingDeptMembers.members.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs bg-[#181818] rounded-xl border border-[#252525]">
                No members currently assigned to {viewingDeptMembers.deptName} Team.
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                {viewingDeptMembers.members.map(m => {
                  const activeTasks = getUserActiveTaskCount(m.id);
                  const workload = getWorkloadStatus(activeTasks);

                  return (
                    <div
                      key={m.id}
                      onClick={() => {
                        setViewingDeptMembers(null);
                        onSelectUser && onSelectUser(m);
                      }}
                      className="p-3 bg-[#181818] hover:bg-[#222222] rounded-xl border border-[#252525] cursor-pointer transition-all flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar user={m} size="xs" />
                        <div className="min-w-0">
                          <p className="font-bold text-white truncate">{m.name}</p>
                          <p className="text-[10px] text-zinc-500 truncate">{m.branch} ({m.year})</p>
                        </div>
                      </div>

                      <span className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                        workload.level === 'OVERLOADED' ? 'text-red-400' :
                        workload.level === 'BUSY' ? 'text-orange-400' : 'text-zinc-400'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${workload.dotClass}`}></span>
                        {activeTasks} Active Tasks
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex justify-end pt-2 border-t border-[#252525]">
              <button
                type="button"
                onClick={() => setViewingDeptMembers(null)}
                className="px-4 py-1.5 bg-[#1e1e24] hover:bg-[#282830] text-zinc-200 text-xs font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

    </div>
  );
}
