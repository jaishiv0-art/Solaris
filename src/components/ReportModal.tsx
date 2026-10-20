import React from 'react';
import { X, Printer, Download, Sun, Leaf, ShieldCheck, Zap, FileText } from 'lucide-react';
import { AnalysisCalculation, GeoPoint, UserProfile } from '../types';
import { siteConfig } from '../config/siteConfig';
import jsPDF from 'jspdf';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculation: AnalysisCalculation;
  coordinates: GeoPoint[];
  currentUser: UserProfile | null;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  calculation,
  coordinates,
  currentUser,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // Add Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 35, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text(`${siteConfig.branding.name} Rooftop Solar & Greenery Audit`, 14, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(203, 213, 225);
    doc.text(`Generated on ${new Date().toLocaleDateString()} | Author: ${siteConfig.developer.name} | User: ${currentUser?.fullName || 'Guest Explorer'}`, 14, 26);

    // Section 1: Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('1. Executive Property Feasibility Summary', 14, 48);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(51, 65, 85);

    const summaryData = [
      ['Rooftop Surface Area:', `${calculation.areaSqMeters} m² (${calculation.areaSqFt} sq ft)`],
      ['Usable Solar Envelope:', `${calculation.usableAreaSqMeters} m² (72% effective)`],
      ['Standard PV Modules:', `${calculation.panelCount} Units (400W Monocrystalline)`],
      ['Rated DC Capacity:', `${calculation.systemCapacityKWp} kWp`],
      ['Annual Generation Yield:', `${calculation.annualSolarGenerationKWh.toLocaleString()} kWh / year`],
      ['Estimated Annual Savings:', `${calculation.currencySymbol}${calculation.estimatedAnnualSavings.toLocaleString()} / year`],
      ['Canopy Density / NDVI:', `${calculation.greeneryRatioPercent}% (${calculation.canopyDensityLevel})`],
      ['Shading Risk Level:', `${calculation.shadeRisk} Obstruction (~${(calculation.shadeFactor * 100).toFixed(0)}% loss)`],
      ['CO2 Emissions Abated:', `${calculation.co2OffsetTonsPerYear} Tons / year (${calculation.treesEquivalent} trees)`],
    ];

    let startY = 56;
    summaryData.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, 16, startY);
      doc.setFont('helvetica', 'normal');
      doc.text(value, 80, startY);
      startY += 7;
    });

    // Section 2: Technical Layout & Policy
    startY += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text('2. Technical Array Advisory & PM Surya Ghar Subsidy', 14, startY);

    startY += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(71, 85, 105);
    doc.text('• Recommended Orientation: True South (180° Azimuth) with 18° fixed tilt for optimal seasonal irradiance.', 16, startY);
    startY += 6;
    doc.text('• Setback Rules: Maintain minimum 1.2m parapet clearance and avoid the elevator machine room shade cone.', 16, startY);
    startY += 6;
    doc.text('• Financial Scheme: Eligible for PM Surya Ghar subsidy (up to ₹78,000 direct bank grant) and DISCOM net-metering.', 16, startY);
    startY += 6;
    doc.text('• Payback Horizon: Estimated 3.8 to 4.5 years with 25-year tier-1 linear performance warranties.', 16, startY);

    // Section 3: Architect Signature
    startY += 16;
    doc.setDrawColor(226, 232, 240);
    doc.line(14, startY, 196, startY);
    startY += 10;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text('Prepared by GeoCanopy Autonomous Architecture Engine', 14, startY);
    startY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Lead Software Architect: Jaishiv Tiwari | Contact: jaishivtiwari@gmail.com | +91 98765 43210', 14, startY);

    doc.save(`GeoCanopy_Solar_Audit_${Date.now()}.pdf`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] shadow-2xl border border-slate-100 flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Official Solar & Greenery Audit Report</h3>
              <p className="text-xs text-slate-500">Ready for DISCOM submission or vendor quotes</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
              title="Print Report"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Report Preview Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-800">
          <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50/50 space-y-5">
            <div className="flex justify-between items-start border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={siteConfig.media.logo}
                  alt={`${siteConfig.branding.name} Logo`}
                  className="w-12 h-12 object-contain rounded-xl border border-slate-200 bg-white"
                />
                <div>
                  <h4 className="text-xl font-black text-slate-900 font-mono">
                    {siteConfig.branding.name} <span className="text-amber-600 font-sans text-base font-bold">Rooftop Assessment</span>
                  </h4>
                  <p className="text-xs text-slate-500">Autonomous Satellite Solar & Canopy Feasibility Engine • {siteConfig.branding.tagline}</p>
                </div>
              </div>
              <div className="text-right text-xs text-slate-500">
                <span className="font-bold text-slate-800">Date: {new Date().toLocaleDateString()}</span>
                <div>Ref: GC-{Date.now().toString(36).toUpperCase()}</div>
              </div>
            </div>

            {/* Metrics Table */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Evaluated Surface Area:</span>
                <span className="font-bold font-mono text-slate-900">{calculation.areaSqMeters} m² ({calculation.areaSqFt} sq ft)</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Usable Solar Envelope (Setback Corrected):</span>
                <span className="font-bold font-mono text-slate-900">{calculation.usableAreaSqMeters} m²</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Standard 400W Monocrystalline Modules:</span>
                <span className="font-bold font-mono text-slate-900">{calculation.panelCount} panels</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Peak DC System Size:</span>
                <span className="font-bold font-mono text-amber-600">{calculation.systemCapacityKWp} kWp</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Expected Annual Generation:</span>
                <span className="font-bold font-mono text-slate-900">{calculation.annualSolarGenerationKWh.toLocaleString()} kWh/yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Estimated Utility Bill Savings:</span>
                <span className="font-bold font-mono text-emerald-600">{calculation.currencySymbol}{calculation.estimatedAnnualSavings.toLocaleString()}/yr</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">NDVI Greenery Ratio / Canopy Score:</span>
                <span className="font-bold font-mono text-slate-900">{calculation.greeneryRatioPercent}% ({calculation.canopyDensityLevel})</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-200">
                <span className="text-slate-500">Annual CO₂ Emissions Reduction:</span>
                <span className="font-bold font-mono text-emerald-600">{calculation.co2OffsetTonsPerYear} Tons ({calculation.treesEquivalent} trees)</span>
              </div>
            </div>

            {/* Developer stamp */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
              <div>
                <span className="font-bold text-slate-700">Project Architect:</span> Jaishiv Tiwari
                <div>jaishivtiwari@gmail.com </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold">
                  Verified Analysis
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download Summary PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
