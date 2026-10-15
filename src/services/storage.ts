import {
  User,
  Listing,
  BuyerRequirement,
  MaterialRequest,
  Transaction,
  WeatherRecoveryReport,
  RequestStatus,
  TransactionStatus,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_LISTINGS,
  INITIAL_REQUIREMENTS,
  INITIAL_REQUESTS,
  INITIAL_TRANSACTIONS,
  INITIAL_WEATHER_REPORTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  CURRENT_USER: 'cropwaste_current_user_v1',
  USERS: 'cropwaste_users_v1',
  LISTINGS: 'cropwaste_listings_v1',
  REQUIREMENTS: 'cropwaste_requirements_v1',
  REQUESTS: 'cropwaste_requests_v1',
  TRANSACTIONS: 'cropwaste_transactions_v1',
  WEATHER_REPORTS: 'cropwaste_weather_reports_v1',
};

// Event listener mechanism for reactivity
type Listener = () => void;
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach(fn => fn());
}

export function subscribeToStore(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getItem<T>(key: string, fallback: T): T {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    notify();
  } catch (err) {
    console.error(`Error writing ${key} to localStorage`, err);
  }
}

// Initialize seed data if not present
export function initStore() {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    // Default to Gurpreet Singh (Farmer)
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LISTINGS)) {
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUIREMENTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(INITIAL_REQUIREMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.WEATHER_REPORTS)) {
    localStorage.setItem(STORAGE_KEYS.WEATHER_REPORTS, JSON.stringify(INITIAL_WEATHER_REPORTS));
  }
}

