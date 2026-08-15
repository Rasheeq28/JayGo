import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus } from '../../utils/renewalLogic';
import { Building2, Lock } from 'lucide-react';

export const StatesPage: React.FC = () => {
  const { states, members, role, setSelectedState, setActiveTab } = useApp();

  const handleStateClick = (stateId: string) => {
    if (role === 'State Admin' && stateId !== 'ST001') return;
    setSelectedState(stateId);
    setActiveTab('renewals');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-indigo-600" />
            State Associations Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Regional state governing bodies under the National Governing Body (NGB).
          </p>
        </div>
      </div>

      {/* Grid of States */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {states.map((st) => {
          const stateMembers = members.filter((m) => m.state_id === st.state_id);
          const eligibleCount = stateMembers.filter((m) => calculateMemberStatus(m) === 'Eligible').length;
          const renewedCount = stateMembers.filter((m) => calculateMemberStatus(m) === 'Already renewed').length;
          const isRestricted = role === 'State Admin' && st.state_id !== 'ST001';

          return (
            <div
              key={st.state_id}
              onClick={() => handleStateClick(st.state_id)}
              className={`p-5 rounded-2xl border transition-all ${
                isRestricted
                  ? 'bg-slate-100/60 border-slate-200 opacity-60 cursor-not-allowed'
                  : 'bg-white border-slate-200 hover:shadow-md hover:border-blue-300 cursor-pointer'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 font-extrabold text-sm flex items-center justify-center border border-indigo-200">
                    {st.code}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{st.state_name}</h3>
                    <p className="text-xs text-slate-500">{st.club_count} Registered Clubs</p>
                  </div>
                </div>

                {isRestricted ? (
                  <span className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-200 text-slate-600">
                    <Lock className="w-3 h-3" /> Restricted
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Active Authority
                  </span>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Total Members</span>
                  <strong className="text-slate-900 text-base">{stateMembers.length}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Eligible</span>
                  <strong className="text-emerald-600 text-base">{eligibleCount}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Renewed</span>
                  <strong className="text-blue-600 text-base">{renewedCount}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
