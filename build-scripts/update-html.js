const fs = require('fs');
const path = require('path');

const htmlFiles = [
  'index.html',
  'blog.html',
  '404.html',
  'privacy.html'
];

const criticalCSS = fs.readFileSync(path.join(__dirname, '../dist/css/critical.min.css'), 'utf8');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);

  if (!fs.existsSync(filePath)) {
    console.log(`⚠ ${file} not found, skipping...`);
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');

  // 1. Add font preload links for critical fonts (after dns-prefetch)
  const fontPreloads = `
    <!-- Font preloading for critical fonts -->
    <link rel="preload" href="/fonts/playfair-display/playfair-display-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/inter/inter-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/fonts/inter/inter-latin-500-normal.woff2" as="font" type="font/woff2" crossorigin>
`;

  // Insert font preloads after the last dns-prefetch
  if (!html.includes('Font preloading')) {
    html = html.replace(
      /(<link rel="dns-prefetch"[^>]*>\s*)+/,
      (match) => match + fontPreloads
    );
  }

  // 2. Inline critical CSS
  if (!html.includes('<style id="critical-css">')) {
    const criticalStyle = `\n    <!-- Critical CSS inlined for faster initial render -->
    <style id="critical-css">${criticalCSS}</style>\n`;

    html = html.replace(
      /<title>/,
      criticalStyle + '    <title>'
    );
  }

  // 3. Update CSS links to use minified bundles
  // For main pages (index.html, 404.html, privacy.html) use bundle.min.css
  // For blog pages use blog-bundle.min.css

  if (file.includes('blog')) {
    // Replace individual CSS files with blog bundle
    html = html.replace(
      /<link rel="stylesheet" href="css\/variables\.css">\s*<link rel="stylesheet" href="css\/fonts\.css">\s*<link rel="stylesheet" href="css\/blog\.css">\s*<link rel="stylesheet" href="css\/blog-article\.css">/gi,
      '<link rel="stylesheet" href="/dist/css/blog-bundle.min.css" media="print" onload="this.media=\'all\'">'
    );
    html = html.replace(
      /<link rel="stylesheet" href="css\/variables\.css">\s*<link rel="stylesheet" href="css\/styles\.css">/gi,
      '<link rel="stylesheet" href="/dist/css/bundle.min.css" media="print" onload="this.media=\'all\'">'
    );
  } else {
    // Replace individual CSS files with main bundle
    html = html.replace(
      /<link rel="stylesheet" href="css\/variables\.css">\s*<link rel="stylesheet" href="css\/styles\.css">/gi,
      '<link rel="stylesheet" href="/dist/css/bundle.min.css" media="print" onload="this.media=\'all\'">'
    );
  }

  // Fallback for non-matching patterns - try individual replacements
  html = html.replace(
    /<link rel="stylesheet" href="css\/variables\.css">/gi,
    '<!-- CSS bundled below -->'
  );
  html = html.replace(
    /<link rel="stylesheet" href="css\/styles\.css">/gi,
    '<link rel="stylesheet" href="/dist/css/bundle.min.css" media="print" onload="this.media=\'all\'">\n    <noscript><link rel="stylesheet" href="/dist/css/bundle.min.css"></noscript>'
  );

  // 4. Update JS to use minified version with defer
  html = html.replace(
    /<script src="js\/main\.js"><\/script>/gi,
    '<script src="/dist/js/main.min.js" defer></script>'
  );

  // 5. Add service worker registration before closing body tag
  if (!html.includes('serviceWorker')) {
    const swRegistration = `
    <!-- Service Worker Registration -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('ServiceWorker registered:', reg.scope))
            .catch(err => console.error('ServiceWorker registration failed:', err));
        });
      }
    </script>
`;

    html = html.replace(
      /<\/body>/,
      swRegistration + '</body>'
    );
  }

  // Write updated HTML
  fs.writeFileSync(filePath, html);
  console.log(`✓ Updated ${file}`);
});

console.log('\n✅ HTML optimization complete!');
console.log('\nOptimizations applied:');
console.log('  • Font preloading for critical fonts');
console.log('  • Critical CSS inlined');
console.log('  • CSS bundles with async loading');
console.log('  • Minified JavaScript with defer');
console.log('  • Service worker registration');
