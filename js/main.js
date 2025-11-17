/**
 * Portfolio Website - Main JavaScript File
 * Refactored with error handling and better organization
 *
 * Modules are organized into logical sections:
 * - Utility Functions
 * - Quote Management
 * - Email Obfuscation
 * - Interactive Elements
 * - Scroll Effects
 * - Event Delegation
 * - Initialization
 */

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 */
function debounce(func, wait = 100) {
    if (typeof func !== 'function') {
        console.error('Debounce: First argument must be a function');
        return function() {};
    }

    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            try {
                func(...args);
            } catch (error) {
                console.error('Error in debounced function:', error);
            }
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 */
function throttle(func, limit = 100) {
    if (typeof func !== 'function') {
        console.error('Throttle: First argument must be a function');
        return function() {};
    }

    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            try {
                func.apply(this, args);
            } catch (error) {
                console.error('Error in throttled function:', error);
            }
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Safely get element by ID
 * @param {string} id - Element ID
 * @returns {HTMLElement|null}
 */
function getElementByIdSafe(id) {
    if (!id || typeof id !== 'string') {
        return null;
    }
    try {
        return document.getElementById(id);
    } catch (error) {
        console.error(`Error getting element "${id}":`, error);
        return null;
    }
}

/**
 * Safely query selector
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element
 * @returns {HTMLElement|null}
 */
function querySelectorSafe(selector, context = document) {
    if (!selector) return null;
    try {
        return context.querySelector(selector);
    } catch (error) {
        console.error(`Error querying "${selector}":`, error);
        return null;
    }
}

/**
 * Safely query selector all
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element
 * @returns {NodeList|Array}
 */
function querySelectorAllSafe(selector, context = document) {
    if (!selector) return [];
    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.error(`Error querying "${selector}":`, error);
        return [];
    }
}

// ============================================================================
// QUOTE MANAGEMENT
// ============================================================================

// Security Leadership Quotes
const quotes = [
    "Security is not a product, but a process. It requires continuous adaptation and strategic thinking. - Bruce Schneier",
    "The intersection of security and business strategy is where true organizational resilience is built. - Anonymous",
    "Effective security leadership means translating technical risk into business language. - Anonymous",
    "In cybersecurity, proactive governance and risk management are the foundations of trust. - Anonymous",
    "Security architecture must enable business agility while maintaining robust controls. - Anonymous",
    "The best security programs align technical excellence with organizational objectives. - Anonymous",
    "Defense in depth is not paranoia—it's strategic risk management at every layer. - Anonymous",
    "Trust is earned through transparency, competence, and consistent delivery of secure solutions. - Anonymous",
    "Companies spend millions of dollars on firewalls and encryption, but it's money wasted because none of these measures address the weakest link in the security chain: the people. - Kevin Mitnick",
    "If you think technology can solve your security problems, then you don't understand the problems and you don't understand the technology. - Bruce Schneier",
    "Moving from reactive defense to proactive resilience is a real opportunity for leaders to drive strategic business growth. - Nick Godfrey",
    "The role of the CISO is expanding, absorbing responsibilities that go beyond traditional IT security. - John Furrier"
];

/**
 * Initialize quote display
 */
function initializeQuote() {
    try {
        const quoteElement = getElementByIdSafe('quote');
        const authorElement = getElementByIdSafe('quote-author');

        if (!quoteElement || !authorElement) {
            return; // Quote elements not on this page
        }

        if (!quotes || quotes.length === 0) {
            console.warn('No quotes available');
            return;
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];

        if (!randomQuote) {
            return;
        }

        // Parse quote and author
        const parts = randomQuote.split(' - ');
        const quoteText = parts[0]?.trim() || '';
        const author = parts.length > 1 ? parts[1]?.trim() : 'Anonymous';

        if (quoteText) {
            quoteElement.textContent = `"${quoteText}"`;
            authorElement.textContent = `— ${author}`;
        }
    } catch (error) {
        console.error('Error initializing quote:', error);
    }
}

// ============================================================================
// EMAIL OBFUSCATION
// ============================================================================

/**
 * Construct email address from data attributes
 * @param {HTMLElement} element - Element with data attributes
 * @returns {string|null}
 */
function constructEmail(element) {
    if (!element || !element.dataset) {
        return null;
    }

    try {
        const user = element.dataset.user;
        const domain = element.dataset.domain;

        if (!user || !domain) {
            return null;
        }

        return `${user}@${domain}`;
    } catch (error) {
        console.error('Error constructing email:', error);
        return null;
    }
}

/**
 * Initialize email obfuscation
 */
function initializeEmailObfuscation() {
    try {
        const elements = querySelectorAllSafe('[data-user][data-domain]');

        if (elements.length === 0) {
            return; // No email elements on this page
        }

        elements.forEach(element => {
            try {
                // Display email in SPAN elements
                if (element.tagName === 'SPAN') {
                    const email = constructEmail(element);
                    if (email) {
                        element.textContent = email;
                    }
                }
            } catch (error) {
                console.error('Error processing email element:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing email obfuscation:', error);
    }
}

// ============================================================================
// INTERACTIVE ELEMENTS
// ============================================================================

const CERT_COLLAPSED_HEIGHT = '275px';
const SCROLL_DELAY = 300;
const ANIMATION_DURATION = 600;

/**
 * Collapse element with animation
 * @param {HTMLElement} element - Element to collapse
 */
function collapseWithAnimation(element) {
    if (!element) return;

    try {
        const currentHeight = element.scrollHeight;
        element.style.height = `${currentHeight}px`;
        element.offsetHeight; // Force reflow
        element.classList.remove('expanded');
        element.style.height = CERT_COLLAPSED_HEIGHT;

        setTimeout(() => {
            element.style.height = '';
        }, ANIMATION_DURATION);
    } catch (error) {
        console.error('Error collapsing element:', error);
        element.classList.remove('expanded');
    }
}

/**
 * Scroll element into view safely
 * @param {HTMLElement} element - Element to scroll into view
 */
function scrollIntoViewSafe(element) {
    if (!element) return;

    try {
        if (typeof element.scrollIntoView === 'function') {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    } catch (error) {
        console.error('Error scrolling into view:', error);
    }
}

/**
 * Toggle certification badge
 * @param {HTMLElement} element - Cert badge element
 */
function toggleCert(element) {
    if (!element) return;

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
            setTimeout(() => scrollIntoViewSafe(element), SCROLL_DELAY);
        }
    } catch (error) {
        console.error('Error toggling certification:', error);
    }
}

/**
 * Toggle project card
 * @param {HTMLElement} element - Project card element
 */
function toggleProject(element) {
    if (!element) return;

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
            setTimeout(() => scrollIntoViewSafe(element), SCROLL_DELAY);
        }
    } catch (error) {
        console.error('Error toggling project:', error);
    }
}

/**
 * Initialize audience tabs
 */
function initializeAudienceTabs() {
    try {
        const tabs = querySelectorAllSafe('.audience-tab');
        const contents = querySelectorAllSafe('.audience-content');

        if (tabs.length === 0) {
            return; // No audience tabs on this page
        }

        tabs.forEach(tab => {
            try {
                tab.addEventListener('click', () => {
                    const targetAudience = tab.getAttribute('data-audience');
                    if (!targetAudience) return;

                    tabs.forEach(t => t.classList.remove('active'));
                    contents.forEach(c => c.classList.remove('active'));

                    tab.classList.add('active');
                    const targetContent = querySelectorSafe(`[data-content="${targetAudience}"]`);
                    if (targetContent) {
                        targetContent.classList.add('active');
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

// ============================================================================
// SCROLL EFFECTS
// ============================================================================

const SCROLL_THRESHOLD = 100;
const NAVBAR_OFFSET = 150;
const BOTTOM_THRESHOLD = 10;
const VISIBLE_ITEMS = 5;

/**
 * Scroll to top of page
 */
function scrollToTop() {
    try {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
        console.error('Error scrolling to top:', error);
        window.scrollTo(0, 0); // Fallback
    }
}

/**
 * Update active navigation link
 */
function updateActiveNavLink() {
    try {
        const sections = querySelectorAllSafe('section[id]');
        const sidebarLinks = querySelectorAllSafe('.sidebar-nav a[href^="#"]');
        const sidebar = getElementByIdSafe('sidebar');

        if (!sidebar) return; // No sidebar on this page

        const arcContainer = querySelectorSafe('.sidebar-arc', sidebar);
        const navList = querySelectorSafe('.sidebar-nav', sidebar);

        if (!sections.length || !sidebarLinks.length || !arcContainer || !navList) {
            return;
        }

        const halfWindow = Math.floor(VISIBLE_ITEMS / 2);
        let currentSection = sections[0]?.getAttribute('id') || '';

        // Find current section
        sections.forEach(section => {
            try {
                const sectionTop = section.offsetTop;
                if (window.scrollY >= sectionTop - NAVBAR_OFFSET) {
                    currentSection = section.getAttribute('id');
                }
            } catch (error) {
                console.error('Error processing section:', error);
            }
        });

        // Check if at bottom of page
        const isAtBottom = window.scrollY + window.innerHeight >=
                          document.documentElement.scrollHeight - BOTTOM_THRESHOLD;
        if (isAtBottom && sections.length > 0) {
            currentSection = sections[sections.length - 1]?.getAttribute('id') || currentSection;
        }

        // Update active states
        sidebarLinks.forEach(link => {
            try {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${currentSection}`) {
                    link.classList.add('active');
                }
            } catch (error) {
                console.error('Error updating link:', error);
            }
        });

        // Update sidebar position
        const links = Array.from(sidebarLinks);
        const activeIndex = links.findIndex(l => l.classList.contains('active'));
        if (activeIndex === -1) return;

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

            // Update visibility
            links.forEach((link, index) => {
                try {
                    const inWindow = index >= windowStart && index <= windowEnd;
                    if (!inWindow) {
                        link.style.opacity = '0';
                        link.style.visibility = 'hidden';
                        link.style.pointerEvents = 'none';
                        return;
                    }

                    const distance = Math.min(2, Math.abs(index - activeIndex));
                    let opacity = 0.3;
                    if (distance === 0) opacity = 1;
                    else if (distance === 1) opacity = 0.5;

                    link.style.opacity = String(opacity);
                    link.style.visibility = 'visible';
                    link.style.pointerEvents = 'auto';
                } catch (error) {
                    console.error('Error updating link visibility:', error);
                }
            });
        } catch (error) {
            console.error('Error updating sidebar:', error);
        }
    } catch (error) {
        console.error('Error in updateActiveNavLink:', error);
    }
}

/**
 * Initialize scroll effects
 */
function initializeScrollEffects() {
    try {
        const navbar = getElementByIdSafe('top-navbar');
        const scrollTopBtn = getElementByIdSafe('scrollTop');

        const handleScroll = throttle(() => {
            try {
                const scrollY = window.scrollY;

                if (scrollY > SCROLL_THRESHOLD) {
                    if (navbar) navbar.classList.add('scrolled');
                    if (scrollTopBtn) scrollTopBtn.classList.add('visible');
                } else {
                    if (navbar) navbar.classList.remove('scrolled');
                    if (scrollTopBtn) scrollTopBtn.classList.remove('visible');
                }

                updateActiveNavLink();
            } catch (error) {
                console.error('Error in scroll handler:', error);
            }
        }, 100);

        window.addEventListener('scroll', handleScroll, { passive: true });
    } catch (error) {
        console.error('Error initializing scroll effects:', error);
    }
}

/**
 * Initialize floating contact button
 */
function initializeFloatingContact() {
    try {
        const floatingBtn = getElementByIdSafe('floatingContact');
        if (!floatingBtn) return;

        const handleContactScroll = throttle(() => {
            try {
                const contactSection = getElementByIdSafe('contact');
                if (!contactSection) return;

                const contactRect = contactSection.getBoundingClientRect();
                const isNearContact = contactRect.top < window.innerHeight;

                if (isNearContact) {
                    floatingBtn.style.opacity = '0';
                    floatingBtn.style.pointerEvents = 'none';
                } else {
                    floatingBtn.style.opacity = '1';
                    floatingBtn.style.pointerEvents = 'auto';
                }
            } catch (error) {
                console.error('Error in floating contact handler:', error);
            }
        }, 100);

        window.addEventListener('scroll', handleContactScroll, { passive: true });
    } catch (error) {
        console.error('Error initializing floating contact:', error);
    }
}

// ============================================================================
// EVENT DELEGATION
// ============================================================================

/**
 * Initialize centralized event delegation
 */
function initializeEventDelegation() {
    try {
        document.addEventListener('click', (e) => {
            try {
                // Handle data-toggle attributes
                const toggleTarget = e.target.closest('[data-toggle]');
                if (toggleTarget) {
                    e.preventDefault();
                    const type = toggleTarget.dataset.toggle;
                    if (type === 'cert') {
                        toggleCert(toggleTarget);
                    } else if (type === 'project') {
                        toggleProject(toggleTarget);
                    }
                    return;
                }

                // Handle data-action attributes
                const actionTarget = e.target.closest('[data-action]');
                if (actionTarget) {
                    e.preventDefault();
                    const action = actionTarget.dataset.action;
                    if (action === 'scroll-top') {
                        scrollToTop();
                    }
                    return;
                }

                // Handle email obfuscation
                const emailTarget = e.target.closest('[data-user][data-domain]');
                if (emailTarget && emailTarget.tagName === 'A') {
                    e.preventDefault();
                    const email = constructEmail(emailTarget);
                    if (email) {
                        window.location.href = `mailto:${encodeURIComponent(email)}`;
                    }
                    return;
                }
            } catch (error) {
                console.error('Error in click handler:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing event delegation:', error);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize all functionality when DOM is loaded
 */
function initializeApp() {
    try {
        initializeEventDelegation();
        initializeEmailObfuscation();
        initializeQuote();
        initializeScrollEffects();
        initializeAudienceTabs();
        initializeFloatingContact();
        updateActiveNavLink();

        // Handle resize and orientation changes
        const debouncedUpdate = debounce(updateActiveNavLink, 200);
        window.addEventListener('resize', debouncedUpdate);
        window.addEventListener('orientationchange', debouncedUpdate);
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Start the application
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
