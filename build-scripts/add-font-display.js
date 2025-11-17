const fs = require('fs');
const path = require('path');

const fontsPath = path.join(__dirname, '../css/fonts.css');
let content = fs.readFileSync(fontsPath, 'utf8');

// Add font-display: swap to all @font-face declarations that don't have it
content = content.replace(
  /@font-face\s*{([^}]*?)}/g,
  (match, declarations) => {
    // Check if font-display is already present
    if (declarations.includes('font-display:')) {
      return match;
    }

    // Find the position after font-stretch or font-weight to insert font-display
    const lines = declarations.split('\n');
    const insertIndex = lines.findIndex(line =>
      line.includes('font-stretch:') || line.includes('font-weight:')
    );

    if (insertIndex >= 0) {
      lines.splice(insertIndex + 1, 0, '  font-display: swap;');
      return `@font-face {${lines.join('\n')}}`;
    }

    return match;
  }
);

fs.writeFileSync(fontsPath, content);
console.log('✅ Added font-display: swap to all @font-face declarations');
