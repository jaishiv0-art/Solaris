import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { AuthModal } from './components/AuthModal';
import { SavedAnalysesDrawer } from './components/SavedAnalysesDrawer';
import { AppMode, SavedAnalysis, UserProfile } from './types';
import { getCurrentUser, logoutUser, fetchUserAnalyses, deleteSavedAnalysis } from './lib/supabaseClient';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'app'>('landing');
  const [appMode, setAppMode] = useState<AppMode>('solar');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);

  // Initialize session and saved records
  const refreshSessionAndData = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    const analyses = await fetchUserAnalyses();
    setSavedAnalyses(analyses);
  };

  useEffect(() => {
    refreshSessionAndData();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setCurrentUser(null);
  };

  const handleAuthSuccess = async (user: UserProfile) => {
    setCurrentUser(user);
    const analyses = await fetchUserAnalyses();
    setSavedAnalyses(analyses);
  };

  const handleDeleteAnalysis = async (id: string) => {
    await deleteSavedAnalysis(id);
    setSavedAnalyses((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        savedCount={savedAnalyses.length}
        appMode={appMode}
        setAppMode={setAppMode}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentView === 'landing' ? (
          <LandingPage
            onLaunchApp={() => setCurrentView('app')}
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        ) : (
          <DashboardPage
            currentUser={currentUser}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            appMode={appMode}
            setAppMode={setAppMode}
            isSavedDrawerOpen={isSavedDrawerOpen}
            setIsSavedDrawerOpen={setIsSavedDrawerOpen}
            savedAnalyses={savedAnalyses}
            setSavedAnalyses={setSavedAnalyses}
          />
        )}
      </main>

      {/* Footer (shown on landing page) */}
      {currentView === 'landing' && <Footer />}

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Saved Analyses Slide-over Drawer (accessible from landing page too) */}
      {currentView === 'landing' && (
        <SavedAnalysesDrawer
          isOpen={isSavedDrawerOpen}
          onClose={() => setIsSavedDrawerOpen(false)}
          analyses={savedAnalyses}
          onLoadAnalysis={() => {
            setCurrentView('app');
            setIsSavedDrawerOpen(false);
          }}
          onDeleteAnalysis={handleDeleteAnalysis}
        />
      )}
    </div>
  );
}

export default App;
