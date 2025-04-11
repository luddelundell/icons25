const fs = require('fs');
const path = require('path');
const { DOMParser } = require('xmldom');

const inputDir = 'assets';
const outputFile = 'dist/icons.js';

const svgFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));

const iconEntries = [];

svgFiles.forEach(file => {
  const filePath = path.join(inputDir, file);
  const svgContent = fs.readFileSync(filePath, 'utf-8');

  const doc = new DOMParser().parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.getElementsByTagName('svg')[0];

  const id = path.basename(file, '.svg');
  const metadataNode = svgElement.getElementsByTagName('metadata')[0];

  if (!metadataNode) return;

  let content = metadataNode.textContent.trim();

  if (content.toLowerCase().startsWith('keywords:')) {
    content = content.split(':')[1];
  }

  const tags = content
    .split(',')
    .map(tag => tag.trim())
    .filter(tag => tag.length > 0);

  if (tags.length > 0) {
    iconEntries.push({ id, tags, since: '2025.XX.Y' });
  }
});

// Build the JS file manually
const lines = [
  'export const icons = ['
];

iconEntries.forEach(icon => {
  const tagArray = icon.tags.map(tag => `'${tag}'`).join(', ');
  lines.push(`  { id: '${icon.id}', tags: [${tagArray}], since: '${icon.since}' },`);
});

lines.push('];\n');

const outputJS = lines.join('\n');

// Ensure output folder exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, outputJS, 'utf-8');

console.log(`✅ icons.js generated without quoted keys → ${outputFile}`);