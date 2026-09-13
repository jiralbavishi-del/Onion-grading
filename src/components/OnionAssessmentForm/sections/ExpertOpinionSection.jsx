import React from 'react';
import { SparklesIcon, FileTextIcon } from '../ui/icons';

export function ExpertOpinionSection({ disabled, onSave, t = {} }) {
  return (
    <div id="section-expert-opinion" className="bento-tile p-5 sm:p-6 space-y-4 relative overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100/50 h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bento-header-label flex items-center gap-1.5">
            <SparklesIcon className="w-3.5 h-3.5 text-onion-600" />
            {t.expertInspectorAnalysis || 'Expert Inspector Analysis'}
          </span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight">
            {t.finalQualityOpinion || 'Final Quality Opinion'}
          </h2>
        </div>
      </div>

      {/* Opinion Text */}
      <div className="bg-white/80 p-4 rounded-xl border border-stone-200/80 shadow-2xs relative flex-1 flex flex-col justify-center">
        <p className="text-xs text-stone-600 leading-relaxed text-justify whitespace-pre-line">
          {t.expertOpinionText || 'Based on the comprehensive telemetry and visual defect tolerance data gathered, this lot exhibits standard variance typical of Kharif season harvesting. The moisture levels are a critical determinant; anything above 14% significantly amplifies the risk of secondary pathogen development and latent sprouting during long-haul transit.\n\nWhile minor superficial skin ruptures and light doubling (twins) are permissible under APEDA Class II export mandates, the primary limiting factor for Grade A certification remains strict adherence to bulb firmness and curing efficacy. The current parameters suggest that if adequate ventilation is maintained in reefer containers, the shipment will easily satisfy standard domestic and regional export compliance. However, for premium European or Middle Eastern markets requiring pristine aesthetics, rigorous culling of borderline conjoined bulbs and strict moisture regulation is paramount.'}
        </p>
      </div>

      {/* Save Actions */}
      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={onSave}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-md font-bold text-xs"
        >
          <FileTextIcon className="w-4 h-4" />
          {t.saveAssessmentLog || 'Save Assessment Log'}
        </button>
        <button
          type="button"
          disabled={disabled}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-stone-700 bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-xs font-bold text-xs"
        >
          <FileTextIcon className="w-4 h-4" />
          {t.exportPdf || 'Export PDF'}
        </button>
      </div>

      {/* Decorative background accent */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-onion-500/10 rounded-full blur-3xl pointer-events-none" />

    </div>
  );
}
