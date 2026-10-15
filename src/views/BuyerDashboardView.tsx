import React, { useState } from 'react';
import { BuyerRequirement, MaterialRequest, Transaction, User, Listing } from '../types';
import { Plus, Truck, CheckCircle2, Clock, Sparkles, Building2, Scale, ArrowRight, ShieldCheck, Factory } from 'lucide-react';

interface Props {
  currentUser: User;
  requirements: BuyerRequirement[];
  requests: MaterialRequest[];
  transactions: Transaction[];
  onOpenCreateRequirement: () => void;
  onNavigateToMatching: (reqId?: string) => void;
  onViewTransaction: (tx: Transaction) => void;
}

export const BuyerDashboardView: React.FC<Props> = ({
  currentUser,
  requirements,
  requests,
  transactions,
  onOpenCreateRequirement,
  onNavigateToMatching,
  onViewTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<'requirements' | 'requests' | 'deliveries' | 'analytics'>('requirements');

  const myRequirements = requirements.filter(r => r.buyerId === currentUser.id);
  const myRequests = requests.filter(r => r.buyerId === currentUser.id);
  const myTransactions = transactions.filter(t => t.buyerId === currentUser.id);

  const totalProcuredTons = myTransactions.reduce((acc, t) => acc + t.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 pb-16">
      {/* Header Profile & Procurement KPIs */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center font-bold text-lg">
              <Factory className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">
                  {currentUser.organization || currentUser.name}
                </h1>
                <span className="text-xs bg-stone-100 text-stone-700 px-2 py-0.5 rounded font-medium border border-stone-200">
                  Verified Bio-Processor
                </span>
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Representative: {currentUser.name} · {currentUser.district}, {currentUser.state} · {currentUser.phone}
              </div>
            </div>
          </div>

          <button
            onClick={onOpenCreateRequirement}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post Procurement Requirement</span>
          </button>
        </div>

        {/* 4 KPI metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100">
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Active Requirements</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {myRequirements.filter(r => r.status === 'active').length}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Submitted Requests</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {myRequests.length}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Inbound Shipments</div>
            <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-0.5">
              {myTransactions.filter(t => t.status !== 'COMPLETED').length}
            </div>
          </div>
          <div className="p-3 bg-stone-50 rounded-xl">
            <div className="text-xs text-stone-500">Total Procured Volume</div>
            <div className="text-xl font-bold text-stone-900 font-mono tabular-nums mt-0.5">
              {totalProcuredTons.toLocaleString()} <span className="text-xs font-normal text-stone-500">Tons</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-medium">
        <button
          onClick={() => setActiveTab('requirements')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'requirements'
              ? 'bg-stone-900 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Procurement Requirements ({myRequirements.length})
        </button>

        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'requests'
              ? 'bg-stone-900 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Sent Purchase Requests ({myRequests.length})
        </button>

        <button
          onClick={() => setActiveTab('deliveries')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'deliveries'
              ? 'bg-stone-900 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Inbound Logistics & Weighbridge ({myTransactions.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeTab === 'analytics'
              ? 'bg-stone-900 text-white font-semibold'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Bioeconomy ESG Metrics
        </button>
      </div>

      {/* 1. Requirements Tab */}
      {activeTab === 'requirements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myRequirements.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-4 shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="capitalize">{req.buyerType.replace('_', ' ')}</span>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                      ACTIVE
                    </span>
                  </div>

                  <h3 className="font-bold text-stone-900 text-base">{req.title}</h3>
                  <div className="text-xs text-stone-600 mt-1">
                    Feedstock: <strong className="text-stone-800">{req.materialName}</strong> · Cap: Max {req.maxMoisturePercentage}% moisture
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-stone-50 rounded-xl text-xs mt-3">
                    <div>
                      <span className="text-stone-400 block">Target Range</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        {req.minQuantity}–{req.maxQuantity} {req.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Ceiling Budget</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        ₹{req.targetPriceMax}/{req.unit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-stone-400 block">Max Haul</span>
                      <strong className="text-stone-900 font-mono tabular-nums">
                        {req.maxDistanceKm} km
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-500">
                    {req.acceptsWeatherAffected ? '✓ Weather-salvage allowed' : 'Standard dry biomass only'}
                  </span>
                  <button
                    onClick={() => onNavigateToMatching(req.id)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Match Engine</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. Sent Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {myRequests.length > 0 ? (
            myRequests.map(req => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-stone-200 p-5 space-y-3 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-stone-500">
                      Farmer: <strong>{req.farmerName}</strong> · Contact: {req.farmerPhone}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {req.listingTitle}
                    </h3>
                  </div>

                  <span
                    className={`text-xs px-2.5 py-1 rounded font-semibold self-start sm:self-auto ${
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

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-stone-50 rounded-xl text-xs">
                  <div>
                    <span className="text-stone-400 block">Requested</span>
                    <strong className="text-stone-900 font-mono tabular-nums">
                      {req.requestedQuantity} {req.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Offered Rate</span>
                    <strong className="text-stone-900 font-mono tabular-nums">
                      ₹{req.offeredPricePerUnit.toLocaleString()} / {req.unit}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Contract Total</span>
                    <strong className="text-emerald-700 font-mono tabular-nums">
                      ₹{req.totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Pickup Scheduled</span>
                    <strong className="text-stone-900 font-mono tabular-nums">
                      {req.proposedPickupDate}
                    </strong>
                  </div>
                </div>

                <div className="text-xs text-stone-600 bg-stone-50/50 p-2.5 rounded-lg border border-stone-100">
                  <strong>Proposal Terms:</strong> {req.message}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No purchase requests sent yet. Browse the marketplace or run the matching engine to connect with farmers.
            </div>
          )}
        </div>
      )}

      {/* 3. Inbound Logistics Tab */}
      {activeTab === 'deliveries' && (
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
                      Waybill Order #{tx.id} · Scheduled {tx.pickupScheduledDate}
                    </div>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {tx.listingTitle} ({tx.quantity} {tx.unit})
                    </h3>
                    <div className="text-xs text-stone-600 mt-0.5">
                      Origin: {tx.originLocation} · Supplier: <strong>{tx.farmerName}</strong> ({tx.farmerPhone})
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
                      <span>Update Delivery State</span>
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl text-xs grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="text-stone-400 block">Agreed Value</span>
                    <strong className="text-emerald-700 font-mono tabular-nums text-sm">
                      ₹{tx.totalAmount.toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Fleet Carrier</span>
                    <span className="text-stone-800">{tx.logisticsArrangedBy}</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block">Latest Status Check</span>
                    <span className="text-stone-800 truncate block">
                      {tx.events[tx.events.length - 1]?.notes || 'Dispatched'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              No active delivery transactions in pipeline.
            </div>
          )}
        </div>
      )}

      {/* 4. Bioeconomy ESG Analytics */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-stone-900">
              Circular Bioeconomy Environmental & Supply Accounting
            </h2>
            <p className="text-xs text-stone-500">
              Estimated avoided emissions and biomass diversion achieved through your procurement contracts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <div className="text-xs font-semibold text-emerald-900">Avoided Stubble Burning CO2e</div>
              <div className="text-2xl font-bold font-mono text-emerald-800 mt-1 tabular-nums">
                {(totalProcuredTons * 1.48).toFixed(1)} MT
              </div>
              <div className="text-[11px] text-emerald-700 mt-1">
                Based on ICAR standard factor of ~1.48 Tons CO2e per ton residue diverted from field fires.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <div className="text-xs font-semibold text-stone-900">Particulate Matter (PM2.5) Mitigated</div>
              <div className="text-2xl font-bold font-mono text-stone-800 mt-1 tabular-nums">
                {(totalProcuredTons * 3.2).toFixed(1)} kg
              </div>
              <div className="text-[11px] text-stone-500 mt-1">
                Prevents hazardous post-harvest seasonal smog formation in airsheds.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
              <div className="text-xs font-semibold text-amber-900">Farmer Economic Inflow</div>
              <div className="text-2xl font-bold font-mono text-amber-800 mt-1 tabular-nums">
                ₹{myTransactions.reduce((acc, t) => acc + t.totalAmount, 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-amber-700 mt-1">
                Direct purchasing value delivered to farm clusters.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
