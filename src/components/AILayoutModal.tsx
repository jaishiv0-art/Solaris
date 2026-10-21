import React, { useState, useMemo } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Download,
  BookmarkCheck,
  Compass,
  Sun,
  ShieldCheck,
  Layers,
  Zap,
  Info,
  Maximize2,
  Ruler,
  Cpu,
  Grid,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AnalysisCalculation, GeoPoint, SavedAnalysis, UserProfile } from '../types';
import { AI_LAYOUT_RULES } from '../lib/mockData';
import { saveAnalysisRecord } from '../lib/supabaseClient';

interface AILayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: AnalysisCalculation;
  coordinates: GeoPoint[];
  currentUser: UserProfile | null;
  onSavedSuccess: () => void;
  onExportReport: () => void;
}

// Available Standard Solar Panel Specifications
interface SolarPanelOption {
  id: string;
  name: string;
  wattage: number; // Watts
  lengthM: number; // Meters (e.g. 1.95m)
  widthM: number;  // Meters (e.g. 1.02m)
  thicknessMm: number; // 35mm
  areaSqM: number; // Length x Width
  weightKg: number;
  cellType: string;
  efficiency: string;
  recommendedFor: string;
}

const SOLAR_PANEL_OPTIONS: SolarPanelOption[] = [
  {
    id: '400w',
    name: 'Tier-1 400W Mono PERC (Standard)',
    wattage: 400,
    lengthM: 1.95,
    widthM: 1.02,
    thicknessMm: 35,
    areaSqM: 2.0,
    weightKg: 21.8,
    cellType: 'Monocrystalline Half-Cut PERC',
    efficiency: '21.3%',
    recommendedFor: 'Residential & Commercial Rooftops (Most Popular)',
  },
  {
    id: '550w',
    name: 'High-Power 550W TOPCon (Industrial)',
    wattage: 550,
    lengthM: 2.27,
    widthM: 1.13,
    thicknessMm: 35,
    areaSqM: 2.56,
    weightKg: 28.6,
    cellType: 'Bi-facial N-Type TOPCon',
    efficiency: '22.1%',
    recommendedFor: 'Large Warehouses & Utility Scale Plants',
  },
  {
    id: '330w',
    name: 'Compact 330W Poly (Small Roof)',
    wattage: 330,
    lengthM: 1.65,
    widthM: 0.99,
    thicknessMm: 35,
    areaSqM: 1.63,
    weightKg: 18.2,
    cellType: 'Polycrystalline High-Durability',
    efficiency: '19.5%',
    recommendedFor: 'Tight, Irregular or Pitched Rooftops',
  },
];

