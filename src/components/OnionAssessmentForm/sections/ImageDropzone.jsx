import React, { useRef, useState } from 'react';
import { SectionHeading } from '../ui/FormPrimitives';
import { CameraIcon, UploadIcon, TrashIcon, AlertTriangleIcon, CheckCircleIcon } from '../ui/icons';

/**
 * Section 5: Photographic Evidence Upload
 * Drag-and-drop file upload with preview, size cap enforcement, and object URL memory cleanup.
 */
export function ImageDropzone({
  images = [],
  onAddFiles,
  onRemoveImage,
  statusBanner = null,
  maxFileSize = 12 * 1024 * 1024,
  disabled = false,
  t = {},
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (disabled) return;

    if (e.dataTransfer?.files?.length) {
      onAddFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files?.length) {
      onAddFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div id="section-photos" className="glass-card rounded-3xl p-5 sm:p-6 space-y-4">
      <SectionHeading
        icon={CameraIcon}
        title={t.sec5Title || 'Sample Photographic Evidence'}
        subtitle={t.sec5Sub || 'Photos of bulb cross-sections, packaging, and scale condition (Max 12MB each)'}
        badge={t.sec5Badge || 'Section 05'}
        action={
          <span className="text-xs font-bold px-3 py-1 rounded-xl bg-onion-50/90 text-onion-800 border border-onion-200/80 shadow-2xs">
            {images.length} {t.photosLogged || 'photo(s)'}
          </span>
        }
      />

      {/* Accessible Live Region for File Upload Banners */}
      <div aria-live="polite" aria-atomic="true">
        {statusBanner && (
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all duration-200 ${
              statusBanner.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : statusBanner.type === 'warning'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-onion-50 border-onion-200 text-onion-900'
            }`}
          >
            {statusBanner.type === 'error' ? (
              <AlertTriangleIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : statusBanner.type === 'warning' ? (
              <AlertTriangleIcon className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircleIcon className="w-4 h-4 text-onion-700 shrink-0 mt-0.5" />
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
        className={`relative border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all duration-200 ${
          isDragOver
            ? 'border-onion-600 bg-onion-50/70 ring-4 ring-onion-700/15'
            : 'border-stone-200/90 hover:border-onion-400 bg-gradient-to-b from-white/60 to-papery-50/40 hover:bg-white/90'
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

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-2.5 rounded-2xl bg-gradient-to-br from-onion-100 to-papery-100 text-onion-800 shadow-xs border border-onion-200/80">
            <UploadIcon className="w-5 h-5" />
          </div>

          <div>
            <span className="font-bold text-xs text-stone-800 hover:text-onion-700 hover:underline">
              {t.dropText || 'Click to select sample images'}
            </span>{' '}
            <span className="text-xs text-stone-500">{t.orDragText || 'or drag and drop here'}</span>
          </div>

          <p className="text-[11px] text-stone-400">
            {t.dropNotice || 'JPEG, PNG, WEBP · Max 12 MB per image'}
          </p>
        </div>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
              Attached Photos ({images.length})
            </h4>
            <span className="text-[10px] text-stone-400">
              Instant memory cleanup on removal
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {images.map((img) => (
              <div
                key={img.id}
                className="group relative rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs flex flex-col"
              >
                <div className="aspect-square w-full bg-stone-100 relative overflow-hidden">
                  <img
                    src={img.previewUrl}
                    alt={`Sample photo: ${img.name}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                    <span className="text-[9px] text-white font-medium truncate">
                      {img.sizeFormatted}
                    </span>
                  </div>
                </div>

                <div className="p-1.5 flex items-center justify-between gap-1 bg-white border-t border-stone-100">
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium text-stone-800 truncate" title={img.name}>
                      {img.name}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveImage(img.id);
                    }}
                    disabled={disabled}
                    className="p-1 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors focus:outline-hidden"
                    title={`Delete photo ${img.name}`}
                    aria-label={`Remove photo ${img.name}`}
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
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
