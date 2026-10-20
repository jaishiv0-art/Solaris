import React from 'react';
import { Sun, Leaf, User, BookmarkCheck, Sparkles, LogOut, ShieldCheck } from 'lucide-react';
import { UserProfile, AppMode } from '../types';

interface NavbarProps {
  currentView: 'landing' | 'app';
  setCurrentView: (view: 'landing' | 'app') => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSavedDrawer: () => void;
  onOpenSupabaseModal: () => void;
  savedCount: number;
  appMode?: AppMode;
  setAppMode?: (mode: AppMode) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenSavedDrawer,
  onOpenSupabaseModal,
  savedCount,
  appMode,
  setAppMode,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-amber-500 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sun className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                Geo<span className="text-emerald-600">Canopy</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                Beta
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block -mt-0.5 font-medium">
              Urban Green & Rooftop Solar Estimator
            </p>
          </div>
        </div>

        {/* Center Mode Controls (Only visible in Dashboard / App view) */}
        {currentView === 'app' && setAppMode && appMode && (
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-full border border-slate-200/80">
            <button
              onClick={() => setAppMode('solar')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                appMode === 'solar'
                  ? 'bg-white text-amber-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              Rooftop Solar Estimator
            </button>
            <button
              onClick={() => setAppMode('greenery')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                appMode === 'greenery'
                  ? 'bg-white text-emerald-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              Land & Greenery Audit
            </button>
          </div>
        )}

        {/* Right Navigation & User Actions */}
        <div className="flex items-center gap-3">
          {currentView === 'landing' ? (
            <button
              onClick={() => setCurrentView('app')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              How It Works
            </button>
          ) : (
            <button
              onClick={() => setCurrentView('landing')}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Home
            </button>
          )}

          {/* Supabase Connection Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition-colors"
            title="Configure Supabase Cloud"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline">Supabase</span>
          </button>

          {/* Saved Analyses Badge Button */}
          <button
            onClick={onOpenSavedDrawer}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
            title="Saved Rooftop Estimates"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                {savedCount}
              </span>
            )}
          </button>

          {/* User Profile / Auth Button */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs text-slate-700">
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[11px]">
                  {currentUser.fullName ? currentUser.fullName[0].toUpperCase() : 'U'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold leading-tight line-clamp-1 max-w-[110px]">
                    {currentUser.fullName || currentUser.email.split('@')[0]}
                  </span>
                  {currentUser.isGuest && (
                    <span className="text-[9px] text-amber-600 font-medium">Guest Mode</span>
                  )}
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}

          {/* Main Call to action: Launch Map */}
          {currentView === 'landing' && (
            <button
              onClick={() => setCurrentView('app')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch Estimator</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
