import React from 'react';
import { ChevronDownIcon } from './icons';
import { clampPercent } from '../constants';

/**
 * Premium Form Primitives — Glassmorphism + Neomorphism Hybrid
 * Fully accessible with glow focus states, glass backgrounds, and micro-animations
 */

/**
 * Field wrapper with label, hint, and error.
 */
export function Field({
  id,
  label,
  required = false,
  hint,
  error,
  labelRight,
  children,
  className = '',
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        {label && (
          <label
            htmlFor={id}
            className="block text-[11px] font-bold uppercase tracking-wider text-stone-600"
          >
            {label}
            {required && (
              <>
                <span className="text-onion-500 font-bold ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}
        {labelRight && <div className="text-[11px] text-stone-400 font-medium">{labelRight}</div>}
      </div>

      {children}

      {hint && !error && (
        <p id={id ? `${id}-hint` : undefined} className="text-[11px] text-stone-400 font-medium">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="text-[11px] font-semibold text-rose-600 flex items-center gap-1 animate-fade-in-up"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/**
 * Text Input with glow focus and glass background.
 */
export function TextInput({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  placeholder = '',
  type = 'text',
  disabled = false,
  readOnly = false,
  maxLength,
  icon: Icon,
  error,
  className = '',
  ...props
}) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="relative rounded-xl">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <input
        id={id}
        name={name || id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`glow-input w-full rounded-xl border bg-white/80 backdrop-blur-xs text-stone-900 text-xs sm:text-sm font-medium py-2.5 transition-all placeholder:text-stone-400 focus:outline-hidden focus:bg-white disabled:bg-stone-50 disabled:cursor-not-allowed ${
          Icon ? 'pl-[38px]' : 'pl-3.5'
        } pr-3.5 ${
          error
            ? 'border-rose-300 focus:border-rose-500 shadow-[0_0_0_3px_rgba(225,29,72,0.08)]'
            : 'border-stone-200/80 hover:border-onion-300 focus:border-onion-600'
        } ${className}`}
        {...props}
      />
    </div>
  );
}

/**
 * Select Dropdown with glass background and glow focus.
 */
export function Select({
  id,
  name,
  value = '',
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  disabled = false,
  error,
  icon: Icon,
  className = '',
  ...props
}) {
  const describedBy = error ? `${id}-error` : undefined;

  return (
    <div className="relative rounded-xl">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
          <Icon className="w-3.5 h-3.5" />
        </div>
      )}
      <select
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`glow-input w-full appearance-none rounded-xl border bg-white/80 backdrop-blur-xs text-stone-900 text-xs sm:text-sm font-medium py-2.5 transition-all focus:outline-hidden focus:bg-white disabled:bg-stone-50 disabled:cursor-not-allowed ${
          Icon ? 'pl-[38px]' : 'pl-3.5'
        } pr-8 ${
          error
            ? 'border-rose-300 focus:border-rose-500 shadow-[0_0_0_3px_rgba(225,29,72,0.08)]'
            : 'border-stone-200/80 hover:border-onion-300 focus:border-onion-600'
        } ${className}`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-stone-400">
        <ChevronDownIcon className="w-4 h-4" />
      </div>
    </div>
  );
}

/**
 * Percent Input with glow focus, visual fill indicator, and quick step buttons.
 */
export function PercentInput({
  id,
  name,
  value = '',
  onChange,
  placeholder = '0',
  disabled = false,
  error,
  className = '',
  step = 1,
  showQuickButtons = true,
  ...props
}) {
  const handleChange = (e) => {
    const raw = e.target.value;
    const clamped = clampPercent(raw);
    onChange(clamped);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const clamped = clampPercent(pastedText);
    onChange(clamped);
  };

  const handleStep = (delta) => {
    const current = value === '' ? 0 : Number(value);
    const updated = clampPercent(current + delta);
    onChange(updated);
  };

  const numericVal = value === '' ? null : Number(value);
  const fillPercent = numericVal !== null ? Math.min(100, Math.max(0, numericVal)) : 0;

  return (
    <div className="space-y-1.5">
      <div className="relative rounded-2xl">
        {/* Visual fill indicator */}
        <div
          className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none"
          aria-hidden="true"
        >
          <div
            className={`h-full transition-all duration-500 ease-out ${
              fillPercent > 15 ? 'bg-onion-50/40' : fillPercent > 0 ? 'bg-emerald-50/30' : ''
            }`}
            style={{ width: `${fillPercent}%` }}
          />
        </div>

        <input
          id={id}
          name={name || id}
          type="number"
          min="0"
          max="100"
          step={step}
          value={value}
          onChange={handleChange}
          onPaste={handlePaste}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={numericVal !== null ? numericVal : undefined}
          className={`glow-input relative z-10 w-full rounded-2xl border bg-white/70 backdrop-blur-sm text-stone-900 text-sm font-semibold pl-4 pr-12 py-3 transition-all placeholder:text-stone-400 focus:outline-hidden focus:bg-white/90 disabled:bg-stone-50 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-300 focus:border-rose-500'
              : 'border-stone-200/80 hover:border-onion-300 focus:border-onion-600'
          } ${className}`}
          {...props}
        />
        <div className="pointer-events-none absolute right-3.5 inset-y-0 flex items-center text-xs font-bold text-onion-600/50 select-none z-10">
          %
        </div>
      </div>

      {showQuickButtons && !disabled && (
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {[-5, -1, 1, 5].map((delta) => (
            <button
              key={delta}
              type="button"
              tabIndex={-1}
              onClick={() => handleStep(delta)}
              className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-white/60 hover:bg-onion-50 text-stone-600 hover:text-onion-700 border border-stone-200/60 hover:border-onion-200 transition-all active:scale-95"
              title={`${delta > 0 ? 'Increase' : 'Decrease'} ${Math.abs(delta)}%`}
            >
              {delta > 0 ? '+' : ''}{delta}%
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Section Heading with gradient underline and glass icon background.
 */
export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-onion-50/80 text-onion-700 border-onion-200/60',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-stone-200/50 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-onion-100/60 to-gold-50/40 text-onion-700 border border-onion-200/40 shadow-xs hover:shadow-md hover:scale-105 transition-all duration-300">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-stone-900 tracking-tight gradient-underline">
              {title}
            </h2>
            {badge && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-[11px] text-stone-400 font-medium">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
