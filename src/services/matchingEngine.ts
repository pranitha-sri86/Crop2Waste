import { Listing, BuyerRequirement, MatchResult, MatchFactor } from '../types';

export interface MatchingWeights {
  material: number;   // 40%
  quantity: number;   // 20%
  location: number;   // 15%
  condition: number;  // 15%
  price: number;      // 5%
  timing: number;     // 5%
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  material: 40,
  quantity: 20,
  location: 15,
  condition: 15,
  price: 5,
  timing: 5,
};

// Calculate approximate great-circle distance between two coordinates in km
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Deterministic Explainable Rule-Based Matching Engine
 * Computes a transparent 0-100% compatibility score across 6 weighted factors.
 */
export function calculateMatchScore(
  listing: Listing,
  req: BuyerRequirement,
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchResult {
  // 1. Hard Eligibility Filters
  let isEligible = true;
  const summaryExplanation: string[] = [];

  // Inactive or depleted listing
  if (listing.status !== 'active' || listing.availableQuantity <= 0) {
    isEligible = false;
    summaryExplanation.push(`Listing status is '${listing.status}' with ${listing.availableQuantity} ${listing.unit} available.`);
  }

  // Weather-affected check
  if (listing.listingType === 'weather_affected' && !req.acceptsWeatherAffected) {
    isEligible = false;
    summaryExplanation.push(
      'Requirement explicitly excludes weather-affected or damp materials.'
    );
  }

  // Unit mismatch safety (all current data normalized to tons/quintals)
  if (listing.unit !== req.unit) {
    // If different units, note but continue if comparable or flag
  }

  // --- FACTOR 1: Material Compatibility (Weight 40%) ---
  let materialRaw = 0;
  let materialExp = '';
  let materialPos = false;

  if (listing.category === req.materialCategory) {
    // Exact category match
    const titleWords = listing.title.toLowerCase().split(/\s+/);
    const reqWords = req.materialName.toLowerCase().split(/\s+/);
    const hasOverlap = titleWords.some(w => w.length > 3 && reqWords.some(rw => rw.includes(w) || w.includes(rw)));

    if (hasOverlap) {
      materialRaw = 100;
      materialExp = `Direct category and material name match (${req.materialName}).`;
      materialPos = true;
    } else {
      materialRaw = 85;
      materialExp = `Category match (${req.materialCategory.replace('_', ' ')}), suitable residue specification.`;
      materialPos = true;
    }
  } else {
    // Check if both are compatible organic biomass
    materialRaw = 20;
    materialExp = `Category mismatch (${listing.category.replace('_', ' ')} vs required ${req.materialCategory.replace('_', ' ')}).`;
    materialPos = false;
  }

  // --- FACTOR 2: Quantity Compatibility (Weight 20%) ---
  let quantityRaw = 0;
  let quantityExp = '';
  let quantityPos = false;

  const avail = listing.availableQuantity;
  if (avail >= req.minQuantity && avail <= req.maxQuantity) {
    quantityRaw = 100;
    quantityExp = `Available quantity (${avail} ${listing.unit}) perfectly fits required range (${req.minQuantity}–${req.maxQuantity} ${req.unit}).`;
    quantityPos = true;
  } else if (avail > req.maxQuantity) {
    quantityRaw = 90;
    quantityExp = `Available quantity (${avail} ${listing.unit}) exceeds required maximum (${req.maxQuantity} ${req.unit}), partial lot pickup possible.`;
    quantityPos = true;
  } else if (avail >= req.minQuantity * 0.6) {
    const pct = Math.round((avail / req.minQuantity) * 100);
    quantityRaw = 65;
    quantityExp = `Available quantity (${avail} ${listing.unit}) fulfills ${pct}% of minimum requested threshold (${req.minQuantity} ${req.unit}).`;
    quantityPos = false;
  } else {
    quantityRaw = 25;
    quantityExp = `Insufficient lot volume (${avail} ${listing.unit}) below minimum target (${req.minQuantity} ${req.unit}).`;
    quantityPos = false;
  }

  // --- FACTOR 3: Distance & Location Compatibility (Weight 15%) ---
  let locationRaw = 0;
  let locationExp = '';
  let locationPos = false;
  let distanceKm: number | undefined;

  if (listing.latitude && listing.longitude && req.latitude && req.longitude) {
    distanceKm = calculateHaversineDistance(
      listing.latitude,
      listing.longitude,
      req.latitude,
      req.longitude
    );

    if (distanceKm <= req.maxDistanceKm * 0.5) {
      locationRaw = 100;
      locationExp = `Proximity ideal: ${distanceKm} km haul is well within buyer radius limit (${req.maxDistanceKm} km).`;
      locationPos = true;
    } else if (distanceKm <= req.maxDistanceKm) {
      const distScore = 100 - Math.round(((distanceKm - req.maxDistanceKm * 0.5) / (req.maxDistanceKm * 0.5)) * 30);
      locationRaw = Math.max(50, distScore);
      locationExp = `Within operational transport radius (${distanceKm} km of max ${req.maxDistanceKm} km).`;
      locationPos = true;
    } else {
      const excess = distanceKm - req.maxDistanceKm;
      locationRaw = Math.max(10, 50 - Math.min(40, Math.round(excess / 10)));
      locationExp = `Extended transit distance (${distanceKm} km exceeds preferred radius of ${req.maxDistanceKm} km by ${excess} km).`;
      locationPos = false;
    }
  } else if (listing.state === req.state) {
    locationRaw = listing.district === req.district ? 95 : 75;
    locationExp = listing.district === req.district 
      ? `Same district (${listing.district}, ${listing.state}) minimizes logistical transit.`
      : `Same state (${listing.state}); intra-state transport permitted.`;
    locationPos = true;
  } else {
    locationRaw = 40;
    locationExp = `Interstate movement required (${listing.state} to ${req.state}).`;
    locationPos = false;
  }

  // --- FACTOR 4: Condition & Moisture Compatibility (Weight 15%) ---
  let conditionRaw = 0;
  let conditionExp = '';
  let conditionPos = false;

  const isConditionAcceptable = req.acceptableConditions.includes(listing.condition);
  const moisture = listing.moisturePercentage ?? 15;
  const moisturePass = moisture <= req.maxMoisturePercentage;

  if (isConditionAcceptable && moisturePass) {
    conditionRaw = 100;
    conditionExp = `Condition '${listing.condition.replace('_', ' ')}' meets specifications; moisture level (${moisture}%) is well below maximum cap (${req.maxMoisturePercentage}%).`;
    conditionPos = true;
  } else if (isConditionAcceptable && !moisturePass) {
    const moistureOverage = moisture - req.maxMoisturePercentage;
    conditionRaw = Math.max(30, 80 - moistureOverage * 4);
    conditionExp = `Condition acceptable, but moisture (${moisture}%) exceeds preferred limit of ${req.maxMoisturePercentage}% by ${moistureOverage}%.`;
    conditionPos = false;
  } else if (!isConditionAcceptable && moisturePass) {
    conditionRaw = 50;
    conditionExp = `Moisture is compliant (${moisture}%), but condition type '${listing.condition.replace('_', ' ')}' differs from preferred forms.`;
    conditionPos = false;
  } else {
    conditionRaw = 20;
    conditionExp = `Neither physical condition nor moisture (${moisture}% vs max ${req.maxMoisturePercentage}%) matches requirement criteria.`;
    conditionPos = false;
  }

  // --- FACTOR 5: Price Compatibility (Weight 5%) ---
  let priceRaw = 0;
  let priceExp = '';
  let pricePos = false;

  const price = listing.pricePerUnit;
  if (price <= req.targetPriceMax && price >= req.targetPriceMin) {
    priceRaw = 100;
    priceExp = `Quoted price (₹${price.toLocaleString()}/${listing.unit}) sits comfortably within target budget range (₹${req.targetPriceMin}–₹${req.targetPriceMax}).`;
    pricePos = true;
  } else if (price < req.targetPriceMin) {
    priceRaw = 95;
    priceExp = `Quoted price (₹${price.toLocaleString()}/${listing.unit}) is below buyer target floor, highly cost-favorable.`;
    pricePos = true;
  } else {
    const excessPct = Math.round(((price - req.targetPriceMax) / req.targetPriceMax) * 100);
    priceRaw = Math.max(10, 90 - excessPct * 2);
    priceExp = `Quoted price (₹${price.toLocaleString()}/${listing.unit}) is ${excessPct}% above buyer ceiling (₹${req.targetPriceMax}); room for negotiation.`;
    pricePos = false;
  }

  // --- FACTOR 6: Timing & Availability Window (Weight 5%) ---
  let timingRaw = 0;
  let timingExp = '';
  let timingPos = false;

  const listingAvail = new Date(listing.availabilityDate).getTime();
  const reqTarget = new Date(req.requiredByDate).getTime();
  const diffDays = Math.round((reqTarget - listingAvail) / (1000 * 60 * 60 * 24));

  if (diffDays >= 0) {
    timingRaw = 100;
    timingExp = `Listing available on ${listing.availabilityDate}, well ahead of required deadline (${req.requiredByDate}).`;
    timingPos = true;
  } else {
    const delayDays = Math.abs(diffDays);
    timingRaw = Math.max(20, 80 - delayDays * 5);
    timingExp = `Material becomes available ${delayDays} days after preferred requirement date.`;
    timingPos = false;
  }

  // Weighted Score Calculation
  const factors: Record<string, MatchFactor> = {
    material: {
      factor: 'material',
      factorName: 'Material Type & Category',
      weight: weights.material,
      score: materialRaw,
      weightedScore: Number(((materialRaw * weights.material) / 100).toFixed(1)),
      explanation: materialExp,
      isPositive: materialPos,
    },
    quantity: {
      factor: 'quantity',
      factorName: 'Lot Quantity & Volume',
      weight: weights.quantity,
      score: quantityRaw,
      weightedScore: Number(((quantityRaw * weights.quantity) / 100).toFixed(1)),
      explanation: quantityExp,
      isPositive: quantityPos,
    },
    location: {
      factor: 'location',
      factorName: 'Logistics & Haul Distance',
      weight: weights.location,
      score: locationRaw,
      weightedScore: Number(((locationRaw * weights.location) / 100).toFixed(1)),
      explanation: locationExp,
      isPositive: locationPos,
    },
    condition: {
      factor: 'condition',
      factorName: 'Condition & Moisture Tolerance',
      weight: weights.condition,
      score: conditionRaw,
      weightedScore: Number(((conditionRaw * weights.condition) / 100).toFixed(1)),
      explanation: conditionExp,
      isPositive: conditionPos,
    },
    price: {
      factor: 'price',
      factorName: 'Price & Unit Budget',
      weight: weights.price,
      score: priceRaw,
      weightedScore: Number(((priceRaw * weights.price) / 100).toFixed(1)),
      explanation: priceExp,
      isPositive: pricePos,
    },
    timing: {
      factor: 'timing',
      factorName: 'Availability Timeline',
      weight: weights.timing,
      score: timingRaw,
      weightedScore: Number(((timingRaw * weights.timing) / 100).toFixed(1)),
      explanation: timingExp,
      isPositive: timingPos,
    },
  };

  const totalScore = Math.round(
    Object.values(factors).reduce((acc, f) => acc + f.weightedScore, 0)
  );

  // Construct summary explanations
  if (materialPos) summaryExplanation.push(materialExp);
  if (locationPos && distanceKm) summaryExplanation.push(`Logistics feasible at ${distanceKm} km.`);
  if (!quantityPos) summaryExplanation.push(quantityExp);
  if (!conditionPos) summaryExplanation.push(conditionExp);

  return {
    listingId: listing.id,
    listing,
    requirementId: req.id,
    requirement: req,
    totalScore,
    factors,
    summaryExplanation,
    isEligible,
    distanceKm,
  };
}

/**
 * Match a specific requirement against all active listings
 */
export function findMatchesForRequirement(
  req: BuyerRequirement,
  listings: Listing[],
  weights?: MatchingWeights
): MatchResult[] {
  return listings
    .filter(l => l.status === 'active')
    .map(listing => calculateMatchScore(listing, req, weights))
    .sort((a, b) => b.totalScore - a.totalScore);
}

/**
 * Match a specific listing against all active buyer requirements
 */
export function findMatchesForListing(
  listing: Listing,
  requirements: BuyerRequirement[],
  weights?: MatchingWeights
): MatchResult[] {
  return requirements
    .filter(r => r.status === 'active')
    .map(req => calculateMatchScore(listing, req, weights))
    .sort((a, b) => b.totalScore - a.totalScore);
}