export const StorageService = {
  // Current User
  getCurrentUser(): User {
    initStore();
    return getItem<User>(STORAGE_KEYS.CURRENT_USER, INITIAL_USERS[0]);
  },
  setCurrentUser(user: User): void {
    setItem(STORAGE_KEYS.CURRENT_USER, user);
  },
  getUsers(): User[] {
    initStore();
    return getItem<User[]>(STORAGE_KEYS.USERS, INITIAL_USERS);
  },

  // Listings
  getListings(): Listing[] {
    initStore();
    return getItem<Listing[]>(STORAGE_KEYS.LISTINGS, INITIAL_LISTINGS);
  },
  getListingById(id: string): Listing | undefined {
    return this.getListings().find(l => l.id === id);
  },
  createListing(data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'availableQuantity'>): Listing {
    const listings = this.getListings();
    const newListing: Listing = {
      ...data,
      id: `lst-${Date.now().toString().slice(-5)}`,
      availableQuantity: data.quantity,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    listings.unshift(newListing);
    setItem(STORAGE_KEYS.LISTINGS, listings);
    return newListing;
  },
  updateListing(id: string, updates: Partial<Listing>): Listing | undefined {
    const listings = this.getListings();
    const idx = listings.findIndex(l => l.id === id);
    if (idx === -1) return undefined;
    listings[idx] = {
      ...listings[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    setItem(STORAGE_KEYS.LISTINGS, listings);
    return listings[idx];
  },
  deleteListing(id: string): boolean {
    const listings = this.getListings();
    const filtered = listings.filter(l => l.id !== id);
    setItem(STORAGE_KEYS.LISTINGS, filtered);
    return true;
  },

  // Requirements
  getRequirements(): BuyerRequirement[] {
    initStore();
    return getItem<BuyerRequirement[]>(STORAGE_KEYS.REQUIREMENTS, INITIAL_REQUIREMENTS);
  },
  createRequirement(data: Omit<BuyerRequirement, 'id' | 'createdAt'>): BuyerRequirement {
    const requirements = this.getRequirements();
    const newReq: BuyerRequirement = {
      ...data,
      id: `req-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    requirements.unshift(newReq);
    setItem(STORAGE_KEYS.REQUIREMENTS, requirements);
    return newReq;
  },
  updateRequirement(id: string, updates: Partial<BuyerRequirement>): BuyerRequirement | undefined {
    const requirements = this.getRequirements();
    const idx = requirements.findIndex(r => r.id === id);
    if (idx === -1) return undefined;
    requirements[idx] = { ...requirements[idx], ...updates };
    setItem(STORAGE_KEYS.REQUIREMENTS, requirements);
    return requirements[idx];
  },

  // Requests
  getRequests(): MaterialRequest[] {
    initStore();
    return getItem<MaterialRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },
  createRequest(data: Omit<MaterialRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): MaterialRequest {
    const requests = this.getRequests();
    const newReq: MaterialRequest = {
      ...data,
      id: `req-${Date.now().toString().slice(-5)}`,
      status: 'REQUESTED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requests.unshift(newReq);
    setItem(STORAGE_KEYS.REQUESTS, requests);
    return newReq;
  },
  updateRequestStatus(id: string, newStatus: RequestStatus, notes?: string): MaterialRequest | undefined {
    const requests = this.getRequests();
    const idx = requests.findIndex(r => r.id === id);
    if (idx === -1) return undefined;

    const req = requests[idx];
    req.status = newStatus;
    req.updatedAt = new Date().toISOString();
    setItem(STORAGE_KEYS.REQUESTS, requests);

    // If accepted, automatically initiate a Transaction
    if (newStatus === 'ACCEPTED') {
      const listing = this.getListingById(req.listingId);
      if (listing) {
        // Deduct available quantity safely
        const updatedAvail = Math.max(0, listing.availableQuantity - req.requestedQuantity);
        this.updateListing(listing.id, {
          availableQuantity: updatedAvail,
          status: updatedAvail === 0 ? 'sold' : 'active',
        });

        // Create transaction
        const transactions = this.getTransactions();
        const newTx: Transaction = {
          id: `tx-${Date.now().toString().slice(-5)}`,
          requestId: req.id,
          listingId: listing.id,
          listingTitle: listing.title,
          materialCategory: listing.category,
          farmerId: req.farmerId,
          farmerName: req.farmerName,
          farmerPhone: req.farmerPhone,
          buyerId: req.buyerId,
          buyerName: req.buyerName,
          buyerCompany: req.buyerCompany,
          buyerPhone: req.buyerPhone,
          quantity: req.requestedQuantity,
          unit: req.unit,
          pricePerUnit: req.offeredPricePerUnit,
          totalAmount: req.totalAmount,
          currency: req.currency,
          status: 'ACCEPTED',
          originLocation: `${listing.locationName}, ${listing.district}, ${listing.state}`,
          destinationLocation: req.buyerCompany,
          logisticsArrangedBy: req.logisticsPreference === 'buyer_arranges' ? 'Buyer Fleet' : 'Third Party Carrier',
          pickupScheduledDate: req.proposedPickupDate,
          events: [
            {
              id: `evt-${Date.now()}-1`,
              status: 'ACCEPTED',
              timestamp: new Date().toISOString(),
              actor: `${req.farmerName} (Farmer)`,
              role: 'farmer',
              notes: notes || `Request accepted for ${req.requestedQuantity} ${req.unit} at ₹${req.offeredPricePerUnit}/${req.unit}.`,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        transactions.unshift(newTx);
        setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
      }
    }

    return req;
  },

  // Transactions
  getTransactions(): Transaction[] {
    initStore();
    return getItem<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, INITIAL_TRANSACTIONS);
  },
  updateTransactionStatus(
    id: string,
    nextStatus: TransactionStatus,
    notes: string,
    actorName: string,
    actorRole: 'farmer' | 'buyer' | 'admin',
    location?: string
  ): Transaction | undefined {
    const transactions = this.getTransactions();
    const idx = transactions.findIndex(t => t.id === id);
    if (idx === -1) return undefined;

    const tx = transactions[idx];
    tx.status = nextStatus;
    tx.updatedAt = new Date().toISOString();

    if (nextStatus === 'DELIVERED' || nextStatus === 'COMPLETED') {
      tx.actualDeliveryDate = new Date().toISOString().split('T')[0];
    }

    tx.events.push({
      id: `evt-${Date.now()}`,
      status: nextStatus,
      timestamp: new Date().toISOString(),
      actor: `${actorName} (${actorRole.toUpperCase()})`,
      role: actorRole,
      notes,
      location,
    });

    setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
    return tx;
  },

  // Weather Reports
  getWeatherReports(): WeatherRecoveryReport[] {
    initStore();
    return getItem<WeatherRecoveryReport[]>(STORAGE_KEYS.WEATHER_REPORTS, INITIAL_WEATHER_REPORTS);
  },
  createWeatherReport(data: Omit<WeatherRecoveryReport, 'id' | 'createdAt'>): WeatherRecoveryReport {
    const reports = this.getWeatherReports();
    const newReport: WeatherRecoveryReport = {
      ...data,
      id: `rep-${Date.now().toString().slice(-5)}`,
      createdAt: new Date().toISOString(),
    };
    reports.unshift(newReport);
    setItem(STORAGE_KEYS.WEATHER_REPORTS, reports);
    return newReport;
  },

  // Reset to initial demo data
  resetDemoData(): void {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[0]));
    localStorage.setItem(STORAGE_KEYS.LISTINGS, JSON.stringify(INITIAL_LISTINGS));
    localStorage.setItem(STORAGE_KEYS.REQUIREMENTS, JSON.stringify(INITIAL_REQUIREMENTS));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.WEATHER_REPORTS, JSON.stringify(INITIAL_WEATHER_REPORTS));
    notify();
  },
};
