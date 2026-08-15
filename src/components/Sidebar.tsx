import React from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Users,
  RefreshCw,
  Building2,
  Trophy,
  BarChart3,
  Settings,
  Lock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  highlight?: boolean;
  restricted?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, role, getDashboardStats } = useApp();
  const stats = getDashboardStats();

  const navItems: NavGroup[] = [
    {
      group: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard }
      ]
    },
    {
      group: 'MEMBERS',
      items: [
        { id: 'members', label: 'Members', icon: Users, badge: stats.totalMembers },
        { id: 'renewals', label: 'Renewals', icon: RefreshCw, badge: stats.eligibleCount, highlight: true }
      ]
    },
    {
      group: 'ORGANIZATION',
      items: [
        { id: 'states', label: 'States', icon: Building2, restricted: role === 'State Admin' },
        { id: 'clubs', label: 'Clubs', icon: Trophy }
      ]
    },
    {
      group: 'REPORTING',
      items: [
        { id: 'reports', label: 'Reports', icon: BarChart3 }
      ]
    },
    {
      group: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between min-h-[calc(100vh-61px)] select-none">
      <div className="p-4 space-y-6">
        {navItems.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              {group.group}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRestricted = item.restricted;

              return (
                <button
                  key={item.id}
                  onClick={() => !isRestricted && setActiveTab(item.id)}
                  disabled={isRestricted}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/30'
                      : isRestricted
                      ? 'opacity-40 cursor-not-allowed text-slate-500'
                      : 'hover:bg-slate-800/80 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : item.highlight ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {isRestricted ? (
                    <span title="Restricted to NGB Admin">
                      <Lock className="w-3.5 h-3.5 text-slate-500" />
                    </span>
                  ) : item.badge !== undefined && item.badge > 0 ? (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.highlight
                          ? 'bg-emerald-500 text-white animate-pulse'
                          : isActive
                          ? 'bg-blue-700 text-blue-100'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Scope Status Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40">
        <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/60 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            {role === 'NGB Admin' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>NGB Scope: Full Org</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>State Scope: Dhaka State</span>
              </>
            )}
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            {role === 'NGB Admin'
              ? 'Authorized to manage all 4 states & 150 members.'
              : 'Scoped to 3 Dhaka clubs & assigned members only.'}
          </p>
        </div>
      </div>
    </aside>
  );
};
