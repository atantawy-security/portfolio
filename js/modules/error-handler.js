/**
 * Global Error Handler Module
 * Provides centralized error handling, logging, and user notifications
 */

/**
 * Global error state
 */
const errorState = {
    errors: [],
    maxErrors: 50,
    listeners: []
};

/**
 * Error severity levels
 */
export const ErrorSeverity = {
    INFO: 'info',
    WARNING: 'warning',
    ERROR: 'error',
    CRITICAL: 'critical'
};

/**
 * Log an error to the error state
 * @param {Error|string} error - Error object or message
 * @param {string} severity - Error severity level
 * @param {Object} context - Additional context
 */
function logError(error, severity = ErrorSeverity.ERROR, context = {}) {
    const errorEntry = {
        message: error?.message || String(error),
        stack: error?.stack || null,
        severity,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    // Add to error state
    errorState.errors.push(errorEntry);

    // Keep only last N errors
    if (errorState.errors.length > errorState.maxErrors) {
        errorState.errors.shift();
    }

    // Notify listeners
    errorState.listeners.forEach(listener => {
        try {
            listener(errorEntry);
        } catch (e) {
            console.error('Error in error listener:', e);
        }
    });

    // Log to console based on severity
    const consoleMethod = severity === ErrorSeverity.WARNING ? 'warn' : 'error';
    console[consoleMethod]('[Error Handler]', errorEntry);
}

/**
 * Initialize global error handlers
 */
export function initializeGlobalErrorHandlers() {
    // Handle uncaught JavaScript errors
    window.addEventListener('error', (event) => {
        logError(event.error || event.message, ErrorSeverity.ERROR, {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            type: 'uncaught-error'
        });

        // Prevent default browser error handling for better UX
        return true;
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        logError(
            new Error(event.reason?.message || String(event.reason)),
            ErrorSeverity.ERROR,
            {
                type: 'unhandled-promise-rejection',
                reason: event.reason
            }
        );

        // Prevent default browser error handling
        event.preventDefault();
    });

    // Handle resource loading errors (images, scripts, etc.)
    window.addEventListener('error', (event) => {
        if (event.target !== window) {
            const element = event.target;
            const tagName = element.tagName?.toLowerCase();

            if (tagName === 'img' || tagName === 'script' || tagName === 'link') {
                logError(
                    new Error(`Failed to load ${tagName}: ${element.src || element.href}`),
                    ErrorSeverity.WARNING,
                    {
                        type: 'resource-load-error',
                        tagName,
                        src: element.src || element.href
                    }
                );
            }
        }
    }, true); // Use capture phase to catch resource errors

    console.log('[Error Handler] Global error handlers initialized');
}

/**
 * Handle image loading errors with fallback
 * @param {HTMLImageElement} img - Image element
 * @param {string} fallbackSrc - Fallback image source
 */
export function handleImageError(img, fallbackSrc = null) {
    if (!img || img.tagName !== 'IMG') {
        console.warn('handleImageError: Invalid image element');
        return;
    }

    const originalSrc = img.src;

    img.addEventListener('error', function onError() {
        // Prevent infinite loop if fallback also fails
        if (img.dataset.errorHandled === 'true') {
            logError(
                new Error(`Image fallback also failed: ${originalSrc}`),
                ErrorSeverity.ERROR,
                { originalSrc, fallbackSrc }
            );
            return;
        }

        img.dataset.errorHandled = 'true';
        logError(
            new Error(`Image failed to load: ${originalSrc}`),
            ErrorSeverity.WARNING,
            { originalSrc }
        );

        // Apply fallback
        if (fallbackSrc) {
            img.src = fallbackSrc;
            img.alt = img.alt || 'Image not available';
        } else {
            // Create a placeholder
            img.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <rect width="100" height="100" fill="#f0f0f0"/>
                    <text x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#999">
                        Image unavailable
                    </text>
                </svg>
            `;
            img.parentNode?.insertBefore(placeholder, img);
        }
    }, { once: true });
}

/**
 * Initialize all images with error handling
 */
export function initializeImageErrorHandling() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Skip if already handled
        if (img.dataset.errorHandlerInit === 'true') return;

        img.dataset.errorHandlerInit = 'true';
        handleImageError(img);
    });

    console.log(`[Error Handler] Initialized error handling for ${images.length} images`);
}

/**
 * Handle network errors with retry logic
 * @param {Function} fetchFunction - Function that performs the fetch
 * @param {Object} options - Options for retry logic
 * @returns {Promise} Promise that resolves with the response
 */
export async function handleNetworkRequest(fetchFunction, options = {}) {
    const {
        maxRetries = 3,
        retryDelay = 1000,
        timeout = 10000,
        onError = null
    } = options;

    let lastError;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Create timeout promise
            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Request timeout')), timeout);
            });

            // Race between fetch and timeout
            const result = await Promise.race([
                fetchFunction(),
                timeoutPromise
            ]);

            return result;
        } catch (error) {
            lastError = error;

            logError(error, ErrorSeverity.WARNING, {
                type: 'network-error',
                attempt: attempt + 1,
                maxRetries: maxRetries + 1
            });

            // Don't retry on last attempt
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
            }
        }
    }

    // All retries failed
    logError(lastError, ErrorSeverity.ERROR, {
        type: 'network-error-all-retries-failed',
        maxRetries: maxRetries + 1
    });

    if (onError) {
        onError(lastError);
    }

    throw lastError;
}

/**
 * Check if user is online
 * @returns {boolean} Online status
 */
export function isOnline() {
    return navigator.onLine;
}

/**
 * Initialize online/offline handlers
 */
export function initializeNetworkHandlers() {
    window.addEventListener('online', () => {
        console.log('[Error Handler] Network connection restored');
        showNetworkNotification('Connection restored', 'success');
    });

    window.addEventListener('offline', () => {
        logError(
            new Error('Network connection lost'),
            ErrorSeverity.WARNING,
            { type: 'network-offline' }
        );
        showNetworkNotification('No internet connection', 'warning');
    });

    // Check initial state
    if (!isOnline()) {
        showNetworkNotification('No internet connection', 'warning');
    }

    console.log('[Error Handler] Network handlers initialized');
}

/**
 * Show a user-friendly notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type (success, warning, error)
 */
function showNetworkNotification(message, type = 'info') {
    // Remove existing notification if present
    const existing = document.getElementById('network-notification');
    if (existing) {
        existing.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'network-notification';
    notification.className = `network-notification network-notification--${type}`;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('network-notification--fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

/**
 * Add error listener
 * @param {Function} listener - Listener function
 */
export function addErrorListener(listener) {
    if (typeof listener === 'function') {
        errorState.listeners.push(listener);
    }
}

/**
 * Get all logged errors
 * @returns {Array} Array of error entries
 */
export function getErrors() {
    return [...errorState.errors];
}

/**
 * Clear all logged errors
 */
export function clearErrors() {
    errorState.errors = [];
}

/**
 * Initialize all error handling systems
 */
export function initializeErrorHandling() {
    initializeGlobalErrorHandlers();
    initializeImageErrorHandling();
    initializeNetworkHandlers();

    console.log('[Error Handler] All error handling systems initialized');
}
