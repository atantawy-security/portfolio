# Ahmed Tantawy - Portfolio Website

Professional portfolio website for Ahmed Tantawy, Information Security Officer with 12+ years of experience, CISSP certified professional specializing in security leadership and strategic vision.

**Live Site:** [atantawy.com](https://atantawy.com)

## Overview

This portfolio website showcases professional credentials, certifications, technical expertise, and insights through blog posts on cybersecurity topics. The site is designed with accessibility, performance, and security best practices in mind.

## Features

### Dynamic Content
- **Audience-Targeted Messaging**: Interactive tabs that display tailored content for different audiences:
  - Executives: Security leadership and strategic vision
  - Recruiters: Professional qualifications and experience
  - Security Teams: Technical expertise and hands-on skills
  - Partners: Collaborative approach and engagement

### Credentials Showcase
- **Professional Certifications**: Interactive display of 13 major security certifications including:
  - CISSP (Certified Information Systems Security Professional)
  - CISM (Certified Information Security Manager)
  - Multiple GIAC certifications (GDSA, GCDA, GPCS, GDAT, GXPN, GPEN, GWAPT)
  - OSCP (Offensive Security Certified Professional)
  - DevSecOps Professional
  - CREST Registered Tester

- **Academic Credentials**:
  - Executive MBA from Central European University
  - Bachelor's in Computer Engineering from Arab Academy for Science, Technology and Maritime Transport

### Blog Section
Technical articles covering:
- Cybersecurity strategy and leadership
- Cloud computing (Oracle Cloud)
- DevSecOps culture
- Media transcription with Whisper OpenAI
- PCI DSS compliance
- And more...

### Performance Optimizations
- Responsive images with WebP format and multiple sizes
- Resource hints (preconnect, dns-prefetch) for external resources
- Browser caching configured via `.htaccess`
- Compression enabled for text-based assets
- Lazy loading for images and certification logos

### Security Features
- Content Security Policy (CSP) headers
- X-Frame-Options protection
- X-XSS-Protection enabled
- Strict Content-Type enforcement
- Referrer Policy configuration
- Permissions Policy for browser features
- HSTS ready (for HTTPS deployment)

### SEO & Social Sharing
- OpenGraph meta tags for social media
- Twitter Card integration
- Structured data (JSON-LD) for search engines
- XML sitemap
- Canonical URLs
- Descriptive meta tags

## Technology Stack

- **Frontend**: Vanilla HTML5, CSS3, JavaScript
- **Server**: Apache (with `.htaccess` configuration)
- **Hosting**: GitHub Pages compatible
- **Domain**: Custom domain (atantawy.com)

## Project Structure

```
portfolio/
├── assets/
│   └── img/              # Images and certification logos
├── blog-posts/           # Individual blog post HTML files
├── css/
│   ├── variables.css     # CSS custom properties
│   └── styles.css        # Main stylesheet
├── fonts/                # Web fonts
├── js/
│   └── main.js          # Main JavaScript file
├── .well-known/         # Domain verification files
├── .github/             # GitHub configuration
├── .htaccess            # Apache server configuration
├── _headers             # Additional headers configuration
├── _redirects           # URL redirects
├── index.html           # Main landing page
├── blog.html            # Blog listing page
├── sitemap.xml          # XML sitemap for SEO
├── robots.txt           # Search engine crawling rules
└── CNAME                # Custom domain configuration
```

## Development

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/atantawy-security/portfolio.git
cd portfolio
```

2. Serve locally using any static file server:

**Using Python:**
```bash
python -m http.server 8000
```

**Using Node.js (http-server):**
```bash
npx http-server -p 8000
```

**Using PHP:**
```bash
php -S localhost:8000
```

3. Open your browser to `http://localhost:8000`

### Making Changes

- **Content Updates**: Edit HTML files directly
- **Styling**: Modify CSS files in the `css/` directory
- **New Blog Posts**: Add HTML files to `blog-posts/` and update `blog.html`
- **Images**: Add optimized images to `assets/img/`

## Deployment

The site is configured for deployment on:
- GitHub Pages (via CNAME file)
- Any static hosting service
- Apache web servers

### GitHub Pages Deployment

The repository is set up for automatic deployment to GitHub Pages with a custom domain configured via the `CNAME` file.

### Security Headers

For production deployment, ensure your web server supports:
- `mod_headers` for security headers
- `mod_deflate` for compression
- `mod_expires` for caching

If deploying to a service that doesn't support `.htaccess`, configure equivalent headers in your hosting platform.

## Accessibility

The site includes:
- Skip to main content link
- ARIA labels and roles
- Semantic HTML structure
- Keyboard navigation support
- Alt text for all images

## Browser Support

The site is designed to work on:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile devices (responsive design)
- Tablets and desktop displays

## License

Copyright © 2025 Ahmed Tantawy. All rights reserved.

## Contact

- **Website**: [atantawy.com](https://atantawy.com)
- **Email**: website@atantawy.com
- **LinkedIn**: [a-htantawy](https://www.linkedin.com/in/a-htantawy)
- **GitHub**: [@atantawy-security](https://github.com/atantawy-security)
- **Location**: Vienna, Austria

---

Built with a focus on security, performance, and user experience.
