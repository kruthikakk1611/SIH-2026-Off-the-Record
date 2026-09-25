const fs = require('fs');
const path = require('path');
const { EXTRA_DATA, PARITY_129 } = require('./compile_all_translations.cjs');

// Let's load the current translationsExtended.ts using tsx or evaluation
const tsx = require('child_process').execSync('npx tsx -e "import { EXTENDED_TRANSLATIONS } from \'./src/data/translationsExtended.ts\'; console.log(JSON.stringify(EXTENDED_TRANSLATIONS));"', { maxBuffer: 10 * 1024 * 1024 }).toString();

const current = JSON.parse(tsx);
const langs = ['en', 'hi', 'kn', 'ta', 'te', 'ml', 'mr'];

// Merge PARITY_129
for (const [key, transMap] of Object.entries(PARITY_129)) {
  for (const lang of ['kn', 'ta', 'te', 'ml', 'mr']) {
    if (transMap[lang]) {
      current[lang][key] = transMap[lang];
    }
  }
}

// Merge EXTRA_DATA
for (const [key, transMap] of Object.entries(EXTRA_DATA)) {
  for (const lang of langs) {
    if (transMap[lang]) {
      current[lang][key] = transMap[lang];
    }
  }
}

// Check parity
const enKeys = Object.keys(current.en);
console.log('Total en keys:', enKeys.length);

for (const lang of langs) {
  const missing = enKeys.filter(k => !current[lang][k]);
  console.log(`Lang [${lang}] key count:`, Object.keys(current[lang]).length, `Missing compared to en:`, missing.length);
  if (missing.length > 0) {
    console.log(`Missing keys in [${lang}]:`, missing);
  }
}

// Write back to src/data/translationsExtended.ts as clean TypeScript
let tsOutput = `import { SupportedLanguage } from './translations';\n\n`;
tsOutput += `export const EXTENDED_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {\n`;

for (const lang of langs) {
  tsOutput += `  ${lang}: {\n`;
  const keys = Object.keys(current[lang]).sort();
  for (const k of keys) {
    const val = current[lang][k].replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    const safeKey = k.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n');
    tsOutput += `    '${safeKey}': '${val}',\n`;
  }
  tsOutput += `  },\n`;
}

tsOutput += `};\n`;

fs.writeFileSync('src/data/translationsExtended.ts', tsOutput, 'utf8');
console.log('Successfully wrote src/data/translationsExtended.ts!');
