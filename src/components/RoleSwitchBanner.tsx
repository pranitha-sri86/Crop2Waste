import React from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';
import { ArrowLeftRight, RotateCcw, ShieldCheck } from 'lucide-react';

interface Props {
  currentUser: User;
  onUserChange: (user: User) => void;
}

export const RoleSwitchBanner: React.FC<Props> = ({ currentUser, onUserChange }) => {
  const allUsers = StorageService.getUsers();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = allUsers.find(u => u.id === e.target.value);
    if (selected) {
      StorageService.setCurrentUser(selected);
      onUserChange(selected);
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all marketplace listings, requests, and transactions to initial seed state?')) {
      StorageService.resetDemoData();
      const defaultUser = StorageService.getCurrentUser();
      onUserChange(defaultUser);
    }
  };

  return (
    <div className="bg-stone-900 text-stone-200 text-xs border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-stone-400 font-medium">
            <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Persona:</span>
          </span>
          <select
            value={currentUser.id}
            onChange={handleSelect}
            className="bg-stone-800 text-stone-100 border border-stone-700 rounded px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
          >
            {allUsers.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} — {user.role === 'farmer' ? '🌾 Farmer' : '🏭 Buyer'} ({user.district}, {user.state})
              </option>
            ))}
          </select>
          <span className="hidden md:inline-flex items-center gap-1 text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-stone-300 font-medium">{currentUser.organization || currentUser.name}</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-stone-400 hidden sm:inline">
            Active Mode: <strong className="text-emerald-400 capitalize">{currentUser.role} Workspace</strong>
          </span>
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-stone-400 hover:text-stone-100 transition-colors py-1 px-2 rounded hover:bg-stone-800"
            title="Reset to initial seed marketplace data"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
