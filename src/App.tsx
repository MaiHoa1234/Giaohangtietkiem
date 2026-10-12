import React, { useState, useEffect } from 'react';
import { LogisticsProvider, useLogistics } from './context/LogisticsContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Footer } from './components/Footer';
import { LoginPage } from './components/LoginPage';
import { PublicHome } from './components/PublicHome';
import { TrackingView } from './components/TrackingView';
import { CustomerPortal } from './components/CustomerPortal';
import { ShopPortal } from './components/ShopPortal';
import { ShipperPortal } from './components/ShipperPortal';
import { DispatcherPortal } from './components/DispatcherPortal';
import { AdminPortal } from './components/AdminPortal';
import { WaybillModal } from './components/WaybillModal';
import { PriceCalculatorModal } from './components/PriceCalculatorModal';
import { DatabaseModal } from './components/DatabaseModal';
import { TicketModal } from './components/TicketModal';
import { Shipment } from './types/logistics';

function AppContent() {
  const { currentUser, isAuthenticated } = useLogistics();

  // Navigation views: 'LOGIN' | 'PUBLIC' | 'TRACKING' | 'CUSTOMER' | 'SHOP' | 'SHIPPER' | 'DISPATCHER' | 'ADMIN'
  const [currentView, setCurrentView] = useState<string>(() => {
    return isAuthenticated ? 'SHOP' : 'LOGIN';
  });
  const [trackedTrackingCode, setTrackedTrackingCode] = useState<string>('FS-HCM-942183');

  // Modals state
  const [waybillShipment, setWaybillShipment] = useState<Shipment | null>(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [ticketModalCode, setTicketModalCode] = useState<string | null>(null);

  // Mobile sidebar state
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // When role changes and user is authenticated, sync to their relevant workspace
  useEffect(() => {
    if (!isAuthenticated) return;
    if (currentUser.role === 'PUBLIC') {
      setCurrentView('PUBLIC');
    } else if (currentUser.role === 'CUSTOMER') {
      setCurrentView('CUSTOMER');
    } else if (currentUser.role === 'SHOP') {
      setCurrentView('SHOP');
    } else if (currentUser.role === 'SHIPPER') {
      setCurrentView('SHIPPER');
    } else if (currentUser.role === 'DISPATCHER') {
      setCurrentView('DISPATCHER');
    } else if (currentUser.role === 'ADMIN') {
      setCurrentView('ADMIN');
    }
  }, [currentUser.role, isAuthenticated]);

  const handleSearchTrack = (code: string) => {
    setTrackedTrackingCode(code);
    setCurrentView('TRACKING');
  };

  const handleOpenTicketModal = (code: string) => {
    setTicketModalCode(code);
  };

  const handleLoginSuccess = (role?: string) => {
    const target = role || currentUser.role;
    if (target === 'ADMIN') setCurrentView('ADMIN');
    else if (target === 'DISPATCHER') setCurrentView('DISPATCHER');
    else if (target === 'SHIPPER') setCurrentView('SHIPPER');
    else if (target === 'CUSTOMER') setCurrentView('CUSTOMER');
    else setCurrentView('SHOP');
  };

  // If user visits a protected section but is not logged in, show Login
  const isProtectedView = ['CUSTOMER', 'SHOP', 'SHIPPER', 'DISPATCHER', 'ADMIN'].includes(currentView);
  const shouldShowLogin = currentView === 'LOGIN' || (!isAuthenticated && isProtectedView);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans flex flex-col selection:bg-emerald-500 selection:text-white antialiased">
      {/* 1. Left Sidebar Navigation (Fixed w-64) */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* 2. Main Layout Area (Shifted to right of sidebar on lg+) */}
      <div className="lg:pl-64 flex-1 flex flex-col min-w-0">
        {/* TopBar Header with search, database trigger & login state */}
        <TopBar
          currentView={currentView}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onSearchTrack={handleSearchTrack}
          onOpenCalculator={() => setIsCalculatorOpen(true)}
          onOpenDatabaseModal={() => setIsDatabaseOpen(true)}
          onNavigateLogin={() => setCurrentView('LOGIN')}
        />

        {/* Main Content Body */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {shouldShowLogin && (
            <LoginPage
              onSuccess={handleLoginSuccess}
              onContinueAsGuest={() => setCurrentView('PUBLIC')}
            />
          )}

          {!shouldShowLogin && currentView === 'PUBLIC' && (
            <PublicHome
              onSearchTrack={handleSearchTrack}
              onOpenCalculator={() => setIsCalculatorOpen(true)}
              onNavigateRole={(role) => setCurrentView(role)}
              onNavigateLogin={(role) => {
                if (role) {
                  handleLoginSuccess(role);
                } else {
                  setCurrentView('LOGIN');
                }
              }}
            />
          )}

          {!shouldShowLogin && currentView === 'TRACKING' && (
            <TrackingView
              initialCode={trackedTrackingCode}
              onOpenWaybill={(shipment) => setWaybillShipment(shipment)}
              onOpenTicketModal={handleOpenTicketModal}
            />
          )}

          {!shouldShowLogin && currentView === 'CUSTOMER' && (
            <CustomerPortal
              onTrackCode={handleSearchTrack}
              onOpenWaybill={(shipment) => setWaybillShipment(shipment)}
              onOpenTicketModal={handleOpenTicketModal}
            />
          )}

          {!shouldShowLogin && currentView === 'SHOP' && (
            <ShopPortal
              onOpenWaybill={(shipment) => setWaybillShipment(shipment)}
              onTrackCode={handleSearchTrack}
            />
          )}

          {!shouldShowLogin && currentView === 'SHIPPER' && (
            <ShipperPortal
              onTrackCode={handleSearchTrack}
              onOpenWaybill={(shipment) => setWaybillShipment(shipment)}
            />
          )}

          {!shouldShowLogin && currentView === 'DISPATCHER' && (
            <DispatcherPortal
              onTrackCode={handleSearchTrack}
              onOpenWaybill={(shipment) => setWaybillShipment(shipment)}
            />
          )}

          {!shouldShowLogin && currentView === 'ADMIN' && <AdminPortal />}
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* 3. Global Functional Modals */}
      <WaybillModal
        shipment={waybillShipment}
        onClose={() => setWaybillShipment(null)}
      />

      <PriceCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
      />

      <TicketModal
        isOpen={ticketModalCode !== null}
        onClose={() => setTicketModalCode(null)}
        defaultTrackingCode={ticketModalCode || ''}
      />
    </div>
  );
}

export default function App() {
  return (
    <LogisticsProvider>
      <AppContent />
    </LogisticsProvider>
  );
}
