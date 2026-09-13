import React from 'react';
import { Field, TextInput } from '../ui/FormPrimitives';
import { UserIcon, CheckCircleIcon } from '../ui/icons';

/**
 * Bento Tile 5: Final Inspection & Official Certification Stamp
 * Option 3 inspired certifier sign-off with realistic AGMARK / APEDA inspection seal.
 */
export function NotesSection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  const currentDateFormatted = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <div id="section-notes" className="bento-tile p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bento-header-label">Official Sign-off</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            Final Inspection & Certification
          </h2>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
          <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
          <span>AGMARK / APEDA</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
        {/* Left: Input Fields (col-span-8) */}
        <div className="md:col-span-8 space-y-3">
          {/* Inspector Name */}
          <Field
            id="inspector-name"
            label={t.inspectorName || 'Certifying Inspector Name'}
            required
            error={errors.inspectorName}
          >
            <TextInput
              id="inspector-name"
              name="inspectorName"
              value={values.inspectorName || ''}
              onChange={(e) => onChange('inspectorName', e.target.value)}
              placeholder={t.inspectorNamePlh || 'e.g. Dr. S. Kulkarni (QC-Lead)'}
              icon={UserIcon}
              disabled={disabled}
              error={errors.inspectorName}
            />
          </Field>

          {/* Observations & Field Advisory */}
          <Field
            id="inspector-notes"
            label={t.notes || 'Field Observations & Advisory'}
          >
            <textarea
              id="inspector-notes"
              name="notes"
              rows={2}
              value={values.notes || ''}
              onChange={(e) => onChange('notes', e.target.value)}
              placeholder={t.notesPlh || 'Cured skin in pristine condition. Well dried necks, high bulb firmness suitable for long-haul reefer export.'}
              disabled={disabled}
              className="w-full rounded-2xl border border-stone-200/80 bg-stone-50/70 backdrop-blur-xs text-stone-900 text-xs p-3 transition-all placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-onion-600 disabled:bg-stone-50 disabled:cursor-not-allowed resize-none shadow-2xs"
            />
          </Field>
        </div>

        {/* Right: Official Verification Stamp & Signature Block (col-span-4) */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-stone-50/70 rounded-2xl border border-stone-200/60 text-center space-y-2 select-none">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
            Official Stamp
          </span>

          {/* Authentic Government/QC Certification Stamp */}
          <div className="official-stamp py-2 px-3 space-y-0.5">
            <span className="text-[9px] font-black tracking-widest text-onion-700">
              GOVT. OF INDIA / APEDA
            </span>
            <span className="text-xs font-black text-onion-900 uppercase">
              {values.grade || 'GRADE A'} CERTIFIED
            </span>
            <span className="text-[8px] font-mono font-bold text-onion-700">
              QC VERIFIED · {currentDateFormatted}
            </span>
          </div>

          <div className="text-[10px] text-stone-400 pt-1 font-mono">
            Inspector: <span className="font-bold text-stone-700">{values.inspectorName || 'Pending Sign'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
