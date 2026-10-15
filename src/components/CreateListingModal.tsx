import React, { useState } from 'react';
import { User, MaterialCategory, ListingType, MaterialCondition, MeasurementUnit, Listing } from '../types';
import { StorageService } from '../services/storage';
import { X, AlertTriangle, Check, Upload, Sparkles } from 'lucide-react';

interface Props {
  currentUser: User;
  onClose: () => void;
  onSuccess: (newListing: Listing) => void;
}

const AVAILABLE_IMAGES = [
  { label: 'Baled Crop Residues & Straw', url: '/src/assets/images/biomass_straw_bales_1791988989212.jpg' },
  { label: 'Weather-Impact Field & Salvage Stalks', url: '/src/assets/images/weather_impact_field_1791988990258.jpg' },
  { label: 'Harvest Field Landscape', url: '/src/assets/images/crop_waste_hero_harvest_1791988988557.jpg' },
  { label: 'Bioenergy Processing Yard', url: '/src/assets/images/bioenergy_processing_plant_1791988990119.jpg' },
];

export const CreateListingModal: React.FC<Props> = ({ currentUser, onClose, onSuccess }) => {
  const [listingType, setListingType] = useState<ListingType>('ordinary_residue');
  const [category, setCategory] = useState<MaterialCategory>('cereal_straw');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<number>(100);
  const [unit, setUnit] = useState<MeasurementUnit>('Tons');
  const [condition, setCondition] = useState<MaterialCondition>('dry_baled');
  const [moisturePercentage, setMoisturePercentage] = useState<number>(14);
  const [pricePerUnit, setPricePerUnit] = useState<number>(2000);
  const [locationName, setLocationName] = useState(currentUser.location || 'Local Farm Staging Yard');
  const [district, setDistrict] = useState(currentUser.district || 'Ludhiana');
  const [state, setState] = useState(currentUser.state || 'Punjab');
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedImage, setSelectedImage] = useState(AVAILABLE_IMAGES[0].url);

  // Weather-specific state
  const [eventType, setEventType] = useState('Unseasonal Rain & Waterlogging');
  const [eventDate, setEventDate] = useState(new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0]);
  const [damageSeverity, setDamageSeverity] = useState<'mild' | 'moderate' | 'severe'>('moderate');
  const [farmerObservations, setFarmerObservations] = useState('');

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Please provide a descriptive listing title.');
      return;
    }
    if (quantity <= 0) {
      setError('Available quantity must be greater than zero.');
      return;
    }
    if (pricePerUnit <= 0) {
      setError('Price per unit must be greater than zero.');
      return;
    }

    const newListing = StorageService.createListing({
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      title: title.trim(),
      description: description.trim() || 'Agricultural residue available for industrial bio-procurement.',
      category,
      listingType,
      quantity,
      unit,
      condition,
      moisturePercentage,
      pricePerUnit,
      currency: 'INR',
      locationName: locationName.trim(),
      district: district.trim(),
      state: state.trim(),
      latitude: currentUser.state === 'Punjab' ? 30.8 : currentUser.state === 'Andhra Pradesh' ? 16.6 : 18.5,
      longitude: currentUser.state === 'Punjab' ? 75.5 : currentUser.state === 'Andhra Pradesh' ? 82.0 : 73.8,
      availabilityDate,
      status: 'active',
      images: [selectedImage],
      weatherEventDetails:
        listingType === 'weather_affected'
          ? {
              eventType,
              eventDate,
              damageSeverity,
              farmerObservations: farmerObservations || 'Surface moisture high; fiber suitable for composting or pyrolysis.',
              testedByBuyer: false,
            }
          : undefined,
      recommendedUses:
        listingType === 'weather_affected'
          ? ['Thermophilic Composting', 'Biochar Pyrolysis', 'Anaerobic Digester']
          : ['Power Plant Co-Firing', 'Biofuel Pellets', 'Industrial Boilers'],
    });

    onSuccess(newListing);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">List Agricultural Crop Residue</h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Connect with verified bioenergy, pelleting, and compost buyers across regional supply chains.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Listing Type Segmented Control */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Residue Classification
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-stone-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setListingType('ordinary_residue');
                  setSelectedImage(AVAILABLE_IMAGES[0].url);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors text-center ${
                  listingType === 'ordinary_residue'
                    ? 'bg-white text-stone-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Standard Agricultural Residue
              </button>
              <button
                type="button"
                onClick={() => {
                  setListingType('weather_affected');
                  setSelectedImage(AVAILABLE_IMAGES[1].url);
                  setCondition('damp_salvageable');
                  setMoisturePercentage(32);
                }}
                className={`py-2 px-3 text-xs font-medium rounded-md transition-colors text-center ${
                  listingType === 'weather_affected'
                    ? 'bg-white text-amber-900 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Recoverable Weather-Affected Biomass
              </button>
            </div>
          </div>

          {/* Weather Impact Sub-panel if applicable */}
          {listingType === 'weather_affected' && (
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Voluntary Weather Event Impact Record</span>
              </div>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                Notice: Farmer-reported observations inform suitable recovery pathways (e.g. biochar/composting) and do not substitute for formal crop loss certifications.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-medium text-amber-900 mb-1">Weather Event Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    <option value="Unseasonal Rain & Waterlogging">Unseasonal Rain & Waterlogging</option>
                    <option value="Cyclone Inundation">Cyclone Inundation</option>
                    <option value="Hailstorm Crop Shatter">Hailstorm Crop Shatter</option>
                    <option value="Cloudburst Flash Runoff">Cloudburst Flash Runoff</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-amber-900 mb-1">Estimated Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={e => setEventDate(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-medium text-amber-900 mb-1">
                    Farmer Observations (Moisture, Mold Status, Recovery Readiness)
                  </label>
                  <input
                    type="text"
                    value={farmerObservations}
                    onChange={e => setFarmerObservations(e.target.value)}
                    placeholder="e.g. Windrows sun-drying for 3 days; fibrous core strong, no decay."
                    className="w-full bg-white border border-amber-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-700 mb-1">Listing Title</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Mechanically Baled Paddy Straw (Dry Storage)"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as MaterialCategory)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="cereal_straw">Cereal Straw (Paddy/Wheat)</option>
                <option value="sugarcane_bagasse">Sugarcane Bagasse</option>
                <option value="oilseed_residue">Oilseed Residue (Mustard/Groundnut)</option>
                <option value="fiber_cotton">Cotton & Fibrous Stalks</option>
                <option value="husk_shell">Husk & Hard Shells</option>
                <option value="horticulture_waste">Horticultural Biomass</option>
                <option value="agro_industrial">Agro-Industrial Residue</option>
              </select>
            </div>
          </div>

          {/* Quantity, Unit, Condition, Moisture */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Available Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
              <select
                value={unit}
                onChange={e => setUnit(e.target.value as MeasurementUnit)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="Tons">Tons</option>
                <option value="Quintals">Quintals</option>
                <option value="Bales">Bales</option>
                <option value="Kg">Kg</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value as MaterialCondition)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none bg-white"
              >
                <option value="dry_baled">Dry Baled</option>
                <option value="loose_dry">Loose Dry</option>
                <option value="moderate_moisture">Moderate Moisture</option>
                <option value="damp_salvageable">Damp (Salvageable)</option>
                <option value="weather_damaged">Weather Damaged</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Moisture (%)</label>
              <input
                type="number"
                min="5"
                max="80"
                value={moisturePercentage}
                onChange={e => setMoisturePercentage(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Price, Currency, Availability Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Price Per {unit} (₹ INR)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={pricePerUnit}
                onChange={e => setPricePerUnit(Number(e.target.value))}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono tabular-nums"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Availability Date</label>
              <input
                type="date"
                value={availabilityDate}
                onChange={e => setAvailabilityDate(e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Location / Mandi</label>
              <input
                type="text"
                value={locationName}
                onChange={e => setLocationName(e.target.value)}
                placeholder="e.g. Jagraon Mandi Road"
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Material Description & Handling Details
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detail storage conditions, machinery used (e.g. square baler), accessibility for heavy transport trucks..."
              className="w-full border border-stone-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Photo asset selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Verified Material Photograph
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_IMAGES.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`relative rounded-lg overflow-hidden border-2 cursor-pointer aspect-4/3 ${
                    selectedImage === img.url ? 'border-emerald-600 ring-2 ring-emerald-500/30' : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 p-1 text-[10px] text-white text-center truncate">
                    {img.label}
                  </div>
                  {selectedImage === img.url && (
                    <div className="absolute top-1 right-1 bg-emerald-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              Publish Marketplace Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
