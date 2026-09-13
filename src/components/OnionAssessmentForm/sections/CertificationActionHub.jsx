import React, { useState } from 'react';
import {
  CheckCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  SparklesIcon,
  FileTextIcon,
} from '../ui/icons';

/**
 * Bento Tile 6: Certification Action Hub
 * Option 3 CTA center with Approve & Certify button, Reject override, Export Certificate, and Quick Presets.
 */
export function CertificationActionHub({
  values,
  images = [],
  onSubmit,
  onReset,
  onApplyPreset,
  isSubmitting = false,
  submissionStatus = null,
  disabled = false,
  t = {},
}) {
  const [exportedNotice, setExportedNotice] = useState(false);

  const handleExportCertificate = () => {
    const certificatePayload = {
      title: 'NATIONAL ONION QUALITY ASSESSMENT CERTIFICATE',
      standard: 'APEDA / AGMARK / ISO 9001:2015',
      timestamp: new Date().toISOString(),
      traceability: {
        supplier: values.supplierName || 'Not Provided',
        contact: values.supplierPhone || 'Not Provided',
        originState: values.state || 'Maharashtra',
        lotNumber: `LOT-#${(values.state || 'MH').slice(0, 2).toUpperCase()}-2026`,
      },
      cropProfile: {
        variety: values.variety,
        declaredGrade: values.grade,
        sizeCaliber: values.sizeClass,
      },
      defectMetrics: {
        moisturePercentage: values.moisture,
        sproutingPercentage: values.sprouting,
        mechanicalDamagePercentage: values.damage,
        doublesSplitsPercentage: values.doubles,
      },
      inspector: {
        signee: values.inspectorName || 'Dr. S. Kulkarni (QA-Lead)',
        remarks: values.notes || 'Batch compliant for commercial handling.',
        status: 'VERIFIED_AND_CERTIFIED',
      },
      photosLoggedCount: images.length,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(certificatePayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Onion_QC_Certificate_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setExportedNotice(true);
    setTimeout(() => setExportedNotice(false), 3000);
  };

  return (
    <div id="section-actions" className="bento-tile p-5 sm:p-6 space-y-4 h-full flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bento-header-label">Operations & Dispatch</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            Certification Actions
          </h2>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
          Ready to Sign
        </span>
      </div>

      {/* Submission Status Alert */}
      <div aria-live="polite" aria-atomic="true">
        {submissionStatus && (
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs animate-fade-in-up ${
              submissionStatus.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}
          >
            {submissionStatus.type === 'success' ? (
              <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertTriangleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <div>
              <p className="font-bold">{submissionStatus.title}</p>
              <p className="opacity-80 text-[11px] mt-0.5">{submissionStatus.message}</p>
            </div>
          </div>
        )}

        {exportedNotice && (
          <div className="p-2.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs flex items-center gap-2 animate-fade-in-up">
            <CheckCircleIcon className="w-4 h-4 text-teal-600" />
            <span>Digital QC Certificate JSON downloaded successfully!</span>
          </div>
        )}
      </div>

      {/* Main CTA Buttons */}
      <div className="space-y-2.5">
        {/* Approve & Certify Button (Option 3 Emerald CTA) */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || isSubmitting}
          className="w-full py-3 px-4 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 hover:from-emerald-500 hover:to-teal-700 shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <RefreshCwIcon className="w-4 h-4 animate-spin" />
              <span>Verifying & Certifying...</span>
            </>
          ) : (
            <>
              <CheckCircleIcon className="w-4 h-4" />
              <span>APPROVE & CERTIFY BATCH</span>
            </>
          )}
        </button>

        {/* Reject Batch Button (Option 3 Ruby CTA) */}
        <button
          type="button"
          onClick={() => {
            onApplyPreset?.('defect');
          }}
          disabled={disabled || isSubmitting}
          className="w-full py-2.5 px-4 rounded-2xl font-bold text-xs text-rose-700 bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <AlertTriangleIcon className="w-3.5 h-3.5 text-rose-600" />
          <span>FLAG BATCH FOR RE-INSPECTION / REJECT</span>
        </button>

        {/* Export Certificate Button */}
        <button
          type="button"
          onClick={handleExportCertificate}
          disabled={disabled || isSubmitting}
          className="w-full py-2 px-4 rounded-2xl font-semibold text-xs text-stone-700 bg-white hover:bg-stone-50 border border-stone-200/80 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-2xs"
        >
          <FileTextIcon className="w-3.5 h-3.5 text-stone-500" />
          <span>EXPORT CERTIFICATE (JSON / PDF)</span>
        </button>
      </div>

      {/* Quick Presets & Reset Row */}
      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onApplyPreset?.('premium')}
            disabled={disabled}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            title="Load Grade A Export Preset"
          >
            <SparklesIcon className="w-3 h-3" />
            <span>Preset A</span>
          </button>
          <span className="text-stone-300">·</span>
          <button
            type="button"
            onClick={() => onApplyPreset?.('defect')}
            disabled={disabled}
            className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            title="Load High Defect Preset"
          >
            <span>Preset B</span>
          </button>
        </div>

        <button
          type="button"
          onClick={onReset}
          disabled={disabled || isSubmitting}
          className="text-[11px] font-medium text-stone-400 hover:text-stone-700 flex items-center gap-1 cursor-pointer"
        >
          <RefreshCwIcon className="w-3 h-3" />
          <span>{t.resetBtn || 'Reset All'}</span>
        </button>
      </div>
    </div>
  );
}
