import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { STANDARD_RENEWAL_FEE } from '../../utils/renewalLogic';
import { AlertTriangle, CheckCircle2, ShieldCheck, X, Layers } from 'lucide-react';

interface BulkRenewalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkRenewalModal: React.FC<BulkRenewalModalProps> = ({ isOpen, onClose }) => {
  const { selectedMemberIds, members, renewBulkMembers } = useApp();
  const [isProcessing, setIsProcessing] = useState(false);
  const [successResult, setSuccessResult] = useState<{ renewedCount: number; remainingCount: number } | null>(null);

  if (!isOpen) return null;

  const selectedMembers = members.filter((m) => selectedMemberIds.includes(m.member_id));
  const totalSelectedCount = selectedMembers.length;

  // Max 100 limit per batch
  const MAX_BATCH_LIMIT = 100;
  const isExceedingLimit = totalSelectedCount > MAX_BATCH_LIMIT;

  // Determine current batch size to process
  const batchToProcess = selectedMembers.slice(0, MAX_BATCH_LIMIT);
  const batchSize = batchToProcess.length;
  const remainingCount = totalSelectedCount - batchSize;
  const totalFee = batchSize * STANDARD_RENEWAL_FEE;

  const handleConfirmRenewal = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const idsToRenew = batchToProcess.map((m) => m.member_id);
      renewBulkMembers(idsToRenew);
      setIsProcessing(false);

      if (remainingCount > 0) {
        setSuccessResult({
          renewedCount: batchSize,
          remainingCount: remainingCount
        });
      } else {
        onClose();
        setSuccessResult(null);
      }
    }, 800);
  };

  const handleProcessRemaining = () => {
    setSuccessResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Bulk Membership Renewal Confirmation</h3>
              <p className="text-xs text-slate-400">Season: 2026–2027 • Standard Fee: £120 / member</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {successResult ? (
            /* Success State for Partial Batch */
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Batch 1 Renewal Successful!</h4>
                <p className="text-xs text-slate-600 mt-1">
                  Successfully processed <strong className="text-emerald-700">{successResult.renewedCount} members</strong> for the 2026–2027 year.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between">
                <span>Remaining eligible in selection queue: <strong>{successResult.remainingCount} members</strong></span>
                <button
                  onClick={handleProcessRemaining}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                >
                  Process Remaining {successResult.remainingCount}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Batch Limit Warning if > 100 */}
              {isExceedingLimit && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Bulk Renewal Limit Exceeded ({totalSelectedCount} Selected)</span>
                  </div>
                  <p className="text-xs text-amber-800 leading-relaxed">
                    The system strictly enforces a maximum of <strong>100 members per bulk action batch</strong>. Your selection will automatically be split into <strong>Batch 1 (100 members)</strong> and <strong>Batch 2 ({remainingCount} members)</strong>.
                  </p>
                </div>
              )}

              {/* Selection Summary Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Processing Batch</span>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {batchSize} <span className="text-xs font-semibold text-slate-500">members</span>
                  </p>
                  {isExceedingLimit && (
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 mt-1">
                      <Layers className="w-3 h-3" /> Batch 1 of 2 ({remainingCount} remaining)
                    </span>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider">Total Renewal Fee</span>
                  <p className="text-2xl font-extrabold text-blue-900 mt-1">
                    £{totalFee.toLocaleString()}
                  </p>
                  <span className="text-[10px] text-blue-600 font-medium">£120 × {batchSize} members</span>
                </div>
              </div>

              {/* Sample Member List Snippet */}
              <div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Members Included in this Batch ({batchSize}):
                </span>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-slate-50/50">
                  {batchToProcess.map((m) => (
                    <div key={m.member_id} className="p-2.5 text-xs flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-slate-800">{m.member_name}</span>
                        <span className="text-[11px] text-slate-400 ml-2">({m.member_id})</span>
                      </div>
                      <span className="text-[11px] text-slate-500">{m.club_name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Actions */}
        {!successResult && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              onClick={handleConfirmRenewal}
              disabled={isProcessing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Renewal...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isExceedingLimit ? `Confirm Batch 1 (${batchSize} Members)` : `Confirm Renewal (${batchSize} Members)`}
                  </span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
