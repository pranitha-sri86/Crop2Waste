import React, { useState } from 'react';
import { Listing, User } from '../types';
import { MapPin, Calendar, Droplets, Scale, AlertTriangle, ArrowRight } from 'lucide-react';

interface Props {
  listing: Listing;
  currentUser: User;
  onSelect: (listing: Listing) => void;
  onRequest: (listing: Listing) => void;
  matchScore?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  cereal_straw: 'Cereal Straw',
  sugarcane_bagasse: 'Sugarcane Bagasse',
  oilseed_residue: 'Oilseed Residue',
  fiber_cotton: 'Cotton & Fiber',
  husk_shell: 'Husks & Shells',
  horticulture_waste: 'Horticulture Biomass',
  agro_industrial: 'Agro-Industrial',
};

const CONDITION_LABELS: Record<string, string> = {
  dry_baled: 'Dry Baled',
  loose_dry: 'Loose Dry',
  moderate_moisture: 'Moderate Moisture',
  damp_salvageable: 'Damp (Salvageable)',
  weather_damaged: 'Weather Damaged',
};

export const MarketplaceCard: React.FC<Props> = ({
  listing,
  currentUser,
  onSelect,
  onRequest,
  matchScore,
}) => {
  const [imageError, setImageError] = useState(false);
  const primaryImage = listing.images && listing.images.length > 0 ? listing.images[0] : null;

  return (
    <div className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 group">
      {/* Card Media Header */}
      <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
        {primaryImage && !imageError ? (
          <img
            src={primaryImage}
            alt={listing.title}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-4 text-center">
            <Scale className="w-8 h-8 text-stone-300 mb-1" />
            <span className="text-xs font-medium text-stone-500">{listing.title}</span>
            <span className="text-[11px] text-stone-400">{listing.locationName}</span>
          </div>
        )}

        {/* Quiet unboxed top indicators */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs pointer-events-none">
          {listing.listingType === 'weather_affected' ? (
            <span className="bg-amber-900/80 backdrop-blur-md text-amber-100 px-2.5 py-1 rounded text-[11px] font-medium flex items-center gap-1 shadow-sm">
              <AlertTriangle className="w-3 h-3 text-amber-300" />
              <span>Weather-Impact Recovery</span>
            </span>
          ) : (
            <span className="bg-stone-900/75 backdrop-blur-md text-stone-100 px-2 py-0.5 rounded text-[11px] font-medium shadow-sm">
              Standard Harvest Residue
            </span>
          )}

          {typeof matchScore === 'number' && (
            <span className="bg-emerald-900/85 backdrop-blur-md text-emerald-100 px-2.5 py-1 rounded text-xs font-semibold tabular-nums shadow-sm">
              {matchScore}% Match
            </span>
          )}
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
            <span className="font-medium text-stone-700">
              {CATEGORY_LABELS[listing.category] || listing.category}
            </span>
            <span aria-hidden="true">·</span>
            <span>{CONDITION_LABELS[listing.condition] || listing.condition}</span>
            {listing.moisturePercentage !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-0.5">
                  <Droplets className="w-3 h-3 text-sky-600 inline" />
                  <span className="font-mono tabular-nums">{listing.moisturePercentage}%</span>
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelect(listing)}
            className="text-base font-bold text-stone-900 hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1 mb-2"
          >
            {listing.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-4">
            {listing.description}
          </p>

          {/* Key Metric Strip */}
          <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-stone-100 mb-4">
            <div className="flex items-center gap-1.5 text-stone-600">
              <Scale className="w-3.5 h-3.5 text-stone-400" />
              <span>Available:</span>
              <strong className="text-stone-900 font-mono tabular-nums">
                {listing.availableQuantity} {listing.unit}
              </strong>
            </div>

            <div className="flex items-center gap-1.5 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span className="truncate">{listing.district}, {listing.state}</span>
            </div>

            <div className="flex items-center gap-1.5 text-stone-600 col-span-2">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>Available from:</span>
              <span className="text-stone-800 font-mono tabular-nums">{listing.availabilityDate}</span>
            </div>
          </div>
        </div>

        {/* Bottom Price & Action Row */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] text-stone-400 uppercase tracking-wider font-medium">Offered At</div>
            <div className="text-base font-bold text-stone-900 font-mono tabular-nums">
              ₹{listing.pricePerUnit.toLocaleString()}
              <span className="text-xs font-normal text-stone-500"> / {listing.unit}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(listing)}
              className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              onClick={() => onRequest(listing)}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              <span>Request</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
