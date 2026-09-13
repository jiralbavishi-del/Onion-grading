import assert from 'node:assert';
import {
  clampPercent,
  sanitizePhone,
  MAX_FILE_SIZE_BYTES,
  PRODUCING_STATES,
  ONION_VARIETIES,
  GRADES,
  SIZE_CLASSES,
} from './src/components/OnionAssessmentForm/constants.js';

console.log('Running Onion Assessment Unit Tests...\n');

// 1. Test clampPercent
console.log('Testing clampPercent()...');
assert.strictEqual(clampPercent(''), '', 'Empty string should return empty string');
assert.strictEqual(clampPercent(null), '', 'null should return empty string');
assert.strictEqual(clampPercent(undefined), '', 'undefined should return empty string');
assert.strictEqual(clampPercent('abc'), '', 'NaN should return empty string');
assert.strictEqual(clampPercent(-10), 0, 'Negative number should clamp to 0');
assert.strictEqual(clampPercent('-50'), 0, 'Negative string should clamp to 0');
assert.strictEqual(clampPercent(150), 100, 'Number > 100 should clamp to 100');
assert.strictEqual(clampPercent('999'), 100, 'String > 100 should clamp to 100');
assert.strictEqual(clampPercent(42), 42, 'Valid number in 0-100 should pass');
assert.strictEqual(clampPercent('13.5'), 13.5, 'Valid decimal should parse correctly');
assert.strictEqual(clampPercent(13.456), 13.5, 'Decimals should round to 1 decimal place');
console.log('✓ clampPercent() passed all tests!');

// 2. Test sanitizePhone
console.log('\nTesting sanitizePhone()...');
assert.strictEqual(sanitizePhone(''), '', 'Empty string returns empty string');
assert.strictEqual(sanitizePhone('+91 98230 12345'), '+91 98230 12345', 'Valid international phone preserved');
assert.strictEqual(sanitizePhone('98230-12345'), '98230-12345', 'Dashes and digits preserved');
assert.strictEqual(sanitizePhone('Phone: +91 98230#ext!'), '+91 98230', 'Letters and special symbols stripped');
assert.strictEqual(
  sanitizePhone('+123 456 789 012 345 678'),
  '+123 456 789 01',
  'Enforces max 15 characters limit'
);
assert.strictEqual(sanitizePhone('+123 456 789 012 345 678').length, 15, 'Length is strictly capped at 15');
console.log('✓ sanitizePhone() passed all tests!');

// 3. Test File cap
console.log('\nTesting File size cap...');
assert.strictEqual(MAX_FILE_SIZE_BYTES, 12 * 1024 * 1024, 'MAX_FILE_SIZE_BYTES must equal 12MB');
console.log('✓ File size cap is 12 MB (12,582,912 bytes)!');

// 4. Test Domain lists
console.log('\nTesting Domain lists...');
assert(PRODUCING_STATES.length >= 10, 'States list should have major producing states');
assert(ONION_VARIETIES.length >= 5, 'Varieties list should have standard varieties');
assert.strictEqual(GRADES.length, 4, 'Must have Grade A, B, C, Reject');
assert.strictEqual(SIZE_CLASSES.length, 4, 'Must have Small, Medium, Large, Jumbo');
console.log('✓ Domain lists verified!');

console.log('\n==================================');
console.log('ALL TESTS PASSED SUCCESSFULLY! 🧅');
console.log('==================================');
