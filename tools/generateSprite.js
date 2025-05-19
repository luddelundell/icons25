const fs = require('fs');
const path = require('path');
const { DOMParser, XMLSerializer } = require('xmldom');
const vm = require('vm');

const inputDir = 'assets';
const outputFile = 'dist/sprite.svg';
const jsFilePath = 'js/icons.js';

const svgFiles = fs.readdirSync(inputDir).filter(file => file.endsWith('.svg'));
let iconsCreated = 0;
let iconMatch = 0;

let jsIconIds = new Set();

if (fs.existsSync(jsFilePath)) {
  let jsCode = fs.readFileSync(jsFilePath, 'utf-8');

  try {
    // Remove "export" keyword
    jsCode = jsCode.replace(/export\s+const\s+icons/, 'const icons');

    const sandbox = {};
    vm.createContext(sandbox);
    vm.runInContext(jsCode + '\nglobalThis.extractedIcons = icons;', sandbox);

    const extractedIcons = sandbox.extractedIcons;

    if (Array.isArray(extractedIcons)) {
      extractedIcons.forEach(icon => {
        if (icon.id) {
          jsIconIds.add(icon.id);
        }
      });
    } else {
      console.warn('⚠️ No icons array found in JavaScript file.');
    }
  } catch (error) {
    console.error(`❌ Failed to parse JavaScript file: ${error.message}`);
  }
} else {
  console.warn(`⚠️ JavaScript file not found at: ${jsFilePath}`);
}

let symbols = [];

svgFiles.forEach(file => {
  const svgContent = fs.readFileSync(path.join(inputDir, file), 'utf-8');
  const doc = new DOMParser().parseFromString(svgContent, 'image/svg+xml');
  const svgElement = doc.getElementsByTagName('svg')[0];

  let innerContent = '';
  for (let i = 0; i < svgElement.childNodes.length; i++) {
    const node = svgElement.childNodes[i];
    if (node.nodeType === 1) {
      innerContent += new XMLSerializer().serializeToString(node);
    }

  }

  const id = path.basename(file, '.svg');

  if (!jsIconIds.has(id)) {
    console.warn(`⚠️ ID '${id}' not found in JavaScript icons list`);
  }
  else {
    iconMatch++;
  }

  symbols.push(`<symbol id="${id}" viewBox="${svgElement.getAttribute('viewBox')}">${innerContent}</symbol>`);
  iconsCreated++;
});

const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none">\n${symbols.join('\n')}\n</svg>`;

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, sprite, 'utf-8');

console.log(`✅ SVG sprite generated (${iconsCreated}/${iconMatch} icons): ${outputFile}`);