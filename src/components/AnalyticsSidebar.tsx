import React, { useState } from 'react';
import {
  Sun,
  Leaf,
  Zap,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle,
  Building,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Info,
  DollarSign,
  TreeDeciduous,
  Flame,
  ArrowRight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { AnalysisCalculation, AppMode, SolarVendor, SubsidyScheme } from '../types';
import { SOLAR_VENDORS, SUBSIDY_SCHEMES } from '../lib/mockData';

interface AnalyticsSidebarProps {
  calculation: AnalysisCalculation;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenAIEngine: () => void;
  onSelectVendor: (vendor: SolarVendor) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  calculation,
  mode,
  setMode,
  onOpenAIEngine,
  onSelectVendor,
  isCollapsed,
  setIsCollapsed,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'vendors' | 'subsidies'>('analytics');
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('pm-surya-ghar');

  const selectedScheme = SUBSIDY_SCHEMES.find((s) => s.id === selectedSchemeId) || SUBSIDY_SCHEMES[0];

  // System estimated cost before subsidy: ~₹52,000 / kWp
  const estimatedGrossCost = Math.round(calculation.systemCapacityKWp * 52000);
  const applicableSubsidy = Math.min(
    selectedScheme.maxSubsidyAmount,
    Math.round(estimatedGrossCost * (selectedScheme.percentageCovered / 100))
  );
  const netEstimatedCost = Math.max(0, estimatedGrossCost - applicableSubsidy);
  const paybackYears = calculation.estimatedAnnualSavings > 0
    ? (netEstimatedCost / calculation.estimatedAnnualSavings).toFixed(1)
    : '4.2';

  return (
    <aside
      className={`fixed top-16 right-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-14' : 'w-full sm:w-[460px]'
      }`}
    >
      {/* Collapse Toggle Handle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -left-3.5 top-6 z-40 w-7 h-7 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-transform hover:scale-110"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Mini Bar when collapsed */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-6 gap-6 text-slate-500">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
            <Sun className="w-5 h-5" />
          </div>
          <div className="writing-vertical text-xs font-bold tracking-widest uppercase text-slate-400 rotate-180">
            {mode === 'solar' ? 'Solar Yield Analysis' : 'Greenery Audit'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Header & Mode Switcher */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/60">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  Rooftop Intelligence Panel
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time calculations for drawn polygon
                </p>
              </div>

              {/* AI Layout Engine Button */}
              <button
                onClick={onOpenAIEngine}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                AI Layout
              </button>
            </div>

            {/* Sub Tabs */}
            <div className="flex bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('vendors')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'vendors'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Vendors ({SOLAR_VENDORS.length})
              </button>
              <button
                onClick={() => setActiveTab('subsidies')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'subsidies'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Subsidies & ROI
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {activeTab === 'analytics' && (
              <>
                {/* Surface Area Hero Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                  
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span className="font-semibold uppercase tracking-wider">Gross Surface Area</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded-full text-[11px] text-amber-300 font-mono">
                      {calculation.usableRoofRatio * 100}% Usable Solar Envelope
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-3xl font-black font-mono tracking-tight text-white">
                      {calculation.areaSqMeters.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold text-amber-400">m²</span>
                    <span className="text-xs text-slate-400 ml-1">
                      / {calculation.areaSqFt.toLocaleString()} sq ft
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/60 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">Solar Panel Count</span>
                      <span className="text-base font-bold text-white font-mono">
                        {calculation.panelCount} units
                      </span>
                      <span className="text-[10px] text-slate-400 block">(400W Monocrystalline)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[11px]">System Capacity</span>
                      <span className="text-base font-bold text-amber-400 font-mono">
                        {calculation.systemCapacityKWp} kWp
                      </span>
                      <span className="text-[10px] text-slate-400 block">Peak DC Rating</span>
                    </div>
                  </div>
                </div>

                {/* Energy & Financial Estimates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/60">
                    <div className="flex items-center gap-1.5 text-amber-800 text-xs font-bold mb-1">
                      <Zap className="w-4 h-4 text-amber-600" />
                      Annual Generation
                    </div>
                    <div className="text-xl font-extrabold text-amber-950 font-mono">
                      {calculation.annualSolarGenerationKWh.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-medium text-amber-800">
                      kWh / year produced
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/60">
                    <div className="flex items-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Estimated Savings
                    </div>
                    <div className="text-xl font-extrabold text-emerald-950 font-mono">
                      {calculation.currencySymbol}{calculation.estimatedAnnualSavings.toLocaleString()}
                    </div>
                    <span className="text-[10px] font-medium text-emerald-800">
                      / year off utility bills
                    </span>
                  </div>
                </div>

                {/* Greenery / NDVI Score Card */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                        <Leaf className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">Greenery & Canopy Density</h4>
                        <span className="text-[11px] text-slate-500">Simulated NDVI Vegetation Index</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {calculation.canopyDensityLevel}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span className="text-slate-600">NDVI Score: <strong className="text-slate-900 font-mono">{calculation.ndviScore}</strong></span>
                      <span className="text-emerald-700 font-bold font-mono">{calculation.greeneryRatioPercent}% Canopy Cover</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-amber-400 via-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${calculation.greeneryRatioPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Shade Warning Banner */}
                <div
                  className={`p-4 rounded-2xl border ${
                    calculation.shadeRisk === 'High'
                      ? 'bg-red-50 border-red-200 text-red-900'
                      : calculation.shadeRisk === 'Medium'
                      ? 'bg-amber-50 border-amber-200 text-amber-900'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle
                      className={`w-5 h-5 shrink-0 mt-0.5 ${
                        calculation.shadeRisk === 'High'
                          ? 'text-red-600'
                          : calculation.shadeRisk === 'Medium'
                          ? 'text-amber-600'
                          : 'text-emerald-600'
                      }`}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold">
                          Shade Warning: {calculation.shadeRisk} Obstruction Risk
                        </h4>
                        <span className="text-[10px] px-2 py-0.2 bg-white/70 rounded-full font-mono">
                          ~{(calculation.shadeFactor * 100).toFixed(0)}% Shade Loss
                        </span>
                      </div>
                      <ul className="text-xs space-y-0.5 list-disc list-inside text-slate-700">
                        {calculation.shadeCauses.map((cause, i) => (
                          <li key={i}>{cause}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Ecological CO2 Offset & Trees Equivalent */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-around text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      CO₂ Abatement
                    </span>
                    <span className="text-lg font-black text-slate-900 font-mono">
                      {calculation.co2OffsetTonsPerYear}
                    </span>
                    <span className="text-xs text-slate-500 block">tons / year</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Tree Offset
                    </span>
                    <span className="text-lg font-black text-emerald-600 font-mono">
                      {calculation.treesEquivalent}
                    </span>
                    <span className="text-xs text-slate-500 block">mature trees</span>
                  </div>
                </div>

                {/* AI Layout Engine Call to action Card */}
                <div className="p-5 rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Step 3
                    </span>
                    <Sparkles className="w-4 h-4 text-amber-200" />
                  </div>
                  <h4 className="text-sm font-bold">Run AI Solar Grid Layout</h4>
                  <p className="text-xs text-amber-100 mt-1 mb-3">
                    Simulate physical panel placement, inspect recommended tilt zones & avoid water tank shadow cones.
                  </p>
                  <button
                    onClick={onOpenAIEngine}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white text-amber-900 hover:bg-amber-50 shadow-sm transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <span>Inspect AI Layout & Advisory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}

            {/* Vendors Tab */}
            {activeTab === 'vendors' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs text-amber-900">
                  <strong>Tier-1 Verified Clean Energy Partners:</strong> Pre-screened for BIS certifications, MNRE empanelment, and PM Surya Ghar net-metering readiness.
                </div>

                {SOLAR_VENDORS.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{vendor.logo}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-bold text-slate-900">{vendor.name}</h4>
                            {vendor.verified && (
                              <span title="Verified Tier-1 Vendor">
                                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <span className="text-amber-500 font-bold">★ {vendor.rating}</span>
                            <span>({vendor.reviewsCount} installs)</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
                        {vendor.warrantyYears} yrs warranty
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Install Turnaround</span>
                        <span className="font-semibold text-slate-800">{vendor.estimatedInstallationDays} business days</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[11px]">Approx Quote for {calculation.systemCapacityKWp}kWp</span>
                        <span className="font-bold text-emerald-700 font-mono">
                          {calculation.currencySymbol}{Math.round(vendor.pricePerKWp * calculation.systemCapacityKWp).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={() => onSelectVendor(vendor)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors"
                      >
                        Request Site Audit Quote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subsidies Tab */}
            {activeTab === 'subsidies' && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 border border-emerald-200/60 rounded-2xl text-xs text-emerald-900">
                  <strong>Government Incentives & Direct Bank Transfers:</strong> Select a national or state incentive scheme to calculate your net out-of-pocket investment.
                </div>

                {/* Scheme Selector */}
                <div className="space-y-2.5">
                  {SUBSIDY_SCHEMES.map((scheme) => (
                    <div
                      key={scheme.id}
                      onClick={() => setSelectedSchemeId(scheme.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedSchemeId === scheme.id
                          ? 'border-amber-500 bg-amber-50/50 shadow-sm'
                          : 'border-slate-200/80 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-900">{scheme.title}</span>
                        <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          {scheme.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
                        {scheme.eligibilityNotes}
                      </p>
                      <div className="flex items-center justify-between text-xs font-medium text-slate-700 pt-1 border-t border-slate-100">
                        <span>Max Cap: <strong>₹{scheme.maxSubsidyAmount.toLocaleString()}</strong></span>
                        <span className="text-emerald-700 font-bold">{scheme.percentageCovered}% grant</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Financial Summary Card */}
                <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Net Investment Breakdown ({calculation.systemCapacityKWp} kWp System)
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>Standard EPC Turnkey Cost:</span>
                      <span className="font-mono">₹{estimatedGrossCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-semibold">
                      <span>Direct Govt Subsidy:</span>
                      <span className="font-mono">- ₹{applicableSubsidy.toLocaleString()}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                      <span>Net Out-of-Pocket Cost:</span>
                      <span className="text-amber-400 font-mono text-base">₹{netEstimatedCost.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-white/10 rounded-2xl flex items-center justify-between text-xs">
                    <span className="text-slate-300">Estimated Payback Period:</span>
                    <span className="text-emerald-300 font-bold font-mono text-sm">{paybackYears} Years</span>
                  </div>

                  <p className="text-[10px] text-slate-400">
                    *Based on average 4.8 Peak Sun Hours and DISCOM net-metering banking tariffs.
                  </p>
                </div>
              </div>
            )}

          </div>

        </div>
      )}
    </aside>
  );
};
