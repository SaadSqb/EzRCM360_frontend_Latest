/**
 * Generates two Excel files for testing AR Analysis:
 * 1. AR_Intake_1Claim_PayerNotFound.xlsx - Intake with 1 claim that will fail payer validation
 * 2. Payer-NotFound_Exclude.xlsx - Payer-NotFound file with Action=Exclude to upload after "resolving"
 *
 * Run from project root: node scripts/generate-ar-test-files.js
 * Output: ar-test-files/ folder in project root
 */

const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, '..', 'ar-test-files');

// Intake headers (must match backend AR Recovery Analysis Template)
const INTAKE_HEADERS = [
  'Client Claim ID',
  'Client Entity Name',
  'Billing Provider Name',
  'Rendering Provider Name',
  'Patient Name',
  'DOB',
  'Primary Payer Name',
  'Secondary Payer Name',
  'Payer Name',
  'Plan Name',
  'Plan ID #',
  'Primary Claim Initial Submission Date',
  'Date of Service',
  'CPT/HCPCS',
  'Units',
  'ICD-10',
  'Billed Amount',
  'Location Name',
  'POS',
  'State',
  'City',
  'Zip Code',
];

// 1 row: use a payer name that won't exist in your org so pipeline produces Payer-NotFound file
const INTAKE_ROW = [
  'CLM-001',                    // Client Claim ID
  'Test Entity',                // Client Entity Name
  'Dr. Smith',                 // Billing Provider Name
  'Dr. Smith',                 // Rendering Provider Name
  'John Doe',                  // Patient Name
  '1990-01-15',                // DOB
  'Unknown Payer For Test',    // Primary Payer Name (not in org → payer validation fails)
  '',                          // Secondary Payer Name
  'Unknown Payer For Test',    // Payer Name
  'Test Plan',                 // Plan Name
  'PLAN-001',                  // Plan ID #
  '2025-01-10',                // Primary Claim Initial Submission Date
  '2025-01-08',                // Date of Service
  '99213',                     // CPT/HCPCS
  '1',                         // Units
  'Z00.00',                    // ICD-10
  '150.00',                    // Billed Amount
  'Main Office',               // Location Name
  '11',                        // POS
  'CA',                        // State
  'Los Angeles',               // City
  '90001',                     // Zip Code
];

function buildIntakeSheet() {
  const data = [INTAKE_HEADERS, INTAKE_ROW];
  const ws = XLSX.utils.aoa_to_sheet(data);
  return ws;
}

function buildPayerNotFoundSheet() {
  const headers = ['Primary Payer Name', 'Client Claim ID', 'Status', 'Action'];
  const row = ['Unknown Payer For Test', 'CLM-001', 'Not Found', 'Exclude'];
  const data = [headers, row];
  const ws = XLSX.utils.aoa_to_sheet(data);
  return ws;
}

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const wb1 = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb1, buildIntakeSheet(), 'Sheet1');
const intakePath = path.join(OUT_DIR, 'AR_Intake_1Claim_PayerNotFound.xlsx');
XLSX.writeFile(wb1, intakePath);
console.log('Created:', intakePath);

const wb2 = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb2, buildPayerNotFoundSheet(), 'PayerNotFound');
const payerNotFoundPath = path.join(OUT_DIR, 'Payer-NotFound_Exclude.xlsx');
XLSX.writeFile(wb2, payerNotFoundPath);
console.log('Created:', payerNotFoundPath);

console.log('\nUsage:');
console.log('1. Create new AR session, upload AR_Intake_1Claim_PayerNotFound.xlsx as intake.');
console.log('2. Start analysis → pipeline will pause at Payer validation and generate Payer-NotFound.');
console.log('3. Download the generated Payer-NotFound.xlsx (or use Payer-NotFound_Exclude.xlsx as-is).');
console.log('4. Upload Payer-NotFound_Exclude.xlsx (Action=Exclude) → pipeline excludes the claim and continues.');
