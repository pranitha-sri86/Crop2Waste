import React, { useState } from 'react';
import { WeatherRecoveryReport, Listing, User } from '../types';
import { CloudRain, AlertTriangle, ShieldAlert, Plus, Sparkles, Scale, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  weatherReports: WeatherRecoveryReport[];
  listings: Listing[];
  currentUser: User;
  onOpenFileWeatherReport: () => void;
  onSelectListing: (listing: Listing) => void;
  onRequestListing: (listing: Listing) => void;
}

export const WeatherRecoveryView: React.FC<Props> = ({
  weatherReports,
  listings,
  currentUser,
  onOpenFileWeatherReport,
  onSelectListing,
  onRequestListing,
}) => {
  const [filterEvent, setFilterEvent] = useState<string>('all');

  // Filter listings marked as weather_affected
  const weatherListings = listings.filter(l => l.listingType === 'weather_affected' && l.status === 'active');

  const filteredReports = weatherReports.filter(rep => {
    if (filterEvent !== 'all' && rep.weatherEventType !== filterEvent) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Recovery Desk Banner & Disclaimer */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-6 sm:p-8 space-y-4 border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <CloudRain className="w-4 h-4" />
              <span>Climate Resilience & Salvage Biomass Mobilization</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Weather Impact Recovery Desk
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-2xl leading-relaxed">
              When unseasonal downpours, flash floods, or cyclones damage standing crops or harvest residues, conventional wholesale mandis reject the lot. CropWaste2Value redirects damp and weather-impacted biomass into thermophilic composting, biochar pyrolysis, and biogas digesters.
            </p>
          </div>

          <button
            onClick={onOpenFileWeatherReport}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File Weather Damage Report</span>
          </button>
        </div>

        {/* Regulatory & Verification Disclaimer */}
        <div className="p-3.5 rounded-xl bg-stone-800/80 border border-stone-700 text-xs text-stone-300 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white font-semibold">Statutory Transparency Disclaimer: </strong>
            Material quantities, moisture levels, and damage observations are voluntarily submitted by farmers. Reporting on CropWaste2Value facilitates voluntary commercial salvage discovery and does not constitute official PMFBY crop insurance certification, statutory compensation, or laboratory microbial clearance. Off-takers must conduct routine inspection upon lot handover.
          </div>
        </div>
      </div>

      {/* 3 Approved Salvage Pathways Guide */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-stone-900">
          Scientifically Recommended Industrial Utilization Pathways
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              01. Thermophilic Windrow Composting
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Elevated Moisture Straw & Stover</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Residues with 30%–45% moisture are ideal for aerobic composting. Microbial inoculation turns wet biomass into stable organic humus fertilizer within 45 days, eliminating need for expensive artificial drying.
            </p>
            <div className="text-[11px] text-stone-500 font-medium pt-1">
              Suitable for: Composting plants, organic orchards, soil amendment mills.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
              02. Biochar Pyrolysis & Carbon Removal
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Degraded Fibrous Stalks</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Severely weathered stalks unsuitable for high-grade cattle feed can undergo controlled thermal pyrolysis (450°C oxygen-limited) to produce carbon-sequestering agricultural biochar.
            </p>
            <div className="text-[11px] text-stone-500 font-medium pt-1">
              Suitable for: Biochar operators, CDR carbon credit projects, soil regeneration.
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-2">
            <div className="text-xs font-bold text-blue-800 uppercase tracking-wider">
              03. Anaerobic Biomethanation (CBG)
            </div>
            <h3 className="font-bold text-stone-900 text-sm">Waterlogged Vegetative Biomass</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Wet groundnut haulms and damp maize stover act as outstanding co-digestion feedstocks for industrial biogas reactors when blended with livestock manure, generating renewable methane gas.
            </p>
            <div className="text-[11px] text-stone-500 font-medium pt-1">
              Suitable for: SATAT Compressed Bio-Gas (CBG) facilities, dairy digesters.
            </div>
          </div>
        </div>
      </div>

      {/* Available Weather-Impact Marketplace Lots */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Active Weather-Impact Recovery Lots ({weatherListings.length} Available)
          </h2>
          <span className="text-xs text-stone-500">
            Listed at discounted salvage valuations for specialized off-takers
          </span>
        </div>

        {weatherListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weatherListings.map(lst => (
              <div
                key={lst.id}
                className="bg-white rounded-xl border border-amber-200 overflow-hidden shadow-2xs hover:border-amber-400 transition-colors flex flex-col justify-between"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded text-[11px]">
                      Weather-Impacted Biomass
                    </span>
                    <span className="font-mono text-stone-500 tabular-nums">
                      {lst.district}, {lst.state}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectListing(lst)}
                    className="font-bold text-stone-900 text-base hover:text-amber-800 cursor-pointer"
                  >
                    {lst.title}
                  </h3>

                  <p className="text-xs text-stone-600 line-clamp-2">
                    {lst.description}
                  </p>

                  {lst.weatherEventDetails && (
                    <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                      <div>
                        <strong>Reported Event: </strong>
                        {lst.weatherEventDetails.eventType} ({lst.weatherEventDetails.eventDate})
                      </div>
                      <div className="text-[11px] text-amber-800">
                        <strong>Farmer Notes: </strong>
                        {lst.weatherEventDetails.farmerObservations}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                    <div>
                      <span className="text-stone-400 block">Available Volume</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        {lst.availableQuantity} {lst.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Salvage Rate</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        ₹{lst.pricePerUnit.toLocaleString()} / {lst.unit}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectListing(lst)}
                    className="text-xs font-medium text-stone-600 hover:text-stone-900"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRequestListing(lst)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-colors"
                  >
                    <span>Request Salvage Lot</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
            No weather-impacted recovery lots currently listed.
          </div>
        )}
      </div>

      {/* Voluntary Farmer Weather Reports Registry */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Regional Voluntary Weather Incident Log ({filteredReports.length} Reports)
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Filter Event:</span>
            <select
              value={filterEvent}
              onChange={e => setFilterEvent(e.target.value)}
              className="bg-white border border-stone-200 rounded px-2 py-1 text-xs"
            >
              <option value="all">All Weather Incidents</option>
              <option value="cyclone_flood">Cyclone & Flood</option>
              <option value="unseasonal_rain">Unseasonal Rain</option>
              <option value="hailstorm">Hailstorm</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {filteredReports.map(rep => (
            <div
              key={rep.id}
              className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-amber-600" />
                  <strong className="text-stone-900 capitalize">
                    {rep.weatherEventType.replace('_', ' ')}
                  </strong>
                  <span aria-hidden="true">·</span>
                  <span className="text-stone-500 font-mono">{rep.eventDate}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rep.district}, {rep.state}</span>
                </div>
                <span className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px] font-semibold">
                  STATUS: {rep.status.toUpperCase()}
                </span>
              </div>

              <div className="text-sm font-bold text-stone-900">
                {rep.affectedCrop} — Estimated Lot: <span className="font-mono tabular-nums">{rep.estimatedQuantityTons} Tons</span> ({rep.currentMoistureEst} moisture)
              </div>

              <p className="text-xs text-stone-600 leading-relaxed">
                {rep.farmerObservations}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
                <span className="text-stone-500">Recommended Recovery Pathways:</span>
                {rep.suitableAlternativeUses.map((u, i) => (
                  <span key={i} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                    {u}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
