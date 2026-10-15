import React, { useState } from 'react';
import { Listing, User } from '../types';
import { X, MapPin, Calendar, Droplets, Scale, AlertTriangle, ArrowRight, Check, UserCircle2, Phone, ShieldCheck } from 'lucide-react';

interface Props {
  listing: Listing;
  currentUser: User;
  onClose: () => void;
  onRequest: (listing: Listing) => void;
}

export const ListingDetailModal: React.FC<Props> = ({
  listing,
  currentUser,
  onClose,
  onRequest,
}) => {
  const [imageError, setImageError] = useState(false);
  const primaryImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Media Banner */}
        <div className="relative aspect-16/9 bg-stone-100 overflow-hidden">
          {primaryImage && !imageError ? (
            <img
              src={primaryImage}
              alt={listing.title}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4">
              <Scale className="w-10 h-10 text-stone-300 mb-1" />
              <span className="text-xs font-medium text-stone-600">{listing.title}</span>
            </div>
          )}

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-stone-900/70 hover:bg-stone-900 text-white p-1.5 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span
              className={`px-3 py-1 rounded text-xs font-semibold backdrop-blur-md shadow-sm ${
                listing.listingType === 'weather_affected'
                  ? 'bg-amber-900/85 text-amber-100'
                  : 'bg-stone-900/85 text-white'
              }`}
            >
              {listing.listingType === 'weather_affected'
                ? 'Weather-Impact Salvage Biomass'
                : 'Standard Agricultural Residue'}
            </span>
            <span className="bg-emerald-900/85 backdrop-blur-md text-emerald-100 px-2.5 py-1 rounded text-xs font-semibold shadow-sm">
              Status: {listing.status.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="text-xs text-stone-500 font-medium capitalize mb-1">
              {listing.category.replace('_', ' ')} · {listing.condition.replace('_', ' ')}
            </div>
            <h2 className="text-xl font-bold text-stone-900 leading-snug">
              {listing.title}
            </h2>
            <p className="text-xs text-stone-600 leading-relaxed mt-2">
              {listing.description}
            </p>
          </div>

          {/* Weather Impact Box if applicable */}
          {listing.weatherEventDetails && (
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Voluntary Weather Incident Record</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-stone-800">
                <div>
                  <strong>Reported Event:</strong> {listing.weatherEventDetails.eventType}
                </div>
                <div>
                  <strong>Incident Date:</strong> {listing.weatherEventDetails.eventDate}
                </div>
                <div className="col-span-2">
                  <strong>Farmer Field Notes:</strong> {listing.weatherEventDetails.farmerObservations}
                </div>
              </div>
              <div className="text-[11px] text-amber-800 pt-1 border-t border-amber-200/60">
                Notice: Farmer observation is provided for recovery discovery; material testing applies at delivery weighbridge.
              </div>
            </div>
          )}

          {/* Physical & Commercial Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-stone-50 rounded-xl text-xs">
            <div>
              <span className="text-stone-400 block">Available Volume</span>
              <strong className="text-stone-900 font-mono tabular-nums text-sm">
                {listing.availableQuantity} {listing.unit}
              </strong>
            </div>

            <div>
              <span className="text-stone-400 block">Farmgate Price</span>
              <strong className="text-emerald-700 font-mono tabular-nums text-sm">
                ₹{listing.pricePerUnit.toLocaleString()} / {listing.unit}
              </strong>
            </div>

            <div>
              <span className="text-stone-400 block">Estimated Moisture</span>
              <strong className="text-stone-900 font-mono tabular-nums text-sm">
                {listing.moisturePercentage !== undefined ? `${listing.moisturePercentage}%` : 'Standard Dry'}
              </strong>
            </div>

            <div>
              <span className="text-stone-400 block">Ready From</span>
              <strong className="text-stone-900 font-mono tabular-nums text-sm">
                {listing.availabilityDate}
              </strong>
            </div>
          </div>

          {/* Supplier details */}
          <div className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <UserCircle2 className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <div className="font-bold text-stone-900">{listing.farmerName}</div>
                <div className="text-stone-500">
                  {listing.locationName}, {listing.district}, {listing.state}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-stone-600">
              <Phone className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-mono">{listing.farmerPhone}</span>
            </div>
          </div>

          {/* Recommended Industrial Uses */}
          {listing.recommendedUses && listing.recommendedUses.length > 0 && (
            <div>
              <div className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2">
                Suitable Industrial Off-take Pathways
              </div>
              <div className="flex flex-wrap gap-2">
                {listing.recommendedUses.map((use, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 text-xs font-medium"
                  >
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>{use}</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
          >
            Back to Marketplace
          </button>

          <button
            onClick={() => {
              onClose();
              onRequest(listing);
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            <span>Submit Purchase Request</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
