import React from 'react';
import { StatCards } from '../components/analytics/StatCards';
import { DepartmentChart } from '../components/analytics/DepartmentChart';
import { WorkloadAnalytics } from '../components/analytics/WorkloadAnalytics';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { getDeadlineStatus } from '../utils/deadlineHelper';
import { BarChart3, TrendingUp, CheckCircle, AlertTriangle, Shield, Award } from 'lucide-react';

export function AnalyticsPage() {
  const { tasks } = useTasks();
  const { users } = useAuth();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
  const submittedTasks = tasks.filter(t => t.status === 'SUBMITTED').length;

  const overdueTasks = tasks.filter(t => {
    if (t.status === 'COMPLETED') return false;
    const d = getDeadlineStatus(t.deadline, t.status);
    return d.status === 'overdue';
  }).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Operational Analytics & Performance</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Real-time insights on task completion rates, departmental efficiency, and workload balance
        </p>
      </div>

      {/* Metric Cards */}
      <StatCards />

      {/* Breakdown Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overall Completion</span>
          <span className="text-2xl font-black text-indigo-700 mt-1 block">{completionRate}%</span>
          <p className="text-[11px] text-slate-500 mt-0.5">{completedTasks} of {totalTasks} deliverables</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">In Progress</span>
          <span className="text-2xl font-black text-amber-600 mt-1 block">{inProgressTasks}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Currently active</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">In Review Queue</span>
          <span className="text-2xl font-black text-indigo-600 mt-1 block">{submittedTasks}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Awaiting verification</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs text-center">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Overdue Tasks</span>
          <span className="text-2xl font-black text-rose-600 mt-1 block">{overdueTasks}</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Need immediate escalation</p>
        </div>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DepartmentChart />
        <WorkloadAnalytics />
      </div>

    </div>
  );
}
