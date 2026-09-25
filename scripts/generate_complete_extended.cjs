const fs = require('fs');

// We will load the existing translation file
const transContent = fs.readFileSync('src/data/translations.ts', 'utf8');

// Read the EXTRA_DATA from build_translations.cjs
delete require.cache[require.resolve('./build_translations.cjs')];

