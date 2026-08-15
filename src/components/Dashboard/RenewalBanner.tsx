import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, ShieldCheck, Zap } from 'lucide-react';

export const RenewalBanner: React.FC = () => {
  const { getDashboardStats, setActiveTab, setSelectedStatusFilter } = useApp();
  const stats = getDashboardStats();

  if (stats.eligibleCount === 0) return null;

  const handleReviewClick = () => {
    setSelectedStatusFilter('Eligible');
    setActiveTab('renewals');
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-5 shadow-lg border border-blue-800/80 relative overflow-hidden">
      {/* Subtle Background Graphic */}
      <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 shrink-0">
            <Zap className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Annual Membership Renewal Action Required</h3>
              <span className="px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-bold bg-amber-500 text-slate-950">
                Window Active
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong className="text-white font-semibold">{stats.eligibleCount} members</strong> are currently within their 7-day anniversary renewal window for the <strong className="text-blue-200">2026–2027 season</strong>. Administrators can perform controlled bulk batch renewals (up to 100 members per batch).
            </p>
          </div>
        </div>

        <button
          onClick={handleReviewClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] shrink-0 border border-blue-400/40"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Review Eligible Members ({stats.eligibleCount})</span>
          <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
};
