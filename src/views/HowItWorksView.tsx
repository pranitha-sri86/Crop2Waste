import React from 'react';
import { Sprout, Scale, Truck, CloudRain, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface Props {
  onNavigate: (tab: 'marketplace' | 'matching' | 'recovery') => void;
}

export const HowItWorksView: React.FC<Props> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 pb-20">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Sprout className="w-3.5 h-3.5 text-emerald-600" />
          <span>Circular Bioeconomy Architecture</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight text-balance">
          Transforming Crop Residues into Verified Industrial Value
        </h1>
        <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
          CropWaste2Value bridges the gap between decentralized farmgate harvest residues and regional industrial bio-processors, eliminating field burning and salvaging weather-damaged biomass.
        </p>
      </div>

      {/* 4-Step Process Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
            01
          </div>
          <h3 className="font-bold text-stone-900 text-base">Farmgate Lot Listing</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Farmers list harvested straw, bagasse, cotton stalks, or groundnut shells with moisture content, bale density, pricing, and precise GPS location.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center font-bold text-sm">
            02
          </div>
          <h3 className="font-bold text-stone-900 text-base">Buyer Feedstock Demand</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Biomass thermal plants, pellet mills, biochar developers, and commercial composters post volume tolerances, maximum moisture caps, and budget ceilings.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm">
            03
          </div>
          <h3 className="font-bold text-stone-900 text-base">6-Factor Matching</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Our deterministic rule-based engine evaluates material suitability (40%), volume (20%), logistics radius (15%), moisture (15%), price (5%), and timing (5%).
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-sm">
            04
          </div>
          <h3 className="font-bold text-stone-900 text-base">Logistics & Weighbridge</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Accepted requests transition smoothly through scheduling, farm pickup, in-transit telemetry, and delivery signoff with weighbridge record logging.
          </p>
        </div>
      </div>

      {/* The 6-Factor Deterministic Formulation */}
      <div className="bg-white rounded-2xl border border-stone-200 p-8 space-y-6">
        <div className="space-y-1">
          <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
            Scoring Transparency
          </div>
          <h2 className="text-xl font-bold text-stone-900">
            The Deterministic 6-Factor Compatibility Formula
          </h2>
          <p className="text-xs text-stone-500">
            Unlike opaque machine learning models that generate ungrounded probability guesses, CropWaste2Value provides an explainable 0–100% parameter alignment score:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Material Alignment</span>
              <span className="font-mono text-emerald-700 font-bold">40% Weight</span>
            </div>
            <p className="text-stone-600">
              Matches botanical category (cereal straw, bagasse, oilseed) and shredding/baling compatibility.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Quantity & Volume Fit</span>
              <span className="font-mono text-blue-700 font-bold">20% Weight</span>
            </div>
            <p className="text-stone-600">
              Compares available lot volume with buyer minimum threshold and truckload batch requirements.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Haul Distance & Transit</span>
              <span className="font-mono text-rose-700 font-bold">15% Weight</span>
            </div>
            <p className="text-stone-600">
              Calculates great-circle freight distance against buyer's operational procurement radius to control haulage emissions.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Moisture & Condition</span>
              <span className="font-mono text-cyan-700 font-bold">15% Weight</span>
            </div>
            <p className="text-stone-600">
              Evaluates moisture % against plant boiler or fermentation tolerances (dry baled vs damp salvageable).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Price & Budget Floor</span>
              <span className="font-mono text-emerald-700 font-bold">5% Weight</span>
            </div>
            <p className="text-stone-600">
              Compares farmgate quotation with buyer target purchase budget for economic feasibility.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
            <div className="font-bold text-stone-900 flex items-center justify-between">
              <span>Timing Window</span>
              <span className="font-mono text-violet-700 font-bold">5% Weight</span>
            </div>
            <p className="text-stone-600">
              Ensures field clearance coincides with buyer processing capacity before next sowing cycle.
            </p>
          </div>
        </div>
      </div>

      {/* Climate Resilience & Weather Salvage */}
      <div className="bg-stone-900 text-stone-200 rounded-2xl p-8 space-y-4 border border-stone-800">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
          <CloudRain className="w-4 h-4" />
          <span>Extreme Weather & Climate Resilience</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Why Separate Weather-Affected Biomass from Ordinary Residues?
        </h2>
        <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-3xl">
          Cyclonic rainfall, flash inundation, and unseasonal cloudbursts leave agricultural residues with moisture levels above 30%. While unusable for direct boiler combustion without cost-prohibitive drying, this biomass is an outstanding input for thermophilic windrow composting, biochar pyrolysis, and anaerobic digesters. CropWaste2Value provides a transparent reporting channel so farmers recover economic value rather than abandoning biomass to rot.
        </p>

        <div className="pt-2 flex flex-wrap gap-4">
          <button
            onClick={() => onNavigate('marketplace')}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            Explore Residue Marketplace
          </button>
          <button
            onClick={() => onNavigate('recovery')}
            className="px-5 py-2.5 text-xs font-semibold text-stone-900 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm transition-colors"
          >
            Visit Weather Recovery Desk
          </button>
        </div>
      </div>
    </div>
  );
};
