import React from 'react';
import { ChevronDownIcon } from './icons';
import { clampPercent } from '../constants';

/**
 * Generic Form Primitives with ZERO domain knowledge.
 * Fully accessible with label bindings, ARIA attributes, and state indicators.
 */

/**
 * Wrapper for form inputs providing standard label, required mark, hint, and error text.
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
            className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            {label}
            {required && (
              <>
                <span className="text-rose-500 font-bold ml-1" aria-hidden="true">*</span>
                <span className="sr-only"> (required)</span>
              </>
            )}
          </label>
        )}
        {labelRight && <div className="text-xs text-slate-500 dark:text-slate-400">{labelRight}</div>}
      </div>

      {children}

      {hint && !error && (
        <p id={id ? `${id}-hint` : undefined} className="text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      )}

      {error && (
        <p
          id={id ? `${id}-error` : undefined}
          role="alert"
          className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

/**
 * Accessible Text Input with optional leading icon.
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
    <div className="relative rounded-xl shadow-xs">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400 dark:text-slate-500">
          <Icon className="w-4 h-4" />
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
        className={`w-full rounded-xl border bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm font-medium py-2.5 transition-colors placeholder:text-stone-400 dark:placeholder:text-stone-500 focus:outline-hidden focus:ring-2 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:cursor-not-allowed ${
          Icon ? 'pl-10' : 'pl-3.5'
        } pr-3.5 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-papery-300/80 dark:border-stone-700 hover:border-onion-400 dark:hover:border-onion-700 focus:border-onion-700 focus:ring-onion-700/20'
        } ${className}`}
        {...props}
      />
    </div>
  );
}

/**
 * Accessible Select Dropdown.
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
    <div className="relative rounded-xl shadow-xs">
      {Icon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-stone-500">
          <Icon className="w-4 h-4" />
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
        className={`w-full appearance-none rounded-xl border bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm font-medium py-2.5 transition-colors focus:outline-hidden focus:ring-2 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:cursor-not-allowed ${
          Icon ? 'pl-10' : 'pl-3.5'
        } pr-10 ${
          error
            ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
            : 'border-papery-300/80 dark:border-stone-700 hover:border-onion-400 dark:hover:border-onion-700 focus:border-onion-700 focus:ring-onion-700/20'
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
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-stone-400">
        <ChevronDownIcon className="w-4 h-4" />
      </div>
    </div>
  );
}

/**
 * Robust Percent Input that enforces 0-100 clamping strictly in the JS handler.
 * Handles typing, pasting, step buttons, and non-numeric characters.
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

  return (
    <div className="space-y-1">
      <div className="relative flex items-center rounded-xl shadow-xs">
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
          className={`w-full rounded-xl border bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-sm font-semibold pl-3.5 pr-12 py-2.5 transition-colors placeholder:text-stone-400 focus:outline-hidden focus:ring-2 disabled:bg-stone-100 dark:disabled:bg-stone-800 disabled:cursor-not-allowed ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-papery-300/80 dark:border-stone-700 hover:border-onion-400 focus:border-onion-700 focus:ring-onion-700/20'
          } ${className}`}
          {...props}
        />
        <div className="pointer-events-none absolute right-3 flex items-center text-xs font-bold text-onion-700/60 dark:text-onion-400/70 select-none">
          %
        </div>
      </div>

      {showQuickButtons && !disabled && (
        <div className="flex items-center gap-1.5 pt-0.5" aria-hidden="true">
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(-5)}
            className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-papery-100/80 dark:bg-stone-800 hover:bg-onion-100 dark:hover:bg-onion-950 text-stone-700 dark:text-stone-300 hover:text-onion-900 transition-colors"
            title="Decrease 5%"
          >
            -5%
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(-1)}
            className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-papery-100/80 dark:bg-stone-800 hover:bg-onion-100 dark:hover:bg-onion-950 text-stone-700 dark:text-stone-300 hover:text-onion-900 transition-colors"
            title="Decrease 1%"
          >
            -1%
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(1)}
            className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-papery-100/80 dark:bg-stone-800 hover:bg-onion-100 dark:hover:bg-onion-950 text-stone-700 dark:text-stone-300 hover:text-onion-900 transition-colors"
            title="Increase 1%"
          >
            +1%
          </button>
          <button
            type="button"
            tabIndex={-1}
            onClick={() => handleStep(5)}
            className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-papery-100/80 dark:bg-stone-800 hover:bg-onion-100 dark:hover:bg-onion-950 text-stone-700 dark:text-stone-300 hover:text-onion-900 transition-colors"
            title="Increase 5%"
          >
            +5%
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Clean Section Heading with icon, title, subtitle, and action slot.
 */
export function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  badge,
  badgeColor = 'bg-onion-50 text-onion-800 dark:bg-onion-950/60 dark:text-onion-300 border-onion-200 dark:border-onion-800',
  action,
  className = '',
}) {
  return (
    <div className={`flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-papery-200/80 dark:border-stone-800 ${className}`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-onion-100/80 to-papery-100/80 dark:from-onion-950/80 dark:to-stone-900 text-onion-800 dark:text-onion-300 border border-onion-200/80 dark:border-onion-800/60 shadow-xs">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-base font-bold text-stone-900 dark:text-white tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
