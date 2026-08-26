import React from 'react';
import { AlertOctagon, Flame, ShieldAlert, ArrowDown } from 'lucide-react';

export function PriorityBadge({ priority, size = 'sm' }) {
  const config = {
    Urgent: {
      label: 'URGENT',
      bgClass: 'bg-red-950/40 text-red-400 border-red-800/60 ring-1 ring-red-500/20 font-bold',
      icon: AlertOctagon
    },
    High: {
      label: 'HIGH',
      bgClass: 'bg-zinc-850 text-red-400 border-zinc-700/60 font-semibold',
      icon: Flame
    },
    Medium: {
      label: 'MEDIUM',
      bgClass: 'bg-zinc-900 text-zinc-300 border-zinc-800',
      icon: ShieldAlert
    },
    Low: {
      label: 'LOW',
      bgClass: 'bg-zinc-900 text-zinc-500 border-zinc-850',
      icon: ArrowDown
    }
  };

  const current = config[priority] || config.Medium;
  const sizeClasses = size === 'xs' ? 'px-1.5 py-0.5 text-[9px]' : 'px-2 py-0.5 text-[10px]';

  return (
    <span className={`inline-flex items-center gap-1 uppercase tracking-wider rounded border ${current.bgClass} ${sizeClasses}`}>
      {current.label}
    </span>
  );
}
