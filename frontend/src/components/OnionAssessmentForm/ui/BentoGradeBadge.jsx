import React from 'react';
import { AlertTriangleIcon } from './icons';

/**
 * Animated Circular Quality Gauge for the Bento Tile
 */
function CircularGauge({ score, size = 110, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getTheme = () => {
    if (score >= 80) return { stroke: '#059669', glow: 'rgba(5, 150, 105, 0.3)', textColor: 'text-emerald-700' };
    if (score >= 60) return { stroke: '#D97706', glow: 'rgba(217, 119, 6, 0.3)', textColor: 'text-amber-700' };
    return { stroke: '#E11D48', glow: 'rgba(225, 29, 72, 0.3)', textColor: 'text-rose-600' };
  };

  const { stroke, glow, textColor } = getTheme();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="-rotate-90 no-transition"
        viewBox={`0 0 ${size} ${size}`}
        style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(129, 27, 53, 0.08)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
        <span className={`text-2xl font-black font-mono tabular-nums ${textColor}`}>
          {score}%
        </span>
        <span className="text-[8px] font-bold text-stone-400 uppercase tracking-widest -mt-0.5">
          Score
        </span>
      </div>
    </div>
  );
}

/**
 * Bento Tile 2: Real-time Grade & Quality Certificate Hub
 * Displays large Grade Ribbon, circular quality score ring, acceptance status, and discrepancies.
 */
