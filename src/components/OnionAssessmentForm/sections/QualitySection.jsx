import React from 'react';
import { Field, PercentInput, SectionHeading } from '../ui/FormPrimitives';
import { SlidersIcon } from '../ui/icons';

/**
 * Section 3: Physical Quality Parameters (Streamlined to 4 core clamped % fields)
 * Enforces strict 0-100 clamping on all 4 percentage fields (moisture, sprouting, damage, doubles).
 */
export function QualitySection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  const moistureVal = Number(values.moisture || 0);
  const sproutingVal = Number(values.sprouting || 0);
  const damageVal = Number(values.damage || 0);
  const doublesVal = Number(values.doubles || 0);

  const totalDefectPct = Math.min(100, Math.round((sproutingVal + damageVal + doublesVal) * 10) / 10);

  // Moisture status evaluation
  const getMoistureBadge = () => {
    if (values.moisture === '' || values.moisture === undefined) return null;
    if (moistureVal <= 12) return { text: t.moistureOptimal || 'Optimal', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (moistureVal <= 14) return { text: t.moistureSafe || 'Safe', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (moistureVal <= 16) return { text: t.moistureDamp || 'Damp', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { text: t.moistureHighRisk || 'High Risk', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const moistureStatus = getMoistureBadge();

  return (
    <div id="section-quality" className="glass-card rounded-3xl p-5 sm:p-6 space-y-5">
      <SectionHeading
        icon={SlidersIcon}
        title={t.sec3Title || 'Quality & Defect Quantitative Analysis'}
        subtitle={t.sec3Sub || 'Moisture content & physiological defect percentages (0–100%)'}
        badge={t.sec3Badge || 'Section 03'}
        action={
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/80 border border-stone-200/80 text-xs shadow-2xs">
            <span className="text-stone-500 font-medium">
              {t.defectLoad || 'Cumulative Defect'}:
            </span>
            <span
              className={`font-bold font-mono px-2 py-0.5 rounded-lg border ${
                totalDefectPct > 15
                  ? 'bg-rose-100 text-rose-700 border-rose-200'
                  : totalDefectPct > 5
                  ? 'bg-amber-100 text-amber-700 border-amber-200'
                  : 'bg-onion-100 text-onion-800 border-onion-200'
              }`}
            >
              {totalDefectPct}%
            </span>
          </div>
        }
      />

      {/* Clamped Percentage Fields Grid (Compact 2x2 layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {/* 1. Moisture Content % */}
        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2">
          <Field
            id="quality-moisture"
            label={t.moisture || 'Moisture Content'}
            required
            error={errors.moisture}
            hint={t.moistureHint || 'Benchmarked: 12% – 14%'}
            labelRight={
              moistureStatus && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${moistureStatus.color}`}>
                  {moistureStatus.text}
                </span>
              )
            }
          >
            <PercentInput
              id="quality-moisture"
              name="moisture"
              value={values.moisture ?? ''}
              onChange={(val) => onChange('moisture', val)}
              placeholder="e.g. 13.5"
              disabled={disabled}
              error={errors.moisture}
              step={0.1}
            />
          </Field>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                moistureVal > 16 ? 'bg-rose-500' : moistureVal > 14 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (moistureVal / 25) * 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Sprouting Rate % */}
        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2">
          <Field
            id="quality-sprouting"
            label={t.sprouting || 'Sprouting Rate'}
            required
            error={errors.sprouting}
            hint={t.sproutingHint || 'Internal shoot emergence'}
            labelRight={
              sproutingVal > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 border border-rose-200">
                  {t.defectTag || 'Defect'}
                </span>
              )
            }
          >
            <PercentInput
              id="quality-sprouting"
              name="sprouting"
              value={values.sprouting ?? ''}
              onChange={(val) => onChange('sprouting', val)}
              placeholder="0"
              disabled={disabled}
              error={errors.sprouting}
            />
          </Field>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(100, sproutingVal)}%` }}
            />
          </div>
        </div>

        {/* 3. Physical Damage % */}
        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2">
          <Field
            id="quality-damage"
            label={t.damage || 'Physical Damage'}
            required
            error={errors.damage}
            hint={t.damageHint || 'Knife cuts, skin ruptures'}
            labelRight={
              damageVal > 5 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 border border-amber-200">
                  {t.elevatedTag || 'Elevated'}
                </span>
              )
            }
          >
            <PercentInput
              id="quality-damage"
              name="damage"
              value={values.damage ?? ''}
              onChange={(val) => onChange('damage', val)}
              placeholder="0"
              disabled={disabled}
              error={errors.damage}
            />
          </Field>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, damageVal)}%` }}
            />
          </div>
        </div>

        {/* 4. Doubles / Bolters % */}
        <div className="p-3.5 rounded-2xl bg-stone-50/70 border border-stone-200/70 space-y-2">
          <Field
            id="quality-doubles"
            label={t.doubles || 'Doubles & Bolters'}
            required
            error={errors.doubles}
            hint={t.doublesHint || 'Split bulbs & bolters'}
            labelRight={
              doublesVal > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 text-purple-700 border border-purple-200">
                  {t.splitTag || 'Split'}
                </span>
              )
            }
          >
            <PercentInput
              id="quality-doubles"
              name="doubles"
              value={values.doubles ?? ''}
              onChange={(val) => onChange('doubles', val)}
              placeholder="0"
              disabled={disabled}
              error={errors.doubles}
            />
          </Field>
          <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 transition-all duration-300"
              style={{ width: `${Math.min(100, doublesVal)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
