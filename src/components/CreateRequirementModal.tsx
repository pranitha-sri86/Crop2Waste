import React, { useState } from 'react';
import { User, BuyerRequirement, MaterialCategory, BuyerType, MaterialCondition, MeasurementUnit } from '../types';
import { StorageService } from '../services/storage';
import { X, AlertTriangle } from 'lucide-react';

interface Props {
  currentUser: User;
  onClose: () => void;
  onSuccess: (newReq: BuyerRequirement) => void;
}

export const CreateRequirementModal: React.FC<Props> = ({ currentUser, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [buyerType, setBuyerType] = useState<BuyerType>('biomass_power');
  const [materialCategory, setMaterialCategory] = useState<MaterialCategory>('cereal_straw');
  const [materialName, setMaterialName] = useState('Paddy Straw Bales');
  const [minQuantity, setMinQuantity] = useState(100);
  const [maxQuantity, setMaxQuantity] = useState(500);
  const [unit, setUnit] = useState<MeasurementUnit>('Tons');
  const [acceptableConditions, setAcceptableConditions] = useState<MaterialCondition[]>(['dry_baled', 'loose_dry']);
  const [maxMoisturePercentage, setMaxMoisturePercentage] = useState(18);
  const [targetPriceMin, setTargetPriceMin] = useState(1800);
  const [targetPriceMax, setTargetPriceMax] = useState(2400);
  const [locationName, setLocationName] = useState(currentUser.location || 'Industrial Processing Hub');
  const [district, setDistrict] = useState(currentUser.district || 'Karnal');
  const [state, setState] = useState(currentUser.state || 'Haryana');
  const [maxDistanceKm, setMaxDistanceKm] = useState(250);
  const [requiredByDate, setRequiredByDate] = useState('2026-11-15');
  const [acceptsWeatherAffected, setAcceptsWeatherAffected] = useState(false);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const toggleCondition = (cond: MaterialCondition) => {
    if (acceptableConditions.includes(cond)) {
      if (acceptableConditions.length > 1) {
        setAcceptableConditions(acceptableConditions.filter(c => c !== cond));
      }
    } else {
      setAcceptableConditions([...acceptableConditions, cond]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a requirement title.');
      return;
    }
    if (minQuantity <= 0 || maxQuantity < minQuantity) {
      setError('Please enter a valid quantity range.');
      return;
    }
    if (targetPriceMax < targetPriceMin) {
      setError('Maximum target price must be equal or greater than minimum price.');
      return;
    }

    const newReq = StorageService.createRequirement({
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCompany: currentUser.organization || 'Green Energy Co.',
      buyerType,
      title: title.trim(),
      materialCategory,
      materialName: materialName.trim(),
      minQuantity,
      maxQuantity,
      unit,
      acceptableConditions,
      maxMoisturePercentage,
      targetPriceMin,
      targetPriceMax,
      currency: 'INR',
      locationName: locationName.trim(),
      district: district.trim(),
      state: state.trim(),
      latitude: currentUser.state === 'Haryana' ? 29.7 : 18.5,
      longitude: currentUser.state === 'Haryana' ? 77.0 : 73.8,
      maxDistanceKm,
      requiredByDate,
      acceptsWeatherAffected,
      notes: notes.trim(),
      status: 'active',
    });

    onSuccess(newReq);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Post Biomass Procurement Requirement</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Specify your feedstock criteria to trigger automated compatibility matching with regional farmers.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Requirement Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Paddy Straw Feedstock for 15MW Thermal Co-firing Unit"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Buyer Facility Type</label>
              <select
                value={buyerType}
                onChange={e => setBuyerType(e.target.value as BuyerType)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="biomass_power">Biomass Power Plant / Thermal Co-Firing</option>
                <option value="compost_biofertilizer">Composting & Organic Fertilizer Facility</option>
                <option value="biofuel_pellet">Bio-Coal Briquetting & Pellet Mill</option>
                <option value="biochar_pyrolysis">Biochar Pyrolysis & Carbon Removal</option>
                <option value="paper_packaging">Paper Pulp & Packaging Board Mill</option>
                <option value="cattle_feed">Cattle Feed & Silage Producer</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Material Category</label>
              <select
                value={materialCategory}
                onChange={e => setMaterialCategory(e.target.value as MaterialCategory)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="cereal_straw">Cereal Straw (Paddy / Wheat)</option>
                <option value="sugarcane_bagasse">Sugarcane Bagasse</option>
                <option value="oilseed_residue">Oilseed Residue (Mustard/Groundnut)</option>
                <option value="fiber_cotton">Cotton Stalks & Agro-Fiber</option>
                <option value="husk_shell">Rice Husk & Hard Shells</option>
                <option value="horticulture_waste">Horticultural Biomass</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Min Volume ({unit})</label>
              <input
                type="number"
                min="10"
                value={minQuantity}
                onChange={e => setMinQuantity(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Volume ({unit})</label>
              <input
                type="number"
                min="10"
                value={maxQuantity}
                onChange={e => setMaxQuantity(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Moisture (%)</label>
              <input
                type="number"
                min="5"
                max="60"
                value={maxMoisturePercentage}
                onChange={e => setMaxMoisturePercentage(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Max Haul (km)</label>
              <input
                type="number"
                min="20"
                max="800"
                value={maxDistanceKm}
                onChange={e => setMaxDistanceKm(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Price Floor (₹/Ton)</label>
              <input
                type="number"
                min="500"
                step="50"
                value={targetPriceMin}
                onChange={e => setTargetPriceMin(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Target Price Ceiling (₹/Ton)</label>
              <input
                type="number"
                min="500"
                step="50"
                value={targetPriceMax}
                onChange={e => setTargetPriceMax(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Acceptable Physical Conditions
            </label>
            <div className="flex flex-wrap gap-2">
              {(['dry_baled', 'loose_dry', 'moderate_moisture', 'damp_salvageable', 'weather_damaged'] as MaterialCondition[]).map(cond => {
                const isSelected = acceptableConditions.includes(cond);
                const labels: Record<MaterialCondition, string> = {
                  dry_baled: 'Dry Baled',
                  loose_dry: 'Loose Dry',
                  moderate_moisture: 'Moderate Moisture',
                  damp_salvageable: 'Damp (Salvageable)',
                  weather_damaged: 'Weather Damaged',
                };
                return (
                  <button
                    key={cond}
                    type="button"
                    onClick={() => toggleCondition(cond)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isSelected
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-semibold'
                        : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                    }`}
                  >
                    {labels[cond]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Weather-affected tolerance toggle */}
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-stone-900">
                Accept Weather-Affected & Salvageable Biomass
              </div>
              <div className="text-[11px] text-stone-500">
                Include rain-soaked or storm-damaged crop residues in matching results at negotiated salvage rates.
              </div>
            </div>
            <input
              type="checkbox"
              checked={acceptsWeatherAffected}
              onChange={e => setAcceptsWeatherAffected(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-stone-300 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Procurement Specifications & Weighbridge Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Moisture deduction formula applies beyond 18%. Delivery accepted Mon-Sat 8am-6pm."
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors"
            >
              Publish Procurement Requirement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
