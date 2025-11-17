/**
 * Email Obfuscation Module
 * Handles email address construction to prevent scraping
 */

import { querySelectorAllSafe } from './utils.js';

/**
 * Construct email address from data attributes
 * @param {HTMLElement} element - Element with data-user and data-domain attributes
 * @returns {string|null} Constructed email address or null if invalid
 */
function constructEmail(element) {
    if (!element || !element.dataset) {
        console.warn('Invalid element provided to constructEmail');
        return null;
    }

    try {
        const user = element.dataset.user;
        const domain = element.dataset.domain;

        if (!user || !domain) {
            console.warn('Missing user or domain data attributes');
            return null;
        }

        // Basic validation
        if (typeof user !== 'string' || typeof domain !== 'string') {
            console.warn('Invalid user or domain data type');
            return null;
        }

        return `${user}@${domain}`;
    } catch (error) {
        console.error('Error constructing email:', error);
        return null;
    }
}

/**
 * Handle email link clicks
 * @param {Event} e - Click event
 * @param {HTMLElement} emailTarget - Target element with email data
 */
export function handleEmailClick(e, emailTarget) {
    if (!emailTarget) {
        return;
    }

    try {
        e.preventDefault();

        const email = constructEmail(emailTarget);
        if (email) {
            // Use encodeURIComponent for proper email URI encoding
            window.location.href = `mailto:${encodeURIComponent(email)}`;
        } else {
            console.error('Could not construct email address');
        }
    } catch (error) {
        console.error('Error handling email click:', error);
    }
}

/**
 * Initialize email obfuscation
 * Constructs and displays email addresses from data attributes
 */
export function initializeEmailObfuscation() {
    try {
        // Find all elements with data-user and data-domain attributes
        const elements = querySelectorAllSafe('[data-user][data-domain]');

        if (elements.length === 0) {
            console.info('No email obfuscation elements found on this page');
            return;
        }

        elements.forEach(element => {
            try {
                // If it's a span (display element), set the text content
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
