/**
 * API Service for Onion Grading Django REST Framework backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Check if the Django backend is reachable and healthy
 */
export async function checkBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health/`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === 'healthy';
  } catch {
    return false;
  }
}

/**
 * Create a new assessment with optional sample photo files
 * @param {Object} values Form field values
 * @param {Array<{file: File}>} images Uploaded image items
 */
export async function createAssessment(values, images = []) {
  const formData = new FormData();

  // Append text/numeric fields
  formData.append('supplier_name', values.supplierName || '');
  formData.append('supplier_phone', values.supplierPhone || '');
  formData.append('state', values.state || 'Maharashtra');
  formData.append('variety', values.variety || 'nashik_red');
  formData.append('grade', values.grade || 'Grade A');
  formData.append('size_class', values.sizeClass || 'Medium');
  formData.append('moisture', values.moisture ?? 12.0);
  formData.append('sprouting', values.sprouting ?? 0);
  formData.append('damage', values.damage ?? 0);
  formData.append('doubles', values.doubles ?? 0);
  formData.append('inspector_name', values.inspectorName || '');
  formData.append('notes', values.notes || '');

  // Append photo evidence files
  if (Array.isArray(images)) {
    images.forEach((img) => {
      if (img.file instanceof File || img.file instanceof Blob) {
        formData.append('uploaded_images', img.file, img.name || 'onion_specimen.jpg');
      }
    });
  }

  const response = await fetch(`${API_BASE_URL}/assessments/`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    let errorDetail = 'Failed to create assessment.';
    try {
      const errJson = await response.json();
      errorDetail = Object.entries(errJson)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
        .join(' | ');
    } catch {
      // ignore
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

/**
 * Fetch paginated or filtered assessments
 */
export async function getAssessments(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/assessments/${query ? `?${query}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch assessments.');
  return res.json();
}

/**
 * Download the APEDA/AGMARK official PDF certificate for an assessment
 * @param {string|number} id Assessment ID
 * @param {string} lotId Lot identifier for download filename
 */
export async function downloadAssessmentPdf(id, lotId = 'certificate') {
  const url = `${API_BASE_URL}/assessments/${id}/pdf/`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error('Failed to generate PDF certificate.');
  }

  const blob = await res.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `Certificate-${lotId}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => window.URL.revokeObjectURL(downloadUrl), 5000);
}

/**
 * Fetch high-level statistics across all registered assessments
 */
export async function getAssessmentStats() {
  const res = await fetch(`${API_BASE_URL}/assessments/stats/`);
  if (!res.ok) throw new Error('Failed to fetch assessment statistics.');
  return res.json();
}

/**
 * Fetch Indian onion varieties from backend database
 */
export async function getVarieties() {
  const res = await fetch(`${API_BASE_URL}/varieties/`);
  if (!res.ok) throw new Error('Failed to fetch onion varieties from backend.');
  return res.json();
}

/**
 * Fetch complete master metadata (states, grades, sizeClasses, varieties, defectSamples) from backend
 */
export async function getAppMetadata() {
  const res = await fetch(`${API_BASE_URL}/meta/`);
  if (!res.ok) throw new Error('Failed to fetch application metadata from backend.');
  return res.json();
}


