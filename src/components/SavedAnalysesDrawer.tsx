import React from 'react';
import { X, BookmarkCheck, Trash2, ArrowUpRight, Calendar, MapPin, Zap, Leaf } from 'lucide-react';
import { SavedAnalysis } from '../types';

interface SavedAnalysesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  analyses: SavedAnalysis[];
  onLoadAnalysis: (analysis: SavedAnalysis) => void;
  onDeleteAnalysis: (id: string) => void;
}

export const SavedAnalysesDrawer: React.FC<SavedAnalysesDrawerProps> = ({
  isOpen,
  onClose,
  analyses,
  onLoadAnalysis,
  onDeleteAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <BookmarkCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Saved Assessments</h3>
              <p className="text-xs text-slate-500">Stored in Supabase database</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {analyses.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
                <BookmarkCheck className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-700">No Saved Analyses Yet</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Draw a rooftop boundary on the map and click "Save Analysis" in the AI Layout engine to store your plans here.
              </p>
            </div>
          ) : (
            analyses.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200/80 hover:border-amber-400 bg-white shadow-xs hover:shadow-md transition-all space-y-3 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.created_at).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {item.areaSqMeters} m²
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteAnalysis(item.id)}
                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-amber-800 bg-amber-50/70 p-2 rounded-xl">
                    <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-amber-700 block">Solar Yield</span>
                      <strong className="font-mono">{item.annualSolarGenerationKWh.toLocaleString()} kWh</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-50/70 p-2 rounded-xl">
                    <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-[10px] text-emerald-700 block">Greenery</span>
                      <strong className="font-mono">{item.greeneryRatioPercent}% Canopy</strong>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadAnalysis(item);
                    onClose();
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-amber-500 hover:text-white text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Load onto Map</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
