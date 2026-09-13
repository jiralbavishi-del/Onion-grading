import React from 'react';
import { Field, TextInput, SectionHeading } from '../ui/FormPrimitives';
import { FileTextIcon, UserIcon } from '../ui/icons';

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
    <div className="glass-card rounded-3xl border border-papery-200/90 dark:border-onion-900/60 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:border-onion-300/80 dark:hover:border-onion-800 space-y-6">
      <SectionHeading
        icon={FileTextIcon}
        title={t.sec4Title || 'Inspector Notes & Sign-off'}
        subtitle={t.sec4Sub || 'Observations and certifying officer accreditation'}
        badge={t.sec4Badge || 'Section 04'}
      />

      <div className="space-y-5">
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
            placeholder={t.inspectorNamePlh || 'e.g. Dr. S. Kulkarni (QA-Insp)'}
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
            rows={3}
            value={values.notes || ''}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder={t.notesPlh || 'Describe curing condition, bulb firmness, or storage recommendations...'}
            disabled={disabled}
            className="w-full rounded-2xl border border-papery-300/80 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm p-4 transition-colors placeholder:text-stone-400 focus:outline-hidden focus:border-onion-700 focus:ring-2 focus:ring-onion-700/20 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:cursor-not-allowed resize-y shadow-xs"
          />
        </Field>
      </div>
    </div>
  );
}