export function BentoGradeBadge({
  values,
  t = {},
}) {
  const moisture = Number(values.moisture || 0);
  const sprouting = Number(values.sprouting || 0);
  const damage = Number(values.damage || 0);
  const doubles = Number(values.doubles || 0);

  const totalDefects = Math.min(100, Math.round((sprouting + damage + doubles) * 10) / 10);

  // Mathematically rigorous Agronomic Quality Scoring (100 Base):
  // 1. Sprouting penalty: 1.5x weight (high risk of fungal rot)
  // 2. Physical damage penalty: 1.2x weight (entry point for pathogens)
  // 3. Doubles & splits penalty: 0.8x weight (commercial grading caliber penalty)
  // 4. Moisture deviation penalty: baseline is 12-14%. Deviation above 14% causes rot, below 10% causes desiccation.
  let defectDeductions = (sprouting * 1.5) + (damage * 1.2) + (doubles * 0.8);
  
  let moisturePenalty = 0;
  if (moisture > 14) {
    moisturePenalty = (moisture - 14) * 3.0; // Excess moisture promotes rot
  } else if (moisture < 10 && moisture > 0) {
    moisturePenalty = (10 - moisture) * 1.5; // Excessively dry bulbs
  }

  // Pure mathematically computed quality score (0 to 100%)
  const computedScore = Math.max(0, Math.min(100, Math.round(100 - defectDeductions - moisturePenalty)));

  // Objective Algorithmic Grading according to AGMARK / APEDA standards:
  // Grade A: Score >= 85, Total Defects <= 5%, Sprouting <= 3%
  // Grade B: Score >= 70, Total Defects <= 12%, Sprouting <= 6%
  // Grade C: Score >= 50, Total Defects <= 22%, Sprouting <= 10%
  // Reject: Score < 50 or Total Defects > 22% or Sprouting > 10%
  let autoGrade = 'Grade A';
  if (computedScore < 50 || totalDefects > 22 || sprouting > 10) {
    autoGrade = 'Reject';
  } else if (computedScore < 70 || totalDefects > 12 || sprouting > 6 || moisture > 16) {
    autoGrade = 'Grade C';
  } else if (computedScore < 85 || totalDefects > 5 || sprouting > 3 || moisture > 14.5) {
    autoGrade = 'Grade B';
  }

  // The true mathematical score directly reflects the telemetry metrics
  const displayScore = computedScore;

  // Active displayed grade: if user manually selected a grade, display it, else autoGrade
  const effectiveGrade = values.grade || autoGrade;

  // Quality rating and batch status directly mapped to the mathematical score
  let qualityRating = t.certifiedStatus || 'CERTIFIED';
  let batchStatus = t.acceptedStatus || 'ACCEPTED';
  let ribbonBg = 'bg-emerald-600 text-white';
  let ratingPillColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';

  if (displayScore < 50 || effectiveGrade === 'Reject' || autoGrade === 'Reject') {
    qualityRating = t.rejectedStatus || 'REJECTED';
    batchStatus = t.notExportableStatus || 'NOT EXPORTABLE';
    ribbonBg = 'bg-rose-600 text-white';
    ratingPillColor = 'text-rose-700 bg-rose-50 border-rose-200';
  } else if (displayScore < 70 || effectiveGrade === 'Grade C' || autoGrade === 'Grade C') {
    qualityRating = t.conditionalStatus || 'CONDITIONAL';
    batchStatus = t.domesticOnlyStatus || 'DOMESTIC ONLY';
    ribbonBg = 'bg-amber-600 text-white';
    ratingPillColor = 'text-amber-700 bg-amber-50 border-amber-200';
  } else if (displayScore < 85 || effectiveGrade === 'Grade B' || autoGrade === 'Grade B') {
    qualityRating = t.standardStatus || 'STANDARD';
    batchStatus = t.qualifiedStatus || 'QUALIFIED';
    ribbonBg = 'bg-teal-600 text-white';
    ratingPillColor = 'text-teal-700 bg-teal-50 border-teal-200';
  } else {
    qualityRating = t.certifiedStatus || 'CERTIFIED';
    batchStatus = t.acceptedStatus || 'ACCEPTED';
    ribbonBg = 'bg-emerald-600 text-white';
    ratingPillColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
  }

  const isGradeCompliant =
    !values.grade ||
    values.grade === autoGrade ||
    (values.grade === 'Grade B' && autoGrade === 'Grade A') ||
    (values.grade === 'Grade C' && (autoGrade === 'Grade A' || autoGrade === 'Grade B'));

  return (
    <div id="section-scorecard" className="bento-tile p-5 sm:p-6 flex flex-col h-full">
      {/* Tile Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <span className="bento-header-label">{t.qualityMetricHub || 'Quality Metric Hub'}</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            {t.realTimeGradeCert || 'Real-time Grade Certificate'}
          </h2>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center space-y-5">
        {/* Main Ribbon & Gauge Row */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/60">
        {/* Left: Dynamic Grade Ribbon (Option 3 Hero) */}
        <div className="sm:col-span-7 flex flex-col justify-center space-y-2">
          <div className="flex items-center gap-2.5">
            {/* Hanging Ribbon Flag */}
            <div className={`flex items-center justify-center w-9 h-12 rounded-b-lg font-black text-xl shadow-md ${ribbonBg}`}>
              {effectiveGrade.startsWith('Grade') ? effectiveGrade.replace('Grade ', '') : 'R'}
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                {t.currentClassification || 'Current Classification'}
              </div>
              <div className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight font-display">
                {t[effectiveGrade] || effectiveGrade.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="text-xs text-stone-600 space-y-0.5 pt-1">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 text-[11px] font-medium">{t.qualityRatingLabel || 'Quality Rating:'}</span>
              <span className="font-bold text-stone-800">{qualityRating}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-400 text-[11px] font-medium">{t.batchStatusLabel || 'Batch Status:'}</span>
              <span className={`font-bold text-[11px] px-1.5 py-0.2 rounded ${
                displayScore >= 80 ? 'text-emerald-700 bg-emerald-100/60' :
                displayScore >= 60 ? 'text-amber-700 bg-amber-100/60' : 'text-rose-700 bg-rose-100/60'
              }`}>
                {batchStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Circular Gauge */}
        <div className="sm:col-span-5 flex flex-col items-center justify-center pt-2 sm:pt-0">
          <CircularGauge score={displayScore} />
          <span className="text-[10px] font-bold text-stone-500 mt-1 uppercase tracking-wide">
            {displayScore >= 80 ? (t.superiorQuality || 'Superior Quality') : displayScore >= 60 ? (t.acceptableQuality || 'Acceptable') : (t.substandardQuality || 'Substandard')}
          </span>
        </div>
      </div>

      {/* Quick Telemetry Chips */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/70 p-2 rounded-xl border border-stone-200/50">
          <span className="text-[10px] text-stone-400 block font-medium">{t.moistureLabel || 'Moisture'}</span>
          <span className="font-mono font-bold text-xs text-stone-800">{values.moisture || 0}%</span>
        </div>
        <div className="bg-white/70 p-2 rounded-xl border border-stone-200/50">
          <span className="text-[10px] text-stone-400 block font-medium">{t.totalDefectLabel || 'Total Defect'}</span>
          <span className={`font-mono font-bold text-xs ${totalDefects > 10 ? 'text-rose-600' : 'text-stone-800'}`}>
            {totalDefects}%
          </span>
        </div>
        <div className="bg-white/70 p-2 rounded-xl border border-stone-200/50">
          <span className="text-[10px] text-stone-400 block font-medium">{t.sizeCaliberLabel || 'Size Caliber'}</span>
          <span className="font-bold text-xs text-stone-800 truncate block">
            {t[values.sizeClass] || values.sizeClass || t['Medium'] || 'Medium'}
          </span>
        </div>
      </div>

      {/* Discrepancy warning if manual grade differs from algorithmic evaluation */}
      {!isGradeCompliant && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
          <AlertTriangleIcon className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="text-[11px]">
            {t.selectedGradeDiffers
              ? t.selectedGradeDiffers.replace('{selected}', t[values.grade] || values.grade).replace('{auto}', t[autoGrade] || autoGrade)
              : `Selected ${t[values.grade] || values.grade} differs from auto-certified ${t[autoGrade] || autoGrade}.`}
          </span>
        </div>
      )}
      </div>
    </div>
  );
}
