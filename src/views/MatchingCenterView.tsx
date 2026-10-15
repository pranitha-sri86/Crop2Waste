import React, { useState, useMemo } from 'react';
import { Listing, BuyerRequirement, User, MatchResult } from '../types';
import { findMatchesForRequirement, DEFAULT_WEIGHTS, MatchingWeights } from '../services/matchingEngine';
import { Sparkles, Sliders, CheckCircle2, AlertCircle, ArrowRight, Scale, MapPin, Droplets, RotateCcw } from 'lucide-react';

interface Props {
  listings: Listing[];
  requirements: BuyerRequirement[];
  currentUser: User;
  onSelectMatch: (match: MatchResult) => void;
  onRequestListing: (listing: Listing) => void;
  onOpenCreateRequirement: () => void;
}

export const MatchingCenterView: React.FC<Props> = ({
  listings,
  requirements,
  currentUser,
  onSelectMatch,
  onRequestListing,
  onOpenCreateRequirement,
}) => {
  const [selectedReqId, setSelectedReqId] = useState<string>(
    requirements[0]?.id || ''
  );
  const [weights, setWeights] = useState<MatchingWeights>(DEFAULT_WEIGHTS);
  const [showWeightTuner, setShowWeightTuner] = useState(false);

  const selectedRequirement = useMemo(() => {
    return requirements.find(r => r.id === selectedReqId) || requirements[0];
  }, [requirements, selectedReqId]);

  const matches = useMemo(() => {
    if (!selectedRequirement) return [];
    return findMatchesForRequirement(selectedRequirement, listings, weights);
  }, [selectedRequirement, listings, weights]);

  const handleWeightChange = (key: keyof MatchingWeights, val: number) => {
    setWeights(prev => ({ ...prev, [key]: val }));
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHTS);
  };

  const totalWeightSum = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-16">
      {/* Title & Introduction */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Deterministic Rule-Based Matching System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              Explainable Compatibility Engine
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Every compatibility index is computed from 6 verifiable physical and economic parameters. No opaque black-box estimates or probability assumptions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWeightTuner(!showWeightTuner)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-500" />
              <span>{showWeightTuner ? 'Hide Weight Controls' : 'Configure Factor Weights'}</span>
            </button>
            <button
              onClick={onOpenCreateRequirement}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors"
            >
              <span>+ Post New Requirement</span>
            </button>
          </div>
        </div>

        {/* Weight Tuner Accordion */}
        {showWeightTuner && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-stone-900">
                Factor Weight Allocation (Current sum: <span className="font-mono">{totalWeightSum}%</span>)
              </div>
              <button
                onClick={handleResetWeights}
                className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Standard Weights (40-20-15-15-5-5)</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
              <div>
                <label className="block text-stone-600 mb-1">Material (40%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.material}
                  onChange={e => handleWeightChange('material', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Quantity (20%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.quantity}
                  onChange={e => handleWeightChange('quantity', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Location (15%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.location}
                  onChange={e => handleWeightChange('location', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Condition (15%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.condition}
                  onChange={e => handleWeightChange('condition', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Price (5%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.price}
                  onChange={e => handleWeightChange('price', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
              <div>
                <label className="block text-stone-600 mb-1">Timing (5%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={weights.timing}
                  onChange={e => handleWeightChange('timing', Number(e.target.value))}
                  className="w-full bg-white border border-stone-300 rounded px-2 py-1 font-mono tabular-nums"
                />
              </div>
            </div>
          </div>
        )}

        {/* Requirement Selector Pills */}
        <div className="pt-2 border-t border-stone-100">
          <label className="block text-xs font-semibold text-stone-700 mb-2">
            Active Procurement Requirement in Focus:
          </label>
          <div className="flex flex-wrap gap-2">
            {requirements.map(req => {
              const isSelected = req.id === selectedReqId;
              return (
                <button
                  key={req.id}
                  onClick={() => setSelectedReqId(req.id)}
                  className={`px-3 py-2 rounded-xl text-xs text-left transition-all border ${
                    isSelected
                      ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500/50 shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <div className="font-semibold text-stone-900">{req.title}</div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    {req.buyerCompany} · {req.minQuantity}–{req.maxQuantity} {req.unit} · Max ₹{req.targetPriceMax}/{req.unit}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Requirement Detail Summary Strip */}
      {selectedRequirement && (
        <div className="bg-stone-900 text-stone-200 rounded-xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-stone-400 block text-[11px]">Material & Facility</span>
            <strong className="text-white font-medium">{selectedRequirement.materialName}</strong>
            <div className="text-stone-400 capitalize mt-0.5">{selectedRequirement.buyerType.replace('_', ' ')}</div>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Requested Volume</span>
            <strong className="text-white font-mono tabular-nums">
              {selectedRequirement.minQuantity} – {selectedRequirement.maxQuantity} {selectedRequirement.unit}
            </strong>
            <div className="text-stone-400 mt-0.5">Max Moisture: {selectedRequirement.maxMoisturePercentage}%</div>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Logistics Radius</span>
            <strong className="text-white">{selectedRequirement.district}, {selectedRequirement.state}</strong>
            <div className="text-stone-400 mt-0.5 font-mono tabular-nums">Within {selectedRequirement.maxDistanceKm} km</div>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Target Budget Ceiling</span>
            <strong className="text-emerald-400 font-mono tabular-nums text-sm">
              ₹{selectedRequirement.targetPriceMax.toLocaleString()} / {selectedRequirement.unit}
            </strong>
            <div className="text-stone-400 mt-0.5">
              {selectedRequirement.acceptsWeatherAffected ? '✓ Weather-salvage allowed' : 'Standard dry lots only'}
            </div>
          </div>
        </div>
      )}

      {/* Matches List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-stone-900">
            Ranked Farmer Lots by Compatibility Score ({matches.length} Evaluated)
          </h2>
          <span className="text-xs text-stone-500">
            Click any entry to inspect explainable scoring parameters
          </span>
        </div>

        {matches.length > 0 ? (
          <div className="space-y-3">
            {matches.map(m => {
              const score = m.totalScore;
              return (
                <div
                  key={m.listingId}
                  className="bg-white rounded-xl border border-stone-200 p-5 hover:border-emerald-500 hover:shadow-md transition-all space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="font-semibold text-stone-800">{m.listing.farmerName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{m.listing.district}, {m.listing.state}</span>
                        {m.distanceKm !== undefined && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-stone-600">~{m.distanceKm} km haul</span>
                          </>
                        )}
                        <span aria-hidden="true">·</span>
                        <span className="capitalize">{m.listing.listingType.replace('_', ' ')}</span>
                      </div>

                      <h3
                        onClick={() => onSelectMatch(m)}
                        className="text-base font-bold text-stone-900 group-hover:text-emerald-700 transition-colors cursor-pointer"
                      >
                        {m.listing.title}
                      </h3>
                    </div>

                    {/* Total Compatibility Index Box */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-2xl font-extrabold font-mono tabular-nums text-stone-900">
                          {score}%
                        </div>
                        <div className="text-[11px] text-stone-500">Compatibility Index</div>
                      </div>

                      <button
                        onClick={() => onSelectMatch(m)}
                        className="px-3.5 py-1.5 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors whitespace-nowrap"
                      >
                        Why this score?
                      </button>

                      <button
                        onClick={() => onRequestListing(m.listing)}
                        className="inline-flex items-center gap-1 px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap"
                      >
                        <span>Request Lot</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Factor Score Mini-Meters Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2 border-t border-stone-100 text-[11px]">
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Material ({m.factors.material.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.material.score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Quantity ({m.factors.quantity.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.quantity.score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Location ({m.factors.location.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.location.score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Condition ({m.factors.condition.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.condition.score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Price ({m.factors.price.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.price.score}/100
                      </div>
                    </div>
                    <div className="p-2 rounded bg-stone-50">
                      <div className="text-stone-500">Timing ({m.factors.timing.weight}%)</div>
                      <div className="font-semibold text-stone-800 font-mono tabular-nums mt-0.5">
                        {m.factors.timing.score}/100
                      </div>
                    </div>
                  </div>

                  {/* Explainability Summary Highlights */}
                  {m.summaryExplanation.length > 0 && (
                    <div className="text-xs text-stone-600 bg-emerald-50/50 p-2.5 rounded-lg border border-emerald-100/60 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        {m.summaryExplanation.map((exp, idx) => (
                          <div key={idx}>{exp}</div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
            No active listings available for evaluation against this requirement.
          </div>
        )}
      </div>
    </div>
  );
};
