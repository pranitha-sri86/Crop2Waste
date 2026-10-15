import React, { useState } from 'react';
import { Transaction, TransactionStatus, User } from '../types';
import { StorageService } from '../services/storage';
import { X, CheckCircle2, Clock, Truck, MapPin, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';

interface Props {
  transaction: Transaction;
  currentUser: User;
  onClose: () => void;
  onUpdated: (tx: Transaction) => void;
}

const STAGES: { status: TransactionStatus; label: string; description: string }[] = [
  { status: 'ACCEPTED', label: 'Accepted', description: 'Offer accepted & volume reserved' },
  { status: 'PICKUP_SCHEDULED', label: 'Pickup Scheduled', description: 'Transport fleet allocated' },
  { status: 'COLLECTED', label: 'Collected & Weighed', description: 'Loaded at farm with APMC slip' },
  { status: 'IN_TRANSIT', label: 'In Transit', description: 'Cargo moving to processor facility' },
  { status: 'DELIVERED', label: 'Delivered', description: 'Arrived at plant unloading bay' },
  { status: 'COMPLETED', label: 'Completed', description: 'Final settlement & invoice closed' },
];

export const TransactionTimelineModal: React.FC<Props> = ({
  transaction,
  currentUser,
  onClose,
  onUpdated,
}) => {
  const [transitionNotes, setTransitionNotes] = useState('');
  const [locationNote, setLocationNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentIdx = STAGES.findIndex(s => s.status === transaction.status);
  const nextStage = currentIdx < STAGES.length - 1 ? STAGES[currentIdx + 1] : null;

  const handleAdvance = () => {
    if (!nextStage) return;
    setIsSubmitting(true);

    const defaultNotes: Record<TransactionStatus, string> = {
      ACCEPTED: 'Agreed terms established.',
      PICKUP_SCHEDULED: 'Vehicle assigned, driver contact shared.',
      COLLECTED: 'Loaded onto carrier; weighbridge slip confirmed.',
      IN_TRANSIT: 'En route via regional highway corridor.',
      DELIVERED: 'Unloaded and sampled at processing yard.',
      COMPLETED: 'Weight reconciled and final transaction recorded.',
    };

    const note = transitionNotes.trim() || defaultNotes[nextStage.status];
    const updated = StorageService.updateTransactionStatus(
      transaction.id,
      nextStage.status,
      note,
      currentUser.name,
      currentUser.role,
      locationNote.trim() || undefined
    );

    setIsSubmitting(false);
    if (updated) {
      onUpdated(updated);
      setTransitionNotes('');
      setLocationNote('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              Transaction ID: #{transaction.id}
            </div>
            <h2 className="text-base font-bold text-white mt-0.5">
              Logistics & Delivery Execution
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Transaction Overview Strip */}
        <div className="p-5 bg-stone-50 border-b border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <div className="text-stone-500">Material</div>
            <div className="font-semibold text-stone-900 truncate">{transaction.listingTitle}</div>
          </div>
          <div>
            <div className="text-stone-500">Volume</div>
            <div className="font-semibold text-stone-900 font-mono tabular-nums">
              {transaction.quantity} {transaction.unit}
            </div>
          </div>
          <div>
            <div className="text-stone-500">Agreed Price</div>
            <div className="font-semibold text-stone-900 font-mono tabular-nums">
              ₹{transaction.pricePerUnit.toLocaleString()} / {transaction.unit}
            </div>
          </div>
          <div>
            <div className="text-stone-500">Total Value</div>
            <div className="font-semibold text-emerald-700 font-mono tabular-nums">
              ₹{transaction.totalAmount.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Progress Step Bar */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Delivery Pipeline Status
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {STAGES.map((st, i) => {
                const isPassed = i <= currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div
                    key={st.status}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      isCurrent
                        ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500'
                        : isPassed
                        ? 'bg-stone-100 border-stone-300 text-stone-700'
                        : 'bg-white border-stone-200 text-stone-400 opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-stone-400">Step {i + 1}</div>
                    <div className="text-[11px] font-semibold text-stone-900 leading-tight mt-0.5">
                      {st.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action to advance if not completed */}
          {nextStage && (
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Next Authorized Step: Advance to "{nextStage.label}"</span>
                </div>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Acting as: {currentUser.name} ({currentUser.role})
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Status Note / Waybill Ref</label>
                  <input
                    type="text"
                    value={transitionNotes}
                    onChange={e => setTransitionNotes(e.target.value)}
                    placeholder={`e.g. Weighbridge record slip, driver phone...`}
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Check-in Location (Optional)</label>
                  <input
                    type="text"
                    value={locationNote}
                    onChange={e => setLocationNote(e.target.value)}
                    placeholder="e.g. Karnal Toll Plaza / Weighbridge"
                    className="w-full bg-white border border-stone-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleAdvance}
                className="w-full py-2 px-4 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Update Status to {nextStage.label}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Event History Timeline */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-3">
              Immutable Event Audit Log
            </div>
            <div className="space-y-3 border-l-2 border-stone-200 pl-4 ml-2">
              {transaction.events.map(evt => (
                <div key={evt.id} className="relative">
                  <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                  <div className="text-xs flex items-center gap-2">
                    <span className="font-semibold text-stone-900">{evt.status.replace('_', ' ')}</span>
                    <span className="text-stone-400 font-mono text-[11px] tabular-nums">
                      {new Date(evt.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    <strong>{evt.actor}</strong>: {evt.notes}
                  </div>
                  {evt.location && (
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Digital verification log stored</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
