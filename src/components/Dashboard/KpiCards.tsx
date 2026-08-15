import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, CheckCircle2, Clock, CalendarX, Sparkles } from 'lucide-react';

export const KpiCards: React.FC = () => {
  const { getDashboardStats, setActiveTab, setSelectedStatusFilter } = useApp();
  const stats = getDashboardStats();

  const handleKpiClick = (statusFilter: string) => {
    setSelectedStatusFilter(statusFilter);
    setActiveTab('renewals');
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Members */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Members</span>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{stats.totalMembers}</span>
          <span className="text-xs text-slate-500 font-medium">100% active org</span>
        </div>
      </div>

      {/* Eligible for Renewal */}
      <div
        onClick={() => handleKpiClick('Eligible')}
        className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 rounded-xl border border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
            Eligible
          </span>
          <div className="p-2 rounded-lg bg-emerald-600 text-white shadow-sm group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-emerald-900">{stats.eligibleCount}</span>
          <span className="text-[11px] font-semibold text-emerald-700 underline group-hover:text-emerald-900">
            Manage &rarr;
          </span>
        </div>
      </div>

      {/* Already Renewed */}
      <div
        onClick={() => handleKpiClick('Already renewed')}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">Already Renewed</span>
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">{stats.alreadyRenewedCount}</span>
          <span className="text-xs text-slate-400 font-medium">2026–2027</span>
        </div>
      </div>

      {/* Not Yet Eligible */}
      <div
        onClick={() => handleKpiClick('Not yet eligible')}
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Not Yet Eligible</span>
          <div className="p-2 rounded-lg bg-slate-100 text-slate-500">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-slate-900">{stats.notYetEligibleCount}</span>
          <span className="text-xs text-slate-400 font-medium">Future window</span>
        </div>
      </div>

      {/* Window Missed */}
      <div
        onClick={() => handleKpiClick('Window missed')}
        className="bg-rose-50/50 p-4 rounded-xl border border-rose-200/80 shadow-sm hover:shadow-md hover:border-rose-300 transition-all cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">Window Missed</span>
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
            <CalendarX className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl font-bold text-rose-900">{stats.windowMissedCount}</span>
          <span className="text-xs text-rose-600 font-medium">Action required</span>
        </div>
      </div>
    </div>
  );
};
