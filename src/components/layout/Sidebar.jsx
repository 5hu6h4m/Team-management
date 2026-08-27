import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTasks } from '../../context/TaskContext';
import { 
  LayoutDashboard, 
  Users, 
  Network, 
  CheckSquare, 
  Layers, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  Plus
} from 'lucide-react';

export function Sidebar({ activeTab, onNavigate, onOpenCreateTask }) {
  const { currentUser } = useAuth();
  const { tasks } = useTasks();

  const isPresident = currentUser?.role === 'President';
  const isMember = currentUser?.role === 'Member';

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      roles: ['President', 'GS', 'Lead', 'Member'],
      tabKey: 'dashboard'
    },
    {
      id: 'team',
      label: 'Team Directory',
      icon: Users,
      roles: ['President', 'GS', 'Lead', 'Member'],
      tabKey: 'team'
    },
    {
      id: 'hierarchy',
      label: 'Team Hierarchy',
      icon: Network,
      roles: ['President', 'GS', 'Lead', 'Member'],
      tabKey: 'hierarchy'
    },
    {
      id: 'my-tasks',
      label: 'My Tasks',
      icon: CheckSquare,
      roles: ['President', 'GS', 'Lead', 'Member'],
      comingSoon: true,
      tabKey: 'tasks'
    },
    {
      id: 'all-tasks',
      label: 'All Tasks',
      icon: Layers,
      roles: ['President', 'GS', 'Lead'],
      comingSoon: true,
      tabKey: 'tasks'
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      roles: ['President', 'GS', 'Lead', 'Member'],
      comingSoon: true,
      tabKey: 'messages'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      roles: ['President', 'GS', 'Lead'],
      comingSoon: true,
      tabKey: 'analytics'
    },
  ];

  const adminNav = [
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: Settings,
      roles: ['President'],
      tabKey: 'admin'
    }
  ];

  return (
    <aside className="w-60 bg-[#0c0c0e] border-r border-[#252525] min-h-[calc(100vh-3.5rem)] flex flex-col justify-between p-3.5 shrink-0 select-none">
      
      <div className="space-y-5">
        
        {/* Sidebar Brand Header */}
        <div className="px-3 pt-2 pb-1 border-b border-[#1e1e24]">
          <h2 className="text-xs font-black tracking-widest text-white uppercase">
            E-CELL MET
          </h2>
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
            TASKHUB
          </p>
        </div>

        {/* Primary Red CTA Button */}
        {!isMember && (
          <div>
            <button
              onClick={onOpenCreateTask}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-[#B11226] hover:bg-[#D61F36] text-white text-xs font-bold rounded-lg shadow-sm transition-all transform active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>+ Assign Task</span>
            </button>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="space-y-1">
          {navItems
            .filter(item => !item.roles || item.roles.includes(currentUser?.role || 'Member'))
            .map(item => {
              const Icon = item.icon;
              const targetKey = item.tabKey || item.id;
              const isActive = !item.comingSoon && activeTab === targetKey;

              if (item.comingSoon) {
                return (
                  <div
                    key={item.id}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-zinc-600 cursor-not-allowed select-none opacity-60"
                    title="Coming soon in next release"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-3.5 h-3.5 text-zinc-600" />
                      <span className="text-zinc-500">{item.label}</span>
                    </div>
                    <span className="px-1.5 py-0.2 text-[9px] font-semibold bg-[#161616] text-zinc-600 rounded border border-[#222226]">
                      Soon
                    </span>
                  </div>
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(targetKey)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'nav-item-active font-bold text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#151515] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
        </nav>

        {/* Management Section (President only) */}
        {isPresident && (
          <div className="pt-3 border-t border-[#1e1e24] space-y-1">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
              Management
            </p>
            {adminNav.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === 'admin';
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate('admin')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all ${
                    isActive
                      ? 'nav-item-active font-bold text-white'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#151515] font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-400' : 'text-zinc-500'}`} />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* User Footer */}
      <div className="pt-3 border-t border-[#1e1e24] px-2 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-zinc-200 truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold truncate">
              {currentUser?.role === 'GS' ? 'General Secretary' : currentUser?.role}
            </p>
          </div>
        </div>
      </div>

    </aside>
  );
}
