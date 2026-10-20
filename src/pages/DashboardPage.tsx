import React, { useState, useMemo, useEffect } from 'react';
import { MapWorkspace } from '../components/MapWorkspace';
import { AnalyticsSidebar } from '../components/AnalyticsSidebar';
import { AILayoutModal } from '../components/AILayoutModal';
import { VendorQuoteModal } from '../components/VendorQuoteModal';
import { ReportModal } from '../components/ReportModal';
import { SavedAnalysesDrawer } from '../components/SavedAnalysesDrawer';
import { AuthModal } from '../components/AuthModal';
import { GeoPoint, AppMode, SolarVendor, SavedAnalysis, UserProfile } from '../types';
import { ROOFTOP_PRESETS } from '../lib/mockData';
import { computeRooftopAnalytics } from '../lib/solarCalculations';
import { fetchUserAnalyses, deleteSavedAnalysis } from '../lib/supabaseClient';

interface DashboardPageProps {
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  appMode: AppMode;
  setAppMode: (mode: AppMode) => void;
  isSavedDrawerOpen: boolean;
  setIsSavedDrawerOpen: (open: boolean) => void;
  savedAnalyses: SavedAnalysis[];
  setSavedAnalyses: React.Dispatch<React.SetStateAction<SavedAnalysis[]>>;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentUser,
  onOpenAuth,
  appMode,
  setAppMode,
  isSavedDrawerOpen,
  setIsSavedDrawerOpen,
  savedAnalyses,
  setSavedAnalyses,
}) => {
  // Map coordinates state
  const [coordinates, setCoordinates] = useState<GeoPoint[]>(ROOFTOP_PRESETS[0].polygon);
  const [activePresetId, setActivePresetId] = useState<string>(ROOFTOP_PRESETS[0].id);

  // Sidebar collapse state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Modals state
  const [isAIEngineOpen, setIsAIEngineOpen] = useState(false);
  const [selectedVendorForQuote, setSelectedVendorForQuote] = useState<SolarVendor | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Site photos state
  const [sitePhotos, setSitePhotos] = useState<string[]>([]);

  // Compute live physics & energy calculation
  const calculation = useMemo(() => {
    return computeRooftopAnalytics(coordinates, appMode);
  }, [coordinates, appMode]);

  // Load saved analysis onto map
  const handleLoadAnalysis = (analysis: SavedAnalysis) => {
    setCoordinates(analysis.coordinates);
    setAppMode(analysis.mode);
  };

  const handleDeleteAnalysis = async (id: string) => {
    await deleteSavedAnalysis(id);
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSavedSuccess = async () => {
    const fresh = await fetchUserAnalyses();
    setSavedAnalyses(fresh);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] overflow-hidden flex bg-slate-900">
      
      {/* Interactive Map Canvas */}
      <div className={`w-full h-full transition-all duration-300 ${isSidebarCollapsed ? 'pr-14' : 'pr-0 sm:pr-[460px]'}`}>
        <MapWorkspace
          mode={appMode}
          coordinates={coordinates}
          setCoordinates={setCoordinates}
          onPolygonComplete={() => {
            // Auto expand sidebar on boundary complete if collapsed
            if (isSidebarCollapsed) setIsSidebarCollapsed(false);
          }}
          activePresetId={activePresetId}
          setActivePresetId={setActivePresetId}
        />
      </div>

      {/* Analytics & Vendor Sidebar */}
      <AnalyticsSidebar
        calculation={calculation}
        mode={appMode}
        setMode={setAppMode}
        onOpenAIEngine={() => setIsAIEngineOpen(true)}
        onSelectVendor={(vendor) => setSelectedVendorForQuote(vendor)}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        sitePhotos={sitePhotos}
        onAddSitePhoto={(photo) => setSitePhotos((prev) => [...prev, photo])}
        onRemoveSitePhoto={(idx) => setSitePhotos((prev) => prev.filter((_, i) => i !== idx))}
      />

      {/* AI Solar Layout & Advisory Engine Modal */}
      <AILayoutModal
        isOpen={isAIEngineOpen}
        onClose={() => setIsAIEngineOpen(false)}
        calculation={calculation}
        coordinates={coordinates}
        currentUser={currentUser}
        onSavedSuccess={handleSavedSuccess}
        onExportReport={() => {
          setIsAIEngineOpen(false);
          setIsReportModalOpen(true);
        }}
      />

      {/* Vendor Quote Request Modal */}
      <VendorQuoteModal
        isOpen={Boolean(selectedVendorForQuote)}
        onClose={() => setSelectedVendorForQuote(null)}
        vendor={selectedVendorForQuote}
        calculation={calculation}
      />

      {/* Export / Print Solar Report Modal */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        calculation={calculation}
        coordinates={coordinates}
        currentUser={currentUser}
      />

      {/* Saved Assessments Slide-out Drawer */}
      <SavedAnalysesDrawer
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        analyses={savedAnalyses}
        onLoadAnalysis={handleLoadAnalysis}
        onDeleteAnalysis={handleDeleteAnalysis}
      />
    </div>
  );
};
