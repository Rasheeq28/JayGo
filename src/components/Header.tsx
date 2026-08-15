import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Search, Bell, RotateCcw, Calendar, ChevronDown, Check, Lock, UserCheck } from 'lucide-react';
import type { RoleType } from '../types';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    userPersona,
    searchQuery,
    setSearchQuery,
    resetDemoData,
    notifications,
    setActiveTab
  } = useApp();

  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const handleRoleChange = (newRole: RoleType) => {
    setRole(newRole);
    setRoleDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Brand & Organization Title */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield className="w-5 h-5 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl tracking-tight text-white">JustGo</span>
                <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-semibold rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  {role}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {role === 'NGB Admin' ? 'Bangladesh Swimming Federation' : 'Dhaka State Swimming Association'}
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by member ID, name, club, or state..."
              className="w-full bg-slate-800/90 text-slate-200 placeholder-slate-400 text-xs rounded-lg left-0 pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Right Section: System Date, Demo Controls, Role Switcher, Profile */}
        <div className="flex items-center gap-3">
          {/* Prototype Fixed Date Display */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            <span>Today: <strong className="text-white font-semibold">14 Aug 2026</strong></span>
          </div>

          {/* Reset Demo State Button */}
          <button
            onClick={resetDemoData}
            title="Reset dataset back to original 150 members"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Reset Demo Data</span>
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors relative"
            >
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 text-slate-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center bg-slate-850">
                  <span className="font-semibold text-xs text-white">Notifications</span>
                  <span className="text-[10px] text-slate-400 font-mono">{notifications.length} active</span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-700/60">
                  {notifications.map((n) => (
                    <div key={n.id} className="p-3 hover:bg-slate-750 transition-colors">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-xs text-blue-300">{n.title}</span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* PROTOTYPE REQUIREMENT: ROLE SWITCHER DROPDOWN */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all border border-blue-400/30"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>View as: <strong>{role}</strong></span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
                <div className="px-4 py-2.5 bg-slate-850 border-b border-slate-700">
                  <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Switch Persona / Authority</p>
                </div>
                
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => handleRoleChange('NGB Admin')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                      role === 'NGB Admin' ? 'bg-blue-600/30 text-white border border-blue-500/40' : 'hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded bg-blue-500/20 text-blue-400">
                      <Shield className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">NGB Admin</span>
                        {role === 'NGB Admin' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Sarah Rahman (Full Access: All 4 States)</p>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleChange('State Admin')}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-start gap-3 transition-colors ${
                      role === 'State Admin' ? 'bg-blue-600/30 text-white border border-blue-500/40' : 'hover:bg-slate-700/60 text-slate-300'
                    }`}
                  >
                    <div className="mt-0.5 p-1 rounded bg-amber-500/20 text-amber-400">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white">State Admin</span>
                        {role === 'State Admin' && <Check className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">Tanvir Ahmed (Dhaka State Only)</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar */}
          <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
            <img
              src={userPersona.avatar}
              alt={userPersona.name}
              className="w-8 h-8 rounded-full border-2 border-blue-500/60 object-cover"
            />
            <div className="hidden xl:block text-left">
              <p className="text-xs font-semibold text-white leading-tight">{userPersona.name}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{userPersona.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
