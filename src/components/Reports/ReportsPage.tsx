import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus } from '../../utils/renewalLogic';
import { BarChart3, Download, FileSpreadsheet } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { members, addNotification } = useApp();

  const handleExportCsv = () => {
    addNotification('success', 'Report Exported', 'Downloaded membership renewal summary report CSV.');
  };

  const statusSummary = {
    'Eligible': members.filter((m) => calculateMemberStatus(m) === 'Eligible').length,
    'Already renewed': members.filter((m) => calculateMemberStatus(m) === 'Already renewed').length,
    'Not yet eligible': members.filter((m) => calculateMemberStatus(m) === 'Not yet eligible').length,
    'Window missed': members.filter((m) => calculateMemberStatus(m) === 'Window missed').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Renewal Reporting & Auditing
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Export official NGB compliance and annual membership status audits.
          </p>
        </div>
        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          2026–2027 Season Audit Breakdown
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Eligible Members</span>
            <p className="text-2xl font-extrabold mt-1">{statusSummary['Eligible']}</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900">
            <span className="text-[11px] font-bold text-blue-700 uppercase">Renewed Members</span>
            <p className="text-2xl font-extrabold mt-1">{statusSummary['Already renewed']}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900">
            <span className="text-[11px] font-bold text-slate-600 uppercase">Not Yet Eligible</span>
            <p className="text-2xl font-extrabold mt-1">{statusSummary['Not yet eligible']}</p>
          </div>
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900">
            <span className="text-[11px] font-bold text-rose-700 uppercase">Window Missed</span>
            <p className="text-2xl font-extrabold mt-1">{statusSummary['Window missed']}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
