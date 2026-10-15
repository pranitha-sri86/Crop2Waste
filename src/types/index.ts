/**
 * CropWaste2Value — Complete Type Definitions
 */

export type UserRole = 'farmer' | 'buyer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  district: string;
  state: string;
  avatarUrl?: string;
  organization?: string;
  verified: boolean;
}

export type MaterialCategory = 
  | 'cereal_straw'
  | 'sugarcane_bagasse'
  | 'oilseed_residue'
  | 'fiber_cotton'
  | 'husk_shell'
  | 'horticulture_waste'
  | 'agro_industrial';

export type ListingType = 'ordinary_residue' | 'weather_affected';

export type MaterialCondition = 
  | 'dry_baled'
  | 'loose_dry'
  | 'moderate_moisture'
  | 'damp_salvageable'
  | 'weather_damaged';

export type MeasurementUnit = 'Tons' | 'Quintals' | 'Bales' | 'Kg';

export interface Listing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  title: string;
  description: string;
  category: MaterialCategory;
  listingType: ListingType;
  quantity: number;
  availableQuantity: number;
  unit: MeasurementUnit;
  condition: MaterialCondition;
  moisturePercentage?: number;
  pricePerUnit: number;
  currency: string;
  locationName: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  availabilityDate: string;
  status: 'active' | 'pending' | 'sold' | 'paused' | 'cancelled';
  images: string[];
  weatherEventDetails?: {
    eventType: string;
    eventDate: string;
    damageSeverity: 'mild' | 'moderate' | 'severe';
    farmerObservations: string;
    testedByBuyer?: boolean;
  };
  recommendedUses?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BuyerType = 
  | 'biomass_power'
  | 'compost_biofertilizer'
  | 'biofuel_pellet'
  | 'cattle_feed'
  | 'paper_packaging'
  | 'biochar_pyrolysis'
  | 'mushroom_cultivation'
  | 'industrial_fiber';

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerType: BuyerType;
  title: string;
  materialCategory: MaterialCategory;
  materialName: string;
  minQuantity: number;
  maxQuantity: number;
  unit: MeasurementUnit;
  acceptableConditions: MaterialCondition[];
  maxMoisturePercentage: number;
  targetPriceMin: number;
  targetPriceMax: number;
  currency: string;
  locationName: string;
  district: string;
  state: string;
  latitude?: number;
  longitude?: number;
  maxDistanceKm: number;
  requiredByDate: string;
  acceptsWeatherAffected: boolean;
  notes?: string;
  status: 'active' | 'fulfilled' | 'closed';
  createdAt: string;
}

export interface MatchFactor {
  factor: 'material' | 'quantity' | 'location' | 'condition' | 'price' | 'timing';
  factorName: string;
  weight: number;
  score: number;
  weightedScore: number;
  explanation: string;
  isPositive: boolean;
}

export interface MatchResult {
  listingId: string;
  listing: Listing;
  requirementId: string;
  requirement: BuyerRequirement;
  totalScore: number;
  factors: Record<string, MatchFactor>;
  summaryExplanation: string[];
  isEligible: boolean;
  distanceKm?: number;
}

export type RequestStatus = 'REQUESTED' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';

export interface MaterialRequest {
  id: string;
  listingId: string;
  listingTitle: string;
  requirementId?: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  requestedQuantity: number;
  unit: MeasurementUnit;
  offeredPricePerUnit: number;
  currency: string;
  totalAmount: number;
  logisticsPreference: 'buyer_arranges' | 'farmer_arranges' | 'third_party_transport';
  status: RequestStatus;
  proposedPickupDate: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export type TransactionStatus = 
  | 'ACCEPTED'
  | 'PICKUP_SCHEDULED'
  | 'COLLECTED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED';

export interface TransactionEvent {
  id: string;
  status: TransactionStatus;
  timestamp: string;
  actor: string;
  role: UserRole;
  notes: string;
  location?: string;
}

export interface Transaction {
  id: string;
  requestId: string;
  listingId: string;
  listingTitle: string;
  materialCategory: MaterialCategory;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  buyerId: string;
  buyerName: string;
  buyerCompany: string;
  buyerPhone: string;
  quantity: number;
  unit: MeasurementUnit;
  pricePerUnit: number;
  totalAmount: number;
  currency: string;
  status: TransactionStatus;
  originLocation: string;
  destinationLocation: string;
  logisticsArrangedBy: string;
  pickupScheduledDate: string;
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  events: TransactionEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface WeatherRecoveryReport {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  weatherEventType: 'unseasonal_rain' | 'cyclone_flood' | 'hailstorm' | 'drought' | 'flash_flood';
  eventDate: string;
  affectedCrop: string;
  estimatedQuantityTons: number;
  materialCondition: string;
  currentMoistureEst: string;
  farmerObservations: string;
  location: string;
  district: string;
  state: string;
  suitableAlternativeUses: string[];
  status: 'reported' | 'matched_for_salvage' | 'salvaged';
  images: string[];
  createdAt: string;
}
