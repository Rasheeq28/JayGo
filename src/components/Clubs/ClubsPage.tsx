import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus } from '../../utils/renewalLogic';
import { Trophy } from 'lucide-react';

export const ClubsPage: React.FC = () => {
  const { clubs, members, role, setSelectedClub, setActiveTab } = useApp();

  const filteredClubs = role === 'State Admin' ? clubs.filter((c) => c.state_id === 'ST001') : clubs;

  const handleClubClick = (clubId: string) => {
    setSelectedClub(clubId);
    setActiveTab('renewals');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-amber-500" />
            Affiliated Swimming Clubs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Local aquatic and swimming clubs under state administration.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredClubs.map((cl) => {
          const clubMembers = members.filter((m) => m.club_id === cl.club_id);
          const eligibleCount = clubMembers.filter((m) => calculateMemberStatus(m) === 'Eligible').length;

          return (
            <div
              key={cl.club_id}
              onClick={() => handleClubClick(cl.club_id)}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
            >
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{cl.state_name}</span>
              <h3 className="font-bold text-sm text-slate-900 mt-0.5">{cl.club_name}</h3>

              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">{clubMembers.length} Members</span>
                <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 text-[10px]">
                  {eligibleCount} Eligible
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
