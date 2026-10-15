import React, { useState } from 'react';
import { Listing, MaterialRequest, Transaction, WeatherRecoveryReport, User } from '../types';
import { StorageService } from '../services/storage';
import { Sprout, Plus, CheckCircle2, XCircle, Clock, Truck, CloudRain, AlertTriangle, Scale, Eye } from 'lucide-react';

interface Props {
  currentUser: User;
  listings: Listing[];
  requests: MaterialRequest[];
  transactions: Transaction[];
  weatherReports: WeatherRecoveryReport[];
  onOpenCreateListing: () => void;
  onOpenFileWeatherReport: () => void;
  onViewTransaction: (tx: Transaction) => void;
  onSelectListing: (listing: Listing) => void;
}

export const FarmerDashboardView: React.FC<Props> = ({
  currentUser,
  listings,
  requests,
  transactions,
  weatherReports,
  onOpenCreateListing,
  onOpenFileWeatherReport,
  onViewTransaction,
  onSelectListing,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'requests' | 'transactions' | 'weather'>('requests');

  // Filter items belonging to this farmer
  const myListings = listings.filter(l => l.farmerId === currentUser.id);
  const myRequests = requests.filter(r => r.farmerId === currentUser.id);
  const myTransactions = transactions.filter(t => t.farmerId === currentUser.id);
  const myReports = weatherReports.filter(w => w.farmerId === currentUser.id);

  const pendingRequests = myRequests.filter(r => r.status === 'REQUESTED');
  const activeVolume = myListings.reduce((sum, l) => sum + (l.status === 'active' ? l.availableQuantity : 0), 0);

  const handleAcceptRequest = (req: MaterialRequest) => {
    const note = window.prompt(`Confirm acceptance for ${req.requestedQuantity} ${req.unit} to ${req.buyerCompany} at ₹${req.offeredPricePerUnit}/${req.unit}:`, 'Confirmed available for pickup at farm staging area.');
    if (note !== null) {
      StorageService.updateRequestStatus(req.id, 'ACCEPTED', note);
    }
  };

  const handleRejectRequest = (req: MaterialRequest) => {
    const reason = window.prompt('Specify reason for decline:', 'Residue lot already reserved or moisture adjustment unavailable.');
    if (reason !== null) {
      StorageService.updateRequestStatus(req.id, 'REJECTED', reason);
    }
  };

  const handleToggleListingStatus = (listing: Listing) => {
    const nextStatus = listing.status === 'active' ? 'paused' : 'active';
    StorageService.updateListing(listing.id, { status: nextStatus });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16">
      {/* Profile & KPI Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">{currentUser.name}</h1>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium border border-emerald-200">
                  Verified Farmer
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                {currentUser.organization} · {currentUser.district}, {currentUser.state} · {currentUser.phone}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenFileWeatherReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors"
            >
              <CloudRain className="w-3.5 h-3.5 text-amber-600" />
              <span>Report Weather Damage</span>
            </button>
            <button
              onClick={onOpenCreateListing}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Residue Lot</span>
            </button>
          </div>
        </div>

        {/* 4 KPI metric blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Available Biomass</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {activeVolume.toLocaleString()} <span className="text-xs font-normal text-stone-500">Tons</span>
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Active Listings</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {myListings.filter(l => l.status === 'active').length}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Pending Buyer Requests</div>
            <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
              {pendingRequests.length}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Active Deliveries</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {myTransactions.filter(t => t.status !== 'COMPLETED').length}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-emerald-700 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <span>Incoming Requests</span>
          {pendingRequests.length > 0 && (
            <span className="bg-emerald-500 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {pendingRequests.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('listings')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'listings'
              ? 'bg-emerald-700 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          My Residue Lots ({myListings.length})
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'transactions'
              ? 'bg-emerald-700 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Shipments & Orders ({myTransactions.length})
        </button>

        <button
          onClick={() => setActiveTab('weather')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'weather'
              ? 'bg-emerald-700 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Weather Recovery Reports ({myReports.length})
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. Incoming Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length > 0 ? (
            myRequests.map(req => {
              const isPending = req.status === 'REQUESTED';
              return (
                <div
                  key={req.id}
                  className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-stone-500 flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{req.buyerCompany}</span>
                        <span>({req.buyerName})</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{req.buyerPhone}</span>
                      </div>
                      <h3 className="text-base font-bold text-stone-900 mt-1">
                        Request for: {req.listingTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-2.5 py-1 rounded font-semibold ${
                          req.status === 'ACCEPTED'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : req.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>
                  </div>

                  {/* Request specs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl text-xs">
                    <div>
                      <span className="text-stone-500 block">Requested Volume</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        {req.requestedQuantity} {req.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Offered Rate</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        ₹{req.offeredPricePerUnit.toLocaleString()} / {req.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Total Lot Value</span>
                      <strong className="text-emerald-700 font-mono tabular-nums">
                        ₹{req.totalAmount.toLocaleString()}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Target Pickup</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        {req.proposedPickupDate}
                      </strong>
                    </div>
                  </div>

                  {/* Buyer message */}
                  <div className="text-xs text-stone-600 bg-stone-50/70 p-3 rounded-lg border border-stone-200/60">
                    <strong className="text-stone-800">Buyer Logistics & Inspection Terms: </strong>
                    {req.message}
                  </div>

                  {/* Action buttons */}
                  {isPending && (
                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
                      <button
                        onClick={() => handleRejectRequest(req)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline Offer</span>
                      </button>
                      <button
                        onClick={() => handleAcceptRequest(req)}
                        className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept Offer & Schedule Logistics</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No buyer requests received yet.
            </div>
          )}
        </div>
      )}

      {/* 2. My Listings */}
      {activeTab === 'listings' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myListings.map(listing => (
              <div
                key={listing.id}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden flex flex-col justify-between shadow-2xs"
              >
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="capitalize">{listing.listingType.replace('_', ' ')}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                        listing.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-stone-100 text-stone-600'
                      }`}
                    >
                      {listing.status.toUpperCase()}
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectListing(listing)}
                    className="font-bold text-stone-900 text-base hover:text-emerald-700 cursor-pointer"
                  >
                    {listing.title}
                  </h3>

                  <div className="text-xs text-stone-600 line-clamp-2">
                    {listing.description}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                    <div>
                      <span className="text-stone-400 block">Available</span>
                      <strong className="text-stone-800 font-mono tabular-nums">
                        {listing.availableQuantity} / {listing.quantity} {listing.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Rate</span>
                      <strong className="text-stone-800 font-mono tabular-nums">
                        ₹{listing.pricePerUnit}/{listing.unit}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleToggleListingStatus(listing)}
                    className="text-stone-600 hover:text-stone-900 font-medium"
                  >
                    {listing.status === 'active' ? 'Pause Listing' : 'Re-activate'}
                  </button>

                  <button
                    onClick={() => onSelectListing(listing)}
                    className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Public Card</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Shipments & Transactions */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          {myTransactions.length > 0 ? (
            myTransactions.map(tx => (
              <div
                key={tx.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-stone-400 font-mono">
                      Order #{tx.id} · Scheduled {tx.pickupScheduledDate}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {tx.listingTitle} ({tx.quantity} {tx.unit})
                    </h3>
                    <div className="text-xs text-stone-600 mt-0.5">
                      Buyer: <strong>{tx.buyerCompany}</strong> · Contact: {tx.buyerPhone}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-lg font-semibold">
                      {tx.status.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => onViewTransaction(tx)}
                      className="px-3.5 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Track & Update</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 bg-stone-50 rounded-xl text-xs">
                  <div>
                    <span className="text-stone-500 block">Agreed Total Value</span>
                    <strong className="text-emerald-700 font-mono tabular-nums text-sm">
                      ₹{tx.totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Fleet Logistics</span>
                    <span className="text-stone-800">{tx.logisticsArrangedBy}</span>
                  </div>
                  <div>
                    <span className="text-stone-500 block">Latest Audit Event</span>
                    <span className="text-stone-800 truncate block">
                      {tx.events[tx.events.length - 1]?.notes || 'Dispatched'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No active shipment transactions currently in pipeline.
            </div>
          )}
        </div>
      )}

      {/* 4. Weather Recovery Reports */}
      {activeTab === 'weather' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs text-stone-500">
              Voluntary reports filed by you to salvage damaged crop residues into biochar and composting.
            </div>
            <button
              onClick={onOpenFileWeatherReport}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>File New Weather Report</span>
            </button>
          </div>

          {myReports.length > 0 ? (
            myReports.map(rep => (
              <div
                key={rep.id}
                className="bg-white rounded-xl border border-amber-200 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-amber-600" />
                    <span className="font-semibold text-stone-900 capitalize">
                      {rep.weatherEventType.replace('_', ' ')}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-500 font-mono">{rep.eventDate}</span>
                  </div>
                  <span className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded text-[11px] font-semibold">
                    {rep.status.toUpperCase()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900">
                  {rep.affectedCrop} (~{rep.estimatedQuantityTons} Tons)
                </h3>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {rep.farmerObservations}
                </p>

                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <span>Suitable Salvage:</span>
                  {rep.suitableAlternativeUses.map((use, i) => (
                    <span key={i} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded text-[11px]">
                      {use}
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No weather damage recovery reports filed.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
