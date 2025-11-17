/**
 * Quotes Module
 * Handles random quote display functionality
 */

import { getElementByIdSafe } from './utils.js';

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
 * Parse quote string into quote and author components
 * @param {string} quoteString - Quote string in format "Quote text. - Author Name"
 * @returns {{text: string, author: string}} Parsed quote object
 */
function parseQuote(quoteString) {
    if (!quoteString || typeof quoteString !== 'string') {
        console.warn('Invalid quote string provided');
        return { text: '', author: 'Anonymous' };
    }

    try {
        const parts = quoteString.split(' - ');
        const text = parts[0]?.trim() || '';
        const author = parts.length > 1 ? parts[1]?.trim() : 'Anonymous';

        return { text, author };
    } catch (error) {
        console.error('Error parsing quote:', error);
        return { text: quoteString, author: 'Anonymous' };
    }
}

/**
 * Get a random quote from the quotes array
 * @returns {string} Random quote string
 */
function getRandomQuote() {
    try {
        if (!quotes || quotes.length === 0) {
            console.warn('No quotes available');
            return "Security is a continuous journey of improvement.  - Anonymous";
        }

        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    } catch (error) {
        console.error('Error getting random quote:', error);
        return "Security is a continuous journey of improvement. - Anonymous";
    }
}

/**
 * Initialize quote display on page load
 * Selects a random quote and displays it in the designated elements
 */
export function initializeQuote() {
    try {
        const quoteElement = getElementByIdSafe('quote');
        const authorElement = getElementByIdSafe('quote-author');

        // Only proceed if both elements exist
        if (!quoteElement || !authorElement) {
            console.info('Quote elements not found on this page - skipping quote initialization');
            return;
        }

        const randomQuote = getRandomQuote();
        const { text, author } = parseQuote(randomQuote);

        if (text) {
            quoteElement.textContent = `"${text}"`;
            authorElement.textContent = `— ${author}`;
        }
    } catch (error) {
        console.error('Error initializing quote:', error);
    }
}
