import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus, formatDate, formatDateWindow } from '../../utils/renewalLogic';
import { Search, CheckCircle2, Clock, CalendarX, Layers, Eye } from 'lucide-react';

export const RenewalTable: React.FC = () => {
  const {
    members,
    states,
    clubs,
    role,
    selectedState,
    setSelectedState,
    selectedClub,
    setSelectedClub,
    selectedStatusFilter,
    setSelectedStatusFilter,
    searchQuery,
    setSearchQuery,
    selectedMemberIds,
    toggleSelectMember,
    toggleSelectAll,
    clearSelection,
    setBulkRenewModalOpen,
    setSelectedMemberDetailId,
    renewSingleMember
  } = useApp();

  // Cascading Clubs dropdown options based on selected state
  const availableClubs = selectedState === 'All'
    ? clubs
    : clubs.filter((c) => c.state_id === selectedState);

  // Filter Members
  const filteredMembers = members.filter((m) => {
    // 1. Role / State Scope
    if (role === 'State Admin' && m.state_id !== 'ST001') {
      return false;
    }
    if (selectedState !== 'All' && m.state_id !== selectedState) {
      return false;
    }

    // 2. Club Scope
    if (selectedClub !== 'All' && m.club_id !== selectedClub) {
      return false;
    }

    // 3. Status Scope
    const currentStatus = calculateMemberStatus(m);
    if (selectedStatusFilter !== 'All' && currentStatus !== selectedStatusFilter) {
      return false;
    }

    // 4. Search Query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = m.member_id.toLowerCase().includes(q);
      const matchName = m.member_name.toLowerCase().includes(q);
      const matchClub = m.club_name.toLowerCase().includes(q);
      const matchState = m.state_name.toLowerCase().includes(q);
      if (!matchId && !matchName && !matchClub && !matchState) return false;
    }

    return true;
  });

  const filteredEligibleMembers = filteredMembers.filter((m) => calculateMemberStatus(m) === 'Eligible');
  const filteredEligibleIds = filteredEligibleMembers.map((m) => m.member_id);

  const isAllEligibleSelected =
    filteredEligibleIds.length > 0 &&
    filteredEligibleIds.every((id) => selectedMemberIds.includes(id));

  const totalSelectedCount = selectedMemberIds.length;
  const isExceeding100Limit = totalSelectedCount > 100;

  return (
    <div className="space-y-4">
      {/* Top Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { id: 'All', label: 'All Statuses', count: members.length },
              { id: 'Eligible', label: 'Eligible', count: members.filter((m) => calculateMemberStatus(m) === 'Eligible').length, badgeColor: 'bg-emerald-500 text-white' },
              { id: 'Already renewed', label: 'Already Renewed', count: members.filter((m) => calculateMemberStatus(m) === 'Already renewed').length },
              { id: 'Not yet eligible', label: 'Not Yet Eligible', count: members.filter((m) => calculateMemberStatus(m) === 'Not yet eligible').length },
              { id: 'Window missed', label: 'Window Missed', count: members.filter((m) => calculateMemberStatus(m) === 'Window missed').length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  selectedStatusFilter === tab.id
                    ? 'bg-slate-900 text-white font-semibold shadow-xs'
                    : 'bg-slate-100/80 hover:bg-slate-200/70 text-slate-600'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    tab.badgeColor ? tab.badgeColor : selectedStatusFilter === tab.id ? 'bg-slate-700 text-slate-200' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredMembers.length}</strong> of {members.length} members
          </div>
        </div>

        {/* Cascading Hierarchy Filters & Search Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search member, ID, club..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          {/* Cascading State Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">State:</span>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedClub('All');
              }}
              disabled={role === 'State Admin'}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:bg-slate-100 disabled:text-slate-400"
            >
              {role === 'NGB Admin' && <option value="All">All States (4 States)</option>}
              {states.map((st) => (
                <option key={st.state_id} value={st.state_id}>
                  {st.state_name}
                </option>
              ))}
            </select>
          </div>

          {/* Cascading Club Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 shrink-0">Club:</span>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="All">All Clubs ({availableClubs.length} Clubs)</option>
              {availableClubs.map((cl) => (
                <option key={cl.club_id} value={cl.club_id}>
                  {cl.club_name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sticky Bulk Action Control Bar when members are checked */}
      {totalSelectedCount > 0 && (
        <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-3.5 rounded-xl shadow-lg border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-400/30">
              {totalSelectedCount} Members Selected
            </div>

            {isExceeding100Limit ? (
              <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                Exceeds max batch limit of 100. Will split into Batch 1 (100 members) & Batch 2 ({totalSelectedCount - 100} members).
              </span>
            ) : (
              <span className="text-xs text-slate-300 font-medium">Ready for bulk annual renewal action.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearSelection}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition-colors"
            >
              Clear Selection
            </button>
            <button
              onClick={() => setBulkRenewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all hover:scale-[1.02]"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isExceeding100Limit ? `Process First 100 Members` : `Renew ${totalSelectedCount} Members`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main High-Density Renewal Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/90 text-slate-600 border-b border-slate-200 uppercase tracking-wider font-bold text-[10px]">
                <th className="p-3 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllEligibleSelected}
                    onChange={() => toggleSelectAll(filteredEligibleIds)}
                    disabled={filteredEligibleIds.length === 0}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-30"
                    title="Select all eligible members in current view"
                  />
                </th>
                <th className="p-3 font-bold">Member ID</th>
                <th className="p-3 font-bold">Member</th>
                <th className="p-3 font-bold">State</th>
                <th className="p-3 font-bold">Club</th>
                <th className="p-3 font-bold">Registration</th>
                <th className="p-3 font-bold">Renewal Date</th>
                <th className="p-3 font-bold">Window</th>
                <th className="p-3 font-bold text-center">Days Left</th>
                <th className="p-3 font-bold text-center">Status</th>
                <th className="p-3 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-12 text-center text-slate-500">
                    <div className="max-w-xs mx-auto space-y-2">
                      <p className="font-bold text-sm text-slate-700">No members found</p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search criteria, state, club, or status filter tab.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMembers.map((m) => {
                  const status = calculateMemberStatus(m);
                  const isEligible = status === 'Eligible';
                  const isSelected = selectedMemberIds.includes(m.member_id);

                  return (
                    <tr
                      key={m.member_id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-blue-50/60 hover:bg-blue-50' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectMember(m.member_id)}
                          disabled={!isEligible}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-30"
                        />
                      </td>

                      {/* Member ID */}
                      <td className="p-3 font-mono font-bold text-slate-900">
                        <button
                          onClick={() => setSelectedMemberDetailId(m.member_id)}
                          className="hover:text-blue-600 hover:underline"
                        >
                          {m.member_id}
                        </button>
                      </td>

                      {/* Member Name */}
                      <td className="p-3">
                        <button
                          onClick={() => setSelectedMemberDetailId(m.member_id)}
                          className="font-bold text-slate-900 hover:text-blue-600 text-left block"
                        >
                          {m.member_name}
                        </button>
                      </td>

                      {/* State */}
                      <td className="p-3 text-slate-600">{m.state_name}</td>

                      {/* Club */}
                      <td className="p-3 text-slate-600">{m.club_name}</td>

                      {/* Registration Date */}
                      <td className="p-3 text-slate-500 font-mono">{formatDate(m.registration_date)}</td>

                      {/* Renewal Date */}
                      <td className="p-3 font-mono font-bold text-slate-900">{formatDate(m.renewal_date)}</td>

                      {/* Renewal Window */}
                      <td className="p-3 text-slate-600 font-medium">
                        {formatDateWindow(m.renewal_window_start, m.renewal_window_end)}
                      </td>

                      {/* Days Left */}
                      <td className="p-3 text-center">
                        <span
                          className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
                            m.days_until_renewal <= 1
                              ? 'bg-rose-100 text-rose-700'
                              : m.days_until_renewal <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.days_until_renewal < 0
                            ? `${Math.abs(m.days_until_renewal)}d overdue`
                            : `${m.days_until_renewal} day${m.days_until_renewal === 1 ? '' : 's'}`}
                        </span>
                      </td>

                      {/* Status Badges */}
                      <td className="p-3 text-center">
                        {status === 'Eligible' && (
                          <span className="badge-eligible">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Eligible
                          </span>
                        )}
                        {status === 'Already renewed' && (
                          <span className="badge-renewed">
                            <CheckCircle2 className="w-3 h-3 text-blue-600" />
                            Already Renewed
                          </span>
                        )}
                        {status === 'Not yet eligible' && (
                          <span className="badge-not-yet">
                            <Clock className="w-3 h-3 text-slate-400" />
                            Not Yet Eligible
                          </span>
                        )}
                        {status === 'Window missed' && (
                          <span className="badge-missed">
                            <CalendarX className="w-3 h-3 text-rose-600" />
                            Window Missed
                          </span>
                        )}
                      </td>

                      {/* Row Actions */}
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isEligible && (
                            <button
                              onClick={() => renewSingleMember(m.member_id)}
                              className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                            >
                              Renew
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedMemberDetailId(m.member_id)}
                            title="View member profile"
                            className="p-1.5 rounded hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
