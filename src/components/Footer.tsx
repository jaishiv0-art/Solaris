import React from 'react';
import { Sun, Leaf, Mail, Phone, User, Globe, Heart, ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="/solaris-logo.jpg"
                alt="Solaris Logo"
                className="w-11 h-11 object-contain rounded-xl shadow-md border border-slate-700 bg-white"
              />
              <div>
                <span className="text-xl font-black tracking-wider text-white font-mono">
                  S<span className="text-amber-400">O</span>LARIS
                </span>
                <p className="text-[10px] text-amber-400 font-semibold tracking-wide">
                  — Connecting Rural & Urban —
                </p>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Empowering homeowners, commercial building managers, and urban planners to unlock clean rooftop solar energy and quantify urban greenery canopy with precision satellite intelligence.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Inspired by Google Project Sunroof
              </span>
              <span className="flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60">
                <Leaf className="w-3.5 h-3.5 text-amber-400" />
                PM Surya Ghar Compatible
              </span>
            </div>
          </div>

          {/* Quick Access */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Features & Tooling</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="hover:text-amber-400 cursor-pointer transition-colors">Interactive Geodesic Boundary Drawing</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-pointer transition-colors">Solar Irradiance & Yield Estimation</span>
              </li>
              <li>
                <span className="hover:text-emerald-400 cursor-pointer transition-colors">NDVI Vegetation & Tree Canopy Audit</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-pointer transition-colors">AI Panel Placement & Advisory Engine</span>
              </li>
              <li>
                <span className="hover:text-amber-400 cursor-pointer transition-colors">PM Surya Ghar Subsidy Calculator</span>
              </li>
            </ul>
          </div>

          {/* Developer Credit & Contact Details */}
          <div className="space-y-3 bg-slate-800/60 p-5 rounded-2xl border border-slate-700/60">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" />
              Developer & Architecture
            </h4>
            
            <div className="space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Jaishiv Tiwari</span>
                <span className="text-[10px] bg-emerald-900/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-700/40 font-mono">
                  Lead Full-Stack Architect
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:jaishivtiwari@gmail.com" className="hover:underline truncate">
                  jaishivtiwari@gmail.com
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <a href="tel:+919876543210" className="hover:underline">
                  +91 98765 43210
                </a>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>New Delhi / Remote, Global</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
              Built with React, Vite, TypeScript, Leaflet & Supabase.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} GeoCanopy. Open Clean Energy Intelligence.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-300 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Methodology Documentation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
