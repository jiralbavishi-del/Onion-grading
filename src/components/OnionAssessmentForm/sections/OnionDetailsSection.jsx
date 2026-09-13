import React from 'react';
import { Field, Select, SectionHeading } from '../ui/FormPrimitives';
import { GradePicker, SizePicker } from '../ui/Pickers';
import { TagIcon } from '../ui/icons';
import { ONION_VARIETIES, GRADES, SIZE_CLASSES } from '../constants';

/**
 * Section 2: Onion Crop Details & Classification (Streamlined to most important fields)
 * Variety selection + GradePicker + SizePicker
 */
export function OnionDetailsSection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  return (
    <div className="glass-card rounded-3xl border border-papery-200/90 dark:border-onion-900/60 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:border-onion-300/80 dark:hover:border-onion-800 space-y-6">
      <SectionHeading
        icon={TagIcon}
        title={t.sec2Title || 'Crop Details & Classification'}
        subtitle={t.sec2Sub || 'Bulb variety, market grade classification, and size caliber'}
        badge={t.sec2Badge || 'Section 02'}
      />

      {/* 1. Variety Selection */}
      <Field
        id="onion-variety"
        label={t.variety || 'Onion Variety / Cultivar'}
        required
        error={errors.variety}
      >
        <Select
          id="onion-variety"
          name="variety"
          value={values.variety || ''}
          onChange={(e) => onChange('variety', e.target.value)}
          options={ONION_VARIETIES.map((v) => ({
            value: v.id,
            label: `${v.name} (${v.type})`,
          }))}
          placeholder={t.varietyPlh || 'Select cultivar / variety'}
          disabled={disabled}
          error={errors.variety}
        />
      </Field>

      {/* 2. Grade Picker */}
      <div className="pt-2">
        <GradePicker
          id="assessment-grade-picker"
          label={t.gradeClassification || 'Quality Grade Classification'}
          value={values.grade || 'Grade A'}
          onChange={(newGrade) => onChange('grade', newGrade)}
          grades={GRADES}
          disabled={disabled}
        />
        {errors.grade && (
          <p className="mt-1 text-xs text-rose-500 font-semibold" role="alert">
            {errors.grade}
          </p>
        )}
      </div>

      {/* 3. Size Picker */}
      <div className="pt-2">
        <SizePicker
          id="assessment-size-picker"
          label={t.sizeClassification || 'Size Caliber Classification'}
          value={values.sizeClass || 'Medium'}
          onChange={(newSize) => onChange('sizeClass', newSize)}
          sizes={SIZE_CLASSES}
          disabled={disabled}
        />
        {errors.sizeClass && (
          <p className="mt-1 text-xs text-rose-500 font-semibold" role="alert">
            {errors.sizeClass}
          </p>
        )}
      </div>
    </div>
  );
}
