import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { Avatar } from '../common/Avatar';
import { Shield, Briefcase, Users, UserCog } from 'lucide-react';

export function HierarchyTree({ onSelectUser, onManageUserRole }) {
  const { users, currentUser } = useAuth();
  const { getUserActiveTaskCount } = useTasks();

  const isPresident = currentUser?.role === 'President';

  const president = users.find(u => u.role === 'President') || users[0];
  const gsList = users.filter(u => u.role === 'GS');
  const leads = users.filter(u => u.role === 'Lead');
  const members = users.filter(u => u.role === 'Member');

  return (
    <div className="p-6 bg-[#111111] rounded-xl border border-[#252525] overflow-x-auto">
      <div className="min-w-[700px] flex flex-col items-center">
        
        {/* Tier 1: President */}
        <div className="flex flex-col items-center">
          <div className="p-4 bg-[#151515] border-2 border-[#D61F36] rounded-xl shadow-lg text-center w-64">
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#B11226] text-white font-extrabold text-[9px] uppercase tracking-wider mb-2">
              <Shield className="w-3 h-3" />
              President / Full Access
            </div>
            <div className="flex items-center justify-center gap-3">
              <Avatar user={president} size="sm" />
              <div className="text-left">
                <h4 className="text-xs font-bold text-white">{president?.name}</h4>
                <p className="text-[10px] text-zinc-400">{president?.email}</p>
              </div>
            </div>
          </div>

          <div className="w-0.5 h-6 bg-[#D61F36]/60 my-1"></div>
        </div>

        {/* Tier 2: GS */}
        <div className="flex flex-col items-center">
          <div className="flex gap-4">
            {gsList.map(gs => (
              <div key={gs.id} className="p-3 bg-[#151515] border border-zinc-700 rounded-xl text-center w-56">
                <div className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-300 font-bold text-[9px] uppercase tracking-wider mb-1.5 border border-zinc-700">
                  <Briefcase className="w-3 h-3 text-red-400" />
                  General Secretary (GS)
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Avatar user={gs} size="xs" />
                  <div className="text-left min-w-0">
                    <h5 className="text-xs font-bold text-zinc-200 truncate">{gs.name}</h5>
                    <p className="text-[9px] text-zinc-500">Task Delegation</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="w-0.5 h-6 bg-zinc-700 my-1"></div>
        </div>

        {/* Tier 3: Department Leads & Sub-members */}
        <div className="w-full">
          <div className="text-center mb-3">
            <span className="px-2.5 py-0.5 bg-[#181818] text-zinc-400 border border-[#252525] rounded text-[10px] font-bold uppercase tracking-wider">
              Department Operations & Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {leads.map(lead => {
              const deptMembers = members.filter(m => m.department === lead.department);

              return (
                <div key={lead.id} className="bg-[#151515] rounded-xl border border-[#252525] p-3.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider bg-zinc-850 text-red-400 rounded border border-zinc-700">
                        {lead.department} Lead
                      </span>
                      {isPresident && (
                        <button
                          onClick={() => onManageUserRole && onManageUserRole(lead)}
                          className="p-1 text-zinc-500 hover:text-white transition-colors"
                          title="Change Role"
                        >
                          <UserCog className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div 
                      onClick={() => onSelectUser && onSelectUser(lead)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[#181818] cursor-pointer mb-2"
                    >
                      <Avatar user={lead} size="xs" />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                        <p className="text-[10px] text-zinc-500">Lead</p>
                      </div>
                    </div>

                    {/* Department Members */}
                    <div className="pt-2 border-t border-[#222226]">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                        Members ({deptMembers.length})
                      </span>
                      
                      <div className="space-y-1">
                        {deptMembers.map(m => (
                          <div
                            key={m.id}
                            onClick={() => onSelectUser && onSelectUser(m)}
                            className="flex items-center justify-between p-1.5 rounded bg-[#181818] hover:bg-[#202020] border border-[#222226] cursor-pointer text-xs"
                          >
                            <span className="text-zinc-300 font-medium truncate text-[11px]">{m.name}</span>
                            <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'active' ? 'bg-emerald-500' : 'bg-zinc-600'}`}></span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
