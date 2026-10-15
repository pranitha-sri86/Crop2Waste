import React, { useState } from 'react';
import { Listing, User, MaterialRequest } from '../types';
import { StorageService } from '../services/storage';
import { X, AlertTriangle, Truck, Check } from 'lucide-react';

interface Props {
  listing: Listing;
  currentUser: User;
  onClose: () => void;
  onSuccess: (request: MaterialRequest) => void;
}

export const SendRequestModal: React.FC<Props> = ({
  listing,
  currentUser,
  onClose,
  onSuccess,
}) => {
  const [requestedQuantity, setRequestedQuantity] = useState(
    Math.min(listing.availableQuantity, 100)
  );
  const [offeredPrice, setOfferedPrice] = useState(listing.pricePerUnit);
  const [logistics, setLogistics] = useState<'buyer_arranges' | 'farmer_arranges' | 'third_party_transport'>('buyer_arranges');
  const [proposedDate, setProposedDate] = useState(
    new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  );
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const totalAmount = requestedQuantity * offeredPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (requestedQuantity <= 0) {
      setError('Requested quantity must be greater than zero.');
      return;
    }
    if (requestedQuantity > listing.availableQuantity) {
      setError(`Cannot request more than the available quantity (${listing.availableQuantity} ${listing.unit}).`);
      return;
    }
    if (offeredPrice <= 0) {
      setError('Offered price must be greater than zero.');
      return;
    }

    const newReq = StorageService.createRequest({
      listingId: listing.id,
      listingTitle: listing.title,
      farmerId: listing.farmerId,
      farmerName: listing.farmerName,
      farmerPhone: listing.farmerPhone,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCompany: currentUser.organization || 'Commercial Buyer Group',
      buyerPhone: currentUser.phone,
      requestedQuantity,
      unit: listing.unit,
      offeredPricePerUnit: offeredPrice,
      currency: listing.currency,
      totalAmount,
      logisticsPreference: logistics,
      proposedPickupDate: proposedDate,
      message: message.trim() || `Formal purchase request for ${requestedQuantity} ${listing.unit} of ${listing.title}.`,
    });

    onSuccess(newReq);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Submit Procurement Request</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Submit your lot reservation to {listing.farmerName} ({listing.district}, {listing.state}).
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Listing summary strip */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs">
            <div className="font-semibold text-stone-900 line-clamp-1">{listing.title}</div>
            <div className="flex items-center gap-2 text-stone-500 mt-1">
              <span>Available: <strong className="text-stone-800 font-mono tabular-nums">{listing.availableQuantity} {listing.unit}</strong></span>
              <span>·</span>
              <span>Listed at: <strong className="text-stone-800 font-mono tabular-nums">₹{listing.pricePerUnit}/{listing.unit}</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Requested Quantity ({listing.unit})
              </label>
              <input
                type="number"
                min="1"
                max={listing.availableQuantity}
                value={requestedQuantity}
                onChange={e => setRequestedQuantity(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Offered Price (₹/{listing.unit})
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={offeredPrice}
                onChange={e => setOfferedPrice(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Computed total value */}
          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-900 font-medium">Estimated Purchase Subtotal</span>
              <div className="text-[11px] text-emerald-700">Subject to weighbridge verification</div>
            </div>
            <div className="text-base font-bold text-emerald-900 font-mono tabular-nums">
              ₹{totalAmount.toLocaleString()}
            </div>
          </div>

          {/* Logistics preference */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Logistics & Haulage Plan
            </label>
            <select
              value={logistics}
              onChange={e => setLogistics(e.target.value as any)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
            >
              <option value="buyer_arranges">Buyer Arranges Own Transport & Weighing Fleet</option>
              <option value="third_party_transport">Contracted Third-Party Logistics Carrier</option>
              <option value="farmer_arranges">Farmer Arranges Local Tractor/Truck Haulage</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Target Pickup Date
            </label>
            <input
              type="date"
              value={proposedDate}
              onChange={e => setProposedDate(e.target.value)}
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Message to Farmer & Special Requirements
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="e.g. Please confirm moisture testing at local APMC scale before dispatch."
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              Confirm & Transmit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
