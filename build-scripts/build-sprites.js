const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

const logosDir = path.join(__dirname, '../assets/logos');
const distDir = path.join(__dirname, '../dist');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Read all SVG files from logos directory
const svgFiles = fs.readdirSync(logosDir).filter(file => file.endsWith('.svg'));

console.log(`Found ${svgFiles.length} SVG files in logos directory`);

// Build SVG sprite
let spriteContent = `<svg xmlns="http://www.w3.org/2000/svg" style="display: none;">
  <defs>\n`;

svgFiles.forEach(file => {
  const filePath = path.join(logosDir, file);
  let svgContent = fs.readFileSync(filePath, 'utf8');

  // Remove BOM if present
  svgContent = svgContent.replace(/^\uFEFF/, '');

  // Extract viewBox and content from SVG
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 100 100';

  // Remove the outer <svg> tags and extract inner content
  const innerContent = svgContent
    .replace(/<\?xml[^>]*>/g, '')
    .replace(/<svg[^>]*>/gi, '')
    .replace(/<\/svg>/gi, '')
    .trim();

  // Create symbol with unique ID based on filename
  const symbolId = file.replace('.svg', '').replace(/\s+/g, '-');

  spriteContent += `    <symbol id="icon-${symbolId}" viewBox="${viewBox}">
      ${innerContent}
    </symbol>\n`;

  console.log(`✓ Added ${file} as icon-${symbolId}`);
});

spriteContent += `  </defs>
</svg>`;

// Write sprite file
const spritePath = path.join(distDir, 'sprite.svg');
fs.writeFileSync(spritePath, spriteContent);

const spriteSize = Buffer.byteLength(spriteContent, 'utf8');
console.log(`\n✓ sprite.svg created (${spriteSize} bytes)`);
console.log(`✓ Contains ${svgFiles.length} icons`);
console.log('\n✅ SVG sprite building complete!');
console.log('\nUsage example:');
console.log('  <svg class="icon"><use href="/dist/sprite.svg#icon-cert-giac"></use></svg>');
