import React from 'react';
import { User } from '../types';
import { Plus, UserCircle2 } from 'lucide-react';

export type ActiveTab = 'marketplace' | 'matching' | 'recovery' | 'dashboard' | 'about';

interface Props {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  currentUser: User;
  onOpenCreateListing: () => void;
  onOpenCreateRequirement: () => void;
}

export const Navbar: React.FC<Props> = ({
  activeTab,
  onTabChange,
  currentUser,
  onOpenCreateListing,
  onOpenCreateRequirement,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onTabChange('marketplace')}
            className="text-xl font-bold tracking-tight text-emerald-900 hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 focus:outline-none"
          >
            <span>CropWaste<span className="text-emerald-600 font-extrabold">2</span>Value</span>
          </button>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => onTabChange('marketplace')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'marketplace'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Marketplace
            </button>

            <button
              onClick={() => onTabChange('matching')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'matching'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Matching Engine
            </button>

            <button
              onClick={() => onTabChange('recovery')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'recovery'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              Weather Recovery
            </button>

            <button
              onClick={() => onTabChange('dashboard')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              <span>{currentUser.role === 'farmer' ? 'Farmer Desk' : 'Buyer Hub'}</span>
            </button>

            <button
              onClick={() => onTabChange('about')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-1 ${
                activeTab === 'about'
                  ? 'text-emerald-700 font-semibold border-b-2 border-emerald-600'
                  : ''
              }`}
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentUser.role === 'farmer' ? (
              <button
                onClick={onOpenCreateListing}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>List Crop Residue</span>
              </button>
            ) : (
              <button
                onClick={onOpenCreateRequirement}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Post Requirement</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-stone-100 text-xs font-medium text-stone-600">
          <button
            onClick={() => onTabChange('marketplace')}
            className={`whitespace-nowrap ${activeTab === 'marketplace' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Marketplace
          </button>
          <button
            onClick={() => onTabChange('matching')}
            className={`whitespace-nowrap ${activeTab === 'matching' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Matching
          </button>
          <button
            onClick={() => onTabChange('recovery')}
            className={`whitespace-nowrap ${activeTab === 'recovery' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Recovery
          </button>
          <button
            onClick={() => onTabChange('dashboard')}
            className={`whitespace-nowrap ${activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onTabChange('about')}
            className={`whitespace-nowrap ${activeTab === 'about' ? 'text-emerald-700 font-bold' : ''}`}
          >
            Guide
          </button>
        </div>
      </div>
    </header>
  );
};
