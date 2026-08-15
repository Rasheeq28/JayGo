import React from 'react';
import { useApp } from '../../context/AppContext';
import { KpiCards } from './KpiCards';
import { RenewalBanner } from './RenewalBanner';
import { AnalyticsCharts } from './AnalyticsCharts';
import { ChevronRight, Lock } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { role, setActiveTab, setSelectedStatusFilter } = useApp();

  return (
    <div className="space-y-6">
      {/* Dashboard Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {role === 'NGB Admin' ? 'NGB Overview' : 'Dhaka State Overview'}
            </h1>
            <span className="px-2.5 py-1 rounded-md bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
              {role}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {role === 'NGB Admin'
              ? 'Centralized administration & organizational annual membership renewal control room.'
              : 'State-scoped membership & renewal control dashboard for Dhaka State.'}
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedStatusFilter('Eligible');
              setActiveTab('renewals');
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-colors"
          >
            <span>Manage Renewals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Notice for State Admin */}
      {role === 'State Admin' && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>State Authority Active:</strong> You are logged in as <strong>Tanvir Ahmed (State Admin)</strong>. Data is automatically filtered to <strong>Dhaka State</strong> (3 clubs, 47 members). Other states are restricted.
            </span>
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <KpiCards />

      {/* Renewal Action Required Alert Banner */}
      <RenewalBanner />

      {/* Analytics Charts & Graphs */}
      <AnalyticsCharts />
    </div>
  );
};
