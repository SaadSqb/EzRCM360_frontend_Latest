const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');

const root = path.resolve(__dirname, '..', '..');
const docsDir = path.join(root, 'Docs');
const excelPath = path.join(docsDir, 'Permission.xlsx');
const outTxt = path.join(docsDir, 'permission_content.txt');
const outJson = path.join(docsDir, 'permission_content.json');

if (!fs.existsSync(excelPath)) {
  console.error('Error: Permission.xlsx not found at', excelPath);
  process.exit(1);
}

const workbook = XLSX.readFile(excelPath, { type: 'file', cellDates: true });
const sheetNames = workbook.SheetNames;
const result = { sheet_names: sheetNames, sheets: {} };
const lines = [];
lines.push('='.repeat(80));
lines.push('PERMISSION.XLSX - EXTRACTED CONTENT');
lines.push('='.repeat(80));
lines.push('Sheet names: ' + JSON.stringify(sheetNames));
lines.push('');

for (const name of sheetNames) {
  const sheet = workbook.Sheets[name];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '', raw: false });
  result.sheets[name] = { row_count: rows.length, rows };
  lines.push('-'.repeat(80));
  lines.push('SHEET: ' + name);
  lines.push('-'.repeat(80));
  rows.forEach((row, i) => {
    const line = Array.isArray(row) ? row.map(c => c == null ? '' : String(c)).join(' | ') : String(row);
    lines.push('  Row ' + (i + 1) + ': ' + line);
  });
  lines.push('');
}

fs.writeFileSync(outTxt, lines.join('\n'), 'utf8');
fs.writeFileSync(outJson, JSON.stringify(result, null, 2), 'utf8');
console.log('Written:', outTxt);
console.log('Written:', outJson);
