import React from 'react';
import { Clock, PlayCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export function StatusBadge({ status, size = 'sm' }) {
  const config = {
    PENDING: {
      label: 'Pending',
      bgClass: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      dotClass: 'bg-zinc-500',
      icon: Clock
    },
    IN_PROGRESS: {
      label: 'In Progress',
      bgClass: 'bg-zinc-800/90 text-zinc-100 border-zinc-700',
      dotClass: 'bg-white',
      icon: PlayCircle
    },
    SUBMITTED: {
      label: 'Submitted (Review)',
      bgClass: 'bg-red-950/20 text-red-400 border-red-500/50 ring-1 ring-red-500/20',
      dotClass: 'bg-red-500 animate-pulse',
      icon: Send
    },
    COMPLETED: {
      label: 'Completed',
      bgClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40',
      dotClass: 'bg-emerald-500',
      icon: CheckCircle2
    }
  };

  const current = config[status] || config.PENDING;
  const Icon = current.icon;
  const sizeClasses = size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${current.bgClass} ${sizeClasses}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${current.dotClass}`}></span>
      <Icon className="w-3 h-3" />
      {current.label}
    </span>
  );
}
