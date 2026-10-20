import React, { useState } from 'react';
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
  ArrowUpRight,
  Maximize2,
  Share2,
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

export const AILayoutModal: React.FC<AILayoutModalProps> = ({
  isOpen,
  onClose,
  calculation,
  coordinates,
  currentUser,
  onSavedSuccess,
  onExportReport,
}) => {
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [analysisTitle, setAnalysisTitle] = useState(
    `Rooftop PV Assessment - ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
  );

  if (!isOpen) return null;

  // Simulate an AI panel placement grid: 
  // calculate columns and rows based on panel count (approx ratio 4:3)
  const totalPanels = calculation.panelCount;
  const cols = Math.max(3, Math.min(12, Math.ceil(Math.sqrt(totalPanels * 1.4))));
  const rows = Math.max(2, Math.ceil(totalPanels / cols));

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
      locationName: 'Rooftop Parcel (' + calculation.areaSqMeters + ' m²)',
      areaSqMeters: calculation.areaSqMeters,
      annualSolarGenerationKWh: calculation.annualSolarGenerationKWh,
      systemCapacityKWp: calculation.systemCapacityKWp,
      greeneryRatioPercent: calculation.greeneryRatioPercent,
      annualSavings: calculation.estimatedAnnualSavings,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-5xl w-full max-h-[92vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-slate-900">
                  AI Solar Layout & Placement Engine
                </h3>
                <span className="text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                  Autonomous Plan
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Optimized 18° South-facing array layout with safety setbacks and shade bypass corridors.
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
          
          {/* Top Info Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Recommended Panels</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">{calculation.panelCount} units</strong>
              <span className="text-[10px] text-slate-400 block">400W Monocrystalline</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">DC System Size</span>
              <strong className="text-sm font-bold text-amber-600 font-mono">{calculation.systemCapacityKWp} kWp</strong>
              <span className="text-[10px] text-slate-400 block">Peak DC capacity</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Array Tilt & Azimuth</span>
              <strong className="text-sm font-bold text-slate-900 font-mono">18° Tilt / 180° South</strong>
              <span className="text-[10px] text-slate-400 block">Maximum yield angle</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Estimated Payback</span>
              <strong className="text-sm font-bold text-emerald-600 font-mono">3.8 - 4.5 Years</strong>
              <span className="text-[10px] text-slate-400 block">with PM Surya Ghar</span>
            </div>
          </div>

          {/* Interactive AI Layout Grid Simulation Preview */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 shadow-xl border border-slate-800">
            <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
              <span className="font-semibold uppercase tracking-wider flex items-center gap-1.5 text-white">
                <Compass className="w-4 h-4 text-amber-400" />
                Simulated Rooftop Plan Preview (Orientation: True South ↓)
              </span>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-blue-500/80 border border-blue-400 inline-block" /> Active Panel
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block" /> Walkway
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded bg-red-950/60 border border-red-500/60 inline-block" /> Shadow Avoidance
                </span>
              </div>
            </div>

            {/* Panel Slots Grid */}
            <div className="p-4 sm:p-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center">
              <div 
                className="grid gap-1.5 sm:gap-2 max-w-full overflow-x-auto p-2"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(28px, 48px))`,
                }}
              >
                {Array.from({ length: cols * rows }).map((_, idx) => {
                  const isWaterTankZone = idx < 2 || (idx % cols === 0 && idx < cols * 2);
                  const isWalkway = (idx % 4 === 3 && idx < totalPanels);
                  const isActivePanel = idx < totalPanels && !isWaterTankZone && !isWalkway;

                  if (isWaterTankZone) {
                    return (
                      <div
                        key={idx}
                        className="h-10 sm:h-12 rounded bg-red-950/50 border border-red-600/40 flex items-center justify-center text-[9px] text-red-400 font-mono select-none"
                        title="Water Tank / Mumty Avoidance Zone"
                      >
                        ✕
                      </div>
                    );
                  }

                  if (isWalkway) {
                    return (
                      <div
                        key={idx}
                        className="h-10 sm:h-12 rounded bg-slate-800/60 border border-dashed border-slate-600/60 flex items-center justify-center text-[8px] text-slate-400 font-mono select-none"
                        title="Maintenance Walkway Corridor"
                      >
                        path
                      </div>
                    );
                  }

                  if (isActivePanel) {
                    return (
                      <div
                        key={idx}
                        className="h-10 sm:h-12 rounded bg-gradient-to-b from-blue-600 to-indigo-900 border border-blue-400/80 shadow-inner flex flex-col items-center justify-center text-[8px] text-blue-200 font-mono select-none transition-transform hover:scale-110 cursor-pointer"
                        title={`PV Slot #${idx + 1}: 400W Monocrystalline PERC (Tilt 18°)`}
                      >
                        <span className="font-bold text-[7px] text-blue-300">PV-{idx + 1}</span>
                        <div className="w-3/4 h-[1px] bg-blue-300/30 my-0.5" />
                        <span className="text-[7px]">400W</span>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={idx}
                      className="h-10 sm:h-12 rounded bg-slate-900/40 border border-slate-800/40 flex items-center justify-center text-[8px] text-slate-700"
                    >
                      •
                    </div>
                  );
                })}
              </div>

              <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  Array Azimuth: 180° Due South
                </span>
                <span>Inter-row Spacing: 0.65m (Zero self-shading at winter solstice)</span>
              </div>
            </div>
          </div>

          {/* Split Screen Do's and Don'ts Advisory Panel */}
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
