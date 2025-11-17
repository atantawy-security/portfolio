const fs = require('fs');
const path = require('path');

// Image dimension mappings (actual sizes from assets)
const imageDimensions = {
  // Profile images
  '0D1A1966-large.webp': { width: 800, height: 1200, aspectRatio: '2/3' },
  '0D1A1966-medium.webp': { width: 600, height: 900, aspectRatio: '2/3' },
  '0D1A1966-small.webp': { width: 400, height: 600, aspectRatio: '2/3' },
  '0D1A1966-large.jpg': { width: 800, height: 1200, aspectRatio: '2/3' },
  '0D1A1966-medium.jpg': { width: 600, height: 900, aspectRatio: '2/3' },
  '0D1A1966-small.jpg': { width: 400, height: 600, aspectRatio: '2/3' },

  // Certification badges (all roughly 140x140 based on SVG viewBox)
  'cissp.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'cism.png': { width: 140, height: 140, aspectRatio: '1/1' },
  '0D1A1966.JPG': { width: 800, height: 1200, aspectRatio: '2/3' },
  'oscp.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gdsa.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gxpn.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gwapt.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gmle.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gcda.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gpcs.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'ciem.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gdat.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gslc.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'gpen.png': { width: 140, height: 140, aspectRatio: '1/1' },

  // Educational logos
  'ceu.png': { width: 200, height: 100, aspectRatio: '2/1' },
  'aastmt.png': { width: 200, height: 100, aspectRatio: '2/1' },

  // Other images
  '404.png': { width: 800, height: 600, aspectRatio: '4/3' },
  'advisory board.png': { width: 300, height: 200, aspectRatio: '3/2' },
  'cdp devsecops.png': { width: 300, height: 200, aspectRatio: '3/2' },
  'crt crest.png': { width: 140, height: 140, aspectRatio: '1/1' },
  'hp arcsight.png': { width: 200, height: 100, aspectRatio: '2/1' }
};

function addDimensionsToHtml(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let html = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Find all img tags
  const imgRegex = /<img([^>]*?)>/gi;

  html = html.replace(imgRegex, (match, attributes) => {
    // Check if already has width and height
    if (attributes.includes('width=') && attributes.includes('height=')) {
      return match;
    }

    // Extract src
    const srcMatch = attributes.match(/src=["']([^"']+)["']/);
    if (!srcMatch) {
      return match;
    }

    const src = srcMatch[1];
    const filename = path.basename(src);

    // Get dimensions
    const dims = imageDimensions[filename];
    if (!dims) {
      console.log(`  ⚠ No dimensions defined for: ${filename}`);
      return match;
    }

    // Add width, height, and loading attributes
    let newAttributes = attributes;

    // Add width and height if not present
    if (!attributes.includes('width=')) {
      newAttributes += ` width="${dims.width}"`;
    }
    if (!attributes.includes('height=')) {
      newAttributes += ` height="${dims.height}"`;
    }

    // Ensure lazy loading for images (except hero images)
    if (!attributes.includes('loading=') && !attributes.includes('hero')) {
      newAttributes += ' loading="lazy"';
    }

    // Add decoding attribute
    if (!attributes.includes('decoding=')) {
      newAttributes += ' decoding="async"';
    }

    modified = true;
    return `<img${newAttributes}>`;
  });

  if (modified) {
    fs.writeFileSync(filePath, html);
    console.log(`✓ Added dimensions to images in ${path.basename(filePath)}`);
  }

  return modified;
}

// Process all HTML files
const htmlFiles = [
  'index.html',
  'blog.html',
  '404.html',
  'privacy.html',
  'blog-posts/oracle-cloud-free-tier.html',
  'blog-posts/devsecops-culture.html',
  'blog-posts/cybersecurity-strategic.html',
  'blog-posts/whisper-transcription.html',
  'blog-posts/stupid-questions.html',
  'blog-posts/pci-dss-guide.html'
];

console.log('Adding image dimensions to prevent CLS...\n');

htmlFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  addDimensionsToHtml(filePath);
});

console.log('\n✅ Image dimension optimization complete!');
