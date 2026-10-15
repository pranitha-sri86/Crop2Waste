import React, { useState, useMemo } from 'react';
import { Listing, User, MaterialCategory, ListingType } from '../types';
import { MarketplaceCard } from '../components/MarketplaceCard';
import { Search, Filter, Sprout, ArrowUpDown, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  listings: Listing[];
  currentUser: User;
  onSelectListing: (listing: Listing) => void;
  onRequestListing: (listing: Listing) => void;
  onOpenCreateListing: () => void;
}

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Biomass' },
  { id: 'cereal_straw', label: 'Cereal Straw' },
  { id: 'sugarcane_bagasse', label: 'Sugarcane Bagasse' },
  { id: 'oilseed_residue', label: 'Oilseed Stover' },
  { id: 'fiber_cotton', label: 'Cotton & Fiber' },
  { id: 'husk_shell', label: 'Husk & Shell' },
];

export const MarketplaceView: React.FC<Props> = ({
  listings,
  currentUser,
  onSelectListing,
  onRequestListing,
  onOpenCreateListing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [listingTypeFilter, setListingTypeFilter] = useState<'all' | ListingType>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc' | 'quantity_desc'>('newest');
  const [maxPrice, setMaxPrice] = useState<number>(3500);

  const filteredListings = useMemo(() => {
    return listings
      .filter(item => {
        if (item.status !== 'active') return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description.toLowerCase().includes(q);
          const matchLoc = `${item.locationName} ${item.district} ${item.state}`.toLowerCase().includes(q);
          const matchFarmer = item.farmerName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchFarmer) return false;
        }
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (listingTypeFilter !== 'all' && item.listingType !== listingTypeFilter) return false;
        if (item.pricePerUnit > maxPrice) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price_asc') return a.pricePerUnit - b.pricePerUnit;
        if (sortBy === 'price_desc') return b.pricePerUnit - a.pricePerUnit;
        if (sortBy === 'quantity_desc') return b.availableQuantity - a.availableQuantity;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [listings, searchQuery, selectedCategory, listingTypeFilter, maxPrice, sortBy]);

  const totalActiveVolume = useMemo(() => {
    return listings
      .filter(l => l.status === 'active')
      .reduce((acc, curr) => acc + curr.availableQuantity, 0);
  }, [listings]);

  return (
    <div className="space-y-8 pb-16">
      {/* Editorial Hero Split adhering to 60-30-10 & anti-slop rules */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                <Sprout className="w-4 h-4 text-emerald-600" />
                <span>Agricultural Biomass & Resource Recovery</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight text-balance leading-tight">
                From Crop Waste to Market Value.
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                A digital marketplace enabling farmers to list agricultural residues and salvageable weather-impacted biomass, while connecting industrial bio-power, pelleting, biochar, and composting facilities with transparent, explainable compatibility matching.
              </p>

              {/* 4-column metric strip */}
              <div className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-stone-200 text-stone-900">
                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
                    {totalActiveVolume.toLocaleString()}
                    <span className="text-xs font-normal text-stone-500 ml-1">Tons</span>
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Active Listed Biomass</div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-emerald-700">
                    100%
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Zero Burning Diverted</div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-stone-900">
                    6 Factors
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Explainable Scoring</div>
                </div>

                <div>
                  <div className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-amber-700">
                    Salvage Ready
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Weather-Impact Desk</div>
                </div>
              </div>
            </div>

            {/* Hero Image Showcase */}
            <div className="lg:col-span-5 relative rounded-2xl overflow-hidden aspect-16/10 border border-stone-200 shadow-sm">
              <img
                src="/src/assets/images/crop_waste_hero_harvest_1791988988557.jpg"
                alt="Golden hour agricultural crop residue harvest"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/90 via-stone-900/40 to-transparent p-4 text-white">
                <div className="text-xs font-semibold">Decentralized Regional Residue Aggregation</div>
                <div className="text-[11px] text-stone-300">Linking farmgate balers directly with commercial off-takers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Marketplace Controls & Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Interactive Filter Toolbar */}
        <div className="bg-white rounded-xl border border-stone-200 p-4 space-y-4 shadow-2xs">
          {/* Top row: search & sort */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search residue name, location, district, or farmer..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-stone-50/50"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
                <span className="hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as any)}
                  className="bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="newest">Latest Listings</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="quantity_desc">Available Volume</option>
                </select>
              </div>

              {currentUser.role === 'farmer' && (
                <button
                  onClick={onOpenCreateListing}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors whitespace-nowrap"
                >
                  + Add Listing
                </button>
              )}
            </div>
          </div>

          {/* Classification tabs & category filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100">
            {/* Segmented listing type buttons */}
            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg text-xs">
              <button
                onClick={() => setListingTypeFilter('all')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  listingTypeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All Lots ({listings.filter(l => l.status === 'active').length})
              </button>
              <button
                onClick={() => setListingTypeFilter('ordinary_residue')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  listingTypeFilter === 'ordinary_residue'
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Standard Residues
              </button>
              <button
                onClick={() => setListingTypeFilter('weather_affected')}
                className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
                  listingTypeFilter === 'weather_affected'
                    ? 'bg-white text-amber-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Weather Recovery
              </button>
            </div>

            {/* Category horizontal filters */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'bg-stone-50 text-stone-600 hover:bg-stone-100 border border-stone-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Listings Result Grid */}
        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map(listing => (
              <MarketplaceCard
                key={listing.id}
                listing={listing}
                currentUser={currentUser}
                onSelect={onSelectListing}
                onRequest={onRequestListing}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center space-y-3">
            <Sprout className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">No Matching Residue Listings</h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              No agricultural residues match your current filter parameters. Try clearing the search query or adjusting the category selection.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setListingTypeFilter('all');
                setMaxPrice(3500);
              }}
              className="px-4 py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Reset Filter Parameters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
