/**
 * Events Module
 * Centralized event delegation and handling
 */

import { toggleCert, toggleProject } from './interactions.js';
import { handleEmailClick } from './email.js';
import { scrollToTop } from './scroll.js';

/**
 * Initialize centralized click event delegation
 * Uses event delegation for better performance and dynamic element support
 */
export function initializeEventDelegation() {
    try {
        document.addEventListener('click', (e) => {
            try {
                // Handle data-toggle attributes (cert badges and project cards)
                const toggleTarget = e.target.closest('[data-toggle]');
                if (toggleTarget) {
                    e.preventDefault();
                    const type = toggleTarget.dataset.toggle;

                    if (type === 'cert') {
                        toggleCert(toggleTarget);
                    } else if (type === 'project') {
                        toggleProject(toggleTarget);
                    } else {
                        console.warn(`Unknown toggle type: ${type}`);
                    }
                    return;
                }

                // Handle data-action attributes (scroll-to-top button, etc.)
                const actionTarget = e.target.closest('[data-action]');
                if (actionTarget) {
                    e.preventDefault();
                    const action = actionTarget.dataset.action;

                    if (action === 'scroll-top') {
                        scrollToTop();
                    } else {
                        console.warn(`Unknown action: ${action}`);
                    }
                    return;
                }

                // Handle email obfuscation clicks
                const emailTarget = e.target.closest('[data-user][data-domain]');
                if (emailTarget && emailTarget.tagName === 'A') {
                    handleEmailClick(e, emailTarget);
                    return;
                }
            } catch (error) {
                console.error('Error in click event handler:', error);
            }
        });
    } catch (error) {
        console.error('Error initializing event delegation:', error);
    }
}
