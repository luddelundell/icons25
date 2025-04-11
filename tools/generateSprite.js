const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');

const inputDir = 'assets';
const outputFile = 'dist/sprite.svg';

const svgFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));

let symbols = [];

svgFiles.forEach(file => {
  const svgContent = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const doc = new DOMParser().parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.getElementsByTagName('svg')[0];

  // Copy inner content
  let innerContent = '';
  for (let i = 0; i < svgElement.childNodes.length; i++) {
    const node = svgElement.childNodes[i];
    if (node.nodeType === 1) {
      innerContent += new XMLSerializer().serializeToString(node);
    }
  }

  const id = path.basename(file, '.svg');
  symbols.push(`<symbol id="${id}" viewBox="${svgElement.getAttribute('viewBox')}">${innerContent}</symbol>`);
});

// Final SVG Sprite
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>`;

// Ensure dist folder exists
fs.mkdirSync(path.dirname(outputFile), { recursive: true });

// Write to file
fs.writeFileSync(outputFile, sprite, 'utf-8');

console.log(`✅ SVG sprite generated: ${outputFile}`);