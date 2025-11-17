/**
 * Utility Functions Module
 * Provides reusable helper functions for performance optimization
 */

/**
 * Debounce function for performance optimization
 * Delays function execution until after wait time has elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 100) {
    if (typeof func !== 'function') {
        console.error('Debounce: First argument must be a function');
        return () => {};
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
 * Limits function execution to once per time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 100) {
    if (typeof func !== 'function') {
        console.error('Throttle: First argument must be a function');
        return () => {};
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
 * Safely get element by ID with error handling
 * @param {string} id - Element ID
 * @returns {HTMLElement|null} Element or null if not found
 */
export function getElementByIdSafe(id) {
    if (!id || typeof id !== 'string') {
        console.warn('getElementByIdSafe: Invalid ID provided');
        return null;
    }

    try {
        return document.getElementById(id);
    } catch (error) {
        console.error(`Error getting element with ID "${id}":`, error);
        return null;
    }
}

/**
 * Safely query selector with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {HTMLElement|null} Element or null if not found
 */
export function querySelectorSafe(selector, context = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn('querySelectorSafe: Invalid selector provided');
        return null;
    }

    try {
        return context.querySelector(selector);
    } catch (error) {
        console.error(`Error querying selector "${selector}":`, error);
        return null;
    }
}

/**
 * Safely query selector all with error handling
 * @param {string} selector - CSS selector
 * @param {HTMLElement} context - Context element (default: document)
 * @returns {NodeList|Array} NodeList or empty array if error
 */
export function querySelectorAllSafe(selector, context = document) {
    if (!selector || typeof selector !== 'string') {
        console.warn('querySelectorAllSafe: Invalid selector provided');
        return [];
    }

    try {
        return context.querySelectorAll(selector);
    } catch (error) {
        console.error(`Error querying selector "${selector}":`, error);
        return [];
    }
}
