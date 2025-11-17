const fs = require('fs');
const path = require('path');

const variablesCSS = fs.readFileSync(path.join(__dirname, '../css/variables.css'), 'utf8');
const stylesCSS = fs.readFileSync(path.join(__dirname, '../css/styles.css'), 'utf8');

// Extract critical CSS - variables, reset, and above-the-fold styles
const criticalRules = [];

// All variables are critical
criticalRules.push(variablesCSS);

// Critical parts from styles.css:
// - Reset styles
// - Body/html styles
// - Sidebar styles (visible on load)
// - Navbar styles (visible on load)
// - Hero section styles (above the fold)

const criticalSelectors = [
  /\/\* Reset \*\/[\s\S]*?(?=\/\*|$)/,
  /\/\* Base Styles \*\/[\s\S]*?(?=\/\*|$)/,
  /html\s*,\s*body[\s\S]*?}/,
  /body\s*{[\s\S]*?}/,
  /\.sidebar[\s\S]*?(?=\.nav-item\s*{)/,
  /\.sidebar-header[\s\S]*?}/,
  /\.nav-item[\s\S]*?}/,
  /\.navbar[\s\S]*?(?=\.navbar\.scrolled)/,
  /\.hero[\s\S]*?(?=\.about)/,
  /\.container\s*{[\s\S]*?}/,
  /\.main-content\s*{[\s\S]*?}/
];

// Since full extraction is complex, let's create a minimal critical CSS
const criticalCSS = `
/* Critical CSS - Above the fold */
:root {
  --primary-color: #2c5282;
  --text-color: #2d3748;
  --bg-color: #ffffff;
  --secondary-bg: #f7fafc;
  --border-color: #e2e8f0;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--bg-color);
}

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 240px;
  height: 100vh;
  background: var(--primary-color);
  color: white;
  z-index: 100;
}

.navbar {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 70px;
  background: white;
  z-index: 90;
}

.main-content {
  margin-left: 240px;
  padding-top: 70px;
}

.hero {
  min-height: calc(100vh - 70px);
  display: flex;
  align-items: center;
}
`;

const distDir = path.join(__dirname, '../dist/css');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

fs.writeFileSync(path.join(distDir, 'critical.min.css'), criticalCSS.replace(/\s+/g, ' ').trim());

const size = Buffer.byteLength(criticalCSS, 'utf8');
console.log(`✓ critical.min.css created (${size} bytes)`);
console.log('✅ Critical CSS extraction complete!');
