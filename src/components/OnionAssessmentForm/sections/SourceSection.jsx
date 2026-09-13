import React from 'react';
import { Field, TextInput, Select, SectionHeading } from '../ui/FormPrimitives';
import { MapPinIcon, PhoneIcon, UserIcon } from '../ui/icons';
import { PRODUCING_STATES, sanitizePhone } from '../constants';

/**
 * Section 1: Source & Supplier Identification (Streamlined to most important fields)
 * Enforces phone sanitization (digits, spaces, +, -, max 15 chars).
 */
export function SourceSection({
  values,
  onChange,
  errors = {},
  disabled = false,
  t = {},
}) {
  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    const sanitized = sanitizePhone(raw);
    onChange('supplierPhone', sanitized);
  };

  return (
    <div className="glass-card rounded-3xl border border-papery-200/90 dark:border-onion-900/60 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:border-onion-300/80 dark:hover:border-onion-800 space-y-6">
      <SectionHeading
        icon={MapPinIcon}
        title={t.sec1Title || 'Source & Supplier Traceability'}
        subtitle={t.sec1Sub || 'Record farm origin and verified contact credentials'}
        badge={t.sec1Badge || 'Section 01'}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* 1. Supplier / Farmer Name */}
        <Field
          id="supplier-name"
          label={t.supplierName || 'Supplier / Grower Name'}
          required
          error={errors.supplierName}
        >
          <TextInput
            id="supplier-name"
            name="supplierName"
            value={values.supplierName || ''}
            onChange={(e) => onChange('supplierName', e.target.value)}
            placeholder={t.supplierNamePlh || 'e.g. Ramesh Patil / Sahyadri Farms'}
            icon={UserIcon}
            disabled={disabled}
            error={errors.supplierName}
          />
        </Field>

        {/* 2. Supplier Contact Number (Sanitized: digits, spaces, +, - only, max 15) */}
        <Field
          id="supplier-phone"
          label={t.supplierPhone || 'Supplier Contact Number'}
          required
          error={errors.supplierPhone}
          hint={t.supplierPhoneHint || 'Digits, +, - only (Max 15 chars)'}
          labelRight={
            <span className="text-[11px] font-mono text-stone-400 dark:text-stone-500 font-semibold">
              {(values.supplierPhone || '').length}/15
            </span>
          }
        >
          <TextInput
            id="supplier-phone"
            name="supplierPhone"
            value={values.supplierPhone || ''}
            onChange={handlePhoneChange}
            placeholder={t.supplierPhonePlh || 'e.g. +91 98230 12345'}
            icon={PhoneIcon}
            disabled={disabled}
            error={errors.supplierPhone}
            maxLength={15}
            inputMode="tel"
          />
        </Field>

        {/* 3. Producing State */}
        <Field
          id="source-state"
          label={t.producingState || 'Producing State'}
          required
          error={errors.state}
        >
          <Select
            id="source-state"
            name="state"
            value={values.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            options={PRODUCING_STATES.map((s) => ({ value: s, label: s }))}
            placeholder={t.statePlh || 'Select origin state'}
            disabled={disabled}
            error={errors.state}
          />
        </Field>
      </div>
    </div>
  );
}
