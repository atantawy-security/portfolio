# Performance Optimizations

This document outlines all performance optimizations implemented for the portfolio website.

## Summary

These optimizations reduce file sizes by ~40% and significantly improve loading performance, particularly on mobile devices and slow networks.

## Implemented Optimizations

### 1. CSS/JS Minification ✅
- **CSS Reduction**: 28-60% file size reduction across all CSS files
  - `variables.css`: 59.64% reduction (4,983 → 2,011 bytes)
  - `styles.css`: 28.76% reduction (35,524 → 25,306 bytes)
  - `blog.css`: 33.05% reduction
  - `blog-article.css`: 27.89% reduction
- **JavaScript Reduction**: 55.25% reduction (13,778 → 6,166 bytes)
- **Bundled CSS**: Created optimized bundles
  - `bundle.min.css`: 37,589 bytes (main site)
  - `blog-bundle.min.css`: 20,384 bytes (blog pages)

### 2. Font Loading Optimization ✅
- Added `font-display: swap` to all @font-face declarations
- Prevents invisible text during font loading (FOIT)
- Preloading critical fonts:
  - Playfair Display (Latin 600)
  - Inter (Latin 400, 500)
- Self-hosted WOFF2 fonts with unicode-range subsets

### 3. Code Splitting ✅
- Separated main site CSS from blog CSS
- Main bundle for homepage/static pages
- Blog bundle for blog-specific pages
- Reduces initial payload for first-time visitors

### 4. Resource Bundling ✅
- Combined 5 CSS files into 2 optimized bundles
- Single minified JavaScript file
- SVG sprite system for logo icons (6 icons in 3,889 bytes)

### 5. JavaScript Optimization ✅
- Minified with Terser
- Tree-shaking enabled (dead code elimination)
- Async loading with `defer` attribute
- Reduced from 13.8KB to 6.2KB

### 6. Service Worker ✅
- Offline support and intelligent caching
- Cache-first strategy for static assets
- Network-first for dynamic content
- Automatic cache versioning and cleanup
- Caches:
  - HTML pages
  - CSS bundles
  - JavaScript files
  - Web fonts (WOFF2)
  - SVG sprite

### 7. SVG Sprite System ✅
- Eliminates duplicate SVG code
- Single sprite file with 6 certification logos
- Reduces HTTP requests
- Size: 3,889 bytes for all logos
- Usage: `<svg><use href="/dist/sprite.svg#icon-cert-giac"></use></svg>`

### 8. Lazy Loading ✅
- Consistent lazy loading for all below-the-fold images
- `loading="lazy"` attribute on all images
- `decoding="async"` for better performance
- Hero images load immediately (no lazy loading)

### 9. Image Dimensions ✅
- Width and height attributes on all images
- Prevents Cumulative Layout Shift (CLS)
- Improves Core Web Vitals score
- Better user experience during page load

### 10. Critical CSS Inlining ✅
- Above-the-fold styles inlined in `<head>`
- Reduces render-blocking CSS
- Faster First Contentful Paint (FCP)
- Non-critical CSS loaded asynchronously

### 11. Font Preloading ✅
- Critical fonts preloaded with `<link rel="preload">`
- Reduces font loading time
- Improves Largest Contentful Paint (LCP)
- Crossorigin attribute for CORS compliance

## Build System

### Installation
```bash
npm install
```

### Build Commands
```bash
# Minify CSS files
npm run minify:css

# Minify JavaScript
npm run minify:js

# Build SVG sprite
npm run build:sprites

# Run all optimizations
npm run build
```

### Build Scripts
Located in `/build-scripts/`:
- `minify-css.js` - CSS minification and bundling
- `minify-js.js` - JavaScript minification with tree-shaking
- `build-sprites.js` - SVG sprite generation
- `add-font-display.js` - Adds font-display: swap to fonts
- `extract-critical-css.js` - Extracts critical above-the-fold CSS
- `update-html.js` - Updates HTML with optimizations
- `add-image-dimensions.js` - Adds width/height to images

## File Structure

```
portfolio/
├── dist/                      # Optimized build output
│   ├── css/
│   │   ├── bundle.min.css     # Main site CSS bundle
│   │   ├── blog-bundle.min.css # Blog CSS bundle
│   │   ├── critical.min.css   # Critical CSS for inlining
│   │   └── *.min.css          # Individual minified files
│   ├── js/
│   │   └── main.min.js        # Minified JavaScript
│   └── sprite.svg             # SVG icon sprite
├── build-scripts/             # Build automation scripts
├── css/                       # Source CSS files
├── js/                        # Source JavaScript files
├── fonts/                     # Self-hosted web fonts
├── sw.js                      # Service Worker
└── package.json               # Build dependencies
```

## Performance Metrics

### Before Optimizations
- CSS: ~63KB uncompressed
- JavaScript: ~14KB uncompressed
- No service worker
- No font optimization
- No lazy loading
- No image dimensions

### After Optimizations
- CSS: ~38-40KB (bundles) - **~40% reduction**
- JavaScript: ~6KB - **55% reduction**
- Service worker with offline support
- Optimized font loading with preload
- Lazy loading for all images
- Image dimensions prevent CLS
- Critical CSS inlined

## Browser Compatibility

- Modern browsers: Full support
- Service Worker: Chrome 40+, Firefox 44+, Safari 11.1+, Edge 17+
- Font loading API: All modern browsers
- Lazy loading: Chrome 77+, Firefox 75+, Safari 15.4+ (native)

## Deployment

The `dist/` folder contains all optimized assets and should be deployed with the site.

## Maintenance

When updating:
1. Edit source files in `css/`, `js/`, etc.
2. Run `npm run build` to regenerate optimized files
3. Test locally
4. Commit and deploy

## Future Optimizations

Potential additional improvements:
- [ ] Convert certificate PNGs to WebP format
- [ ] Implement HTTP/2 Server Push
- [ ] Add responsive images for certificates
- [ ] Compress 404.png (currently 2.4MB)
- [ ] Consider CDN for static assets
- [ ] Implement advanced caching headers

## Resources

- [Web.dev Performance Guide](https://web.dev/fast/)
- [Core Web Vitals](https://web.dev/vitals/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Font Loading Best Practices](https://web.dev/font-best-practices/)
