import React from 'react';
import { Settings, Calendar, Layers, ShieldCheck, Info } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            System Configuration & Renewal Rules
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Global governance rules, anniversary window configuration, and bulk limits.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Prototype System Date Setting */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>Prototype Fixed Date</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The platform is fixed to <strong>14 August 2026</strong> as system "today". All member eligibility calculations dynamically evaluate against this anniversary reference date.
          </p>
          <div className="p-3 bg-slate-100 rounded-lg font-mono font-bold text-slate-800">
            TODAY = 2026-08-14
          </div>
        </div>

        {/* 7-Day Window Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Anniversary Renewal Window</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Every member has an individual anniversary registration date. The renewal window is <strong>7 calendar days inclusive</strong> (`Renewal Date - 6 days` to `Renewal Date`).
          </p>
          <div className="p-3 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-lg font-semibold">
            Window Start &lt;= 14 Aug 2026 &lt;= Renewal Date
          </div>
        </div>

        {/* Bulk Action Batch Limit */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Layers className="w-4 h-4 text-indigo-600" />
            <span>Bulk Renewal Limit Enforcement</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            The platform enforces a strict maximum batch limit of <strong>100 members per bulk renewal action</strong> to prevent database timeouts and ensure payment gateway stability.
          </p>
          <div className="p-3 bg-indigo-50 text-indigo-900 border border-indigo-200 rounded-lg font-bold">
            MAX_BATCH_LIMIT = 100 members / batch
          </div>
        </div>

        {/* Organizational Scoping */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <Info className="w-4 h-4 text-amber-600" />
            <span>Authority & Role Hierarchy</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            NGB Admins have unconstrained access to all 4 states and 150 members. State Admins (e.g. Tanvir Ahmed) are scoped strictly to their assigned state (Dhaka State).
          </p>
          <div className="p-3 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg font-semibold">
            NGB &rarr; State &rarr; Club &rarr; Members
          </div>
        </div>
      </div>
    </div>
  );
};
