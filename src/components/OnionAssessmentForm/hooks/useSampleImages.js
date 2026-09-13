import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MAX_FILE_SIZE_BYTES,
  ACCEPTED_IMAGE_MIME_TYPES,
  formatBytes,
} from '../constants';

/**
 * Custom hook to manage onion field sample photos.
 * Solves object-URL memory leaks by:
 *  1. Calling URL.revokeObjectURL() immediately when any individual image is removed.
 *  2. Revoking all remaining active object-URLs when the component unmounts.
 * Enforces security:
 *  1. File-size cap (12MB) preventing oversized files from freezing the browser tab.
 *  2. MIME type verification.
 */
export function useSampleImages(initialImages = []) {
  const [images, setImages] = useState(initialImages);
  const [statusBanner, setStatusBanner] = useState(null);

  // Track all active object URLs in a ref so we can revoke them on unmount
  const activeUrlsRef = useRef(new Set());

  // Cleanup on unmount: revoke every URL still registered
  useEffect(() => {
    const urls = activeUrlsRef.current;
    return () => {
      urls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch (err) {
          console.warn('Failed to revoke object URL on unmount:', err);
        }
      });
      urls.clear();
    };
  }, []);

  /**
   * Validates and adds uploaded files.
   * @param {FileList|File[]} fileList
   */
  const addFiles = useCallback((fileList) => {
    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);
    const newItems = [];
    const rejectedFiles = [];

    filesArray.forEach((file) => {
      // 1. Validate MIME type
      const isMimeValid =
        file.type.startsWith('image/') ||
        ACCEPTED_IMAGE_MIME_TYPES.includes(file.type.toLowerCase());

      if (!isMimeValid) {
        rejectedFiles.push({
          name: file.name,
          reason: 'Invalid file format (only images supported)',
        });
        return;
      }

      // 2. Validate file-size cap (12 MB)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        rejectedFiles.push({
          name: file.name,
          reason: `Exceeds 12MB limit (${formatBytes(file.size)})`,
        });
        return;
      }

      // 3. Create object URL and track it
      const previewUrl = URL.createObjectURL(file);
      activeUrlsRef.current.add(previewUrl);

      newItems.push({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        name: file.name,
        size: file.size,
        sizeFormatted: formatBytes(file.size),
        previewUrl,
        uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    });

    if (newItems.length > 0) {
      setImages((prev) => [...prev, ...newItems]);
    }

    // Set accessible status announcement
    if (rejectedFiles.length > 0 && newItems.length > 0) {
      setStatusBanner({
        type: 'warning',
        message: `Added ${newItems.length} image(s). ${rejectedFiles.length} file(s) rejected: ${rejectedFiles.map((f) => `${f.name} (${f.reason})`).join(', ')}.`,
        timestamp: Date.now(),
      });
    } else if (rejectedFiles.length > 0) {
      setStatusBanner({
        type: 'error',
        message: `Upload rejected: ${rejectedFiles.map((f) => `${f.name} (${f.reason})`).join(', ')}.`,
        timestamp: Date.now(),
      });
    } else {
      setStatusBanner({
        type: 'success',
        message: `Successfully uploaded ${newItems.length} photo(s).`,
        timestamp: Date.now(),
      });
    }
  }, []);

  /**
   * Removes a single image and immediately revokes its object URL.
   * @param {string} id
   */
  const removeImage = useCallback((id) => {
    setImages((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target && target.previewUrl) {
        try {
          URL.revokeObjectURL(target.previewUrl);
          activeUrlsRef.current.delete(target.previewUrl);
        } catch (err) {
          console.warn('Error revoking object URL:', err);
        }
      }
      return prev.filter((item) => item.id !== id);
    });

    setStatusBanner({
      type: 'info',
      message: 'Photo removed from assessment.',
      timestamp: Date.now(),
    });
  }, []);

  /**
   * Clears all images, revoking each URL.
   */
  const clearImages = useCallback(() => {
    activeUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch (err) {
        console.warn('Error revoking object URL:', err);
      }
    });
    activeUrlsRef.current.clear();
    setImages([]);
    setStatusBanner({
      type: 'info',
      message: 'All photos cleared.',
      timestamp: Date.now(),
    });
  }, []);

  return {
    images,
    addFiles,
    removeImage,
    clearImages,
    statusBanner,
    setStatusBanner,
    MAX_FILE_SIZE_BYTES,
  };
}
