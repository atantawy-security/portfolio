// Utility: Debounce function for performance optimization
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Utility: Throttle function for scroll events
function throttle(func, limit = 100) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

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

// DOM element cache for better performance
const DOMCache = {
    init() {
        this.certBadges = document.querySelectorAll('.cert-badge');
        this.projectCards = document.querySelectorAll('.project-card');
        this.scrollTop = document.getElementById('scrollTop');
        this.floatingContact = document.getElementById('floatingContact');
        this.sidebar = document.getElementById('sidebar');
        this.topNavbar = document.getElementById('top-navbar');
    }
};

// Centralized click event delegation
function initializeEventDelegation() {
    document.addEventListener('click', (e) => {
        // Handle data-toggle attributes (cert badges and project cards)
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

        // Handle data-action attributes (scroll-to-top button)
        const actionTarget = e.target.closest('[data-action]');
        if (actionTarget) {
            e.preventDefault();
            const action = actionTarget.dataset.action;
            if (action === 'scroll-top') {
                scrollToTop();
            }
            return;
        }

        // Handle email obfuscation clicks
        const emailTarget = e.target.closest('[data-user][data-domain]');
        if (emailTarget && emailTarget.tagName === 'A') {
            e.preventDefault();
            const user = emailTarget.dataset.user;
            const domain = emailTarget.dataset.domain;
            location.href = 'mailto:' + user + '@' + domain;
            return;
        }
    });
}

// Initialize quote on page load
function initializeQuote() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteElement = document.getElementById('quote');
    const authorElement = document.getElementById('quote-author');

    if (quoteElement && authorElement) {
        // Split quote and author (format: "Quote text. - Author Name")
        const parts = randomQuote.split(' - ');
        const quoteText = parts[0].trim();
        const author = parts.length > 1 ? parts[1].trim() : 'Anonymous';

        quoteElement.textContent = `"${quoteText}"`;
        authorElement.textContent = `— ${author}`;
    }
}

// Certification toggle functionality
function toggleCert(element) {
    const isExpanded = element.classList.contains('expanded');

    // Close all other expanded certificates
    document.querySelectorAll('.cert-badge.expanded').forEach(badge => {
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
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// Helper function to collapse with smooth animation
function collapseWithAnimation(element) {
    // Get the current height
    const currentHeight = element.scrollHeight;

    // Set explicit height before collapsing
    element.style.height = currentHeight + 'px';

    // Force reflow to ensure the height is set
    element.offsetHeight;

    // Remove expanded class and set target height
    element.classList.remove('expanded');
    element.style.height = '275px';

    // Clear inline height after transition completes
    setTimeout(() => {
        element.style.height = '';
    }, 600);
}

// Scroll effects for navigation and scroll-to-top button
function initializeScrollEffects() {
    const navbar = document.getElementById('top-navbar');
    const scrollTop = document.getElementById('scrollTop');

    // Throttle scroll handler for better performance
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            if (navbar) navbar.classList.add('scrolled');
            if (scrollTop) scrollTop.classList.add('visible');
        } else {
            if (navbar) navbar.classList.remove('scrolled');
            if (scrollTop) scrollTop.classList.remove('visible');
        }

        // Update active navigation link based on scroll position
        updateActiveNavLink();
    }, 100);

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Update active navigation link based on current scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a[href^="#"]');
    const sidebar = document.getElementById('sidebar');
    const arcContainer = sidebar ? sidebar.querySelector('.sidebar-arc') : null;
    const navList = sidebar ? sidebar.querySelector('.sidebar-nav') : null;
    const visibleCount = 5;
    const halfWindow = Math.floor(visibleCount / 2);

    if (!sections.length || !sidebarLinks.length || !arcContainer || !navList) {
        return;
    }

    let currentSection = sections[0]?.getAttribute('id') || '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;

        // Check if section is in viewport (with offset for navbar)
        if (window.scrollY >= sectionTop - 150) {
            currentSection = section.getAttribute('id');
        }
    });

    // Check if we've scrolled to the bottom of the page
    // This ensures the last section (Contact) gets highlighted when at bottom
    const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
    if (isAtBottom && sections.length > 0) {
        currentSection = sections[sections.length - 1]?.getAttribute('id') || currentSection;
    }

    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');

        if (href === `#${currentSection}`) {
            link.classList.add('active');
        }
    });

    const links = Array.from(sidebarLinks);
    const activeIndex = links.findIndex(l => l.classList.contains('active'));
    if (activeIndex === -1) return;

    const activeLink = links[activeIndex];
    const containerHeight = arcContainer.clientHeight;
    const linkHeight = activeLink.offsetHeight;
    const linkOffset = activeLink.offsetTop;
    const targetOffset = containerHeight / 2 - (linkOffset + linkHeight / 2);
    navList.style.transform = `translateY(${targetOffset}px)`;

    let windowStart = activeIndex - halfWindow;
    if (windowStart < 0) windowStart = 0;
    let windowEnd = windowStart + visibleCount - 1;
    if (windowEnd >= links.length) {
        windowEnd = links.length - 1;
        windowStart = Math.max(0, windowEnd - visibleCount + 1);
    }

    links.forEach((link, index) => {
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
    });
}

// Scroll to top functionality
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Audience tab switching functionality
function initializeAudienceTabs() {
    const tabs = document.querySelectorAll('.audience-tab');
    const contents = document.querySelectorAll('.audience-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetAudience = tab.getAttribute('data-audience');

            // Remove active class from all tabs and contents
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));

            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const targetContent = document.querySelector(`[data-content="${targetAudience}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Project card toggle functionality
function toggleProject(element) {
    const isExpanded = element.classList.contains('expanded');

    // Close all other expanded projects
    document.querySelectorAll('.project-card.expanded').forEach(project => {
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
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
    }
}

// Floating contact button visibility
function initializeFloatingContact() {
    const floatingBtn = document.getElementById('floatingContact');
    if (!floatingBtn) return;

    // Throttle scroll handler for better performance
    const handleContactScroll = throttle(() => {
        // Hide floating button when near contact section
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            const contactRect = contactSection.getBoundingClientRect();
            const isNearContact = contactRect.top < window.innerHeight;

            if (isNearContact) {
                floatingBtn.style.opacity = '0';
                floatingBtn.style.pointerEvents = 'none';
            } else {
                floatingBtn.style.opacity = '1';
                floatingBtn.style.pointerEvents = 'auto';
            }
        }
    }, 100);

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleContactScroll, { passive: true });
}

// Email obfuscation to prevent scraping
function initializeEmailObfuscation() {
    // Find all elements with data-user and data-domain attributes
    document.querySelectorAll('[data-user][data-domain]').forEach(element => {
        const user = element.dataset.user;
        const domain = element.dataset.domain;

        // If it's a span (display element), set the text content
        if (element.tagName === 'SPAN') {
            element.textContent = user + '@' + domain;
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeEventDelegation(); // Set up centralized click handling
    initializeEmailObfuscation(); // Construct email addresses from data attributes
    initializeQuote();
    initializeScrollEffects();
    initializeAudienceTabs();
    initializeFloatingContact();
    updateActiveNavLink(); // Set initial active state
    // Keep arc and centering aligned on resize and orientation changes (debounced)
    window.addEventListener('resize', debounce(updateActiveNavLink, 200));
    window.addEventListener('orientationchange', debounce(updateActiveNavLink, 200));
});
