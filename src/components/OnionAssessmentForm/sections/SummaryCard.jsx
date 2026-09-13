import React from 'react';
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  SparklesIcon,
  RefreshCwIcon,
  ShieldAlertIcon,
  FileTextIcon,
} from '../ui/icons';
import { GRADES, ONION_VARIETIES } from '../constants';

/**
 * Section 6: Real-time Evaluation Summary Card & Form Orchestration Actions
 * Displays computed quality scores, defect compliance check, and export/submission triggers.
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

  // Compute calculated quality score (100 base)
  let computedScore = 100;
  if (moisture > 14) {
    computedScore -= (moisture - 14) * 4.0;
  }
  computedScore -= sprouting * 2.5;
  computedScore -= damage * 1.5;
  computedScore -= doubles * 1.0;

  computedScore = Math.max(0, Math.min(100, Math.round(computedScore)));

  // Automatic Grade Recommendation
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

  return (
    <div className="glass-card sticky top-6 rounded-3xl border border-papery-200/90 dark:border-onion-900/70 shadow-[0_20px_50px_rgba(109,26,48,0.07)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-7 space-y-6 ring-1 ring-gold-500/10 dark:ring-onion-500/20 backdrop-blur-2xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-papery-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-onion-800 dark:text-onion-300 font-display">
              {t.realTimeAudit || 'REAL-TIME AUDIT'}
            </span>
          </div>
          <h2 className="text-xl font-black font-display text-stone-900 dark:text-white tracking-tight">
            {t.scorecardTitle || 'Quality Scorecard'}
          </h2>
        </div>
        <div className="p-2.5 rounded-2xl bg-gradient-to-br from-onion-100 via-onion-50 to-gold-100 dark:from-onion-950 dark:to-stone-900 text-onion-800 dark:text-onion-300 border border-onion-200/80 dark:border-onion-800/80 shadow-xs">
          <SparklesIcon className="w-5 h-5" />
        </div>
      </div>

      {/* Accessible Live Banner for Submission Results */}
      <div aria-live="polite" aria-atomic="true">
        {submissionStatus && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              submissionStatus.type === 'success'
                ? 'bg-onion-50 dark:bg-onion-950/60 border-onion-300 text-onion-900 dark:text-onion-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 text-rose-900 dark:text-rose-200'
            }`}
          >
            {submissionStatus.type === 'success' ? (
              <CheckCircleIcon className="w-5 h-5 text-onion-700 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div className="text-xs">
              <p className="font-bold">{submissionStatus.title}</p>
              <p className="mt-0.5 opacity-90">{submissionStatus.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* Quality Score Meter */}
      <div className="p-4 rounded-xl bg-gradient-to-br from-papery-50/70 to-onion-50/50 dark:from-onion-950/40 dark:to-stone-900 border border-papery-200 dark:border-onion-900/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-stone-600 dark:text-stone-400">
            {t.qualityIndex || 'Calculated Quality Index'}
          </span>
          <span
            className={`text-2xl font-black font-mono ${
              computedScore >= 80
                ? 'text-onion-800 dark:text-onion-300'
                : computedScore >= 60
                ? 'text-amber-700 dark:text-amber-300'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {computedScore}
            <span className="text-xs text-stone-400 font-normal">/100</span>
          </span>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-papery-200/80 dark:bg-stone-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              computedScore >= 80
                ? 'bg-gradient-to-r from-onion-700 to-papery-500'
                : computedScore >= 60
                ? 'bg-amber-500'
                : 'bg-rose-500'
            }`}
            style={{ width: `${computedScore}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500">
          <span>{t.algoSuggest || 'Algorithmic suggestion:'}</span>
          <span className="font-bold text-stone-800 dark:text-stone-200">{autoGrade}</span>
        </div>
      </div>

      {/* Quick Spec Matrix */}
      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between py-1.5 border-b border-papery-100 dark:border-stone-800">
          <span className="text-stone-500">{t.cultivar || 'Cultivar:'}</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {varietyObj?.name || '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-papery-100 dark:border-stone-800">
          <span className="text-stone-500">{t.selectedGrade || 'Selected Grade:'}</span>
          <span className="font-bold text-stone-800 dark:text-stone-200">
            {values.grade || 'Grade A'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-papery-100 dark:border-stone-800">
          <span className="text-stone-500">{t.sizeCaliber || 'Size Caliber:'}</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {values.sizeClass || 'Medium'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-papery-100 dark:border-stone-800">
          <span className="text-stone-500">{t.moistureContent || 'Moisture Content:'}</span>
          <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
            {values.moisture !== '' ? `${values.moisture}%` : '—'}
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5 border-b border-papery-100 dark:border-stone-800">
          <span className="text-stone-500">{t.cumulativeDefects || 'Cumulative Defects:'}</span>
          <span
            className={`font-mono font-bold ${
              totalDefects > 10 ? 'text-rose-600' : 'text-stone-800 dark:text-stone-200'
            }`}
          >
            {totalDefects}%
          </span>
        </div>

        <div className="flex items-center justify-between py-1.5">
          <span className="text-stone-500">{t.photoAttachments || 'Photo Attachments:'}</span>
          <span className="font-semibold text-stone-800 dark:text-stone-200">
            {images.length}
          </span>
        </div>
      </div>

      {/* Grade Discrepancy Notice */}
      {!isGradeCompliant && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <AlertTriangleIcon className="w-4 h-4 text-amber-600 shrink-0" />
            Quality Discrepancy
          </div>
          <p className="text-[11px] leading-relaxed">
            Batch is marked as <strong>{values.grade}</strong>, but computed defects suggest <strong>{autoGrade}</strong>.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-2">
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-onion-800 via-onion-700 to-papery-700 hover:from-onion-900 hover:via-onion-800 hover:to-papery-800 active:from-onion-950 transition-all shadow-md hover:shadow-lg shadow-onion-900/20 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-hidden focus:ring-2 focus:ring-onion-700/40"
        >
          {isSubmitting ? (
            <>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
              <span>{t.submittingBtn || 'Validating & Recording...'}</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              <span>{t.submitBtn || 'Submit Field Assessment'}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled || isSubmitting}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs text-stone-600 dark:text-stone-300 hover:bg-papery-100/80 dark:hover:bg-onion-950/60 transition-colors focus:outline-hidden focus:ring-2 focus:ring-onion-400"
        >
          <RefreshCwIcon className="w-3.5 h-3.5" />
          <span>{t.resetBtn || 'Reset Form Data'}</span>
        </button>
      </div>
    </div>
  );
}
