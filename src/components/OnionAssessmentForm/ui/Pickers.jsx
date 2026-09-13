import React, { useRef } from 'react';
import { CheckCircleIcon } from './icons';

/**
 * Accessible SegmentGroup supporting full keyboard navigation (arrows, Home, End, Space).
 * Generic component with zero domain logic.
 */
export function SegmentGroup({
  name,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  className = '',
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (disabled || options.length === 0) return;

    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % options.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + options.length) % options.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = options.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== null) {
      const nextOpt = options[nextIndex];
      onChange(nextOpt.id);
      // Focus the newly active button
      const buttons = containerRef.current?.querySelectorAll('button[role="radio"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label={label}
      className={`inline-flex flex-wrap p-1 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 ${className}`}
    >
      {options.map((opt, idx) => {
        const isSelected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="radio"
            name={name}
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            disabled={disabled}
            onClick={() => onChange(opt.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all focus:outline-hidden focus:ring-2 focus:ring-emerald-500/40 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
            }`}
          >
            {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
            {opt.badge && (
              <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/**
 * GradePicker component for selecting inspection grades.
 * Supports keyboard navigation and clear visual cards with quality tags.
 */
export function GradePicker({
  id = 'grade-picker',
  label = 'Quality Grade Classification',
  value,
  onChange,
  grades = [],
  disabled = false,
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (disabled || grades.length === 0) return;
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % grades.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + grades.length) % grades.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = grades.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== null) {
      onChange(grades[nextIndex].id);
      const items = containerRef.current?.querySelectorAll('[role="radio"]');
      if (items && items[nextIndex]) items[nextIndex].focus();
    }
  };

  const getBorderColor = (color, isSelected) => {
    if (!isSelected) {
      return 'border-papery-200 dark:border-stone-800 hover:border-papery-400 dark:hover:border-stone-700 bg-white dark:bg-stone-900/70';
    }
    switch (color) {
      case 'emerald':
      case 'onion':
        return 'border-onion-700 bg-gradient-to-b from-onion-50/90 to-papery-50/50 dark:from-onion-950/60 dark:to-stone-900 ring-2 ring-onion-700/25';
      case 'blue':
      case 'papery':
        return 'border-papery-600 bg-papery-50/80 dark:bg-papery-950/40 ring-2 ring-papery-600/25';
      case 'amber':
        return 'border-amber-600 bg-amber-50/80 dark:bg-amber-950/40 ring-2 ring-amber-600/25';
      case 'rose':
        return 'border-rose-600 bg-rose-50/80 dark:bg-rose-950/40 ring-2 ring-rose-600/25';
      default:
        return 'border-onion-800 ring-2 ring-onion-500/20';
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'emerald':
      case 'onion':
        return 'bg-onion-100 text-onion-900 dark:bg-onion-950 dark:text-onion-200 border border-onion-300/80';
      case 'blue':
      case 'papery':
        return 'bg-papery-200 text-papery-900 dark:bg-papery-900/60 dark:text-papery-200 border border-papery-300/80';
      case 'amber':
        return 'bg-amber-100 text-amber-900 dark:bg-amber-900/60 dark:text-amber-200 border border-amber-300/80';
      case 'rose':
        return 'bg-rose-100 text-rose-900 dark:bg-rose-900/60 dark:text-rose-200 border border-rose-300/80';
      default:
        return 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-300';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label id={`${id}-label`} className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
          {label} <span className="text-onion-700 font-bold ml-1">*</span>
        </label>
        <span className="text-xs text-stone-500 dark:text-stone-400">Select lot classification</span>
      </div>

      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
      >
        {grades.map((grade, idx) => {
          const isSelected = value === grade.id;
          return (
            <div
              key={grade.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !disabled && onChange(grade.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative flex flex-col justify-between p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-onion-700/40 ${getBorderColor(
                grade.color,
                isSelected
              )} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="font-bold text-sm text-stone-900 dark:text-white">
                    {grade.label}
                  </div>
                  {isSelected && (
                    <CheckCircleIcon className="w-4 h-4 text-onion-700 dark:text-onion-400 shrink-0" />
                  )}
                </div>

                <div className="mb-2">
                  <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md ${getBadgeStyle(grade.color)}`}>
                    {grade.badge}
                  </span>
                </div>

                <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                  {grade.description}
                </p>
              </div>

              {grade.maxDefectTotal && (
                <div className="mt-3 pt-2 border-t border-papery-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400 font-medium">
                  Tolerance: ≤ {grade.maxDefectTotal}% defect
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * SizePicker component for caliber categorization with proportional visual indicators.
 */
export function SizePicker({
  id = 'size-picker',
  label = 'Size Caliber Classification',
  value,
  onChange,
  sizes = [],
  disabled = false,
}) {
  const containerRef = useRef(null);

  const handleKeyDown = (e, index) => {
    if (disabled || sizes.length === 0) return;
    let nextIndex = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % sizes.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + sizes.length) % sizes.length;
      e.preventDefault();
    } else if (e.key === 'Home') {
      nextIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      nextIndex = sizes.length - 1;
      e.preventDefault();
    }

    if (nextIndex !== null) {
      onChange(sizes[nextIndex].id);
      const items = containerRef.current?.querySelectorAll('[role="radio"]');
      if (items && items[nextIndex]) items[nextIndex].focus();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label id={`${id}-label`} className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
          {label} <span className="text-onion-700 font-bold ml-1">*</span>
        </label>
        <span className="text-xs text-stone-500 dark:text-stone-400">Bulb diameter grading</span>
      </div>

      <div
        ref={containerRef}
        role="radiogroup"
        aria-labelledby={`${id}-label`}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {sizes.map((size, idx) => {
          const isSelected = value === size.id;
          return (
            <div
              key={size.id}
              role="radio"
              aria-checked={isSelected}
              tabIndex={isSelected ? 0 : -1}
              onClick={() => !disabled && onChange(size.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`p-3 rounded-xl border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-150 focus:outline-hidden focus:ring-2 focus:ring-onion-700/40 ${
                isSelected
                  ? 'border-onion-700 bg-gradient-to-b from-onion-50/70 to-papery-50/40 dark:from-onion-950/40 dark:to-stone-900 ring-2 ring-onion-700/25'
                  : 'border-papery-200 dark:border-stone-800 hover:border-papery-400 dark:hover:border-stone-700 bg-white dark:bg-stone-900/60'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Visual circle representing real onion bulb diameter */}
              <div className="h-10 flex items-center justify-center mb-1.5">
                <div
                  style={{
                    width: `${Math.round((size.circleDiameter || 36) * 0.78)}px`,
                    height: `${Math.round((size.circleDiameter || 36) * 0.78)}px`,
                  }}
                  className={`rounded-full transition-all border-2 flex items-center justify-center shadow-xs ${
                    isSelected
                      ? 'bg-gradient-to-tr from-onion-800 via-onion-600 to-papery-500 border-onion-900 text-white'
                      : 'bg-gradient-to-tr from-papery-200 to-onion-100 dark:from-stone-800 dark:to-stone-700 border-papery-400/80 dark:border-stone-600 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                    {size.mmMin}ø
                  </span>
                </div>
              </div>

              <div className="font-bold text-xs sm:text-sm text-stone-900 dark:text-white">
                {size.label}
              </div>
              <div className="text-[11px] font-bold text-onion-700 dark:text-onion-400 mt-0.5">
                {size.caliber}
              </div>
              <div className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                {size.purpose}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
