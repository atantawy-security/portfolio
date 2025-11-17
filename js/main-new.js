/**
 * Main Application Entry Point
 * Initializes all modules and sets up the application
 */

import { debounce } from './modules/utils.js';
import { initializeQuote } from './modules/quotes.js';
import { initializeEmailObfuscation } from './modules/email.js';
import { initializeAudienceTabs } from './modules/interactions.js';
import { initializeScrollEffects, initializeFloatingContact, updateActiveNavLink } from './modules/scroll.js';
import { initializeEventDelegation } from './modules/events.js';

/**
 * Initialize all application functionality
 */
function initializeApp() {
    try {
        console.info('Initializing portfolio application...');

        // Set up centralized click handling (must be first)
        initializeEventDelegation();

        // Initialize email obfuscation (important for security)
        initializeEmailObfuscation();

        // Initialize page-specific features
        initializeQuote();
        initializeScrollEffects();
        initializeAudienceTabs();
        initializeFloatingContact();

        // Set initial active navigation state
        updateActiveNavLink();

        // Handle window resize and orientation changes
        const debouncedUpdate = debounce(updateActiveNavLink, 200);
        window.addEventListener('resize', debouncedUpdate);
        window.addEventListener('orientationchange', debouncedUpdate);

        console.info('Portfolio application initialized successfully');
    } catch (error) {
        console.error('Error initializing application:', error);
    }
}

// Initialize when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    // DOM already loaded
    initializeApp();
}
