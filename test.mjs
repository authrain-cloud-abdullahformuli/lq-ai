import fs from 'fs';
import path from 'path';
import assert from 'assert';
import { execSync } from 'child_process';

const ROOT = import.meta.dirname;
console.log('🧪 Starting lq-ai verification test suite in:', ROOT);

// 1. Prohibited files check
const prohibitedPatterns = [
  'CODE_OF_CONDUCT.md',
  'web/CODE_OF_CONDUCT.md',
  'CONTRIBUTING.md',
  'skills/CONTRIBUTING.md',
  'web/CONTRIBUTOR_LICENSE_AGREEMENT',
  'web/contribution_stats.py',
  'GOVERNANCE.md',
  '.github/CODEOWNERS',
  'docs/contribute',
  'docs/security/external-contribution-vetting.md',
];
for (const rel of prohibitedPatterns) {
  assert(!fs.existsSync(path.join(ROOT, rel)), `Prohibited file should not exist: ${rel}`);
}
console.log('✔ Prohibited governance files cleanly removed');

// 2. Metadata files existence
const required = [
  'LICENSE',
  'MAINTAINERS.md',
  'CITATION.cff',
  'package.json',
  'README.md',
  'web/static/assets/welcome.mp4',
  'web/demo.png',
];
for (const f of required) {
  assert(fs.existsSync(path.join(ROOT, f)), `Required file missing: ${f}`);
}
console.log('✔ All required metadata files present');

// 3. LICENSE verification
const license = fs.readFileSync(path.join(ROOT, 'LICENSE'), 'utf-8');
assert(license.includes('MIT License'), 'LICENSE must be MIT');
assert(license.includes('Copyright (c) 2026 Abdullah Formuli'), 'LICENSE must have Copyright 2026 Abdullah Formuli');
console.log('✔ LICENSE verified (MIT, Copyright 2026 Abdullah Formuli)');

// 4. MAINTAINERS.md verification
const maintainers = fs.readFileSync(path.join(ROOT, 'MAINTAINERS.md'), 'utf-8');
assert(maintainers.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.'), 'MAINTAINERS statement mismatch');
console.log('✔ MAINTAINERS.md verified');

// 5. CITATION.cff verification
const citation = fs.readFileSync(path.join(ROOT, 'CITATION.cff'), 'utf-8');
assert(citation.includes('family-names: Formuli'), 'CITATION author missing Formuli');
assert(citation.includes('given-names: Abdullah'), 'CITATION author missing Abdullah');
assert(citation.includes('authrain-cloud-abdullahformuli/lq-ai'), 'CITATION repo URL missing');
console.log('✔ CITATION.cff verified');

// 6. package.json verification
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf-8'));
assert.strictEqual(pkg.name, 'lq-ai', 'Package name must be lq-ai');
assert(pkg.author.includes('Abdullah Formuli'), 'Author must include Abdullah Formuli');
assert.strictEqual(pkg.license, 'MIT', 'License must be MIT');
assert(pkg.repository.url.includes('authrain-cloud-abdullahformuli/lq-ai'), 'Repository URL mismatch');
console.log('✔ Root package.json verified');

// 7. README.md verification
const readme = fs.readFileSync(path.join(ROOT, 'README.md'), 'utf-8');
assert(readme.includes('Maintained solely by Abdullah Formuli. No external contributions accepted.'), 'README maintainers notice missing');
assert(!readme.includes('LegalQuants/lq-ai'), 'README still contains LegalQuants/lq-ai');
assert(!readme.includes('## Contributing'), 'README still contains Contributing section');
console.log('✔ README.md verified');

// 8. Preview image verification
const previewPath = '/Users/authrain/Downloads/lq-ai-preview.png';
assert(fs.existsSync(previewPath), 'Preview graphic missing in Downloads');
const sipsOut = execSync(`sips -g pixelWidth -g pixelHeight "${previewPath}"`, { encoding: 'utf-8' });
assert(sipsOut.includes('pixelWidth: 1280'), 'Preview graphic width is not 1280');
assert(sipsOut.includes('pixelHeight: 720'), 'Preview graphic height is not 720');
console.log('✔ Preview graphic verified: 1280x720 in /Users/authrain/Downloads/lq-ai-preview.png');

// 9. Demo video verification
const demoPath = '/Users/authrain/Downloads/lq-ai-demo.mp4';
assert(fs.existsSync(demoPath), 'Demo video missing in Downloads');
const stat = fs.statSync(demoPath);
assert(stat.size > 1000000, 'Demo video too small or invalid');
console.log(`✔ Demo video verified: ${(stat.size / (1024 * 1024)).toFixed(2)} MB in /Users/authrain/Downloads/lq-ai-demo.mp4`);

console.log('\n🎉 ALL CHECKS PASSED (9/9)!');
