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

      {/* Minimal Clean Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-stone-200/50 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          
          {/* Left side — Logo & Title */}
          <div className="flex items-center gap-3 sm:gap-4 group cursor-pointer">
            {/* Logo */}
            <div className="flex-shrink-0 w-8 sm:w-10 h-8 sm:h-10 rounded-xl sm:rounded-2xl border border-onion-200 overflow-hidden shadow-sm relative group-hover:scale-105 transition-transform duration-300">
              <img
                src="/onion-logo.jpg"
                alt="Logo"
                className="w-full h-full object-cover"
              />
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-onion-500/0 group-hover:bg-onion-500/10 transition-colors duration-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight font-display text-onion-900 truncate">
                Onion Assessment & Grading
              </span>
              <p className="text-[9px] sm:text-[11px] text-stone-400 font-medium -mt-0.5 tracking-wide truncate max-w-[170px] sm:max-w-none">
                Onion Quality Data Collection
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
                  className="glow-input appearance-none font-bold text-[10px] sm:text-[11px] bg-onion-50/70 text-onion-800 pl-1.5 sm:pl-2.5 pr-6 sm:pr-7 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-onion-200/50 cursor-pointer focus:outline-none transition-all hover:bg-onion-100/80 max-w-[130px] sm:max-w-none"
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
      </nav>

      {/* Main App Canvas */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <OnionAssessmentForm lang={lang} onLangChange={setLang} />
      </main>

      {/* Minimal Clean & High-Visibility Footer */}
      <footer className="relative z-10 py-5 sm:py-6 mt-auto bg-white/95 border-t border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center text-center">
          <span className="font-semibold text-xs sm:text-sm tracking-wide font-display text-onion-900">
            &copy; {new Date().getFullYear()} Onion Assessment &amp; Grading. All rights reserved.
          </span>
        </div>
      </footer>
    </div>
  );
}
