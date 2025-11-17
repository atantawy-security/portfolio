# Image Optimization Guide

## WebP Conversion Required

The following images need to be converted to WebP format for better performance:

### Priority 1 - Large Images
1. **assets/img/404.png** (2.4MB)
   - High priority: Large file used on 404 page
   - HTML already updated to support WebP with fallback
   - Create: `assets/img/404.webp`

### Conversion Commands

Using `cwebp` (recommended):
```bash
cwebp -q 85 assets/img/404.png -o assets/img/404.webp
```

Using ImageMagick:
```bash
magick convert assets/img/404.png -quality 85 assets/img/404.webp
```

Using Python Pillow:
```python
from PIL import Image
img = Image.open('assets/img/404.png')
img.save('assets/img/404.webp', 'webp', quality=85)
```

## Already Optimized

The following images are already optimized with WebP and fallbacks:
- Hero profile image (0D1A1966.*) - Has small/medium/large WebP and JPG versions
- Blog post images - Using SVG format (already optimized)
- Certification logos - Small PNG files, acceptable size

## HTML Implementation

All images should use the `<picture>` element for WebP with fallbacks:

```html
<picture>
    <source srcset="path/to/image.webp" type="image/webp">
    <img src="path/to/image.png" alt="Description" loading="lazy" decoding="async">
</picture>
```

## Performance Impact

- WebP typically provides 25-35% better compression than PNG
- The 404.png (2.4MB) could be reduced to ~1.6MB or less with WebP
- All images use lazy loading and async decoding for optimal performance
