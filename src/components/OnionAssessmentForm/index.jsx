import React, { useState, useCallback } from 'react';
import { useSampleImages } from './hooks/useSampleImages';
import { SourceSection } from './sections/SourceSection';
import { OnionDetailsSection } from './sections/OnionDetailsSection';
import { QualitySection } from './sections/QualitySection';
import { NotesSection } from './sections/NotesSection';
import { ImageDropzone } from './sections/ImageDropzone';
import { SummaryCard } from './sections/SummaryCard';
import { LANGUAGES, TRANSLATIONS } from './translations';
import { ChevronDownIcon } from './ui/icons';

/**
 * Streamlined essential form values (unnecessary clutter removed).
 */
const DEFAULT_FORM_VALUES = {
  // Section 1: Source & Supplier
  supplierName: '',
  supplierPhone: '',
  state: 'Maharashtra',

  // Section 2: Crop Details
  variety: 'nashik_red',
  grade: 'Grade A',
  sizeClass: 'Medium',

  // Section 3: Essential Quality Percentages (Clamped 0-100)
  moisture: 13.5,
  sprouting: 0,
  damage: 2,
  doubles: 1,

  // Section 4: Notes & Certifier
  inspectorName: '',
  notes: '',
};

/**
 * OnionAssessmentForm
 *
 * Streamlined to most important fields:
 * - Supplier Name, Phone (sanitized), State
 * - Variety, GradePicker, SizePicker
 * - Moisture %, Sprouting %, Damage %, Doubles % (clamped 0-100)
 * - Photo Evidence (12MB cap, URL revocation)
 * - Inspector Name & Notes
 * - Full Multi-Language Dropdown (English, Marathi, Hindi, Gujarati)
 */
