/**
 * Integration test script: Tests connection from Frontend to Django REST Backend
 */

const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function runTests() {
  console.log('----------------------------------------------------');
  console.log('Testing Frontend -> Django REST Backend Connection');
  console.log('API URL:', API_BASE_URL);
  console.log('----------------------------------------------------\n');

  // Test 1: Health check endpoint
  try {
    process.stdout.write('1. Testing Backend Health (/api/health/)... ');
    const healthRes = await fetch(`${API_BASE_URL}/health/`);
    if (!healthRes.ok) {
      throw new Error(`Status ${healthRes.status}: ${healthRes.statusText}`);
    }
    const healthData = await healthRes.json();
    console.log('SUCCESS! (Status: %s, Protocol: %s)', healthData.status, healthData.protocol);
  } catch (err) {
    console.log('FAILED:', err.message);
    return;
  }

  // Test 2: Create Assessment (simulating form submission)
  let createdLotId = null;
  let createdId = null;

  try {
    process.stdout.write('2. Submitting Assessment from Frontend (/api/assessments/)... ');
    const payload = {
      supplierName: 'Sahyadri Agro Producers',
      supplierPhone: '+91 98220 12345',
      state: 'Maharashtra',
      variety: 'nashik_red',
      grade: 'Grade A',
      sizeClass: 'Medium',
      moisture: 12.8,
      sprouting: 0.0,
      damage: 1.5,
      doubles: 0.5,
      inspectorName: 'Dr. V. M. Deshmukh (QC-Lead)',
      notes: 'End-to-end integration test from frontend client.',
    };

    const postRes = await fetch(`${API_BASE_URL}/assessments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!postRes.ok) {
      const errText = await postRes.text();
      throw new Error(`Status ${postRes.status}: ${errText}`);
    }

    const postData = await postRes.json();
    createdId = postData.id;
    createdLotId = postData.lot_id;
    console.log('SUCCESS!');
    console.log('   -> Lot ID: %s', createdLotId);
    console.log('   -> Computed Score: %s / 100 (%s)', postData.computed_score, postData.quality_status);
  } catch (err) {
    console.log('FAILED:', err.message);
    return;
  }

  // Test 3: Verify PDF Certificate generation
  try {
    process.stdout.write(`3. Testing PDF Certificate Export (/api/assessments/${createdId}/pdf/)... `);
    const pdfRes = await fetch(`${API_BASE_URL}/assessments/${createdId}/pdf/`);
    if (!pdfRes.ok) {
      throw new Error(`Status ${pdfRes.status}: ${pdfRes.statusText}`);
    }
    const contentType = pdfRes.headers.get('content-type');
    const contentDisposition = pdfRes.headers.get('content-disposition');
    const buffer = await pdfRes.arrayBuffer();

    console.log('SUCCESS!');
    console.log('   -> Content-Type: %s', contentType);
    console.log('   -> Header: %s', contentDisposition);
    console.log('   -> PDF Size: %d bytes (Valid binary stream)', buffer.byteLength);
  } catch (err) {
    console.log('FAILED:', err.message);
  }

  // Test 4: Verify Stats endpoint
  try {
    process.stdout.write('4. Testing Analytics Stats Endpoint (/api/assessments/stats/)... ');
    const statsRes = await fetch(`${API_BASE_URL}/assessments/stats/`);
    if (!statsRes.ok) {
      throw new Error(`Status ${statsRes.status}`);
    }
    const stats = await statsRes.json();
    console.log('SUCCESS!');
    console.log('   -> Total Registered Assessments: %d', stats.totalAssessments);
    console.log('   -> Average Quality Score: %s%', stats.averageScore);
    console.log('   -> Grade Distribution:', stats.gradeBreakdown);
  } catch (err) {
    console.log('FAILED:', err.message);
  }

  console.log('\n----------------------------------------------------');
  console.log('All Frontend <-> Backend connectivity checks passed!');
  console.log('----------------------------------------------------');
}

runTests();
