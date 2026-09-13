import React, { useState } from 'react';
import { Field, TextInput, Select } from '../ui/FormPrimitives';
import { PhoneIcon, UserIcon } from '../ui/icons';
import { PRODUCING_STATES, ONION_VARIETIES, GRADES, SIZE_CLASSES, sanitizePhone } from '../constants';
import { GradePicker, SizePicker } from '../ui/Pickers';
import { VARIETY_IMAGES } from '../onionImagesData';

/**
 * Bento Tile 1: Origin & Farm Traceability Dashboard
 * Features interactive variety buttons with high-definition hover preview card.
 */
export function OriginTraceabilitySection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  const [hoveredVariety, setHoveredVariety] = useState(null);

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const sanitized = sanitizePhone(raw);
    onChange('supplierPhone', sanitized);
  };

  const selectedVariety = ONION_VARIETIES.find((v) => v.id === values.variety) || ONION_VARIETIES[0];
  const activePreviewVariety = hoveredVariety
    ? VARIETY_IMAGES[hoveredVariety]
    : VARIETY_IMAGES[values.variety] || VARIETY_IMAGES.nashik_red;

  return (
    <div id="section-source" className="bento-tile p-5 sm:p-6 space-y-5 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <span className="bento-header-label">{t.originFarmTraceability || 'Origin & Farm Traceability'}</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            {t.traceabilityDash || 'Traceability Dashboard'}
          </h2>
        </div>

        {/* Dynamic Lot & Compliance Tag Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
            LOT #{values.state ? values.state.slice(0, 2).toUpperCase() : 'IN'}-2026
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            APEDA VERIFIED
          </span>
        </div>
      </div>

      {/* Supplier Credentials & Origin Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/60">
        {/* Supplier Name */}
        <div className="sm:col-span-5">
          <Field
            id="supplier-name"
            label={t.supplierName || 'Supplier Name'}
            required
            error={errors.supplierName}
          >
            <TextInput
              id="supplier-name"
              name="supplierName"
              value={values.supplierName || ''}
              onChange={(e) => onChange('supplierName', e.target.value)}
              placeholder={t.supplierNamePlh || 'e.g. Ramesh Patil'}
              icon={UserIcon}
              disabled={disabled}
              error={errors.supplierName}
            />
          </Field>
        </div>

        {/* Contact Phone */}
        <div className="sm:col-span-4">
          <Field
            id="supplier-phone"
            label={t.supplierPhone || 'Contact Number'}
            required
            error={errors.supplierPhone}
          >
            <TextInput
              id="supplier-phone"
              name="supplierPhone"
              value={values.supplierPhone || ''}
              onChange={handlePhoneChange}
              placeholder={t.supplierPhonePlh || '+91 98220 12345'}
              icon={PhoneIcon}
              disabled={disabled}
              error={errors.supplierPhone}
              maxLength={15}
              inputMode="tel"
            />
          </Field>
        </div>

        {/* Origin State */}
        <div className="sm:col-span-3">
          <Field
            id="source-state"
            label={t.producingState || 'Origin State'}
            required
            error={errors.state}
          >
            <Select
              id="source-state"
              name="state"
              value={values.state || ''}
              onChange={(e) => onChange('state', e.target.value)}
              options={PRODUCING_STATES.map((s) => ({ value: s, label: t[s] || s }))}
              placeholder={t.statePlh || 'Select State'}
              disabled={disabled}
              error={errors.state}
            />
          </Field>
        </div>
      </div>

      {/* Cultivar / Variety Picker with Hover Photo Preview Card */}
      <div className="space-y-3 relative">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
            {t.variety || 'Bulb Variety / Cultivar'}
          </label>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-onion-50 text-onion-800 border border-onion-200">
            {selectedVariety?.type || 'Red Globe'}
          </span>
        </div>

        {/* Grid of Varieties */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 relative">
          {ONION_VARIETIES.map((v, idx) => {
            const isSelected = values.variety === v.id;
            const isHovered = hoveredVariety === v.id;
            const varietyData = VARIETY_IMAGES[v.id] || VARIETY_IMAGES.other;
            const isRightColumn = (idx % 4) >= 2;

            return (
              <div
                key={v.id}
                className="relative"
                onMouseEnter={() => setHoveredVariety(v.id)}
                onMouseLeave={() => setHoveredVariety(null)}
              >
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange('variety', v.id)}
                  className={`w-full p-2.5 rounded-xl text-left border transition-all duration-200 cursor-pointer flex items-center gap-2 group ${
                    isSelected
                      ? 'border-onion-600 bg-onion-50/90 text-onion-950 font-bold shadow-xs ring-2 ring-onion-500/20'
                      : isHovered
                      ? 'border-onion-400 bg-white text-stone-900 shadow-md scale-[1.02]'
                      : 'border-stone-200/80 bg-white/75 text-stone-600 hover:bg-white hover:text-stone-900'
                  }`}
                >
                  {/* Micro Thumbnail */}
                  <img
                    src={varietyData.img}
                    alt={v.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 border border-stone-200 shadow-2xs transition-transform duration-200 group-hover:scale-115"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate">{t[v.name] || v.name}</div>
                    <div className="text-[10px] opacity-70 truncate">
                      {t[{
                        'Rabi / Storage': 'rabiStorage',
                        'Kharif / High Yield': 'kharifYield',
                        'Southern High Color': 'southernColor',
                        'Export / Rabi': 'exportRabi',
                      }[v.type]] || t[v.type] || v.type}
                    </div>
                  </div>
                </button>

                {/* Floating Hover Card (High-Definition Preview directly on hover) */}
                {isHovered && (
                  <div className={`absolute z-50 bottom-full ${isRightColumn ? 'right-0 sm:right-0' : 'left-0 sm:left-0'} mb-2 w-72 p-3.5 bg-white rounded-2xl border-2 border-stone-200 shadow-2xl pointer-events-none animate-fade-in-up`}>
                    <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200 mb-2.5 relative shadow-inner">
                      <img
                        src={varietyData.img}
                        alt={varietyData.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-1.5 right-1.5 text-[9px] font-bold px-2 py-0.5 rounded-md bg-stone-900 text-white shadow-xs">
                        {t[varietyData.origin] || varietyData.origin}
                      </span>
                      <span className="absolute top-1.5 left-1.5 text-[9px] font-black px-2 py-0.5 rounded-md bg-onion-600 text-white shadow-xs">
                        SPECIMEN
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-stone-900">{t[varietyData.name] || varietyData.name}</span>
                        <span className="text-[9px] font-bold text-onion-700 uppercase tracking-wider bg-onion-50 px-2 py-0.5 rounded-full border border-onion-200/60">
                          {t.cultivarSpecimen || 'Cultivar Specimen'}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 leading-snug">
                        {t[varietyData.characteristics] || varietyData.characteristics}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Grade & Caliber Pickers */}
      <div className="space-y-3 pt-1 border-t border-stone-200/60">
        <GradePicker
          id="assessment-grade-picker"
          label={t.gradeClassification || 'Target Grade Standard'}
          value={values.grade || 'Grade A'}
          onChange={(newGrade) => onChange('grade', newGrade)}
          grades={GRADES}
          disabled={disabled}
          t={t}
        />
        {errors.grade && (
          <p className="text-xs text-rose-500 font-semibold" role="alert">
            {errors.grade}
          </p>
        )}

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
          <p className="text-xs text-rose-500 font-semibold" role="alert">
            {errors.sizeClass}
          </p>
        )}
      </div>
    </div>
  );
}
