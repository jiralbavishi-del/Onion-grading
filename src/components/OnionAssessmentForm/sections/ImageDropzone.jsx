import React, { useState, useRef } from 'react';
import { SectionHeading } from '../ui/FormPrimitives';
import {
  CameraIcon,
  UploadIcon,
  TrashIcon,
  AlertTriangleIcon,
  CheckCircleIcon,
  InfoIcon,
} from '../ui/icons';

/**
 * Section 5: Photographic Sample Evidence & Dropzone
 * Enforces:
 *  - 12 MB size restriction
 *  - Accessible status announcements with aria-live="polite"
 *  - Individual photo removal with object-URL revocation
 */
export function ImageDropzone({
  images = [],
  onAddFiles,
  onRemoveImage,
  statusBanner,
  disabled = false,
  t = {},
}) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="glass-card rounded-3xl border border-papery-200/90 dark:border-onion-900/60 p-7 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] transition-all hover:border-onion-300/80 dark:hover:border-onion-800 space-y-7">
      <SectionHeading
        icon={CameraIcon}
        title={t.sec5Title || 'Sample Photographic Evidence'}
        subtitle={t.sec5Sub || 'Upload photos of bulb cross-sections, packaging, and scale condition (Max 12MB each)'}
        badge={t.sec5Badge || 'Section 05'}
        action={
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-onion-50/80 dark:bg-onion-950/80 text-onion-900 dark:text-onion-200 border border-onion-200/80 dark:border-onion-800/60 shadow-2xs">
            {images.length} {t.photosLogged || 'photo(s) logged'}
          </span>
        }
      />

      {/* Accessible Live Region for File Upload Banners */}
      <div aria-live="polite" aria-atomic="true">
        {statusBanner && (
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all duration-200 ${
              statusBanner.type === 'error'
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200'
                : statusBanner.type === 'warning'
                ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-200'
                : 'bg-onion-50 dark:bg-onion-950/60 border-onion-200 dark:border-onion-900 text-onion-900 dark:text-onion-200'
            }`}
          >
            {statusBanner.type === 'error' ? (
              <AlertTriangleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            ) : statusBanner.type === 'warning' ? (
              <AlertTriangleIcon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircleIcon className="w-5 h-5 text-onion-700 shrink-0 mt-0.5" />
            )}
            <div className="text-xs font-medium">{statusBanner.message}</div>
          </div>
        )}
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-onion-600 bg-onion-50/70 dark:bg-onion-950/50 ring-4 ring-onion-700/15'
            : 'border-papery-300 dark:border-onion-900/60 hover:border-onion-500 dark:hover:border-onion-700 bg-gradient-to-b from-papery-50/40 to-onion-50/20 dark:from-[#190C13] dark:to-stone-900/60'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          id="onion-photo-upload"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/jpg"
          multiple
          disabled={disabled}
          onChange={handleFileInputChange}
          className="sr-only"
        />

        <div className="flex flex-col items-center justify-center space-y-2.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-onion-100 to-papery-100 dark:from-onion-950 dark:to-stone-900 text-onion-800 dark:text-onion-300 shadow-xs border border-onion-200/80 dark:border-onion-800">
            <UploadIcon className="w-7 h-7" />
          </div>

          <div>
            <span className="font-bold text-sm text-stone-800 dark:text-stone-200 hover:text-onion-700 dark:hover:text-onion-400 hover:underline">
              {t.dropText || 'Click to select sample images'}
            </span>{' '}
            <span className="text-sm text-stone-500">{t.orDragText || 'or drag and drop photos here'}</span>
          </div>

          <p className="text-xs text-stone-400 dark:text-stone-500">
            {t.dropNotice || 'JPEG, PNG, WEBP supported · Strict 12 MB size cap enforced'}
          </p>
        </div>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Attached Evidence ({images.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Revoking image releases object URL memory immediately
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs flex flex-col"
              >
                <div className="aspect-square w-full bg-slate-200 dark:bg-slate-900 relative overflow-hidden">
                  <img
                    src={img.previewUrl}
                    alt={`Sample photo: ${img.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                    <span className="text-[10px] text-white font-medium truncate">
                      {img.sizeFormatted}
                    </span>
                  </div>
                </div>

                <div className="p-2 flex items-center justify-between gap-1 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate" title={img.name}>
                      {img.name}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {img.uploadedAt || 'Uploaded'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(img.id);
                    }}
                    disabled={disabled}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-rose-500/40"
                    title={`Delete photo ${img.name} and revoke object URL`}
                    aria-label={`Remove photo ${img.name}`}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
