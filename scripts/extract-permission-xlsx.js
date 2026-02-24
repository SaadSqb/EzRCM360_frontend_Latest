const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const paths = [
  'c:\\Users\\Signup Solution\\Downloads\\Permission.xlsx',
  path.join(__dirname, '..', '..', 'Docs', 'Permission.xlsx'),
];

let found = false;
for (const filePath of paths) {
  if (fs.existsSync(filePath)) {
    const workbook = XLSX.readFile(filePath);
    const lines = ['=== ' + filePath + ' ===', 'Sheets: ' + workbook.SheetNames.join(', ')];
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
      lines.push('--- Sheet: ' + sheetName + ' ---');
      rows.slice(0, 150).forEach((row) => {
        const line = Array.isArray(row) ? row.map((c) => (c != null ? String(c) : '')).join('|') : JSON.stringify(row);
        if (line.trim()) lines.push(line);
      });
    }
    const outPath = path.join(__dirname, '..', '..', 'Docs', 'permission_from_excel.txt');
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    console.log('Wrote', outPath);
    found = true;
    break;
  }
}
if (!found) {
  const outPath = path.join(__dirname, '..', '..', 'Docs', 'permission_from_excel.txt');
  fs.writeFileSync(outPath, 'Permission.xlsx not found at: ' + paths.join(' or '), 'utf8');
  console.log('File not found');
}
