import React, { useState } from 'react';
import OnionAssessmentForm from './components/OnionAssessmentForm';
import { LANGUAGES } from './components/OnionAssessmentForm/translations';
import { ChevronDownIcon, OnionMark, GlobeIcon } from './components/OnionAssessmentForm/ui/icons';

export default function App() {
  const [lang, setLang] = useState('en');

  return (
    <div className="min-h-screen bg-[#F8F6F0] text-stone-900 relative overflow-hidden bg-mesh-pattern grain-overlay">
      {/* Animated floating orbs */}
      <div className="floating-orb floating-orb-1" />
      <div className="floating-orb floating-orb-2" />
      <div className="floating-orb floating-orb-3" />

      {/* Premium Glass Navbar */}
      <header className="sticky top-0 z-50 glass-nav animated-border-bottom">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-14 py-2 sm:h-18 flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3.5 group cursor-pointer select-none min-w-0">
            {/* Logo */}
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 shrink-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-onion-700 via-onion-800 to-onion-950 flex items-center justify-center text-xl shadow-lg shadow-onion-900/25 ring-1 ring-white/20 transition-all duration-500 group-hover:scale-105 group-hover:shadow-glow-onion">
              <OnionMark size={22} className="sm:hidden" />
              <OnionMark size={26} className="hidden sm:block" />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-onion-500/0 group-hover:bg-onion-500/10 transition-colors duration-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight font-display bg-gradient-to-r from-onion-900 via-onion-700 to-onion-800 bg-clip-text text-transparent truncate">
                Onion Grading
              </span>
              <p className="text-[9px] sm:text-[11px] text-stone-400 font-medium -mt-0.5 tracking-wide truncate max-w-[170px] sm:max-w-none">
                National Onion Quality & Export Verification
              </p>
            </div>
          </div>

          {/* Right side — Language Selector */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language Selector in Navbar */}
            <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200/70 shadow-xs">
              <GlobeIcon className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-1.5 sm:ml-2" />
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Select application language"
                  className="glow-input appearance-none font-bold text-[10px] sm:text-[11px] bg-onion-50/70 text-onion-800 pl-1.5 sm:pl-2.5 pr-6 sm:pr-7 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-onion-200/50 cursor-pointer focus:outline-hidden transition-all hover:bg-onion-100/80 max-w-[130px] sm:max-w-none"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 sm:pr-2 text-onion-600">
                  <ChevronDownIcon className="w-3 h-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <OnionAssessmentForm lang={lang} onLangChange={setLang} />
      </main>

      {/* Minimal Clean & High-Visibility Footer */}
      <footer className="relative z-10 py-5 sm:py-6 mt-auto bg-white/95 border-t border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            {/* Same Logo Badge as Navbar */}
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-onion-700 via-onion-800 to-onion-950 flex items-center justify-center text-white shadow-sm ring-1 ring-black/5 shrink-0">
              <OnionMark size={18} />
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="font-extrabold text-sm sm:text-base text-stone-900 tracking-tight font-display">
                Onion Grading
              </span>
              <span className="text-stone-300 hidden sm:inline">•</span>
              <span className="text-xs font-semibold text-stone-600">
                Quality &amp; Defect Assessment 
              </span>
            </div>
          </div>
          <p className="text-xs font-medium text-stone-500">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-stone-700">Onion Grading</span>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
