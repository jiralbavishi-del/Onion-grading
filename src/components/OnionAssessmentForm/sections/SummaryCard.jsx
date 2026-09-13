import React, { useEffect, useState } from 'react';
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  SparklesIcon,
  RefreshCwIcon,
} from '../ui/icons';
import { ONION_VARIETIES } from '../constants';

/**
 * Animated circular gauge SVG component
 */
function CircularGauge({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return { stroke: 'url(#gaugeGradientGood)', glow: 'gauge-glow-good' };
    if (score >= 60) return { stroke: 'url(#gaugeGradientMid)', glow: 'gauge-glow-mid' };
    return { stroke: 'url(#gaugeGradientBad)', glow: 'gauge-glow-bad' };
  };

  const { stroke, glow } = getColor();

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className={`-rotate-90 ${glow} no-transition`}
        viewBox={`0 0 ${size} ${size}`}
      >
        <defs>
          <linearGradient id="gaugeGradientGood" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9B1D3C" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#9B1D3C" />
          </linearGradient>
          <linearGradient id="gaugeGradientMid" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <linearGradient id="gaugeGradientBad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#F43F5E" />
          </linearGradient>
        </defs>
        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(155, 29, 60, 0.08)"
          strokeWidth={strokeWidth}
        />
        {/* Score ring */}
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
          className="gauge-ring no-transition"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
        />
      </svg>
      {/* Center score */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black font-mono tabular-nums ${
          score >= 80 ? 'text-onion-800' : score >= 60 ? 'text-amber-700' : 'text-rose-600'
        }`}>
          {score}
        </span>
        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest -mt-0.5">/100</span>
      </div>
    </div>
  );
}

/**
 * Premium Summary Scorecard with glassmorphism, circular gauge, and shimmer submit
 */
export function SummaryCard({
  values,
  images = [],
  onSubmit,
  onReset,
  isSubmitting = false,
  submissionStatus,
  disabled = false,
  t = {},
}) {
  const moisture = Number(values.moisture || 0);
  const sprouting = Number(values.sprouting || 0);
  const damage = Number(values.damage || 0);
  const doubles = Number(values.doubles || 0);

  const totalDefects = Math.min(100, Math.round((sprouting + damage + doubles) * 10) / 10);

  let computedScore = 100;
  if (moisture > 14) computedScore -= (moisture - 14) * 4.0;
  computedScore -= sprouting * 2.5;
  computedScore -= damage * 1.5;
  computedScore -= doubles * 1.0;
  computedScore = Math.max(0, Math.min(100, Math.round(computedScore)));

  let autoGrade = 'Grade A';
  if (computedScore < 50 || totalDefects > 20 || sprouting > 12) {
    autoGrade = 'Reject';
  } else if (computedScore < 70 || totalDefects > 10 || moisture > 16) {
    autoGrade = 'Grade C';
  } else if (computedScore < 85 || totalDefects > 5 || moisture > 14.5) {
    autoGrade = 'Grade B';
  }

  const varietyObj = ONION_VARIETIES.find((v) => v.id === values.variety);

  const isGradeCompliant =
    values.grade === autoGrade ||
    (values.grade === 'Grade B' && autoGrade === 'Grade A') ||
    (values.grade === 'Grade C' && (autoGrade === 'Grade A' || autoGrade === 'Grade B'));

  const specRows = [
    { label: t.cultivar || 'Cultivar:', value: varietyObj?.name ? (t[varietyObj.name] || varietyObj.name) : '—' },
    { label: t.selectedGrade || 'Selected Grade:', value: t[values.grade] || values.grade || 'Grade A', bold: true },
    { label: t.sizeCaliber || 'Size Caliber:', value: t[values.sizeClass] || values.sizeClass || 'Medium' },
    { label: t.moistureContent || 'Moisture:', value: values.moisture !== '' ? `${values.moisture}%` : '—', mono: true },
    { label: t.cumulativeDefects || 'Defects:', value: `${totalDefects}%`, mono: true, danger: totalDefects > 10 },
    { label: t.photoAttachments || 'Photos:', value: images.length },
  ];

  return (
    <div id="section-scorecard" className="glass-card sticky top-20 rounded-3xl p-6 space-y-5 ring-1 ring-onion-200/30">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-onion-600 live-dot" />
            <span className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-onion-700 font-display">
              {t.realTimeAudit || 'Real-Time Audit'}
            </span>
          </div>
          <h2 className="text-lg font-black font-display text-stone-900 tracking-tight gradient-underline">
            {t.scorecardTitle || 'Quality Scorecard'}
          </h2>
        </div>
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-onion-100/80 via-gold-50 to-papery-100/60 text-onion-700 border border-onion-200/50 shadow-xs">
          <SparklesIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Status Banner */}
      <div aria-live="polite" aria-atomic="true">
        {submissionStatus && (
          <div className={`p-3.5 rounded-2xl border flex items-start gap-3 animate-fade-in-up ${
            submissionStatus.type === 'success'
              ? 'bg-emerald-50/80 border-emerald-200/60 text-emerald-900'
              : 'bg-rose-50/80 border-rose-200/60 text-rose-900'
          }`}>
            {submissionStatus.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <p className="font-bold">{submissionStatus.title}</p>
              <p className="mt-0.5 opacity-80">{submissionStatus.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Circular Quality Gauge */}
      <div className="flex flex-col items-center py-3">
        <CircularGauge score={computedScore} />
        <div className="mt-3 text-center">
          <p className="text-[10px] font-semibold text-stone-500">
            {t.qualityIndex || 'Quality Index'}
          </p>
          <p className="text-xs font-bold text-stone-700 mt-0.5">
            {t.algoSuggest || 'Suggested:'}{' '}
            <span className={`${
              computedScore >= 80 ? 'text-onion-700' : computedScore >= 60 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {t[autoGrade] || autoGrade}
            </span>
          </p>
        </div>
      </div>

      {/* Spec Matrix */}
      <div className="space-y-0 text-xs rounded-2xl bg-white/40 border border-white/60 overflow-hidden">
        {specRows.map((row, i) => (
          <div
            key={i}
            className={`flex items-center justify-between px-4 py-2.5 ${
              i < specRows.length - 1 ? 'border-b border-stone-100/80' : ''
            } hover:bg-white/50 transition-colors`}
          >
            <span className="text-stone-500 font-medium">{row.label}</span>
            <span className={`font-semibold ${
              row.danger ? 'text-rose-600 font-bold' :
              row.bold ? 'text-stone-900 font-bold' :
              row.mono ? 'font-mono text-stone-800' :
              'text-stone-800'
            }`}>
              {row.value}
            </span>
          </div>
        ))}
      </div>

      {/* Grade Discrepancy */}
      {!isGradeCompliant && (
        <div className="p-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 text-amber-800 text-xs space-y-1 animate-fade-in-up">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            {t.qualityDiscrepancy || 'Quality Discrepancy'}
          </div>
          <p className="text-[11px] leading-relaxed opacity-80">
            Batch: <strong>{t[values.grade] || values.grade}</strong> → Suggested: <strong>{t[autoGrade] || autoGrade}</strong>
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
          className="shimmer-btn w-full flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-onion-800 via-onion-700 to-onion-800 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 focus:ring-onion-700/40 focus:ring-offset-2"
        >
          {isSubmitting ? (
            <>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
              <span>{t.submittingBtn || 'Validating...'}</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              <span>{t.submitBtn || 'Submit Assessment'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled || isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-2xl font-semibold text-xs text-stone-500 hover:text-onion-700 hover:bg-onion-50/50 transition-all focus:outline-hidden focus:ring-2 focus:ring-onion-400"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          <span>{t.resetBtn || 'Reset Form'}</span>
        </button>
      </div>
    </div>
  );
}
