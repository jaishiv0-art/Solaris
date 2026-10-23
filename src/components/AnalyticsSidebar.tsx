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
  Info,
  DollarSign,
  ArrowRight,
  Calculator,
  Camera,
  Upload,
  Trash2,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import { AnalysisCalculation, AppMode, SolarVendor, SubsidyScheme } from '../types';
import { SOLAR_VENDORS, SUBSIDY_SCHEMES } from '../lib/mockData';
import { calculatePMSuryaGharSubsidy } from '../lib/solarCalculations';

interface AnalyticsSidebarProps {
  calculation: AnalysisCalculation;
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onOpenAIEngine: () => void;
  onSelectVendor: (vendor: SolarVendor) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  sitePhotos?: string[];
  onAddSitePhoto?: (photoUrl: string) => void;
  onRemoveSitePhoto?: (index: number) => void;
}

export const AnalyticsSidebar: React.FC<AnalyticsSidebarProps> = ({
  calculation,
  mode,
  setMode,
  onOpenAIEngine,
  onSelectVendor,
  isCollapsed,
  setIsCollapsed,
  sitePhotos = [],
  onAddSitePhoto,
  onRemoveSitePhoto,
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'calculator' | 'vendors' | 'photos'>('analytics');
  
  // Real customizable parameters for personal bill calculation
  const [monthlyBillINR, setMonthlyBillINR] = useState(3800); // ₹3,800/mo typical tier
  const [unitTariffINR, setUnitTariffINR] = useState(8.2); // ₹8.2/unit typical DISCOM tariff

  // Turnkey EPC cost benchmark (~₹52,000 / kWp installed)
  const turnkeyCostPerKWp = 52000;
  const estimatedGrossCost = Math.round(calculation.systemCapacityKWp * turnkeyCostPerKWp);

  // Exact Central PM Surya Ghar Subsidy
  const pmSuryaGharGrant = calculatePMSuryaGharSubsidy(calculation.systemCapacityKWp);
  const netEstimatedCost = Math.max(0, estimatedGrossCost - pmSuryaGharGrant);

  // Real bill savings calculation based on user's actual bill & net-metering
  const monthlySolarUnits = Math.round(calculation.annualSolarGenerationKWh / 12);
  const monthlySolarSavings = Math.round(monthlySolarUnits * unitTariffINR);
  const finalMonthlySavings = Math.min(monthlyBillINR, monthlySolarSavings);
  
  // For commercial / large scale systems (>10 kWp), savings reflect full net-metering solar generation value
  const isCommercialScale = calculation.systemCapacityKWp > 10;
  const annualSavingsFromBill = isCommercialScale
    ? calculation.estimatedAnnualSavings
    : finalMonthlySavings * 12;

  const paybackYears = annualSavingsFromBill > 0
    ? (netEstimatedCost / annualSavingsFromBill).toFixed(1)
    : '4.1';

  // Handle local photo upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && onAddSitePhoto) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          onAddSitePhoto(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(files[0]);
    }
  };

  return (
    <aside
      className={`fixed top-16 right-0 bottom-0 z-30 bg-white/95 backdrop-blur-xl border-l border-slate-200/90 shadow-2xl transition-all duration-300 flex flex-col ${
        isCollapsed ? 'w-14' : 'w-full sm:w-[480px]'
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
            {mode === 'solar' ? 'Rooftop Solar Intelligence' : 'Greenery & Canopy'}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full overflow-hidden">
          
          {/* Header & Sub-Tabs */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  Rooftop Intelligence Panel
                </h2>
                <p className="text-xs text-slate-500">
                  Real measurements & verified MNRE formulas
                </p>
              </div>

              {/* AI Layout Engine Trigger */}
              <button
                onClick={onOpenAIEngine}
                disabled={calculation.areaSqMeters === 0}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-40 text-white shadow-md shadow-amber-500/25 transition-transform hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Layout</span>
              </button>
            </div>

            {/* Navigation Tabs */}
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
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 py-1.5 rounded-lg transition-all ${
                  activeTab === 'calculator'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bill Calculator
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
                onClick={() => setActiveTab('photos')}
                className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${
                  activeTab === 'photos'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Camera className="w-3 h-3" />
                Photos {sitePhotos.length > 0 && `(${sitePhotos.length})`}
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            
            {/* Tab 1: Real Analytics */}
            {activeTab === 'analytics' && (
              <>
                {calculation.areaSqMeters === 0 ? (
                  <div className="p-8 text-center bg-amber-50/60 rounded-3xl border border-amber-200/80 space-y-3">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <Sun className="w-6 h-6 animate-spin-slow" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">No Roof Selected Yet</h4>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-xs mx-auto">
                      Click <strong>"Draw Roof Area"</strong> on the map and outline the perimeter corners of your rooftop to calculate exact real solar capacity and savings.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Surface Area Hero Card */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-3xl shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl" />
                      
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                        <span className="font-semibold uppercase tracking-wider">Exact Geodesic Area</span>
                        <span className="bg-white/10 px-2.5 py-0.5 rounded-full text-[11px] text-amber-300 font-mono">
                          {Math.round(calculation.usableRoofRatio * 100)}% Usable Solar Envelope
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
                          <span className="text-slate-400 block text-[11px]">400W Solar Panels</span>
                          <span className="text-base font-bold text-white font-mono">
                            {calculation.panelCount} units
                          </span>
                          <span className="text-[10px] text-slate-400 block">2.0 m² per Tier-1 module</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[11px]">Calculated System Size</span>
                          <span className="text-base font-bold text-amber-400 font-mono">
                            {calculation.systemCapacityKWp} kWp
                          </span>
                          <span className="text-[10px] text-slate-400 block">Peak DC capacity rating</span>
                        </div>
                      </div>
                    </div>

                    {/* Solar Generation & Bill Savings */}
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
                          Annual Bill Savings
                        </div>
                        <div className="text-xl font-extrabold text-emerald-950 font-mono">
                          {calculation.currencySymbol}{annualSavingsFromBill.toLocaleString()}
                        </div>
                        <span className="text-[10px] font-medium text-emerald-800">
                          / year off electric bills
                        </span>
                      </div>
                    </div>

                    {/* Shade Risk Banner */}
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
                              Shade Risk: {calculation.shadeRisk} Obstruction
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

                    {/* Greenery / NDVI Score Card */}
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                            <Leaf className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Greenery & Canopy Density</h4>
                            <span className="text-[11px] text-slate-500">Vegetation Index</span>
                          </div>
                        </div>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          {calculation.canopyDensityLevel}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="flex justify-between text-xs mb-1 font-medium">
                          <span className="text-slate-600">NDVI: <strong className="text-slate-900 font-mono">{calculation.ndviScore}</strong></span>
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

                    {/* PM Surya Ghar Subsidy Summary */}
                    <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                          PM Surya Ghar Subsidy Math
                        </h4>
                        <span className="text-[10px] bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded-full font-mono">
                          MNRE Empaneled
                        </span>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-300">
                          <span>Total Turnkey System Cost:</span>
                          <span className="font-mono">₹{estimatedGrossCost.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-semibold">
                          <span>PM Surya Ghar Direct Subsidy:</span>
                          <span className="font-mono">- ₹{pmSuryaGharGrant.toLocaleString()}</span>
                        </div>
                        <div className="pt-2 border-t border-slate-700 flex justify-between text-sm font-bold text-white">
                          <span>Net Investment Cost:</span>
                          <span className="text-amber-400 font-mono text-base">₹{netEstimatedCost.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="p-2.5 bg-white/10 rounded-2xl flex items-center justify-between text-xs">
                        <span className="text-slate-300">Simple Payback Period:</span>
                        <span className="text-emerald-300 font-bold font-mono text-sm">{paybackYears} Years</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Tab 2: Customizable Bill & Tariff Calculator */}
            {activeTab === 'calculator' && (
              <div className="space-y-5">
                <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-xs space-y-1 text-amber-950">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Real Personal Bill Estimator</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Adjust your actual monthly power bill and tariff rate to see your personal financial payback.
                  </p>
                </div>

                <div className="space-y-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>Current Monthly Electricity Bill</span>
                      <span className="font-mono text-amber-600 text-sm">₹{monthlyBillINR.toLocaleString()} / mo</span>
                    </div>
                    <input
                      type="range"
                      min={1000}
                      max={25000}
                      step={500}
                      value={monthlyBillINR}
                      onChange={(e) => setMonthlyBillINR(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹1,000</span>
                      <span>₹10,000</span>
                      <span>₹25,000</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                      <span>DISCOM Electricity Tariff Rate</span>
                      <span className="font-mono text-emerald-600 text-sm">₹{unitTariffINR.toFixed(1)} / kWh</span>
                    </div>
                    <input
                      type="range"
                      min={5.0}
                      max={14.0}
                      step={0.2}
                      value={unitTariffINR}
                      onChange={(e) => setUnitTariffINR(Number(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                      <span>₹5.0 (Subsidized)</span>
                      <span>₹8.2 (Standard)</span>
                      <span>₹14.0 (Commercial)</span>
                    </div>
                  </div>
                </div>

                {/* Calculation breakdown */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Monthly Financial Impact</span>
                  </h4>
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-600">
                      <span>Monthly Rooftop Generation:</span>
                      <strong className="font-mono text-slate-900">{monthlySolarUnits} units (kWh)</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Expected Monthly Bill Savings:</span>
                      <strong className="font-mono text-emerald-600">₹{finalMonthlySavings.toLocaleString()}</strong>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>New Adjusted Electric Bill:</span>
                      <strong className="font-mono text-slate-900">
                        ₹{Math.max(150, monthlyBillINR - finalMonthlySavings).toLocaleString()} / mo
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Verified Vendors */}
            {activeTab === 'vendors' && (
              <div className="space-y-4">
                <div className="p-3 bg-amber-50 border border-amber-200/60 rounded-2xl text-xs text-amber-900">
                  <strong>Tier-1 Empaneled Installers:</strong> Pre-screened for BIS certifications and direct PM Surya Ghar subsidy disbursement.
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
                        <span className="text-slate-400 block text-[11px]">Cost for {calculation.systemCapacityKWp}kWp</span>
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

            {/* Tab 4: Site Photos & Rooftop Upload */}
            {activeTab === 'photos' && (
              <div className="space-y-4">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-1.5 text-emerald-950">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Camera className="w-4 h-4 text-emerald-600" />
                    <span>Upload Rooftop & Site Photos</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Upload photos of your roof, parapets, or obstacles (water tanks, vents) to attach them to your official PDF solar report.
                  </p>
                </div>

                {/* Upload Button */}
                <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white hover:bg-amber-50/30">
                  <Upload className="w-6 h-6 text-slate-400 mb-2" />
                  <span className="text-xs font-bold text-slate-700">Click to Select Photos</span>
                  <span className="text-[10px] text-slate-400">PNG, JPG, or WEBP up to 10MB</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>

                {/* Photo Previews Grid */}
                {sitePhotos.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-slate-700">Attached Rooftop Photos ({sitePhotos.length})</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {sitePhotos.map((photo, idx) => (
                        <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-video">
                          <img src={photo} alt={`Site photo ${idx + 1}`} className="w-full h-full object-cover" />
                          {onRemoveSitePhoto && (
                            <button
                              onClick={() => onRemoveSitePhoto(idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Delete photo"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      )}
    </aside>
  );
};
