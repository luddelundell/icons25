// check-icons.js

const fs = require('fs');
const path = require('path');
const { icons } = require('./js/icons.js'); // <-- updated path to icons.js

const ASSETS_DIR = path.join(__dirname, 'assets');

// Create a Set of valid icon IDs
const iconIds = new Set(icons.map(icon => icon.id));

// Read SVG files in the assets directory
fs.readdir(ASSETS_DIR, (err, files) => {
  if (err) {
    console.error('💥 Error reading assets folder:', err);
    return;
  }

  const svgFiles = files.filter(file => file.endsWith('.svg'));
  const foundIds = new Set();

  console.log('\n🔍 Checking SVG files in /assets:\n');

  svgFiles.forEach(file => {
    const id = path.basename(file, '.svg');
    if (iconIds.has(id)) {
      console.log(`✔️  Matched: ${id}`);
      foundIds.add(id);
    } else {
      console.warn(`❌  No match in icons.js for file: ${file}`);
    }
  });

  console.log('\n🕵️ Icons in icons.js missing corresponding SVGs:\n');

  icons.forEach(icon => {
    if (!foundIds.has(icon.id)) {
      console.warn(`❌  Missing SVG for icon id: ${icon.id}`);
    }
  });
});