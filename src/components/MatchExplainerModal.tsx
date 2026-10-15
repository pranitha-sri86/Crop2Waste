import React from 'react';
import { MatchResult, User } from '../types';
import { X, CheckCircle2, AlertCircle, Sparkles, Scale, MapPin, Droplets, Calendar, IndianRupee, ArrowRight } from 'lucide-react';

interface Props {
  matchResult: MatchResult;
  currentUser: User;
  onClose: () => void;
  onRequest: () => void;
}

export const MatchExplainerModal: React.FC<Props> = ({
  matchResult,
  currentUser,
  onClose,
  onRequest,
}) => {
  const { listing, requirement, totalScore, factors, summaryExplanation, distanceKm } = matchResult;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getBarColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-600';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-stone-200 shadow-xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-stone-900 text-stone-100 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Deterministic Rule-Based Matching Evaluation</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              Compatibility Score Analysis
            </h2>
            <div className="text-xs text-stone-300 mt-1">
              Comparing requirement <strong className="text-stone-100">"{requirement.title}"</strong> with listing <strong className="text-stone-100">"{listing.title}"</strong>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aggregate Score Card */}
        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs text-stone-500 font-medium">Calculated Match Index</div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-stone-900 font-mono tabular-nums">
                {totalScore}%
              </span>
              <span className="text-xs text-stone-500">Aggregate Compatibility</span>
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Reflects parameter alignment (40% material, 20% volume, 15% location, 15% condition, 5% price, 5% timeline).
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${getScoreColor(
                totalScore
              )}`}
            >
              {totalScore >= 80
                ? 'High Synergy Match'
                : totalScore >= 60
                ? 'Viable with Negotiation'
                : 'Marginal Compatibility'}
            </span>
          </div>
        </div>

        {/* 6-Factor Breakdown List */}
        <div className="p-6 space-y-4 max-h-[55vh] overflow-y-auto">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Weighted Factor Breakdown (100% Total)
          </div>

          {/* Factor 1: Material (40%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>1. Material Compatibility ({factors.material.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.material.score}/100 ({factors.material.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.material.score)}`}
                style={{ width: `${factors.material.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.material.explanation}
            </p>
          </div>

          {/* Factor 2: Quantity (20%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Scale className="w-4 h-4 text-blue-600" />
                <span>2. Quantity & Volume ({factors.quantity.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.quantity.score}/100 ({factors.quantity.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.quantity.score)}`}
                style={{ width: `${factors.quantity.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.quantity.explanation}
            </p>
          </div>

          {/* Factor 3: Location / Distance (15%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>3. Distance & Transport Radius ({factors.location.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.location.score}/100 ({factors.location.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.location.score)}`}
                style={{ width: `${factors.location.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.location.explanation}
            </p>
          </div>

          {/* Factor 4: Condition & Moisture (15%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <span>4. Condition & Moisture Limit ({factors.condition.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.condition.score}/100 ({factors.condition.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.condition.score)}`}
                style={{ width: `${factors.condition.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.condition.explanation}
            </p>
          </div>

          {/* Factor 5: Price (5%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <IndianRupee className="w-4 h-4 text-emerald-700" />
                <span>5. Price & Budget Alignment ({factors.price.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.price.score}/100 ({factors.price.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.price.score)}`}
                style={{ width: `${factors.price.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.price.explanation}
            </p>
          </div>

          {/* Factor 6: Timing (5%) */}
          <div className="p-3.5 rounded-xl border border-stone-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-semibold text-stone-900">
                <Calendar className="w-4 h-4 text-violet-600" />
                <span>6. Availability Timing Window ({factors.timing.weight}%)</span>
              </div>
              <div className="font-mono tabular-nums text-stone-700 font-semibold">
                {factors.timing.score}/100 ({factors.timing.weightedScore} pts)
              </div>
            </div>
            <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full ${getBarColor(factors.timing.score)}`}
                style={{ width: `${factors.timing.score}%` }}
              />
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              {factors.timing.explanation}
            </p>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 transition-colors"
          >
            Close Evaluation
          </button>

          <button
            onClick={onRequest}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-colors"
          >
            <span>Proceed to Request Material</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
