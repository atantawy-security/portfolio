const fs = require('fs');
const path = require('path');
const CleanCSS = require('clean-css');

const cssDir = path.join(__dirname, '../css');
const cssFiles = [
  'variables.css',
  'fonts.css',
  'styles.css',
  'blog.css',
  'blog-article.css'
];

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '../dist/css');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Minify each CSS file individually
cssFiles.forEach(file => {
  const inputPath = path.join(cssDir, file);
  const outputPath = path.join(distDir, file.replace('.css', '.min.css'));

  const input = fs.readFileSync(inputPath, 'utf8');
  const output = new CleanCSS({
    level: 2,
    compatibility: '*',
    format: false
  }).minify(input);

  if (output.errors.length > 0) {
    console.error(`Error minifying ${file}:`, output.errors);
  } else {
    fs.writeFileSync(outputPath, output.styles);
    const originalSize = Buffer.byteLength(input, 'utf8');
    const minifiedSize = Buffer.byteLength(output.styles, 'utf8');
    const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);
    console.log(`✓ ${file}: ${originalSize} → ${minifiedSize} bytes (${reduction}% reduction)`);
  }
});

// Create bundled versions
// Bundle 1: Critical CSS (variables + fonts + above-the-fold styles)
const criticalCSS = [
  fs.readFileSync(path.join(cssDir, 'variables.css'), 'utf8'),
  fs.readFileSync(path.join(cssDir, 'fonts.css'), 'utf8'),
  // Extract critical styles from styles.css (we'll do this manually later)
];

// Bundle 2: Main styles bundle
const mainBundle = cssFiles
  .filter(f => !f.includes('blog'))
  .map(f => fs.readFileSync(path.join(cssDir, f), 'utf8'))
  .join('\n');

const mainBundleMin = new CleanCSS({ level: 2 }).minify(mainBundle);
fs.writeFileSync(
  path.join(distDir, 'bundle.min.css'),
  mainBundleMin.styles
);
console.log(`✓ bundle.min.css created (${Buffer.byteLength(mainBundleMin.styles, 'utf8')} bytes)`);

// Bundle 3: Blog styles bundle
const blogBundle = [
  fs.readFileSync(path.join(cssDir, 'variables.css'), 'utf8'),
  fs.readFileSync(path.join(cssDir, 'fonts.css'), 'utf8'),
  fs.readFileSync(path.join(cssDir, 'blog.css'), 'utf8'),
  fs.readFileSync(path.join(cssDir, 'blog-article.css'), 'utf8')
].join('\n');

const blogBundleMin = new CleanCSS({ level: 2 }).minify(blogBundle);
fs.writeFileSync(
  path.join(distDir, 'blog-bundle.min.css'),
  blogBundleMin.styles
);
console.log(`✓ blog-bundle.min.css created (${Buffer.byteLength(blogBundleMin.styles, 'utf8')} bytes)`);

console.log('\n✅ CSS minification complete!');
