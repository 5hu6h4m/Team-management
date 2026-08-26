/**
 * Helper to calculate deadline status based on date difference and task completion
 * Uses clean dark institutional aesthetic with red accents for alerts.
 */
export function getDeadlineStatus(deadlineStr, taskStatus) {
  if (taskStatus === 'COMPLETED') {
    return {
      status: 'completed',
      label: 'Completed',
      color: 'emerald',
      bgClass: 'bg-emerald-950/30 text-emerald-400 border-emerald-800/40',
      dotClass: 'bg-emerald-500',
      icon: 'CheckCircle2'
    };
  }

  if (!deadlineStr) {
    return {
      status: 'no_deadline',
      label: 'No Deadline',
      color: 'zinc',
      bgClass: 'bg-zinc-900 text-zinc-400 border-zinc-800',
      dotClass: 'bg-zinc-500',
      icon: 'Clock'
    };
  }

  const deadline = new Date(deadlineStr);
  const now = new Date();
  const diffMs = deadline.getTime() - now.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);

  if (diffMs < 0) {
    const overdueDays = Math.ceil(Math.abs(diffHours) / 24);
    return {
      status: 'overdue',
      label: `Overdue by ${overdueDays}d`,
      shortLabel: 'Overdue',
      color: 'red',
      bgClass: 'bg-red-950/40 text-red-400 border-red-800/60',
      dotClass: 'bg-red-500 animate-pulse',
      icon: 'AlertCircle',
      overdueDays
    };
  } else if (diffHours <= 24) {
    const hoursLeft = Math.max(1, Math.round(diffHours));
    return {
      status: 'due_soon',
      label: `Due in ${hoursLeft}h`,
      shortLabel: 'Due Soon',
      color: 'amber',
      bgClass: 'bg-amber-950/30 text-amber-300 border-amber-800/40',
      dotClass: 'bg-amber-400',
      icon: 'AlertTriangle',
      hoursLeft
    };
  } else {
    const daysLeft = Math.ceil(diffHours / 24);
    return {
      status: 'on_track',
      label: `${daysLeft} days left`,
      shortLabel: 'On Track',
      color: 'zinc',
      bgClass: 'bg-zinc-900 text-zinc-300 border-zinc-800',
      dotClass: 'bg-emerald-500',
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