export const AILayoutModal: React.FC<AILayoutModalProps> = ({
  isOpen,
  onClose,
  calculation,
  coordinates,
  currentUser,
  onSavedSuccess,
  onExportReport,
}) => {
  const [selectedPanelId, setSelectedPanelId] = useState<string>('400w');
  const [layoutViewMode, setLayoutViewMode] = useState<'blueprint' | 'strings'>('blueprint');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [analysisTitle, setAnalysisTitle] = useState(
    `Rooftop PV Assessment - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  );

  const selectedPanel = useMemo(() => {
    return SOLAR_PANEL_OPTIONS.find((p) => p.id === selectedPanelId) || SOLAR_PANEL_OPTIONS[0];
  }, [selectedPanelId]);

  if (!isOpen) return null;

  // Real Rooftop Area Sizing Calculations based on Selected Panel
  const totalRoofArea = calculation.areaSqMeters || 100;
  const usableRatio = calculation.usableRoofRatio || 0.72; // 72% usable (28% for parapet setbacks, walking aisles, tank shade)
  const usableArea = Math.round(totalRoofArea * usableRatio * 10) / 10;
  
  // Real Number of Panels Required = Usable Area / Single Panel Area
  const calculatedPanelCount = Math.floor(usableArea / selectedPanel.areaSqM);
  const totalArrayCoverageArea = Math.round(calculatedPanelCount * selectedPanel.areaSqM * 10) / 10;
  const calculatedKWp = Math.round(((calculatedPanelCount * selectedPanel.wattage) / 1000) * 10) / 10;
  const annualYieldKWh = Math.round(calculatedKWp * 1450);

  // String Architecture Sizing
  const panelsPerString = 24; // standard 1000V/1500V inverter string size
  const totalStrings = Math.max(1, Math.ceil(calculatedPanelCount / panelsPerString));
  const invertersRequired50KW = Math.max(1, Math.ceil(calculatedKWp / 50));

  // Determine visual grid columns and rows (capped to prevent browser DOM lag on huge roofs)
  const isLargeCommercialRoof = calculatedPanelCount > 80;
  const displayPanelsCount = isLargeCommercialRoof ? 72 : calculatedPanelCount;
  const cols = Math.max(4, Math.min(12, Math.ceil(Math.sqrt(displayPanelsCount * 1.5))));
  const rows = Math.max(2, Math.ceil(displayPanelsCount / cols));

  const handleSave = async () => {
    setSaving(true);
    const newRecord: SavedAnalysis = {
      id: 'analysis_' + Date.now().toString(36),
      title: analysisTitle,
      created_at: new Date().toISOString(),
      user_id: currentUser?.id,
      mode: 'solar',
      coordinates,
      center: coordinates.length > 0 ? coordinates[0] : { lat: 28.6139, lng: 77.2090 },
      locationName: 'Rooftop Parcel (' + totalRoofArea + ' m²)',
      areaSqMeters: totalRoofArea,
      annualSolarGenerationKWh: annualYieldKWh,
      systemCapacityKWp: calculatedKWp,
      greeneryRatioPercent: calculation.greeneryRatioPercent,
      annualSavings: Math.round(annualYieldKWh * 8.2),
      shadeRisk: calculation.shadeRisk,
    };

    const res = await saveAnalysisRecord(newRecord);
    setSaving(false);

    if (res.success) {
      setSaveSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
      onSavedSuccess();
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] shadow-2xl border border-slate-200 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 font-black">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  AI Solar Layout & Sizing Engine
                </h3>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Autonomous Plan
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Calculated strictly from your drawn rooftop area of <strong className="text-slate-800">{totalRoofArea.toLocaleString()} m² ({Math.round(totalRoofArea * 10.7639).toLocaleString()} sq ft)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* STEP 1: SOLAR PANEL MODEL & DIMENSION SELECTOR */}
          <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-amber-500" />
                Select Solar Panel Model & Physical Dimensions
              </span>
              <span className="text-[11px] text-slate-500">
                Physical size dictates exact module count per square meter
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {SOLAR_PANEL_OPTIONS.map((panel) => {
                const isSelected = panel.id === selectedPanelId;
                return (
                  <div
                    key={panel.id}
                    onClick={() => setSelectedPanelId(panel.id)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-1 ring-amber-500'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-bold text-slate-900">{panel.name}</span>
                      <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                        {panel.wattage}W
                      </span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-600">
                        <span>Dimensions:</span>
                        <strong className="text-slate-900 font-mono">{panel.lengthM}m × {panel.widthM}m</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Surface Area:</span>
                        <strong className="text-slate-900 font-mono">{panel.areaSqM} m² ({Math.round(panel.areaSqM * 10.7639 * 10) / 10} sq ft)</strong>
                      </div>
                      <div className="flex justify-between text-slate-600">
                        <span>Efficiency / Tech:</span>
                        <span className="text-emerald-700 font-semibold">{panel.efficiency} • {panel.cellType}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 2: TRANSPARENT MATHEMATICAL DERIVATION BREAKDOWN */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-5 sm:p-6 rounded-3xl text-white space-y-4 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-amber-400" />
                Mathematical Rooftop Sizing Breakdown
              </span>
              <span className="text-[11px] text-slate-400">
                Formula: Usable Area ÷ Single Panel Size ({selectedPanel.areaSqM} m²)
              </span>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
              <div className="p-3.5 bg-slate-800/70 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">1. Total Measured Roof</span>
                <strong className="text-base font-black text-white font-mono mt-0.5 block">
                  {totalRoofArea.toLocaleString()} m²
                </strong>
                <span className="text-[10px] text-slate-500 font-mono">
                  {Math.round(totalRoofArea * 10.7639).toLocaleString()} sq ft
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/70 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">2. Usable Solar Envelope</span>
                <strong className="text-base font-black text-amber-400 font-mono mt-0.5 block">
                  {usableArea.toLocaleString()} m²
                </strong>
                <span className="text-[10px] text-slate-400">
                  72% usable (28% buffers)
                </span>
              </div>

              <div className="p-3.5 bg-slate-800/70 rounded-2xl border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">3. Single Panel Footprint</span>
                <strong className="text-base font-black text-white font-mono mt-0.5 block">
                  {selectedPanel.areaSqM} m²
                </strong>
                <span className="text-[10px] text-slate-400">
                  {selectedPanel.lengthM}m × {selectedPanel.widthM}m
                </span>
              </div>

              <div className="p-3.5 bg-amber-500/20 rounded-2xl border border-amber-400/50">
                <span className="text-[10px] text-amber-300 block font-semibold">4. Panels Required</span>
                <strong className="text-xl font-black text-amber-400 font-mono mt-0.5 block">
                  {calculatedPanelCount.toLocaleString()} Units
                </strong>
                <span className="text-[10px] text-amber-200/80">
                  Total Array Area: {totalArrayCoverageArea.toLocaleString()} m²
                </span>
              </div>

              <div className="p-3.5 bg-emerald-500/20 rounded-2xl border border-emerald-400/50">
                <span className="text-[10px] text-emerald-300 block font-semibold">5. Rated DC Capacity</span>
                <strong className="text-xl font-black text-emerald-400 font-mono mt-0.5 block">
                  {calculatedKWp.toLocaleString()} kWp
                </strong>
                <span className="text-[10px] text-emerald-200/80">
                  Annual: {annualYieldKWh.toLocaleString()} kWh
                </span>
              </div>
            </div>
          </div>

          {/* STEP 3: SIMULATED ROOFTOP PLAN PREVIEW */}
          <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl text-white space-y-4 shadow-xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-white">
                  <Compass className="w-4 h-4 text-amber-400" />
                  Simulated Rooftop Plan Preview (Orientation: True South 180° ↓)
                </span>
                {isLargeCommercialRoof && (
                  <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/50 px-2 py-0.5 rounded-full font-mono">
                    Commercial Multi-String Array ({calculatedPanelCount.toLocaleString()} Panels)
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500/80 border border-blue-400 inline-block" /> Active Panel ({selectedPanel.wattage}W)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Walkway
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-950/60 border border-red-500/60 inline-block" /> Shadow Avoidance
                </span>
              </div>
            </div>

            {/* If Commercial / Mega Roof (>80 panels), provide high-level string cluster architecture */}
            {isLargeCommercialRoof && (
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-bold text-amber-400 flex items-center gap-1.5">
                    <Grid className="w-4 h-4" />
                    Multi-String Inverter Architecture:
                  </span>
                  <span className="font-mono text-white">
                    {totalStrings} Series Strings ({panelsPerString} panels/string) • ~{invertersRequired50KW} × 50kW Three-Phase Inverters
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Due to the large parcel size ({totalRoofArea.toLocaleString()} m²), panels are grouped into modular 24-panel DC strings separated by 1.2m service aisles for cleaning and high-voltage string routing. The grid below shows an architectural sub-array cluster sample:
                </p>
              </div>
            )}

            {/* Panel Slots Grid */}
            <div className="p-4 sm:p-6 bg-slate-950/90 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center">
              <div 
                className="grid gap-1.5 sm:gap-2 max-w-full overflow-x-auto p-2"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(32px, 52px))`,
                }}
              >
                {Array.from({ length: cols * rows }).map((_, idx) => {
                  const isWaterTankZone = idx < 2 || (idx % cols === 0 && idx < cols * 2);
                  const isWalkway = (idx % 4 === 3 && idx < displayPanelsCount);
                  const isActivePanel = idx < displayPanelsCount && !isWaterTankZone && !isWalkway;

                  if (isWaterTankZone) {
                    return (
                      <div
                        key={idx}
                        className="h-11 sm:h-12 rounded bg-red-950/50 border border-red-600/40 flex items-center justify-center text-[9px] text-red-400 font-mono select-none"
                        title="Water Tank / Mumty / Lift Shaft Setback"
                      >
                        ✕
                      </div>
                    );
                  }

                  if (isWalkway) {
                    return (
                      <div
                        key={idx}
                        className="h-11 sm:h-12 rounded bg-slate-800/60 border border-dashed border-slate-600/60 flex items-center justify-center text-[8px] text-slate-400 font-mono select-none"
                        title="1.0m Safety & Cleaning Walkway Corridor"
                      >
                        path
                      </div>
                    );
                  }

                  if (isActivePanel) {
                    return (
                      <div
                        key={idx}
                        className="h-11 sm:h-12 rounded bg-gradient-to-b from-blue-600 to-indigo-900 border border-blue-400/80 shadow-inner flex flex-col items-center justify-center text-[8px] text-blue-200 font-mono select-none transition-transform hover:scale-110 cursor-pointer"
                        title={`PV Module #${idx + 1}: ${selectedPanel.name} (${selectedPanel.lengthM}m x ${selectedPanel.widthM}m = ${selectedPanel.areaSqM} m²)`}
                      >
                        <span className="font-bold text-[7px] text-blue-300">PV-{idx + 1}</span>
                        <div className="w-3/4 h-[1px] bg-blue-300/30 my-0.5" />
                        <span className="text-[7px]">{selectedPanel.wattage}W</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="h-11 sm:h-12 rounded bg-slate-900/40 border border-slate-800/40 flex items-center justify-center text-[8px] text-slate-700"
                    >
                      •
                    </div>
                  );
                })}
              </div>

              <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Array Azimuth: 180° Due South • Tilt: 18° Optimal
                </span>
                <span>Inter-row Spacing: 0.65m (Zero winter solstice shading)</span>
                <span>Single Module Footprint: {selectedPanel.lengthM}m × {selectedPanel.widthM}m ({selectedPanel.areaSqM} m²)</span>
              </div>
            </div>
          </div>

          {/* DOs & DONTs ADVISORY */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Recommended Zones (DOs) */}
            <div className="p-5 rounded-3xl bg-emerald-50/70 border border-emerald-200/80 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-xl bg-emerald-200/80 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
                <span>Recommended Installation Zones (Do's)</span>
              </div>

              <div className="space-y-2.5">
                {AI_LAYOUT_RULES.recommended.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-2xl border border-emerald-200/60 shadow-xs space-y-1">
                    <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed pl-3">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Avoid Zones (DON'Ts) */}
            <div className="p-5 rounded-3xl bg-red-50/70 border border-red-200/80 space-y-3">
              <div className="flex items-center gap-2 text-red-800 font-bold text-sm">
                <div className="w-7 h-7 rounded-xl bg-red-200/80 text-red-800 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4 text-red-700" />
                </div>
                <span>Avoid & Buffer Zones (Don'ts)</span>
              </div>

              <div className="space-y-2.5">
                {AI_LAYOUT_RULES.avoid.map((item, idx) => (
                  <div key={idx} className="p-3 bg-white rounded-2xl border border-red-200/60 shadow-xs space-y-1">
                    <h5 className="text-xs font-bold text-red-950 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                      {item.title}
                    </h5>
                    <p className="text-xs text-slate-600 leading-relaxed pl-3">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Save Analysis Input */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex-1 w-full">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Assessment Title
              </label>
              <input
                type="text"
                value={analysisTitle}
                onChange={(e) => setAnalysisTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 font-semibold"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto pt-4 sm:pt-0">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <BookmarkCheck className="w-4 h-4" />
                <span>{saveSuccess ? 'Saved to Records!' : saving ? 'Saving...' : 'Save Analysis'}</span>
              </button>

              <button
                onClick={onExportReport}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4" />
                <span>Export Report</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
