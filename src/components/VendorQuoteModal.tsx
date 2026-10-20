import React, { useState } from 'react';
import { X, ShieldCheck, Send, CheckCircle2, Phone, Mail, Building } from 'lucide-react';
import { SolarVendor, AnalysisCalculation } from '../types';

interface VendorQuoteModalProps {
  vendor: SolarVendor | null;
  isOpen: boolean;
  onClose: () => void;
  calculation: AnalysisCalculation;
}

export const VendorQuoteModal: React.FC<VendorQuoteModalProps> = ({
  vendor,
  isOpen,
  onClose,
  calculation,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('Please schedule an on-site structural audit and PM Surya Ghar net-metering feasibility survey.');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !vendor) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  const estimatedQuote = Math.round(vendor.pricePerKWp * calculation.systemCapacityKWp);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{vendor.logo}</span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-base font-bold text-slate-900">{vendor.name}</h3>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-slate-500">Official Empaneled Installer • {vendor.warrantyYears} Year Performance Warranty</p>
            </div>
          </div>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-lg font-bold text-slate-900">Site Audit Request Dispatched!</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {vendor.name}'s engineering team will reach out within 24 hours with a comprehensive site inspection blueprint.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-amber-800 font-bold block">Estimated Project Estimate</span>
                <span className="text-amber-700">{calculation.systemCapacityKWp} kWp ({calculation.panelCount} panels)</span>
              </div>
              <span className="text-base font-black text-amber-950 font-mono">
                {calculation.currencySymbol}{estimatedQuote.toLocaleString()}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jaishiv Tiwari"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number (for Site Engineer)</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Project Notes / Roof Access</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-slate-800"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Free Feasibility Request</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
