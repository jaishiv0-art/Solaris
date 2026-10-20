import React, { useState } from 'react';
import {
  Sun,
  Leaf,
  Pencil,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Zap,
  ArrowRight,
  Layers,
  MapPin,
  CheckCircle2,
  DollarSign,
  TreeDeciduous,
  FileText,
  Award,
  ChevronRight,
} from 'lucide-react';
import { UserProfile } from '../types';
import { siteConfig } from '../config/siteConfig';

interface LandingPageProps {
  onLaunchApp: () => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onLaunchApp,
  currentUser,
  onOpenAuth,
}) => {
  // Interactive mini ROI slider for the hero
  const [demoRoofArea, setDemoRoofArea] = useState(120); // in m²

  // Quick live calculations
  const usableArea = Math.round(demoRoofArea * siteConfig.solar.usableRoofRatio);
  const panelCount = Math.floor(usableArea / siteConfig.solar.panelAreaSqMeters);
  const systemKWp = (panelCount * siteConfig.solar.panelCapacityKW).toFixed(1);
  const annualKWh = Math.round(parseFloat(systemKWp) * 1450);
  const annualSavingsINR = Math.round(annualKWh * siteConfig.financials.defaultTariffINR);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-amber-100 selection:text-amber-900">

      {/* Hero Section - Isolated dark canvas with vivid background & crisp high-contrast text */}
      <section className="relative isolate pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden bg-slate-950 text-white">
        {/* Cinematic Solar & Urban Landscape Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src={siteConfig.media.heroBackground}
            onError={(e) => {
              const target = e.currentTarget;
              target.src = siteConfig.media.logo;
            }}
            alt="Solaris Rooftop Solar Landscape"
            className="w-full h-full object-cover object-center opacity-95 filter brightness-105 contrast-[1.05]"
          />
          {/* Lighter translucent gradient wash letting the background image shine through vividly */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-950/50 to-slate-900/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Headline & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-700/80 shadow-md">
                  <img
                    src={siteConfig.media.logo}
                    alt={siteConfig.branding.name}
                    className="w-7 h-7 object-contain rounded-lg bg-white"
                  />
                  <span className="text-xs font-black tracking-wider text-white font-mono">
                    {siteConfig.branding.name}
                  </span>
                  <span className="text-[10px] text-amber-400 font-bold hidden sm:inline">
                    {siteConfig.branding.tagline}
                  </span>
                </div>

                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-400/40 text-amber-200 text-xs font-bold tracking-wide shadow-xs">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Google Sunroof Engine</span>
                  <span className="w-1 h-1 rounded-full bg-amber-400" />
                  <span className="text-emerald-400">PM Surya Ghar</span>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
                Turn Your Rooftop into a{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-md">
                  Clean Energy Asset
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-100 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                Draw custom roof boundaries with satellite GIS imagery, simulate high-density solar PV arrays, detect tree shade obstructions, and calculate direct government subsidies in seconds.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={onLaunchApp}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-amber-500 via-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2.5 group"
                >
                  <Sparkles className="w-4 h-4 text-amber-200 group-hover:rotate-12 transition-transform" />
                  <span>Launch Rooftop Estimator</span>
                  <ArrowRight className="w-4 h-4 text-white/80 group-hover:translate-x-1 transition-transform" />
                </button>

                {!currentUser && (
                  <button
                    onClick={onOpenAuth}
                    className="w-full sm:w-auto px-6 py-4 rounded-2xl text-sm font-bold bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/20 shadow-soft transition-all hover:shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Sign In to Save Rooftops</span>
                  </button>
                )}
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-700/60 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free & Open Satellite Data</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>BIS & MNRE Empaneled Partners</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Leaf className="w-4 h-4 text-emerald-400" />
                  <span>Urban Green Canopy NDVI</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Hero Estimator Card with solarsetting.avif background */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl p-6 sm:p-8 isolate">
                {/* Solar Setting AVIF Background Image */}
                <img
                  src={siteConfig.media.cardBackground || '/solarsetting.avif'}
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.src = siteConfig.media.heroBackground;
                  }}
                  alt="Solar ROI Simulator Background"
                  className="absolute inset-0 w-full h-full object-cover object-center -z-10 brightness-[0.70] contrast-[1.15]"
                />
                {/* Frosted Glass Dark Wash Overlay for realistic aesthetics and high visibility */}
                <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-md -z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/50 to-slate-950/30 -z-10" />

                <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-amber-500 to-emerald-500 text-white text-[11px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-lg border border-amber-300/40">
                  Live ROI Simulator
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Estimate Your Rooftop Area
                      </label>
                      <span className="text-sm font-extrabold text-amber-300 font-mono drop-shadow-sm">
                        {demoRoofArea} m² ({Math.round(demoRoofArea * 10.7639)} sq ft)
                      </span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={600}
                      step={10}
                      value={demoRoofArea}
                      onChange={(e) => setDemoRoofArea(Number(e.target.value))}
                      className="w-full h-2.5 bg-slate-800/90 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-700/60"
                    />
                    <div className="flex justify-between text-[10px] text-slate-300/90 font-medium mt-1.5">
                      <span>30 m² (Townhouse)</span>
                      <span>300 m² (Villa)</span>
                      <span>600 m² (Commercial)</span>
                    </div>
                  </div>

                  {/* Calculated metrics: Dual Glow HUD Cards */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="p-4 bg-slate-900/80 backdrop-blur-md border border-amber-500/40 rounded-2xl shadow-lg shadow-amber-950/20 group hover:border-amber-400 transition-colors">
                      <span className="text-[11px] font-bold text-amber-300 block flex items-center gap-1.5">
                        <Sun className="w-3.5 h-3.5 text-amber-400" />
                        Annual Solar Yield
                      </span>
                      <div className="text-2xl font-black text-white font-mono mt-1 drop-shadow-md">
                        {annualKWh.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-amber-200/80 font-medium">kWh / year clean power</span>
                    </div>

                    <div className="p-4 bg-slate-900/80 backdrop-blur-md border border-emerald-500/40 rounded-2xl shadow-lg shadow-emerald-950/20 group hover:border-emerald-400 transition-colors">
                      <span className="text-[11px] font-bold text-emerald-300 block flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-400" />
                        Estimated Savings
                      </span>
                      <div className="text-2xl font-black text-emerald-400 font-mono mt-1 drop-shadow-md">
                        ₹{annualSavingsINR.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-200/80 font-medium">/ year off grid bills</span>
                    </div>
                  </div>

                  {/* Panel Fit Spec */}
                  <div className="p-4 bg-slate-900/85 backdrop-blur-md border border-slate-700/80 rounded-2xl flex items-center justify-between text-xs shadow-md">
                    <div>
                      <span className="text-slate-300 text-[11px] block font-medium">Rooftop Panel Capacity</span>
                      <strong className="text-sm text-white font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="text-amber-400 font-bold">{panelCount}</span> Solar Panels ({systemKWp} kWp)
                      </strong>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-300 text-[11px] block font-medium">PM Surya Ghar Grant</span>
                      <span className="text-xs font-black text-emerald-300 bg-emerald-950/90 px-2.5 py-1 rounded-full border border-emerald-500/40 inline-block mt-0.5 shadow-sm">
                        Up to ₹78,000
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onLaunchApp}
                    className="w-full py-3.5 px-4 rounded-xl text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-slate-950 shadow-xl shadow-amber-500/30 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group tracking-wide"
                  >
                    <span>Analyze Your Specific Roof on Map</span>
                    <ChevronRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* "How It Works" Section: 3 Visual Feature Cards */}
      <section className="py-20 bg-white border-y border-slate-200/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200/60">
              Three Simple Steps
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              How Solaris Works </h2>
            <p className="text-sm text-slate-600">
              Transforming satellite imagery into actionable solar architecture and urban greenery intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1: Draw Area */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft hover:shadow-float transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors shadow-inner">
                  <Pencil className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Step 01</span>
                  <h3 className="text-lg font-bold text-slate-900">Draw Area</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Search any address or select high-profile presets. Click points to outline the exact perimeter of your flat or pitched rooftop on ultra-crisp satellite layers.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                <span>Geodesic polygon precision</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 2: Analyze Sun/Shade & Greenery */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft hover:shadow-float transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors shadow-inner">
                  <Sun className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 02</span>
                  <h3 className="text-lg font-bold text-slate-900">Analyze Sun/Shade & Greenery</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our physics engine assesses peak sun hours, detects tree canopy shadow cones, estimates NDVI vegetative index, and computes total kWh energy output.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-semibold text-emerald-700 flex items-center gap-1.5">
                <span>NDVI & obstruction detection</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Step 3: Get Solar & Vendor Plans */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-soft hover:shadow-float transition-all group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                  <Sparkles className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 03</span>
                  <h3 className="text-lg font-bold text-slate-900">Get Solar & Vendor Plans</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspect the AI-generated panel placement grid, verify Do's & Don'ts setbacks, claim PM Surya Ghar subsidies, and request certified vendor quotes.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/70 text-xs font-semibold text-blue-700 flex items-center gap-1.5">
                <span>Direct bank grant matching</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Call to action Banner */}
      <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold border border-white/10">
            <Award className="w-4 h-4" />
            <span>Open Energy Geospatial Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Discover Your Roof's Solar & Green Potential?
          </h2>

          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Join thousands of homeowners and sustainability engineers taking control of their energy destiny. Zero hardware required.
          </p>

          <div className="pt-2">
            <button
              onClick={onLaunchApp}
              className="px-8 py-3.5 rounded-2xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-lg shadow-amber-500/30 transition-transform hover:scale-105 active:scale-95 inline-flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Interactive Map Workspace</span>
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
