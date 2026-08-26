import React from 'react';
import { getWorkloadStatus } from '../../utils/deadlineHelper';

export function WorkloadBadge({ activeTaskCount, showCount = true, size = 'sm' }) {
  const workload = getWorkloadStatus(activeTaskCount || 0);

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-md border ${workload.bgClass} ${size === 'xs' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${workload.dotClass}`}></span>
      <span>{workload.label}</span>
      {showCount && (
        <span className="ml-0.5 text-zinc-400 font-normal text-[11px]">
          ({activeTaskCount || 0})
        </span>
      )}
    </span>
  );
}
