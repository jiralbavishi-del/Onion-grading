import React from 'react';
import { FileTextIcon, ActivityIcon, CheckCircleIcon } from '../ui/icons';

export function ExpertOpinionSection({
  values = {},
  onChange,
  disabled,
  onSave,
  onExportPdf,
  canExportPdf = false,
  isExportingPdf = false,
  t = {}
}) {
  return (
    <div id="section-actions" className="bento-tile p-5 sm:p-6 relative overflow-hidden bg-gradient-to-br from-stone-50 to-stone-100/50 h-full flex flex-col justify-between">
      
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div>
            <span className="bento-header-label flex items-center gap-1.5">
              <ActivityIcon className="w-3.5 h-3.5 text-onion-600" />
              {t.dataCollectionHub || 'Data Collection Hub'}
            </span>
            <h2 className="text-base font-extrabold text-stone-900 tracking-tight">
              {t.submitAssessment || 'Submit Assessment'}
            </h2>
          </div>
        </div>

        <div className="text-xs text-stone-500 mb-6 shrink-0">
          {t.expertDesc || 'Record the data collected from the visual and manual inspection into the central database.'}
        </div>

        {/* Pre-submission Checklist */}
        <div className="bg-white/80 p-4 rounded-xl border border-stone-200/80 shadow-2xs space-y-3 shrink-0 relative z-10 mb-5">
          <h3 className="text-[10px] font-bold text-stone-900 uppercase tracking-wider mb-1">
            {t.preSubChecklist || 'Pre-Submission Checklist'}
          </h3>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-stone-600 leading-tight">{t.check1 || 'Verify all origin and traceability fields match the physical lot documentation.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-stone-600 leading-tight">{t.check2 || 'Ensure all defect percentages (moisture, sprouting) are accurately recorded.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-[11px] text-stone-600 leading-tight">{t.check3 || 'Confirm high-resolution reference images are uploaded and clearly visible.'}</span>
            </li>
          </ul>
        </div>

        {/* Inspector Notes Area */}
        <div className="flex-1 flex flex-col relative z-10 min-h-[120px]">
          <label htmlFor="notes" className="text-xs font-bold text-stone-900 mb-2 flex items-center gap-1.5">
            <FileTextIcon className="w-3.5 h-3.5 text-stone-500" />
            {t.inspectorNotes || 'Inspector Remarks / Notes'}
            <span className="text-stone-400 font-normal ml-auto">{t.optional || '(Optional)'}</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            value={values.notes || ''}
            onChange={(e) => onChange && onChange('notes', e.target.value)}
            disabled={disabled}
            placeholder={t.notesPlaceholder || 'Add observations regarding lot condition, packaging, or storage environment...'}
            className="flex-1 w-full p-3.5 rounded-xl border border-stone-200 bg-white shadow-inner text-sm placeholder:text-stone-400 focus:outline-none focus:border-onion-500 focus:ring-1 focus:ring-onion-500 resize-none transition-colors"
          />
        </div>

        {/* Save Actions */}
        <div className="pt-5 flex flex-col sm:flex-row gap-3 mt-auto shrink-0 relative z-10">
          <button
            type="button"
            disabled={disabled}
            onClick={onSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white bg-stone-900 hover:bg-stone-800 transition-colors shadow-md font-bold text-xs disabled:opacity-50"
          >
            <FileTextIcon className="w-4 h-4" />
            {disabled ? 'Saving to Database...' : (t.saveAssessmentLog || 'Save Assessment Data')}
          </button>
          <button
            type="button"
            disabled={disabled || !canExportPdf}
            onClick={onExportPdf}
            title={canExportPdf ? 'Download APEDA/AGMARK Certificate' : 'Save assessment first to export official certificate'}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border transition-all shadow-xs font-bold text-xs ${
              canExportPdf
                ? 'bg-onion-900 text-white border-onion-950 hover:bg-onion-800 shadow-sm'
                : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
            }`}
          >
            <FileTextIcon className="w-4 h-4" />
            {isExportingPdf ? 'Generating...' : (t.exportPdf || 'Export PDF')}
          </button>
        </div>
      </div>
    </div>
  );
}
