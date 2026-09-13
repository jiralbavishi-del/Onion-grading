import React from 'react';
import { Field, TextInput, SectionHeading } from '../ui/FormPrimitives';
import { FileTextIcon, UserIcon, CheckCircleIcon } from '../ui/icons';

/**
 * Section 4: Inspector Field Notes & Certifier Sign-off (Streamlined)
 */
export function NotesSection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  return (
    <div id="section-notes" className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
      <SectionHeading
        icon={FileTextIcon}
        title={t.sec4Title || 'Inspector Notes & Sign-off'}
        subtitle={t.sec4Sub || 'Observations and certifying officer accreditation'}
        badge={t.sec4Badge || 'Section 04'}
        action={
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200/80 text-[10px] font-bold">
            <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>AGMARK / APEDA Protocol</span>
          </div>
        }
      />

      <div className="space-y-3.5">
        {/* 1. Inspector Name & Officer Code */}
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
            placeholder={t.inspectorNamePlh || 'e.g. Dr. S. Kulkarni (QA-Lead)'}
            icon={UserIcon}
            disabled={disabled}
            error={errors.inspectorName}
          />
        </Field>

        {/* 2. Field Notes Textarea */}
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
            placeholder={t.notesPlh || 'Describe curing condition, bulb firmness, or export storage recommendations...'}
            disabled={disabled}
            className="glow-input w-full rounded-2xl border border-stone-200/80 bg-white/70 backdrop-blur-sm text-stone-900 text-sm p-3.5 transition-all placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-onion-600 disabled:bg-stone-50 disabled:cursor-not-allowed resize-none shadow-xs"
          />
        </Field>
      </div>
    </div>
  );
}
