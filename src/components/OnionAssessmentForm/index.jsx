import React, { useState, useCallback, useMemo } from 'react';
import { useSampleImages } from './hooks/useSampleImages';
import { SourceSection } from './sections/SourceSection';
import { OnionDetailsSection } from './sections/OnionDetailsSection';
import { QualitySection } from './sections/QualitySection';
import { NotesSection } from './sections/NotesSection';
import { ImageDropzone } from './sections/ImageDropzone';
import { SummaryCard } from './sections/SummaryCard';
import { TRANSLATIONS } from './translations';
import {
  MapPinIcon,
  SlidersIcon,
  TagIcon,
  FileTextIcon,
  CameraIcon,
  SparklesIcon,
  AlertTriangleIcon,
} from './ui/icons';

const DEFAULT_FORM_VALUES = {
  supplierName: '',
  supplierPhone: '',
  state: 'Maharashtra',
  variety: 'nashik_red',
  grade: 'Grade A',
  sizeClass: 'Medium',
  moisture: 13.5,
  sprouting: 0,
  damage: 2,
  doubles: 1,
  inspectorName: '',
  notes: '',
};

/**
 * Interactive Quick-Nav Pills with SVG icons and completion state
 */
function QuickNavPills({ steps, onSelectStep }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full scrollbar-none">
      {steps.map((step) => {
        const StepIcon = step.icon;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => onSelectStep(step.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              step.filled
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70 shadow-2xs'
                : 'bg-white/80 text-stone-600 border border-stone-200/70 hover:bg-white hover:text-stone-900 shadow-2xs'
            }`}
          >
            <StepIcon className="w-3.5 h-3.5 shrink-0 opacity-80" />
            <span>{step.label}</span>
            {step.filled && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-0.5" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function OnionAssessmentForm({
  initialValues = {},
  onComplete,
  className = '',
  initialLang = 'en',
  lang: controlledLang,
  onLangChange,
}) {
  const [internalLang, setInternalLang] = useState(initialLang);
  const lang = controlledLang || internalLang;
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const [formValues, setFormValues] = useState({
    ...DEFAULT_FORM_VALUES,
    ...initialValues,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const {
    images,
    addFiles,
    removeImage,
    clearImages,
    statusBanner: imageStatusBanner,
    MAX_FILE_SIZE_BYTES,
  } = useSampleImages();

  const handleFieldChange = useCallback((fieldName, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

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

  const handleSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();

    const isValid = validateForm();
    if (!isValid) {
      setSubmissionStatus({
        type: 'error',
        title: t.valErrorsFound || 'Validation Incomplete',
        message: t.valFixFields || 'Please review highlighted fields before proceeding.',
      });
      return;
    }

    setIsSubmitting(true);
    setSubmissionStatus(null);

    setTimeout(() => {
      setIsSubmitting(false);

      const computedScore = Math.max(
        0,
        100 -
          (Number(formValues.moisture || 0) > 14 ? (Number(formValues.moisture) - 14) * 3 : 0) -
          Number(formValues.sprouting || 0) * 3 -
          Number(formValues.damage || 0) * 2 -
          Number(formValues.doubles || 0) * 1.5
      );

      const resultPayload = {
        ...formValues,
        computedScore: Math.round(computedScore),
        timestamp: new Date().toISOString(),
        lotId: `IN-ONION-${Date.now().toString().slice(-6)}`,
        photoCount: images.length,
      };

      setSubmissionStatus({
        type: 'success',
        title: t.subSuccessTitle || 'Assessment Certified & Export-Approved',
        message: `${t.subSuccessMsg || 'Lot verified'} (Lot #${resultPayload.lotId})`,
      });

      if (onComplete) {
        onComplete(resultPayload);
      }
    }, 900);
  };

  const handleReset = () => {
    setFormValues(DEFAULT_FORM_VALUES);
    setErrors({});
    setSubmissionStatus(null);
    clearImages();
  };

  const steps = useMemo(() => [
    {
      id: 'source',
      label: '1. Origin',
      icon: MapPinIcon,
      filled: !!(formValues.supplierName && formValues.supplierPhone && formValues.state),
    },
    {
      id: 'quality',
      label: '2. Defects',
      icon: SlidersIcon,
      filled: formValues.moisture !== '' && formValues.sprouting !== '',
    },
    {
      id: 'details',
      label: '3. Grading',
      icon: TagIcon,
      filled: !!(formValues.variety && formValues.grade && formValues.sizeClass),
    },
    {
      id: 'notes',
      label: '4. Sign-off',
      icon: FileTextIcon,
      filled: !!(formValues.inspectorName),
    },
    {
      id: 'photos',
      label: '5. Photos',
      icon: CameraIcon,
      filled: images.length > 0,
    },
  ], [formValues, images]);

  const completedCount = steps.filter((s) => s.filled).length;

  const handleSelectStep = (stepId) => {
    const el = document.getElementById(`section-${stepId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      el.classList.add('ring-2', 'ring-onion-500/50');
      setTimeout(() => el.classList.remove('ring-2', 'ring-onion-500/50'), 1500);
    }
  };

  return (
    <div className={`w-full max-w-7xl mx-auto space-y-5 sm:space-y-6 ${className}`}>
      {/* Header with Protocol Badge & Quick Presets */}
      <header className="animate-fade-in-up flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.12em] bg-onion-50/80 text-onion-700 border border-onion-200/50 font-display">
              {t.qcProtocol || 'QC Protocol'}
            </span>
            <span className="text-[11px] text-stone-400 font-mono tabular-nums">
              Lot # {formValues.state ? formValues.state.slice(0, 2).toUpperCase() : 'IN'}-{new Date().getFullYear()}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              {completedCount}/{steps.length} Complete
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display text-stone-900 tracking-tight">
            {t.pageTitle || 'Onion Field Quality Assessment'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 font-medium max-w-lg">
            {t.pageSubtitle || 'Standardized grading, defect quantification, and certified sign-off.'}
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/70 backdrop-blur-md border border-stone-200/60 shadow-xs self-start sm:self-end">
          <button
            type="button"
            onClick={() => {
              setFormValues((prev) => ({
                ...prev,
                supplierName: 'Sahyadri Agro Producers',
                supplierPhone: '+91 98220 12345',
                state: 'Maharashtra',
                variety: 'nashik_red',
                grade: 'Grade A',
                sizeClass: 'Medium',
                moisture: 12.8,
                sprouting: 0,
                damage: 1.5,
                doubles: 0.5,
                inspectorName: 'Dr. V. M. Deshmukh (QC-Lead)',
                notes: 'Cured skin in pristine condition. Well dried necks, high bulb firmness suitable for long-haul reefer export.',
              }));
              setErrors({});
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-emerald-700 bg-emerald-50/80 hover:bg-emerald-100 border border-emerald-200/60 transition-all active:scale-95 shadow-2xs"
            title="Load ideal Grade A export sample"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.loadPremium || 'Premium Export'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setFormValues((prev) => ({
                ...prev,
                supplierName: 'Kalyan Mandi Trader Batch 4',
                supplierPhone: '+91 94231 99880',
                state: 'Karnataka',
                variety: 'bellary_red',
                grade: 'Grade C',
                sizeClass: 'Small',
                moisture: 17.5,
                sprouting: 8.5,
                damage: 12.0,
                doubles: 6.0,
                inspectorName: 'K. S. Patil',
                notes: 'High ambient moisture during transport. Visible skin rupture.',
              }));
              setErrors({});
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-amber-700 bg-amber-50/80 hover:bg-amber-100 border border-amber-200/60 transition-all active:scale-95 shadow-2xs"
            title="Load high defect sample"
          >
            <AlertTriangleIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>{t.loadDefect || 'Defect Sample'}</span>
          </button>
        </div>
      </header>

      {/* Quick Navigation Pills with SVG icons */}
      <div className="flex items-center justify-between gap-2 pb-1">
        <QuickNavPills
          steps={steps}
          onSelectStep={handleSelectStep}
        />
        <span className="text-[11px] text-stone-400 font-medium hidden md:inline-block">
          Click any section above to jump directly
        </span>
      </div>

      {/* Form Workspace: DUAL COLUMN BALANCED WORKFLOW */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (Batch & Physical Profile): lg:col-span-7 */}
          <div className="lg:col-span-7 space-y-6">
            {/* Section 01: Source & Supplier Traceability */}
            <div className="animate-fade-in-up animate-delay-1">
              <SourceSection
                values={formValues}
                onChange={handleFieldChange}
                errors={errors}
                disabled={isSubmitting}
                t={t}
              />
            </div>

            {/* Section 02: Crop Details & Classification */}
            <div className="animate-fade-in-up animate-delay-2">
              <OnionDetailsSection
                values={formValues}
                onChange={handleFieldChange}
                errors={errors}
                disabled={isSubmitting}
                t={t}
              />
            </div>

            {/* Section 05: Photographic Evidence */}
            <div className="animate-fade-in-up animate-delay-3">
              <ImageDropzone
                images={images}
                onAddFiles={addFiles}
                onRemoveImage={removeImage}
                statusBanner={imageStatusBanner}
                maxFileSize={MAX_FILE_SIZE_BYTES}
                disabled={isSubmitting}
                t={t}
              />
            </div>
          </div>

          {/* Right Column (Quality Lab & Sign-off): lg:col-span-5 */}
          <div className="lg:col-span-5 space-y-6">
            {/* Section 03: Quality & Defect Quantitative Analysis (Top of right column!) */}
            <div className="animate-fade-in-up animate-delay-1">
              <QualitySection
                values={formValues}
                onChange={handleFieldChange}
                errors={errors}
                disabled={isSubmitting}
                t={t}
              />
            </div>

            {/* Section 04: Inspector Notes & Sign-off */}
            <div className="animate-fade-in-up animate-delay-2">
              <NotesSection
                values={formValues}
                onChange={handleFieldChange}
                errors={errors}
                disabled={isSubmitting}
                t={t}
              />
            </div>

            {/* Quality Scorecard & Final Certification Submission */}
            <div className="animate-fade-in-up animate-delay-3">
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
      </form>
    </div>
  );
}
