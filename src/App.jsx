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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 group cursor-pointer select-none">
            {/* Logo */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-onion-700 via-onion-800 to-onion-950 flex items-center justify-center text-xl shadow-lg shadow-onion-900/25 ring-1 ring-white/20 transition-all duration-500 group-hover:scale-110 group-hover:shadow-glow-onion group-hover:rotate-3">
              <OnionMark size={26} />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-2xl bg-onion-500/0 group-hover:bg-onion-500/10 transition-colors duration-500" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight font-display bg-gradient-to-r from-onion-900 via-onion-700 to-onion-800 bg-clip-text text-transparent group-hover:from-onion-700 group-hover:to-onion-600 transition-all duration-500">
                Onion Grading
              </span>
              <p className="text-[10px] sm:text-[11px] text-stone-400 font-medium -mt-0.5 tracking-wide">
                National Onion Quality & Export Verification
              </p>
            </div>
          </div>

          {/* Right side — Language Selector */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Language Selector in Navbar */}
            <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/80 backdrop-blur-md border border-stone-200/70 shadow-xs">
              <GlobeIcon className="w-3.5 h-3.5 text-stone-500 shrink-0 ml-2" />
              <div className="relative">
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  aria-label="Select application language"
                  className="glow-input appearance-none font-bold text-[11px] bg-onion-50/70 text-onion-800 pl-2.5 pr-7 py-1.5 rounded-xl border border-onion-200/50 cursor-pointer focus:outline-hidden transition-all hover:bg-onion-100/80"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.native} ({l.label})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-onion-600">
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

      {/* Minimal Footer */}
      <footer className="relative z-10 border-t border-stone-200/50 py-6 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-medium">
            AgriInspect &copy; {new Date().getFullYear()} — APEDA / AGMARK Compliant
          </div>
          <div className="flex items-center gap-3 text-[10px] font-semibold text-stone-300 uppercase tracking-wider">
            <span>ISO 9001:2015</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>Real-Time QC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
