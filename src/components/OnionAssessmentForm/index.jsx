import React, { useState, useCallback, useMemo } from 'react';
import { useSampleImages } from './hooks/useSampleImages';
import { OriginTraceabilitySection } from './sections/OriginTraceabilitySection';
import { BentoGradeBadge } from './ui/BentoGradeBadge';
import { QualitySection } from './sections/QualitySection';
import { ImageDropzone } from './sections/ImageDropzone';
import { ExpertOpinionSection } from './sections/ExpertOpinionSection';
import { TRANSLATIONS } from './translations';
import {
  MapPinIcon,
  SlidersIcon,
  TagIcon,
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
 * Bento Box Quick Step Indicator Pills
 */
function BentoQuickNavPills({ steps, onSelectStep }) {
  return (
    <div className="w-full flex justify-center py-1">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-2 sm:gap-2.5 w-full sm:w-auto">
        {steps.map((step) => {
          const StepIcon = step.icon;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer shadow-xs active:scale-95 ${
                step.filled
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100 hover:border-emerald-400'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50 hover:text-stone-900'
              }`}
            >
              <StepIcon className="w-3.5 h-3.5 shrink-0 opacity-85" />
              <span className="truncate">{step.label}</span>
              {step.filled && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function OnionAssessmentForm({
  initialValues = {},
  onComplete,
  className = '',
  initialLang = 'en',
  lang: controlledLang,
}) {
  const lang = controlledLang || initialLang;
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
          (Number(formValues.moisture || 0) > 14 ? (Number(formValues.moisture) - 14) * 4.0 : 0) -
          Number(formValues.sprouting || 0) * 2.5 -
          Number(formValues.damage || 0) * 1.5 -
          Number(formValues.doubles || 0) * 1.0
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
    }, 800);
  };

  const handleReset = () => {
    setFormValues(DEFAULT_FORM_VALUES);
    setErrors({});
    setSubmissionStatus(null);
    clearImages();
  };

  const handleApplyPreset = (type) => {
    if (type === 'premium') {
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
    } else if (type === 'defect') {
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
        notes: 'High ambient moisture during transport. Visible skin rupture and secondary shoot emergence.',
      }));
      setErrors({});
    }
  };

  const steps = useMemo(() => [
    {
      id: 'source',
      label: t.step1 || '1. Traceability',
      icon: MapPinIcon,
      filled: !!(formValues.supplierName && formValues.supplierPhone && formValues.state),
    },
    {
      id: 'scorecard',
      label: t.step2 || '2. Certification',
      icon: TagIcon,
      filled: !!(formValues.variety && formValues.grade && formValues.sizeClass),
    },
    {
      id: 'photos',
      label: t.step3 || '3. Photo Evidence',
      icon: CameraIcon,
      filled: images.length > 0,
    },
    {
      id: 'quality',
      label: t.step4 || '4. Defect Lab',
      icon: SlidersIcon,
      filled: formValues.moisture !== '' && formValues.sprouting !== '',
    },
  ], [formValues, images, t]);

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
      {/* Bento Header & Quick Nav */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-stone-200/60">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.12em] bg-onion-50 text-onion-800 border border-onion-200/60 font-display">
              {t.bentoQcArchitecture || 'Bento QC Architecture'}
            </span>
            <span className="text-[11px] text-stone-400 font-mono tabular-nums">
              {t.protocol || 'PROTOCOL #APEDA-AGMARK-2026'}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              {completedCount}/{steps.length} {t.modulesVerified || 'Modules Verified'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black font-display text-stone-900 tracking-tight">
            {t.pageTitle || 'Onion Quality Assessment & Grading Dashboard'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 font-medium max-w-xl">
            {t.pageSubtitle || 'Standardized grading, defect quantification, and certified sign-off in modular Bento style.'}
          </p>
        </div>
      </header>

      {/* Submission Status Alert */}
      {submissionStatus && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm animate-fade-in-up ${
            submissionStatus.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 shadow-sm'
              : 'bg-rose-50 text-rose-900 border-rose-200 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <span className="font-bold">{submissionStatus.title}:</span>
            <span>{submissionStatus.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setSubmissionStatus(null)}
            className="text-xs font-bold px-2 py-1 rounded-lg bg-black/5 hover:bg-black/10"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Nav Module Navigation */}
      <div className="w-full flex justify-center pb-1">
        <BentoQuickNavPills steps={steps} onSelectStep={handleSelectStep} />
      </div>

      {/* BENTO BOX GRID LAYOUT */}
      <form onSubmit={handleSubmit} noValidate>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          
          {/* ROW 1 LEFT: Origin & Traceability (Span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <OriginTraceabilitySection
              values={formValues}
              onChange={handleFieldChange}
              errors={errors}
              disabled={isSubmitting}
              t={t}
            />
          </div>

          {/* ROW 1 RIGHT: Grade Badge & Quality Sliders (Span 5) */}
          <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6 h-full">
            <BentoGradeBadge
              values={formValues}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              t={t}
            />
            
            <QualitySection
              values={formValues}
              onChange={handleFieldChange}
              disabled={isSubmitting}
              t={t}
            />
          </div>

          {/* ROW 2 LEFT: Photos & Visual Intake (Span 7) */}
          <div className="lg:col-span-7 flex flex-col">
            <ImageDropzone
              images={images}
              onAddFiles={addFiles}
              onRemoveImage={removeImage}
              statusBanner={imageStatusBanner}
              disabled={isSubmitting}
              t={t}
            />
          </div>

          {/* ROW 2 RIGHT: Final Quality & Expert Opinion (Span 5) */}
          <div className="lg:col-span-5 flex flex-col">
            <ExpertOpinionSection 
              disabled={isSubmitting} 
              onSave={handleSubmit} 
              t={t}
            />
          </div>
          
        </div>
      </form>
    </div>
  );
}
