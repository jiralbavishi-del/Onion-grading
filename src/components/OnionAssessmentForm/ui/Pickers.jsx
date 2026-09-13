import React, { useRef } from 'react';
import { CheckCircleIcon } from './icons';

/**
 * Accessible SegmentGroup with glass pill styling.
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
      className={`inline-flex flex-wrap p-1 rounded-2xl bg-stone-100/80 border border-stone-200/60 ${className}`}
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
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-onion-500/30 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected
                ? 'bg-white text-stone-900 shadow-md font-bold'
                : 'text-stone-500 hover:text-stone-800 hover:bg-white/50'
            }`}
          >
            {opt.icon && <opt.icon className="w-3.5 h-3.5" />}
            <span>{opt.label}</span>
            {opt.badge && (
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-md bg-stone-200/80 text-stone-600">
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
 * GradePicker — Premium glass cards with glow halos and shimmer effects.
 */
export function GradePicker({
  id = 'grade-picker',
  label = 'Quality Grade Classification',
  value,
  onChange,
  grades = [],
  disabled = false,
  t = {},
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

  const getGlowClass = (color, isSelected) => {
    if (!isSelected) {
      return 'border-stone-200/80 bg-white/60 hover:bg-white/80 hover:border-stone-300 hover:shadow-md';
    }
    switch (color) {
      case 'emerald':
      case 'onion':
        return 'border-onion-500/50 bg-gradient-to-b from-onion-50/80 to-white grade-card-selected grade-card-glow-onion';
      case 'blue':
      case 'papery':
        return 'border-papery-500/50 bg-gradient-to-b from-papery-50/80 to-white grade-card-selected grade-card-glow-amber';
      case 'amber':
        return 'border-amber-500/50 bg-gradient-to-b from-amber-50/80 to-white grade-card-selected grade-card-glow-amber';
      case 'rose':
        return 'border-rose-500/50 bg-gradient-to-b from-rose-50/80 to-white grade-card-selected grade-card-glow-rose';
      default:
        return 'border-onion-500/50 bg-onion-50/60 grade-card-selected grade-card-glow-onion';
    }
  };

  const getBadgeStyle = (color) => {
    switch (color) {
      case 'emerald':
      case 'onion':
        return 'bg-onion-100/80 text-onion-800 border border-onion-200/60';
      case 'blue':
      case 'papery':
        return 'bg-papery-100/80 text-papery-800 border border-papery-200/60';
      case 'amber':
        return 'bg-amber-100/80 text-amber-800 border border-amber-200/60';
      case 'rose':
        return 'bg-rose-100/80 text-rose-800 border border-rose-200/60';
      default:
        return 'bg-stone-100 text-stone-700';
    }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label id={`${id}-label`} className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
          {label} <span className="text-onion-500 font-bold ml-1">*</span>
        </label>
        <span className="text-[11px] text-stone-400 font-medium">
          {t.selectClassification || 'Select classification'}
        </span>
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
              className={`hover-shimmer relative flex flex-col justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-onion-600/30 backdrop-blur-sm ${getGlowClass(
                grade.color,
                isSelected
              )} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="font-bold text-sm text-stone-900">
                    {t[grade.label] || grade.label}
                  </div>
                  {isSelected && (
                    <div className="flex items-center justify-center w-5 h-5 rounded-full bg-onion-600 shadow-sm">
                      <CheckCircleIcon className="w-3.5 h-3.5 text-white" />
                    </div>
                  )}
                </div>

                <div className="mb-2.5">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-lg ${getBadgeStyle(grade.color)}`}>
                    {t[grade.badge] || grade.badge}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                  {t[grade.description] || grade.description}
                </p>
              </div>

              {grade.maxDefectTotal && (
                <div className="mt-3 pt-2.5 border-t border-stone-100/80 text-[10px] text-stone-400 font-semibold">
                  {t.tolerancePrefix || 'Max:'} ≤ {grade.maxDefectTotal}% {t.defectSuffix || 'defect'}
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
 * SizePicker — Glass cards with proportional circles and pulse animation on selection.
 */
export function SizePicker({
  id = 'size-picker',
  label = 'Size Caliber Classification',
  value,
  onChange,
  sizes = [],
  disabled = false,
  t = {},
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
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label id={`${id}-label`} className="block text-[11px] font-bold uppercase tracking-wider text-stone-600">
          {label} <span className="text-onion-500 font-bold ml-1">*</span>
        </label>
        <span className="text-[11px] text-stone-400 font-medium">
          {t.bulbDiameterGrading || 'Bulb diameter'}
        </span>
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
              className={`hover-shimmer p-3.5 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-300 focus:outline-hidden focus:ring-2 focus:ring-onion-600/30 backdrop-blur-sm ${
                isSelected
                  ? 'border-onion-500/50 bg-gradient-to-b from-onion-50/80 to-white grade-card-selected grade-card-glow-onion'
                  : 'border-stone-200/80 bg-white/60 hover:bg-white/80 hover:border-stone-300 hover:shadow-md'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {/* Visual circle with pulse on selection */}
              <div className="h-12 flex items-center justify-center mb-2">
                <div
                  style={{
                    width: `${Math.round((size.circleDiameter || 36) * 0.85)}px`,
                    height: `${Math.round((size.circleDiameter || 36) * 0.85)}px`,
                  }}
                  className={`rounded-full transition-all duration-500 border-2 flex items-center justify-center ${
                    isSelected
                      ? 'bg-gradient-to-tr from-onion-700 via-onion-600 to-gold-500 border-onion-800 text-white shadow-lg shadow-onion-500/30 size-circle-pulse'
                      : 'bg-gradient-to-tr from-stone-100 to-papery-100 border-stone-300/80 text-stone-500'
                  }`}
                >
                  <span className={`text-[9px] font-black ${isSelected ? 'text-white' : 'text-stone-600'}`}>
                    {size.mmMin}ø
                  </span>
                </div>
              </div>

              <div className="font-bold text-xs sm:text-sm text-stone-900">
                {t[size.label] || size.label}
              </div>
              <div className={`text-[11px] font-bold mt-0.5 ${isSelected ? 'text-onion-600' : 'text-stone-400'}`}>
                {t[size.caliber] || size.caliber}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5 line-clamp-1">
                {t[size.purpose] || size.purpose}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
