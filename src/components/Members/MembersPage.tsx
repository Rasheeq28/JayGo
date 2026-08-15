import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus, formatDate } from '../../utils/renewalLogic';
import { Search, Users } from 'lucide-react';

export const MembersPage: React.FC = () => {
  const {
    members,
    states,
    clubs,
    role,
    selectedState,
    setSelectedState,
    selectedClub,
    setSelectedClub,
    searchQuery,
    setSearchQuery,
    setSelectedMemberDetailId
  } = useApp();

  const availableClubs = selectedState === 'All' ? clubs : clubs.filter((c) => c.state_id === selectedState);

  const filteredMembers = members.filter((m) => {
    if (role === 'State Admin' && m.state_id !== 'ST001') return false;
    if (selectedState !== 'All' && m.state_id !== selectedState) return false;
    if (selectedClub !== 'All' && m.club_id !== selectedClub) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.member_id.toLowerCase().includes(q) ||
        m.member_name.toLowerCase().includes(q) ||
        m.club_name.toLowerCase().includes(q) ||
        m.state_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Member Directory
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive list of registered athletes and administrators across the organization.
          </p>
        </div>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
          {filteredMembers.length} Members Listed
        </span>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search member name or ID..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => {
            setSelectedState(e.target.value);
            setSelectedClub('All');
          }}
          disabled={role === 'State Admin'}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
        >
          {role === 'NGB Admin' && <option value="All">All States</option>}
          {states.map((st) => (
            <option key={st.state_id} value={st.state_id}>
              {st.state_name}
            </option>
          ))}
        </select>

        <select
          value={selectedClub}
          onChange={(e) => setSelectedClub(e.target.value)}
          className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800"
        >
          <option value="All">All Clubs</option>
          {availableClubs.map((cl) => (
            <option key={cl.club_id} value={cl.club_id}>
              {cl.club_name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-100 uppercase tracking-wider text-[10px] font-bold text-slate-600 border-b border-slate-200">
              <th className="p-3">Member ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">State</th>
              <th className="p-3">Club</th>
              <th className="p-3">Reg Date</th>
              <th className="p-3">Renewal Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredMembers.map((m) => {
              const status = calculateMemberStatus(m);
              return (
                <tr key={m.member_id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-slate-900">{m.member_id}</td>
                  <td className="p-3 font-bold text-slate-900">{m.member_name}</td>
                  <td className="p-3 text-slate-600">{m.state_name}</td>
                  <td className="p-3 text-slate-600">{m.club_name}</td>
                  <td className="p-3 font-mono text-slate-500">{formatDate(m.registration_date)}</td>
                  <td className="p-3">
                    <span className="font-semibold text-xs">{status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => setSelectedMemberDetailId(m.member_id)}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px]"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
