/**
 * CropWaste2Value — Complete Full-Stack Application
 * Tagline: From Crop Waste to Market Value.
 */

import React, { useState, useEffect } from 'react';
import { User, Listing, BuyerRequirement, MaterialRequest, Transaction, WeatherRecoveryReport, MatchResult } from './types';
import { StorageService, subscribeToStore } from './services/storage';
import { Navbar, ActiveTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { RoleSwitchBanner } from './components/RoleSwitchBanner';
import { MarketplaceView } from './views/MarketplaceView';
import { MatchingCenterView } from './views/MatchingCenterView';
import { WeatherRecoveryView } from './views/WeatherRecoveryView';
import { FarmerDashboardView } from './views/FarmerDashboardView';
import { BuyerDashboardView } from './views/BuyerDashboardView';
import { HowItWorksView } from './views/HowItWorksView';

import { CreateListingModal } from './components/CreateListingModal';
import { CreateRequirementModal } from './components/CreateRequirementModal';
import { SendRequestModal } from './components/SendRequestModal';
import { MatchExplainerModal } from './components/MatchExplainerModal';
import { TransactionTimelineModal } from './components/TransactionTimelineModal';
import { WeatherRecoveryModal } from './components/WeatherRecoveryModal';
import { ListingDetailModal } from './components/ListingDetailModal';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => StorageService.getCurrentUser());
  const [listings, setListings] = useState<Listing[]>(() => StorageService.getListings());
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(() => StorageService.getRequirements());
  const [requests, setRequests] = useState<MaterialRequest[]>(() => StorageService.getRequests());
  const [transactions, setTransactions] = useState<Transaction[]>(() => StorageService.getTransactions());
  const [weatherReports, setWeatherReports] = useState<WeatherRecoveryReport[]>(() => StorageService.getWeatherReports());

  const [activeTab, setActiveTab] = useState<ActiveTab>('marketplace');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isCreateRequirementOpen, setIsCreateRequirementOpen] = useState(false);
  const [selectedListingForDetail, setSelectedListingForDetail] = useState<Listing | null>(null);
  const [selectedListingForRequest, setSelectedListingForRequest] = useState<Listing | null>(null);
  const [selectedMatchForExplainer, setSelectedMatchForExplainer] = useState<MatchResult | null>(null);
  const [selectedTransactionForTimeline, setSelectedTransactionForTimeline] = useState<Transaction | null>(null);
  const [isFileWeatherReportOpen, setIsFileWeatherReportOpen] = useState(false);

  // Subscribe to storage mutations
  useEffect(() => {
    const unsubscribe = subscribeToStore(() => {
      setCurrentUser(StorageService.getCurrentUser());
      setListings(StorageService.getListings());
      setRequirements(StorageService.getRequirements());
      setRequests(StorageService.getRequests());
      setTransactions(StorageService.getTransactions());
      setWeatherReports(StorageService.getWeatherReports());
    });
    return unsubscribe;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUserChange = (newUser: User) => {
    setCurrentUser(newUser);
    showToast(`Switched active workspace to ${newUser.name} (${newUser.role.toUpperCase()})`);
  };

  const handleRequestListing = (listing: Listing) => {
    setSelectedListingForRequest(listing);
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 font-sans text-stone-900 antialiased selection:bg-emerald-100 selection:text-emerald-900">
      {/* Role Switcher & Persona Bar */}
      <RoleSwitchBanner
        currentUser={currentUser}
        onUserChange={handleUserChange}
      />

      {/* Top Bar Contract compliant Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentUser={currentUser}
        onOpenCreateListing={() => setIsCreateListingOpen(true)}
        onOpenCreateRequirement={() => setIsCreateRequirementOpen(true)}
      />

      {/* Subtle Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs px-4 py-2.5 rounded-lg shadow-lg border border-stone-700 flex items-center gap-2 animate-fade-in">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary View Router */}
      <main className="flex-1">
        {activeTab === 'marketplace' && (
          <MarketplaceView
            listings={listings}
            currentUser={currentUser}
            onSelectListing={setSelectedListingForDetail}
            onRequestListing={handleRequestListing}
            onOpenCreateListing={() => setIsCreateListingOpen(true)}
          />
        )}

        {activeTab === 'matching' && (
          <MatchingCenterView
            listings={listings}
            requirements={requirements}
            currentUser={currentUser}
            onSelectMatch={setSelectedMatchForExplainer}
            onRequestListing={handleRequestListing}
            onOpenCreateRequirement={() => setIsCreateRequirementOpen(true)}
          />
        )}

        {activeTab === 'recovery' && (
          <WeatherRecoveryView
            weatherReports={weatherReports}
            listings={listings}
            currentUser={currentUser}
            onOpenFileWeatherReport={() => setIsFileWeatherReportOpen(true)}
            onSelectListing={setSelectedListingForDetail}
            onRequestListing={handleRequestListing}
          />
        )}

        {activeTab === 'dashboard' && (
          <>
            {currentUser.role === 'farmer' ? (
              <FarmerDashboardView
                currentUser={currentUser}
                listings={listings}
                requests={requests}
                transactions={transactions}
                weatherReports={weatherReports}
                onOpenCreateListing={() => setIsCreateListingOpen(true)}
                onOpenFileWeatherReport={() => setIsFileWeatherReportOpen(true)}
                onViewTransaction={setSelectedTransactionForTimeline}
                onSelectListing={setSelectedListingForDetail}
              />
            ) : (
              <BuyerDashboardView
                currentUser={currentUser}
                requirements={requirements}
                requests={requests}
                transactions={transactions}
                onOpenCreateRequirement={() => setIsCreateRequirementOpen(true)}
                onNavigateToMatching={(reqId) => {
                  setActiveTab('matching');
                }}
                onViewTransaction={setSelectedTransactionForTimeline}
              />
            )}
          </>
        )}

        {activeTab === 'about' && (
          <HowItWorksView
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Global Modals */}

      {/* 1. Create Listing Modal */}
      {isCreateListingOpen && (
        <CreateListingModal
          currentUser={currentUser}
          onClose={() => setIsCreateListingOpen(false)}
          onSuccess={(newListing) => {
            setIsCreateListingOpen(false);
            showToast(`Listed "${newListing.title}" successfully!`);
          }}
        />
      )}

      {/* 2. Create Requirement Modal */}
      {isCreateRequirementOpen && (
        <CreateRequirementModal
          currentUser={currentUser}
          onClose={() => setIsCreateRequirementOpen(false)}
          onSuccess={(newReq) => {
            setIsCreateRequirementOpen(false);
            showToast(`Procurement requirement posted for "${newReq.materialName}"!`);
            setActiveTab('matching');
          }}
        />
      )}

      {/* 3. Send Request Modal */}
      {selectedListingForRequest && (
        <SendRequestModal
          listing={selectedListingForRequest}
          currentUser={currentUser}
          onClose={() => setSelectedListingForRequest(null)}
          onSuccess={(req) => {
            setSelectedListingForRequest(null);
            showToast(`Procurement request for ${req.requestedQuantity} ${req.unit} sent to ${req.farmerName}!`);
            if (currentUser.role === 'buyer') {
              setActiveTab('dashboard');
            }
          }}
        />
      )}

      {/* 4. Match Explainer Modal */}
      {selectedMatchForExplainer && (
        <MatchExplainerModal
          matchResult={selectedMatchForExplainer}
          currentUser={currentUser}
          onClose={() => setSelectedMatchForExplainer(null)}
          onRequest={() => {
            const lst = selectedMatchForExplainer.listing;
            setSelectedMatchForExplainer(null);
            setSelectedListingForRequest(lst);
          }}
        />
      )}

      {/* 5. Transaction Timeline Modal */}
      {selectedTransactionForTimeline && (
        <TransactionTimelineModal
          transaction={selectedTransactionForTimeline}
          currentUser={currentUser}
          onClose={() => setSelectedTransactionForTimeline(null)}
          onUpdated={(updatedTx) => {
            setSelectedTransactionForTimeline(updatedTx);
            showToast(`Updated transaction to status: ${updatedTx.status.replace('_', ' ')}`);
          }}
        />
      )}

      {/* 6. File Weather Report Modal */}
      {isFileWeatherReportOpen && (
        <WeatherRecoveryModal
          currentUser={currentUser}
          onClose={() => setIsFileWeatherReportOpen(false)}
          onSuccess={(newReport) => {
            setIsFileWeatherReportOpen(false);
            showToast(`Weather impact report filed for ${newReport.affectedCrop}!`);
            setActiveTab('recovery');
          }}
        />
      )}

      {/* 7. Listing Detail Modal */}
      {selectedListingForDetail && (
        <ListingDetailModal
          listing={selectedListingForDetail}
          currentUser={currentUser}
          onClose={() => setSelectedListingForDetail(null)}
          onRequest={(lst) => {
            setSelectedListingForDetail(null);
            setSelectedListingForRequest(lst);
          }}
        />
      )}

      {/* Domain-Clean Footer */}
      <Footer onNavigate={setActiveTab} />
    </div>
  );
}
