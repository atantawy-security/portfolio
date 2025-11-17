/**
 * Interactions Module
 * Handles interactive elements like certification badges and project cards
 */

import { querySelectorAllSafe } from './utils.js';

// Magic number from CSS variables - cert collapsed height
const CERT_COLLAPSED_HEIGHT = '275px';
const SCROLL_DELAY = 300;
const ANIMATION_DURATION = 600;

/**
 * Collapse element with smooth animation
 * @param {HTMLElement} element - Element to collapse
 */
function collapseWithAnimation(element) {
    if (!element) {
        console.warn('collapseWithAnimation: No element provided');
        return;
    }

    try {
        // Get the current height
        const currentHeight = element.scrollHeight;

        // Set explicit height before collapsing
        element.style.height = `${currentHeight}px`;

        // Force reflow to ensure the height is set
        element.offsetHeight; // eslint-disable-line no-unused-expressions

        // Remove expanded class and set target height
        element.classList.remove('expanded');
        element.style.height = CERT_COLLAPSED_HEIGHT;

        // Clear inline height after transition completes
        setTimeout(() => {
            element.style.height = '';
        }, ANIMATION_DURATION);
    } catch (error) {
        console.error('Error collapsing element:', error);
        // Fallback: just remove the class
        element.classList.remove('expanded');
    }
}

/**
 * Safely scroll element into view
 * @param {HTMLElement} element - Element to scroll into view
 */
function scrollIntoViewSafe(element) {
    if (!element) {
        return;
    }

    try {
        if (typeof element.scrollIntoView === 'function') {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        console.error('Error scrolling element into view:', error);
    }
}

/**
 * Toggle certification badge expansion
 * @param {HTMLElement} element - Cert badge element to toggle
 */
export function toggleCert(element) {
    if (!element) {
        console.warn('toggleCert: No element provided');
        return;
    }

    try {
        const isExpanded = element.classList.contains('expanded');

        // Close all other expanded certificates
        const expandedBadges = querySelectorAllSafe('.cert-badge.expanded');
        expandedBadges.forEach(badge => {
            if (badge !== element) {
                collapseWithAnimation(badge);
            }
        });

        // Toggle current certificate
        if (isExpanded) {
            collapseWithAnimation(element);
        } else {
            element.classList.add('expanded');
            // Smooth scroll to show the expanded cert
            setTimeout(() => {
                scrollIntoViewSafe(element);
            }, SCROLL_DELAY);
        }
    } catch (error) {
        console.error('Error toggling certification:', error);
    }
}

/**
 * Toggle project card expansion
 * @param {HTMLElement} element - Project card element to toggle
 */
export function toggleProject(element) {
    if (!element) {
        console.warn('toggleProject: No element provided');
        return;
    }

    try {
        const isExpanded = element.classList.contains('expanded');

        // Close all other expanded projects
        const expandedProjects = querySelectorAllSafe('.project-card.expanded');
        expandedProjects.forEach(project => {
            if (project !== element) {
                project.classList.remove('expanded');
            }
        });

        // Toggle current project
        if (isExpanded) {
            element.classList.remove('expanded');
        } else {
            element.classList.add('expanded');
            // Smooth scroll to show the expanded project
            setTimeout(() => {
                scrollIntoViewSafe(element);
            }, SCROLL_DELAY);
        }
    } catch (error) {
        console.error('Error toggling project:', error);
    }
}

/**
 * Initialize audience tab switching functionality
 */
export function initializeAudienceTabs() {
    try {
        const tabs = querySelectorAllSafe('.audience-tab');
        const contents = querySelectorAllSafe('.audience-content');

        if (tabs.length === 0) {
            console.info('No audience tabs found on this page');
            return;
        }

        // Initialize aria-hidden on tab panels
        contents.forEach(content => {
            const isActive = content.classList.contains('active');
            content.setAttribute('aria-hidden', isActive ? 'false' : 'true');
        });

        tabs.forEach(tab => {
            try {
                tab.addEventListener('click', () => {
                    const targetAudience = tab.getAttribute('data-audience');

                    if (!targetAudience) {
                        console.warn('Tab missing data-audience attribute');
                        return;
                    }

                    // Remove active class from all tabs and contents
                    tabs.forEach(t => {
                        t.classList.remove('active');
                        t.setAttribute('aria-selected', 'false');
                    });
                    contents.forEach(c => {
                        c.classList.remove('active');
                        c.setAttribute('aria-hidden', 'true');
                    });

                    // Add active class to clicked tab and corresponding content
                    tab.classList.add('active');
                    tab.setAttribute('aria-selected', 'true');
                    const targetContent = document.querySelector(`[data-content="${targetAudience}"]`);
                    if (targetContent) {
                        targetContent.classList.add('active');
                        targetContent.setAttribute('aria-hidden', 'false');
                    } else {
                        console.warn(`No content found for audience: ${targetAudience}`);
                    }
                });
            } catch (error) {
                console.error('Error setting up audience tab:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing audience tabs:', error);
    }
}