export default function OnionAssessmentForm({
  initialValues = {},
  onComplete,
  className = '',
  initialLang = 'en',
}) {
  const [lang, setLang] = useState(initialLang);
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [formValues, setFormValues] = useState({
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  // Hook managing photo evidence lifecycle, memory revocation & size caps
  const {
    images,
    addFiles,
    removeImage,
    clearImages,
    statusBanner: imageStatusBanner,
    MAX_FILE_SIZE_BYTES,
  } = useSampleImages();

  /**
   * Universal field change updater.
   */
  const handleFieldChange = useCallback((fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Clear field-specific error when user modifies it
    setErrors((prev) => {
      if (prev[fieldName]) {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      }
      return prev;
    });

    if (submissionStatus) {
      setSubmissionStatus(null);
    }
  }, [submissionStatus]);

  /**
   * Validates essential fields only.
   */
  const validateForm = () => {
    const errs = {};

    if (!formValues.supplierName?.trim()) {
      errs.supplierName = t.valNameReq || 'Supplier name is required.';
    }

    if (!formValues.supplierPhone?.trim()) {
      errs.supplierPhone = t.valPhoneReq || 'Contact number is required (min 8 digits).';
    } else if (formValues.supplierPhone.replace(/[^0-9]/g, '').length < 8) {
      errs.supplierPhone = t.valPhoneReq || 'Contact number must contain at least 8 digits.';
    }

    if (!formValues.state) {
      errs.state = t.valStateReq || 'Producing state is required.';
    }

    if (!formValues.variety) {
      errs.variety = t.valVarietyReq || 'Cultivar variety selection is required.';
    }

    if (formValues.moisture === '' || formValues.moisture === undefined) {
      errs.moisture = 'Moisture percentage is required.';
    }

    if (formValues.sprouting === '' || formValues.sprouting === undefined) {
      errs.sprouting = 'Sprouting percentage is required.';
    }

    if (formValues.damage === '' || formValues.damage === undefined) {
      errs.damage = 'Damage percentage is required.';
    }

    if (formValues.doubles === '' || formValues.doubles === undefined) {
      errs.doubles = 'Doubles percentage is required.';
    }

    if (!formValues.inspectorName?.trim()) {
      errs.inspectorName = t.valInspectorReq || 'Inspector name is required.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  /**
   * Submission handler.
   */
  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setSubmissionStatus({
        type: 'error',
        title: 'Validation Incomplete',
        message: t.valErrors || 'Please resolve highlighted errors across assessment sections.',
      });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const payload = {
        ...formValues,
        imagesCount: images.length,
        language: lang,
        submittedAt: new Date().toISOString(),
      };

      setSubmissionStatus({
        type: 'success',
        title: t.valSuccess || 'Assessment Certified & Submitted',
        message: `${formValues.supplierName} - Grade: ${formValues.grade}`,
      });

      if (onComplete) {
        onComplete(payload);
      }
    }, 600);
  };

  /**
   * Reset form and cleanup all object URLs.
   */
  const handleReset = () => {
    if (window.confirm(t.confirmReset || 'Reset all entered onion assessment fields and clear attached photos?')) {
      setFormValues(DEFAULT_FORM_VALUES);
      setErrors({});
      clearImages();
      setSubmissionStatus(null);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-6 sm:space-y-8 ${className}`}>
      {/* Streamlined Clean Header with Language Dropdown Menu */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-stone-900 dark:text-white tracking-tight">
            {t.pageTitle || 'Onion Field Quality Assessment'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1 font-medium">
            {t.pageSubtitle || 'Standardized grading, defect quantification, and certified consignment sign-off.'}
          </p>
        </div>

        {/* Language Selection Dropdown Menu */}
        <div className="flex items-center gap-2 p-1.5 rounded-xl bg-white/90 dark:bg-stone-900/90 border border-papery-200/90 dark:border-stone-800 shadow-2xs backdrop-blur-md self-start sm:self-auto shrink-0">
          <span className="text-xs text-stone-500 pl-2 select-none">🌐</span>
          <div className="relative">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              aria-label={t.langSelect || 'Select language'}
              className="appearance-none font-bold text-xs bg-onion-50/90 dark:bg-onion-950/80 text-onion-900 dark:text-onion-200 pl-2.5 pr-7 py-1.5 rounded-lg border border-onion-200/80 dark:border-onion-800/80 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-onion-700/30 transition-all hover:bg-onion-100"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.flag} {l.native} ({l.label})
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-onion-700 dark:text-onion-300">
              <ChevronDownIcon className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Grid: Form Sections (Left) & Sticky Summary Card (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Streamlined Form Sections */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="lg:col-span-8 space-y-8"
        >
          {/* Section 1: Source (Supplier Name, Phone, State) */}
          <SourceSection
            values={formValues}
            onChange={handleFieldChange}
            errors={errors}
            disabled={isSubmitting}
            t={t}
          />

          {/* Section 2: Crop Details (Variety, GradePicker, SizePicker) */}
          <OnionDetailsSection
            values={formValues}
            onChange={handleFieldChange}
            errors={errors}
            disabled={isSubmitting}
            t={t}
          />

          {/* Section 3: Essential 4 Clamped % Fields (Moisture, Sprouting, Damage, Doubles) */}
          <QualitySection
            values={formValues}
            onChange={handleFieldChange}
            errors={errors}
            disabled={isSubmitting}
            t={t}
          />

          {/* Section 4: Inspector Notes & Name */}
          <NotesSection
            values={formValues}
            onChange={handleFieldChange}
            errors={errors}
            disabled={isSubmitting}
            t={t}
          />

          {/* Section 5: Photo Evidence Dropzone (12MB Cap & URL Revoke) */}
          <ImageDropzone
            images={images}
            onAddFiles={addFiles}
            onRemoveImage={removeImage}
            statusBanner={imageStatusBanner}
            maxFileSize={MAX_FILE_SIZE_BYTES}
            disabled={isSubmitting}
            t={t}
          />
        </form>

        {/* Right Column: Sticky Summary & Orchestration Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-6">
          <SummaryCard
            values={formValues}
            images={images}
            onSubmit={handleSubmit}
            onReset={handleReset}
            isSubmitting={isSubmitting}
            submissionStatus={submissionStatus}
            disabled={isSubmitting}
            t={t}
          />
        </div>
      </div>
    </div>
  );
}
