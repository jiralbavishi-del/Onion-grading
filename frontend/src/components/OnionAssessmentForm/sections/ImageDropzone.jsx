import React, { useRef, useState } from 'react';
import { UploadIcon, TrashIcon, AlertTriangleIcon, CheckCircleIcon } from '../ui/icons';

/**
 * Bento Tile 3: Interactive Photo Intake & Visual Evidence Gallery
 * Features authentic high-resolution agricultural defect inspection photographs
 * with interactive hover previews and defect tag overlays.
 */
export function ImageDropzone({
  images = [],
  onAddFiles,
  onRemoveImage,
  statusBanner = null,
  disabled = false,
  t = {},
  defectSamples = [],
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredSample, setHoveredSample] = useState(null);

  const getSampleTitle = (title) => t[{
    'Sprouted Bulb Evidence': 'sproutedBulbEvidence',
    'Pristine Export Grade A': 'pristineExportGradeA',
    'Twin / Split Bulb Defect': 'twinSplitBulbDefect',
  }[title]] || title;

  const getSampleTag = (tag) => {
    const key = {
      '[DEFECT: SPROUT (MODERATE)]': 'defectSproutMod',
      '[OK: EXPORT COMPLIANT]': 'okExportCompliant',
      '[DEFECT: DOUBLES (LIGHT)]': 'defectDoublesLight',
    }[tag];
    const text = key ? (t[key] || tag) : tag;
    return text.replace(/[\[\]]/g, '');
  };

  const getSampleClassTag = (tag) => t[{
    'TAG: CLASS II': 'tagClassII',
    'TAG: GRADE A': 'tagGradeA',
    'TAG: BORDERLINE': 'tagBorderline',
  }[tag]] || tag;

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
    <div id="section-photos" className="bento-tile p-5 sm:p-6 space-y-3.5 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="bento-header-label">{t.visualVerification || 'Visual Verification'}</span>
          <h2 className="text-base font-extrabold text-stone-900 tracking-tight flex items-center gap-1.5">
            {t.interactivePhotoUpload || 'Interactive Photo Upload'}
          </h2>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-onion-50 text-onion-700 border border-onion-200">
          {images.length} Attached
        </span>
      </div>

      {/* Accessible upload banner */}
      {statusBanner && (
        <div
          className={`p-2.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            statusBanner.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : statusBanner.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          {statusBanner.type === 'error' ? (
            <AlertTriangleIcon className="w-4 h-4 text-rose-600 shrink-0" />
          ) : (
            <CheckCircleIcon className="w-4 h-4 text-emerald-600 shrink-0" />
          )}
          <span>{statusBanner.message}</span>
        </div>
      )}

      {/* Drag & Drop Upload Area (Flex-1 fills all vertical space smoothly) */}
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`flex-1 min-h-[120px] border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-stone-50/60 via-white to-onion-50/20 hover:from-white hover:to-onion-50/40 shadow-2xs group ${
          isDragOver
            ? 'border-onion-600 bg-onion-50/90 ring-4 ring-onion-700/10'
            : 'border-stone-300/90 hover:border-onion-500'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/jpg"
          multiple
          disabled={disabled}
          onChange={handleFileInputChange}
          className="sr-only"
        />
        <div className="w-12 h-12 rounded-2xl bg-onion-100 text-onion-800 flex items-center justify-center shrink-0 border border-onion-200/80 shadow-xs group-hover:scale-110 transition-transform">
          <UploadIcon className="w-6 h-6" />
        </div>
        <div className="text-center space-y-0.5">
          <p className="text-sm font-bold text-stone-800">
            {t.dragDropImages || 'DRAG & DROP IMAGES'}{' '}
            <span className="font-normal text-stone-500 text-xs">{t.clickToBrowse || 'or click to browse'}</span>
          </p>
          <p className="text-xs text-stone-400 font-medium">
            {t.imageFormats || 'JPG, PNG, WEBP · High-res bulb inspection (Max 12MB)'}
          </p>
        </div>
      </div>

      {/* Visual Sample Cards Row with Authentic Inspection Photos and Hover Previews */}
      <div className="space-y-2 relative">
        <div className="flex items-center justify-between text-[11px] font-bold text-stone-600 uppercase tracking-wider">
          <span>{t.liveSampleIntake || 'Live Sample Intake & Reference Tags'}</span>
          <span className="text-[10px] text-stone-400 font-normal">{t.hoverToEnlarge || 'Hover to enlarge'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {defectSamples.map((sample) => {
            const isHovered = hoveredSample === sample.id;
            return (
              <div
                key={sample.id}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredSample(sample.id)}
                onMouseLeave={() => setHoveredSample(null)}
              >
                <div className="relative rounded-2xl overflow-hidden border border-stone-200/90 bg-stone-50 h-32 shadow-xs group-hover:shadow-md transition-all duration-300 mb-2 flex items-center justify-center p-1">
                  {/* Real Photographic Background */}
                  <img
                    src={sample.img}
                    alt={sample.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                
                {/* Title & Clean Text Tags */}
                <div className="flex flex-col space-y-0.5">
                  <span className="text-[12px] font-bold text-stone-900 line-clamp-1">
                    {getSampleTitle(sample.title)}
                  </span>
                  <div className="flex flex-col">
                    <span className={`text-[10px] font-bold ${
                      sample.id === 'sample_sprout' ? 'text-rose-600' :
                      sample.id === 'sample_grade_a' ? 'text-emerald-600' :
                      'text-amber-600'
                    }`}>
                      {getSampleTag(sample.tag)}
                    </span>
                    <span className="text-[10px] font-medium text-stone-500">
                      {getSampleClassTag(sample.classTag)}
                    </span>
                  </div>
                </div>

                {/* Floating Enlarge Popover on Hover */}
                {isHovered && (
                  <div className="absolute z-50 bottom-full left-0 mb-2 w-64 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-300/80 shadow-2xl pointer-events-none animate-fade-in-up">
                    <div className="aspect-4/3 w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200/80 mb-2 relative">
                      <img
                        src={sample.img}
                        alt={sample.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1.5 right-1.5 text-[8px] font-mono font-bold px-2 py-0.5 rounded bg-black/80 text-white">
                        Reference Specimen
                      </span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-bold text-xs text-stone-900">{getSampleTitle(sample.title)}</div>
                      <p className="text-[10px] text-stone-600 leading-tight">
                        {sample.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* User Uploaded Photos List */}
      {images.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-stone-200/60">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
            Uploaded Photos ({images.length})
          </span>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {images.map((img) => (
              <div
                key={img.id}
                className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border border-stone-200 bg-white group shadow-2xs"
              >
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(img.id)}
                  className="absolute top-1 right-1 p-0.5 rounded bg-black/70 text-white hover:bg-rose-600 transition-colors"
                  title="Remove image"
                >
                  <TrashIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
