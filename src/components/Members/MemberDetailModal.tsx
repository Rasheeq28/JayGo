import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateMemberStatus, formatDate, formatDateWindow, STANDARD_RENEWAL_FEE } from '../../utils/renewalLogic';
import { X, CheckCircle2, Clock, CalendarX, Building2, User, History, ShieldCheck, Calendar } from 'lucide-react';

export const MemberDetailModal: React.FC = () => {
  const { selectedMemberDetailId, setSelectedMemberDetailId, members, renewSingleMember } = useApp();
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  if (!selectedMemberDetailId) return null;

  const member = members.find((m) => m.member_id === selectedMemberDetailId);
  if (!member) return null;

  const status = calculateMemberStatus(member);
  const isEligible = status === 'Eligible';

  const handleConfirmRenew = () => {
    renewSingleMember(member.member_id);
    setConfirmModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">{member.member_name}</h3>
                <span className="px-2 py-0.5 rounded font-mono text-xs bg-slate-800 text-blue-300 font-bold border border-slate-700">
                  {member.member_id}
                </span>
              </div>
              <p className="text-xs text-slate-400">{member.club_name} • {member.state_name}</p>
            </div>
          </div>

          <button
            onClick={() => setSelectedMemberDetailId(null)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Status Alert Banner */}
          <div className="p-4 rounded-xl border flex items-center justify-between gap-4 bg-slate-50 border-slate-200">
            <div className="flex items-center gap-3">
              {status === 'Eligible' && (
                <span className="badge-eligible text-sm py-1.5 px-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  Eligible for Renewal
                </span>
              )}
              {status === 'Already renewed' && (
                <span className="badge-renewed text-sm py-1.5 px-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  Already Renewed (2026–2027)
                </span>
              )}
              {status === 'Not yet eligible' && (
                <span className="badge-not-yet text-sm py-1.5 px-3">
                  <Clock className="w-4 h-4 text-slate-500" />
                  Not Yet Eligible
                </span>
              )}
              {status === 'Window missed' && (
                <span className="badge-missed text-sm py-1.5 px-3">
                  <CalendarX className="w-4 h-4 text-rose-600" />
                  Window Missed
                </span>
              )}

              <div className="text-xs text-slate-600 font-medium">
                Days Remaining: <strong className="text-slate-900 font-bold">{member.days_until_renewal} days</strong>
              </div>
            </div>

            {isEligible && (
              <button
                onClick={() => setConfirmModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all shrink-0"
              >
                Renew Membership (£120)
              </button>
            )}
          </div>

          {/* Section 1: Personal & Contact Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b pb-2">
              <User className="w-3.5 h-3.5 text-blue-600" />
              Personal Information
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-slate-500 block">Member ID:</span>
                <strong className="font-mono text-slate-900 text-sm">{member.member_id}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Full Name:</span>
                <strong className="text-slate-900">{member.member_name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Date of Birth:</span>
                <strong className="text-slate-800">12 May 2002</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Email Address:</span>
                <strong className="text-slate-800 font-mono text-[11px]">{member.member_name.toLowerCase().replace(' ', '.')}@aquatics.bd</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Phone Number:</span>
                <strong className="text-slate-800 font-mono">+880 1711-889922</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Membership Status:</span>
                <strong className="text-emerald-700 font-bold">{member.membership_status}</strong>
              </div>
            </div>
          </div>

          {/* Section 2: Organizational Hierarchy */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b pb-2">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              Organizational Hierarchy
            </h4>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">NGB Level</span>
                <strong className="text-slate-900 text-xs mt-0.5 block">{member.ngb_name}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">State Level</span>
                <strong className="text-slate-900 text-xs mt-0.5 block">{member.state_name}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Club Level</span>
                <strong className="text-slate-900 text-xs mt-0.5 block">{member.club_name}</strong>
              </div>
            </div>
          </div>

          {/* Section 3: Membership Anniversary & Window Breakdown */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b pb-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              Anniversary Renewal Schedule
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Registration Date:</span>
                <strong className="font-mono text-slate-900">{formatDate(member.registration_date)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Renewal Date:</span>
                <strong className="font-mono text-slate-900">{formatDate(member.renewal_date)}</strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">7-Day Window:</span>
                <strong className="text-slate-900">
                  {formatDateWindow(member.renewal_window_start, member.renewal_window_end)}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] text-slate-500 block">Current Season:</span>
                <strong className="text-slate-900">{member.current_membership_year}</strong>
              </div>
            </div>
          </div>

          {/* Section 4: Renewal History Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2 border-b pb-2">
              <History className="w-3.5 h-3.5 text-amber-600" />
              Renewal History Timeline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="font-bold text-slate-900">2025–2026 Season</span>
                  <p className="text-[11px] text-slate-500">Initial Membership Registration</p>
                </div>
                <span className="font-mono text-slate-600">{formatDate(member.registration_date)}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-200">
                <div>
                  <span className="font-bold text-blue-900">2026–2027 Season</span>
                  <p className="text-[11px] text-blue-700">
                    {status === 'Already renewed'
                      ? 'Renewed Successfully'
                      : isEligible
                      ? `Eligible Window: ${formatDateWindow(member.renewal_window_start, member.renewal_window_end)}`
                      : `Status: ${status}`}
                  </p>
                </div>
                <span className="font-bold text-blue-700">{status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={() => setSelectedMemberDetailId(null)}
            className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
          >
            Close
          </button>

          {isEligible && (
            <button
              onClick={() => setConfirmModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Renew Membership for 2026–2027</span>
            </button>
          )}
        </div>
      </div>

      {/* Nested Individual Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <h4 className="font-bold text-base text-slate-900">Confirm Individual Renewal</h4>
            <p className="text-xs text-slate-600">
              Are you sure you want to renew <strong>{member.member_name} ({member.member_id})</strong> for the <strong>2026–2027</strong> membership season?
            </p>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Club:</span>
                <strong className="text-slate-800">{member.club_name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Renewal Fee:</span>
                <strong className="text-blue-700 font-bold">£{STANDARD_RENEWAL_FEE}</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setConfirmModalOpen(false)}
                className="px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRenew}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
              >
                Confirm Renewal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
