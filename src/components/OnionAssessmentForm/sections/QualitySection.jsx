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
    if (moistureVal <= 12) return { text: 'Optimal', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60' };
    if (moistureVal <= 14) return { text: 'Safe', color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60' };
    if (moistureVal <= 16) return { text: 'Damp', color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/60' };
    return { text: 'High Risk', color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/60' };
  };

  const moistureStatus = getMoistureBadge();

  return (
    <div className="glass-card rounded-3xl border border-papery-200/90 dark:border-onion-900/60 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:border-onion-300/80 dark:hover:border-onion-800 space-y-6">
      <SectionHeading
        icon={SlidersIcon}
        title={t.sec3Title || 'Quality & Defect Quantitative Analysis'}
        subtitle={t.sec3Sub || 'Evaluate moisture content and physiological defect percentages (Clamped 0–100%)'}
        badge={t.sec3Badge || 'Section 03'}
        action={
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-stone-100/90 dark:bg-stone-900/90 border border-papery-200 dark:border-stone-700 text-xs shadow-2xs">
            <span className="text-stone-600 dark:text-stone-400 font-medium">
              {t.defectLoad || 'Cumulative Defect Load'}:
            </span>
            <span
              className={`font-bold font-mono px-2 py-0.5 rounded-lg ${
                totalDefectPct > 15
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300'
                  : totalDefectPct > 5
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                  : 'bg-onion-100 text-onion-800 dark:bg-onion-950 dark:text-onion-300'
              }`}
            >
              {totalDefectPct}%
            </span>
          </div>
        }
      />

      {/* Clamped Percentage Fields Grid (The 4 essential metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Moisture Content % */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/50 border border-papery-200/80 dark:border-stone-800 space-y-2">
          <Field
            id="quality-moisture"
            label={t.moisture || 'Moisture Content'}
            required
            error={errors.moisture}
            hint={t.moistureHint || 'Benchmarked target: 12% – 14%'}
            labelRight={
              moistureStatus && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${moistureStatus.color}`}>
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
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                moistureVal > 16 ? 'bg-rose-500' : moistureVal > 14 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, (moistureVal / 25) * 100)}%` }}
            />
          </div>
        </div>

        {/* 2. Sprouting Rate % */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/50 border border-papery-200/80 dark:border-stone-800 space-y-2">
          <Field
            id="quality-sprouting"
            label={t.sprouting || 'Sprouting Rate'}
            required
            error={errors.sprouting}
            hint={t.sproutingHint || 'Internal green shoot emergence'}
            labelRight={
              sproutingVal > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                  Defect
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
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-300"
              style={{ width: `${Math.min(100, sproutingVal)}%` }}
            />
          </div>
        </div>

        {/* 3. Physical Damage % */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/50 border border-papery-200/80 dark:border-stone-800 space-y-2">
          <Field
            id="quality-damage"
            label={t.damage || 'Physical Damage / Cuts'}
            required
            error={errors.damage}
            hint={t.damageHint || 'Mechanical knife cuts, crush'}
            labelRight={
              damageVal > 5 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  Elevated
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
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all duration-300"
              style={{ width: `${Math.min(100, damageVal)}%` }}
            />
          </div>
        </div>

        {/* 4. Doubles / Bolters % */}
        <div className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-900/50 border border-papery-200/80 dark:border-stone-800 space-y-2">
          <Field
            id="quality-doubles"
            label={t.doubles || 'Doubles & Bolters'}
            required
            error={errors.doubles}
            hint={t.doublesHint || 'Split bulbs & premature seed heads'}
            labelRight={
              doublesVal > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-300">
                  Split
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
          <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden">
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
