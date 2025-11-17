/**
 * Scroll Module
 * Handles scroll-based functionality including navigation updates and floating elements
 */

import { getElementByIdSafe, querySelectorAllSafe, throttle } from './utils.js';

// Configuration constants
const SCROLL_THRESHOLD = 100;
const NAVBAR_OFFSET = 150;
const BOTTOM_THRESHOLD = 10;
const VISIBLE_ITEMS = 5;
const THROTTLE_DELAY = 100;

/**
 * Scroll to top of page
 */
export function scrollToTop() {
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error scrolling to top:', error);
        // Fallback for older browsers
        window.scrollTo(0, 0);
    }
}

/**
 * Update active navigation link based on current scroll position
 */
export function updateActiveNavLink() {
    try {
        const sections = querySelectorAllSafe('section[id]');
        const sidebarLinks = querySelectorAllSafe('.sidebar-nav a[href^="#"]');
        const sidebar = getElementByIdSafe('sidebar');

        if (!sidebar) {
            return; // No sidebar on this page
        }

        const arcContainer = sidebar.querySelector('.sidebar-arc');
        const navList = sidebar.querySelector('.sidebar-nav');

        if (!sections.length || !sidebarLinks.length || !arcContainer || !navList) {
            return;
        }

        const halfWindow = Math.floor(VISIBLE_ITEMS / 2);
        let currentSection = sections[0]?.getAttribute('id') || '';

        // Find current section based on scroll position
        sections.forEach(section => {
            try {
                const sectionTop = section.offsetTop;
                // Check if section is in viewport (with offset for navbar)
                if (window.scrollY >= sectionTop - NAVBAR_OFFSET) {
                    currentSection = section.getAttribute('id');
                }
            } catch (error) {
                console.error('Error processing section:', error);
            }
        });

        // Check if we've scrolled to the bottom of the page
        const isAtBottom = window.scrollY + window.innerHeight >=
                          document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
        if (isAtBottom && sections.length > 0) {
            currentSection = sections[sections.length - 1]?.getAttribute('id') || currentSection;
        }

        // Update active class on navigation links
        sidebarLinks.forEach(link => {
            try {
                link.classList.remove('active');
                const href = link.getAttribute('href');

                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            } catch (error) {
                console.error('Error updating link active state:', error);
            }
        });

        // Update sidebar navigation position and visibility
        const links = Array.from(sidebarLinks);
        const activeIndex = links.findIndex(l => l.classList.contains('active'));

        if (activeIndex === -1) {
            return;
        }

        try {
            const activeLink = links[activeIndex];
            const containerHeight = arcContainer.clientHeight;
            const linkHeight = activeLink.offsetHeight;
            const linkOffset = activeLink.offsetTop;
            const targetOffset = containerHeight / 2 - (linkOffset + linkHeight / 2);
            navList.style.transform = `translateY(${targetOffset}px)`;

            // Calculate visible window
            let windowStart = activeIndex - halfWindow;
            if (windowStart < 0) windowStart = 0;
            let windowEnd = windowStart + VISIBLE_ITEMS - 1;
            if (windowEnd >= links.length) {
                windowEnd = links.length - 1;
                windowStart = Math.max(0, windowEnd - VISIBLE_ITEMS + 1);
            }

            // Update link visibility and opacity
            links.forEach((link, index) => {
                try {
                    const inWindow = index >= windowStart && index <= windowEnd;
                    if (!inWindow) {
                        link.style.opacity = '0';
                        link.style.visibility = 'hidden';
                        link.style.pointerEvents = 'none';
                        link.setAttribute('aria-hidden', 'true');
                        return;
                    }

                    const distance = Math.min(2, Math.abs(index - activeIndex));
                    let opacity = 0.3;
                    if (distance === 0) opacity = 1;
                    else if (distance === 1) opacity = 0.5;

                    link.style.opacity = String(opacity);
                    link.style.visibility = 'visible';
                    link.style.pointerEvents = 'auto';
                    link.setAttribute('aria-hidden', 'false');
                } catch (error) {
                    console.error('Error updating link visibility:', error);
                }
            });
        } catch (error) {
            console.error('Error updating sidebar navigation:', error);
        }
    } catch (error) {
        console.error('Error in updateActiveNavLink:', error);
    }
}

/**
 * Initialize scroll effects for navigation and scroll-to-top button
 */
export function initializeScrollEffects() {
    try {
        const navbar = getElementByIdSafe('top-navbar');
        const scrollTopBtn = getElementByIdSafe('scrollTop');

        // Create throttled scroll handler for better performance
        const handleScroll = throttle(() => {
            try {
                const scrollY = window.scrollY;

                if (scrollY > SCROLL_THRESHOLD) {
                    if (navbar) navbar.classList.add('scrolled');
                    if (scrollTopBtn) {
                        scrollTopBtn.classList.add('visible');
                        scrollTopBtn.setAttribute('aria-hidden', 'false');
                    }
                } else {
                    if (navbar) navbar.classList.remove('scrolled');
                    if (scrollTopBtn) {
                        scrollTopBtn.classList.remove('visible');
                        scrollTopBtn.setAttribute('aria-hidden', 'true');
                    }
                }

                // Update active navigation link based on scroll position
                updateActiveNavLink();
            } catch (error) {
                console.error('Error in scroll handler:', error);
            }
        }, THROTTLE_DELAY);

        // Use passive listener for better scroll performance
        window.addEventListener('scroll', handleScroll, { passive: true });
    } catch (error) {
        console.error('Error initializing scroll effects:', error);
    }
}

/**
 * Initialize floating contact button visibility based on scroll position
 */
export function initializeFloatingContact() {
    try {
        const floatingBtn = getElementByIdSafe('floatingContact');

        if (!floatingBtn) {
            console.info('Floating contact button not found on this page');
            return;
        }

        // Create throttled scroll handler for better performance
        const handleContactScroll = throttle(() => {
            try {
                // Hide floating button when near contact section
                const contactSection = getElementByIdSafe('contact');

                if (!contactSection) {
                    return;
                }

                const contactRect = contactSection.getBoundingClientRect();
                const isNearContact = contactRect.top < window.innerHeight;

                if (isNearContact) {
                    floatingBtn.style.opacity = '0';
                    floatingBtn.style.pointerEvents = 'none';
                    floatingBtn.setAttribute('aria-hidden', 'true');
                } else {
                    floatingBtn.style.opacity = '1';
                    floatingBtn.style.pointerEvents = 'auto';
                    floatingBtn.setAttribute('aria-hidden', 'false');
                }
            } catch (error) {
                console.error('Error in floating contact scroll handler:', error);
            }
        }, THROTTLE_DELAY);

        // Use passive listener for better scroll performance
        window.addEventListener('scroll', handleContactScroll, { passive: true });
    } catch (error) {
        console.error('Error initializing floating contact:', error);
    }
}
