import React from 'react';
import { ActivityIcon } from '../ui/icons';

/**
 * Bento Tile 4: Defect Tolerance & Quantitative Calibration Board
 * Features dual range sliders + numeric steppers with color-coded tolerance tracks.
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

  // Status helper
  const getStatusText = (val, safeMax, cautionMax) => {
    if (val <= safeMax) return { label: 'Optimal / Safe', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (val <= cautionMax) return { label: 'Borderline Caution', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Exceeds Tolerance', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const handleSliderChange = (field, e) => {
    const raw = parseFloat(e.target.value);
    const clamped = Math.max(0, Math.min(field === 'moisture' ? 30 : 100, isNaN(raw) ? 0 : raw));
    onChange(field, clamped);
  };

  const defectParameters = [
    {
      id: 'sprouting',
      label: t.sprouting || 'Sprouting Rate',
      value: sproutingVal,
      max: 30,
      step: 0.5,
      safeMax: 3,
      cautionMax: 8,
      hint: '0% – 5% Export | >8% Reject',
    },
    {
      id: 'doubles',
      label: t.doubles || 'Doubles & Splits',
      value: doublesVal,
      max: 30,
      step: 0.5,
      safeMax: 3,
      cautionMax: 6,
      hint: '0% – 4% Standard | >6% Industrial',
    },
    {
      id: 'moisture',
      label: t.moisture || 'Moisture Content',
      value: moistureVal,
      max: 25,
      step: 0.1,
      safeMax: 14,
      cautionMax: 16,
      hint: 'Benchmarked: 12% – 14%',
    },
    {
      id: 'damage',
      label: t.damage || 'Mechanical Damage',
      value: damageVal,
      max: 30,
      step: 0.5,
      safeMax: 3,
      cautionMax: 7,
      hint: '0% – 3% Clean | >7% Blemish',
    },
  ];

  return (
    <div id="section-quality" className="bento-tile p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bento-header-label">{t.telemetryCalibration || 'Telemetry Calibration'}</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            {t.defectToleranceCalibration || 'Defect Tolerance Calibration'}
          </h2>
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-3.5">
        {defectParameters.map((param) => {
          const status = getStatusText(param.value, param.safeMax, param.cautionMax);
          return (
            <div
              key={param.id}
              className="p-3 rounded-2xl bg-stone-50/80 border border-stone-200/60 hover:bg-white/80 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-700">{param.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border ${status.color}`}>
                    {status.label}
                  </span>
                  <div className="flex items-center bg-white rounded-lg border border-stone-300/80 px-2 py-0.5 shadow-2xs">
                    <input
                      type="number"
                      value={param.value}
                      min={0}
                      max={param.max}
                      step={param.step}
                      disabled={disabled}
                      onChange={(e) => onChange(param.id, parseFloat(e.target.value) || 0)}
                      className="w-10 text-right font-mono font-bold text-xs text-stone-900 focus:outline-none bg-transparent"
                    />
                    <span className="text-[10px] text-stone-400 font-mono ml-0.5">%</span>
                  </div>
                </div>
              </div>

              {/* Range Slider */}
              <div className="relative pt-1 pb-0.5">
                <input
                  type="range"
                  min={0}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  disabled={disabled}
                  onChange={(e) => handleSliderChange(param.id, e)}
                  className="bento-range"
                />
              </div>

              {/* Benchmark hint */}
              <div className="flex justify-between items-center text-[10px] text-stone-400 font-medium mt-0.5">
                <span>0%</span>
                <span className="text-[9px] text-stone-500">{param.hint}</span>
                <span>{param.max}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Calibration Footer / Summary */}
      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 text-stone-500 text-[11px] font-medium">
          <ActivityIcon className="w-3.5 h-3.5 text-onion-600" />
          <span>{t.statusLabel || 'Status:'}</span>
          <span className="font-mono font-bold text-stone-700">{t.calibrationActive || '[CALIBRATION ACTIVE]'}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-stone-400 text-[11px]">{t.cumulativeDefect || 'Cumulative Defect:'}</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded-lg border ${
            totalDefectPct > 15 ? 'bg-rose-100 text-rose-700 border-rose-200' :
            totalDefectPct > 5 ? 'bg-amber-100 text-amber-700 border-amber-200' :
            'bg-emerald-100 text-emerald-800 border-emerald-200'
          }`}>
            {totalDefectPct}%
          </span>
        </div>
      </div>
    </div>
  );
}
