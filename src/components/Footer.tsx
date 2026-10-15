import React from 'react';
import { Sprout } from 'lucide-react';

interface Props {
  onNavigate: (tab: 'marketplace' | 'matching' | 'recovery' | 'dashboard' | 'about') => void;
}

export const Footer: React.FC<Props> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-12 pb-8 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg tracking-tight">
              <Sprout className="w-5 h-5 text-emerald-400" />
              <span>CropWaste2Value</span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              From Crop Waste to Market Value. Connecting agricultural producers with industrial bioenergy, composting, and biochar processors to eliminate crop burning and monetize salvageable biomass.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('marketplace')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Residue Marketplace
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('matching')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Explainable Matching Engine
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('recovery')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Weather Recovery Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Logistics & Tracking
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Approved Utilization Pathways
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>Thermal Power Plant Co-Firing (Paddy Straw)</li>
              <li>Compressed Bio-Gas (CBG) & Methanation</li>
              <li>Thermophilic Windrow Composting</li>
              <li>Torrefied Pellets & Bio-Coal Briquettes</li>
              <li>Biochar Soil Carbon Pyrolysis</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-3">
              Transparency & Notice
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Material quantities, moisture levels, and weather damage descriptions are voluntary farmer-reported data. CropWaste2Value provides transparent compatibility scoring and logistics coordination; sampling verification occurs at weighbridge arrival.
            </p>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 CropWaste2Value Technologies. Built for sustainable circular bioeconomy.</p>
          <div className="flex items-center gap-6">
            <span>Deterministic 6-Factor Scoring</span>
            <span>·</span>
            <span>Zero Crop Burning</span>
            <span>·</span>
            <span>Climate-Resilient Biomass</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
