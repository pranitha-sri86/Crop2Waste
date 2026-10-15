import React, { useState } from 'react';
import { User, WeatherRecoveryReport } from '../types';
import { StorageService } from '../services/storage';
import { X, AlertTriangle, CloudRain, CheckCircle2 } from 'lucide-react';

interface Props {
  currentUser: User;
  onClose: () => void;
  onSuccess: (report: WeatherRecoveryReport) => void;
}

export const WeatherRecoveryModal: React.FC<Props> = ({ currentUser, onClose, onSuccess }) => {
  const [weatherEventType, setWeatherEventType] = useState<'unseasonal_rain' | 'cyclone_flood' | 'hailstorm' | 'drought' | 'flash_flood'>('unseasonal_rain');
  const [eventDate, setEventDate] = useState(new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0]);
  const [affectedCrop, setAffectedCrop] = useState('Paddy / Rice Straw Residue');
  const [estimatedQuantityTons, setEstimatedQuantityTons] = useState(80);
  const [materialCondition, setMaterialCondition] = useState('Moist and waterlogged; intact fiber, zero rotting');
  const [currentMoistureEst, setCurrentMoistureEst] = useState('30% - 35%');
  const [farmerObservations, setFarmerObservations] = useState('');
  const [location, setLocation] = useState(currentUser.location || 'Riverbank canal field');
  const [district, setDistrict] = useState(currentUser.district || 'East Godavari');
  const [state, setState] = useState(currentUser.state || 'Andhra Pradesh');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!affectedCrop.trim()) {
      setError('Please specify the affected crop.');
      return;
    }
    if (estimatedQuantityTons <= 0) {
      setError('Estimated quantity must be greater than zero.');
      return;
    }

    const newReport = StorageService.createWeatherReport({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      weatherEventType,
      eventDate,
      affectedCrop: affectedCrop.trim(),
      estimatedQuantityTons,
      materialCondition: materialCondition.trim(),
      currentMoistureEst: currentMoistureEst.trim(),
      farmerObservations: farmerObservations.trim() || 'Surface water drained; material piled on ridges ready for biomass salvage.',
      location: location.trim(),
      district: district.trim(),
      state: state.trim(),
      suitableAlternativeUses: ['Thermophilic Composting', 'Biochar Pyrolysis', 'Anaerobic Digester'],
      status: 'reported',
      images: ['/src/assets/images/weather_impact_field_1791988990258.jpg'],
    });

    onSuccess(newReport);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold text-white">File Weather Impact Recovery Report</h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Voluntarily document weather-affected crop residue to mobilize salvage buyers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Statutory disclaimer banner */}
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold block mb-0.5">Voluntary Observation Notice:</strong>
              This report records farmer observation of weather-impacted biomass for recovery applications (composting, biochar, pellets). It does not guarantee compensation or replace insurance assessment.
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Weather Event</label>
              <select
                value={weatherEventType}
                onChange={e => setWeatherEventType(e.target.value as any)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="unseasonal_rain">Unseasonal Rain & Downpour</option>
                <option value="cyclone_flood">Cyclone & Flood Inundation</option>
                <option value="hailstorm">Hailstorm Lodging & Shatter</option>
                <option value="flash_flood">Flash Flood Runoff</option>
                <option value="drought">Premature Drying / Drought Stress</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Date of Occurrence</label>
              <input
                type="date"
                value={eventDate}
                onChange={e => setEventDate(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Affected Crop / Biomass</label>
              <input
                type="text"
                value={affectedCrop}
                onChange={e => setAffectedCrop(e.target.value)}
                placeholder="e.g. Wetland Paddy Straw"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Estimated Quantity (Tons)</label>
              <input
                type="number"
                min="5"
                value={estimatedQuantityTons}
                onChange={e => setEstimatedQuantityTons(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Material Condition</label>
              <input
                type="text"
                value={materialCondition}
                onChange={e => setMaterialCondition(e.target.value)}
                placeholder="e.g. Intact stalks, elevated moisture"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Moisture Estimate</label>
              <input
                type="text"
                value={currentMoistureEst}
                onChange={e => setCurrentMoistureEst(e.target.value)}
                placeholder="e.g. 30% - 35%"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Field Observations & Recovery Recommendations
            </label>
            <textarea
              rows={3}
              value={farmerObservations}
              onChange={e => setFarmerObservations(e.target.value)}
              placeholder="Describe access road conditions, drainage steps taken, whether material is bundled or loose..."
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
              className="px-5 py-2 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg shadow-sm transition-colors"
            >
              Submit Recovery Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
