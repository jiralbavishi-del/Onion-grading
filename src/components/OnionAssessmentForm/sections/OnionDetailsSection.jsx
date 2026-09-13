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
    <div id="section-details" className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
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
            label: `${t[v.name] || v.name} (${t[v.type] || v.type})`,
          }))}
          placeholder={t.varietyPlh || 'Select cultivar / variety'}
          disabled={disabled}
          error={errors.variety}
        />
      </Field>

      {/* 2. Grade Picker */}
      <div className="pt-1">
        <GradePicker
          id="assessment-grade-picker"
          label={t.gradeClassification || 'Quality Grade Classification'}
          value={values.grade || 'Grade A'}
          onChange={(newGrade) => onChange('grade', newGrade)}
          grades={GRADES}
          disabled={disabled}
          t={t}
        />
        {errors.grade && (
          <p className="mt-1 text-xs text-rose-500 font-semibold" role="alert">
            {errors.grade}
          </p>
        )}
      </div>

      {/* 3. Size Picker */}
      <div className="pt-1">
        <SizePicker
          id="assessment-size-picker"
          label={t.sizeClassification || 'Size Caliber Classification'}
          value={values.sizeClass || 'Medium'}
          onChange={(newSize) => onChange('sizeClass', newSize)}
          sizes={SIZE_CLASSES}
          disabled={disabled}
          t={t}
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
