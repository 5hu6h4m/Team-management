/**
 * Helper to calculate deadline status based on date difference and task completion
 * Supports granular urgency levels (Hot Red, Approaching, Calm, Overdue).
 */
export function getDeadlineStatus(deadlineStr, taskStatus) {
  if (taskStatus === 'COMPLETED') {
    return {
      status: 'completed',
      urgencyLevel: 'COMPLETED',
      label: 'Completed',
      shortLabel: 'Done',
      color: 'emerald',
      bgClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40',
      dotClass: 'bg-emerald-500',
      cardStyle: 'border-emerald-900/30 hover:border-emerald-700/50 bg-[#101512]',
      icon: 'CheckCircle2'
    };
  }

  if (!deadlineStr) {
    return {
      status: 'no_deadline',
      urgencyLevel: 'CALM',
      label: 'No Deadline',
      shortLabel: 'No Date',
      color: 'zinc',
      bgClass: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      dotClass: 'bg-zinc-500',
      cardStyle: 'border-[#222226] hover:border-[#353535] bg-[#141416]',
      icon: 'Clock'
    };
  }

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    const overdueDays = Math.max(1, Math.ceil(Math.abs(diffHours) / 24));
    return {
      status: 'overdue',
      urgencyLevel: 'OVERDUE',
      label: `Overdue by ${overdueDays}d`,
      shortLabel: 'Overdue',
      color: 'red',
      bgClass: 'bg-red-950/80 text-red-300 border-red-500/80 ring-1 ring-red-500/50',
      dotClass: 'bg-red-500 animate-ping',
      cardStyle: 'border-red-600/80 bg-gradient-to-b from-[#240a0e] to-[#14080a] shadow-[0_0_25px_rgba(220,38,38,0.25)] ring-1 ring-red-500/40',
      icon: 'AlertCircle',
      overdueDays
    };
  } else if (diffHours <= 24) {
    const hoursLeft = Math.max(1, Math.round(diffHours));
    return {
      status: 'due_today',
      urgencyLevel: 'HOT_RED',
      label: `Due in ${hoursLeft}h (Today!)`,
      shortLabel: `${hoursLeft}h Left`,
      color: 'red',
      bgClass: 'bg-red-600 text-white font-bold animate-pulse shadow-md',
      dotClass: 'bg-red-400 animate-ping',
      cardStyle: 'border-red-500/90 bg-gradient-to-b from-[#280c10] via-[#1a0c0e] to-[#12090b] shadow-[0_0_24px_rgba(239,68,68,0.35)] ring-1 ring-red-500/60',
      icon: 'Flame',
      hoursLeft
    };
  } else if (diffHours <= 72) {
    const daysLeft = Math.ceil(diffHours / 24);
    return {
      status: 'due_soon',
      urgencyLevel: 'APPROACHING',
      label: `Due in ${daysLeft} days`,
      shortLabel: `${daysLeft}d left`,
      color: 'amber',
      bgClass: 'bg-amber-950/50 text-amber-300 border-amber-600/50',
      dotClass: 'bg-amber-400',
      cardStyle: 'border-amber-700/50 hover:border-amber-600/70 bg-gradient-to-b from-[#1c1510] to-[#131114] shadow-[0_0_15px_rgba(245,158,11,0.1)]',
      icon: 'AlertTriangle',
      daysLeft
    };
  } else {
    const daysLeft = Math.ceil(diffHours / 24);
    return {
      status: 'on_track',
      urgencyLevel: 'CALM',
      label: `${daysLeft} days left`,
      shortLabel: `${daysLeft}d`,
      color: 'zinc',
      bgClass: 'bg-zinc-900 text-zinc-300 border-zinc-800',
      dotClass: 'bg-emerald-500',
      cardStyle: 'border-[#222226] hover:border-[#353535] bg-[#141416]',
      icon: 'Clock',
      daysLeft
    };
  }
}

export function formatDeadline(dateStr) {
  if (!dateStr) return 'No deadline';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTimeAgo(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function getWorkloadStatus(activeCount) {
  if (activeCount === 0) {
    return {
      level: 'AVAILABLE',
      label: 'Available',
      color: 'emerald',
      bgClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40',
      dotClass: 'bg-emerald-500',
    };
  } else if (activeCount <= 3) {
    return {
      level: 'NORMAL',
      label: 'Normal',
      color: 'amber',
      bgClass: 'bg-zinc-850 text-zinc-300 border-zinc-700/50',
      dotClass: 'bg-amber-400',
    };
  } else if (activeCount <= 5) {
    return {
      level: 'BUSY',
      label: 'Busy',
      color: 'orange',
      bgClass: 'bg-orange-950/30 text-orange-400 border-orange-800/40',
      dotClass: 'bg-orange-500',
    };
  } else {
    return {
      level: 'OVERLOADED',
      label: 'Overloaded',
      color: 'red',
      bgClass: 'bg-red-950/40 text-red-400 border-red-800/60 ring-1 ring-red-500/30',
      dotClass: 'bg-red-500 animate-pulse',
    };
  }
}
