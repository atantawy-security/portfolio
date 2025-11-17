const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const jsDir = path.join(__dirname, '../js');
const distDir = path.join(__dirname, '../dist/js');

// Create dist directory if it doesn't exist
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

async function minifyJS() {
  const inputPath = path.join(jsDir, 'main.js');
  const outputPath = path.join(distDir, 'main.min.js');

  const input = fs.readFileSync(inputPath, 'utf8');

  const result = await minify(input, {
    compress: {
      dead_code: true,
      drop_console: false,
      drop_debugger: true,
      keep_classnames: false,
      keep_fnames: false,
      passes: 2
    },
    mangle: {
      toplevel: true,
      keep_classnames: false,
      keep_fnames: false
    },
    format: {
      comments: false
    }
  });

  if (result.error) {
    console.error('Error minifying JavaScript:', result.error);
    process.exit(1);
  }

  fs.writeFileSync(outputPath, result.code);

  const originalSize = Buffer.byteLength(input, 'utf8');
  const minifiedSize = Buffer.byteLength(result.code, 'utf8');
  const reduction = ((1 - minifiedSize / originalSize) * 100).toFixed(2);

  console.log(`✓ main.js: ${originalSize} → ${minifiedSize} bytes (${reduction}% reduction)`);
  console.log('\n✅ JavaScript minification complete!');
}

minifyJS().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
