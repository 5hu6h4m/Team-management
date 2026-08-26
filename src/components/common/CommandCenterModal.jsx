import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  UserPlus, 
  MessageSquare, 
  AlertTriangle, 
  Users, 
  Layers, 
  Search, 
  X,
  Sparkles,
  Command
} from 'lucide-react';

export function CommandCenterModal({ 
  isOpen, 
  onClose, 
  onAssignTask, 
  onAddMember, 
  onNavigate 
}) {
  const [search, setSearch] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'assign',
      label: 'Assign New Task',
      desc: 'Create task with assignee, workload & deadline',
      icon: Plus,
      color: 'text-red-400 bg-red-950/40 border-red-800/40',
      action: () => { onClose(); onAssignTask(); }
    },
    {
      id: 'member',
      label: 'Add Team Member',
      desc: 'Invite new member to department roster',
      icon: UserPlus,
      color: 'text-zinc-300 bg-zinc-800 border-zinc-700',
      action: () => { onClose(); onAddMember(); }
    },
    {
      id: 'message',
      label: 'Send Direct Message',
      desc: 'Quick 1-on-1 team communication',
      icon: MessageSquare,
      color: 'text-zinc-300 bg-zinc-800 border-zinc-700',
      action: () => { onClose(); onNavigate('messages'); }
    },
    {
      id: 'overdue',
      label: 'View Overdue Tasks',
      desc: 'Inspect delayed tasks requiring attention',
      icon: AlertTriangle,
      color: 'text-red-400 bg-red-950/40 border-red-800/40',
      action: () => { onClose(); onNavigate('tasks'); }
    },
    {
      id: 'available',
      label: 'View Available Members',
      desc: 'Find free team members with 0 active tasks',
      icon: Users,
      color: 'text-emerald-400 bg-emerald-950/30 border-emerald-800/40',
      action: () => { onClose(); onNavigate('team'); }
    }
  ];

  const filtered = actions.filter(a => 
    a.label.toLowerCase().includes(search.toLowerCase()) || 
    a.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-[#111111] border border-[#252525] rounded-2xl shadow-2xl overflow-hidden z-10">
        
        {/* Search header */}
        <div className="p-4 border-b border-[#252525] flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-400" />
          <input
            type="text"
            autoFocus
            placeholder="Type a command or search action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
          <kbd className="px-1.5 py-0.5 text-[10px] text-zinc-400 bg-zinc-800 border border-zinc-700 rounded">ESC</kbd>
        </div>

        {/* Action List */}
        <div className="p-2 max-h-80 overflow-y-auto space-y-1">
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
            Quick Command Actions
          </p>
          {filtered.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#181818] border border-transparent hover:border-[#252525] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-200 group-hover:text-white">{item.label}</p>
                    <p className="text-[11px] text-zinc-500">{item.desc}</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-600 group-hover:text-red-400 transition-colors font-bold">↵</span>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
