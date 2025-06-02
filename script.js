// Main site JavaScript
(function() {
    'use strict';

    const config = {
        HTML_SNIPPETS: {
            FOOTER_URL: 'footer.html',
            HEADER_URL: 'header.html',
            NAVIGATION_URL: 'navigation.html',
        },
        PLACEHOLDER_IDS: {
            FOOTER: 'footer-placeholder',
            HEADER: 'header-placeholder',
            NAVIGATION: 'navigation-placeholder',
        },
        API_URLS: {
            GITHUB_COMMITS: 'https://api.github.com/repos/hadcomfort/veterans.github.io/commits?per_page=1',
        },
        LOCALES: {
            DATE: 'en-US',
        },
        MESSAGES: {
            LAST_UPDATED_ERROR: 'Could not retrieve',
            LAST_UPDATED_LOAD_ERROR: 'Error loading date',
        },
        SELECTORS: {
            MENU_TOGGLE: '#header-placeholder .menu-toggle',
            MAIN_NAV_MENU: '#navigation-placeholder .main-navigation-menu',
            DROPDOWN: '#navigation-placeholder .dropdown',
            DROPDOWN_TRIGGER: 'a[aria-haspopup="true"]',
            DROPDOWN_CONTENT: '.dropdown-content',
        },
        CSS_CLASSES: {
            NAV_OPEN: 'nav-open',
            DROPDOWN_OPEN: 'dropdown-open',
            SCREEN_READER_ONLY: 'sr-only',
        },
        BREAKPOINTS: {
            MOBILE_NAV: 768,
        },
        ANALYTICS: {
            DISABLED_HOSTNAMES: ['localhost', '127.0.0.1'],
            CONSOLE_MESSAGE: 'Analytics would initialize here',
        }
    };

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', async function() {
        initializeYear();
        initializeLastUpdated();
        initializeAccessibility();
        initializeAnalytics(); // Corrected typo from initializeAnalytis

        try {
            await loadHTMLSnippetsAndInitializeNav();
        } catch (error) {
            console.error("Failed to load HTML snippets and initialize navigation:", error);
            // Optionally, display a user-friendly message on the page
        }
    });

    // New function to load HTML snippets and then initialize navigation
    async function loadHTMLSnippetsAndInitializeNav() {
        const loadSnippet = async (url, placeholderId) => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
                }
                const html = await response.text();
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = html;
                } else {
                    console.error(`Placeholder #${placeholderId} not found.`);
                    throw new Error(`Placeholder #${placeholderId} not found.`);
                }
            } catch (error) {
                console.error(`Error loading ${url}:`, error);
                throw error; // Re-throw to be caught by Promise.all or the caller
            }
        };

        // Load footer independently - no need to await for nav initialization
        loadSnippet(config.HTML_SNIPPETS.FOOTER_URL, config.PLACEHOLDER_IDS.FOOTER).catch(error => {
            console.error('Error loading footer.html (non-critical):', error);
        });

        try {
            // Wait for header and navigation to be loaded and injected
            await Promise.all([
                loadSnippet(config.HTML_SNIPPETS.HEADER_URL, config.PLACEHOLDER_IDS.HEADER),
                loadSnippet(config.HTML_SNIPPETS.NAVIGATION_URL, config.PLACEHOLDER_IDS.NAVIGATION)
            ]);
            initializeNavigation(); // Call initializeNavigation after header and nav are loaded
        } catch (error) {
            console.error("Error loading critical HTML (header/navigation):", error);
            // If header or navigation fails, we might want to stop further JS execution
            // or display a prominent error message.
            throw error; // Re-throw to be caught by DOMContentLoaded listener
        }
    }

    // Update current year
    function initializeYear() {
        const yearElements = document.querySelectorAll('#current-year');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    // Show last GitHub update
    async function initializeLastUpdated() {
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            try {
                // Replace with actual owner and repo if different
                const response = await fetch(config.API_URLS.GITHUB_COMMITS);
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                const commits = await response.json();
                if (commits && commits.length > 0) {
                    const lastCommitDate = new Date(commits[0].commit.committer.date);
                    lastUpdatedEl.textContent = lastCommitDate.toLocaleDateString(config.LOCALES.DATE, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } else {
                    lastUpdatedEl.textContent = config.MESSAGES.LAST_UPDATED_ERROR;
                }
            } catch (error) {
                console.error('Error fetching last updated date:', error);
                lastUpdatedEl.textContent = config.MESSAGES.LAST_UPDATED_LOAD_ERROR;
            }
        }
    }

    // Enhanced navigation functionality

    function initMenuToggle(config, mainNav, menuToggle) {
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                const isExpanded = mainNav.classList.toggle(config.CSS_CLASSES.NAV_OPEN);
                this.setAttribute('aria-expanded', isExpanded);
            });
        }
    }

    function initDropdowns(config, dropdowns) {
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector(config.SELECTORS.DROPDOWN_TRIGGER); // More specific selector
            const content = dropdown.querySelector(config.SELECTORS.DROPDOWN_CONTENT);

            if (trigger && content) {
                trigger.addEventListener('click', function(e) {
                    if (window.innerWidth <= config.BREAKPOINTS.MOBILE_NAV) { // Mobile/touch behavior
                        e.preventDefault(); // Prevent navigation for parent link

                        const isExpanded = this.getAttribute('aria-expanded') === 'true';

                        // Close other open dropdowns on mobile
                        if (!isExpanded) { // If about to open this one
                            dropdowns.forEach(otherDropdown => {
                                if (otherDropdown !== dropdown) {
                                    otherDropdown.querySelector(config.SELECTORS.DROPDOWN_TRIGGER).setAttribute('aria-expanded', 'false');
                                    otherDropdown.querySelector(config.SELECTORS.DROPDOWN_CONTENT).classList.remove(config.CSS_CLASSES.DROPDOWN_OPEN);
                                }
                            });
                        }

                        this.setAttribute('aria-expanded', !isExpanded);
                        content.classList.toggle(config.CSS_CLASSES.DROPDOWN_OPEN);
                    }
                    // Desktop hover is handled by CSS, but ensure aria-expanded is correct if JS interacts
                    // For desktop, if we want click instead of hover, logic would go here
                });
            }
        });
    }

    function initClickOutsideNav(config, mainNav, menuToggle, dropdowns) {
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= config.BREAKPOINTS.MOBILE_NAV) {
                // Close mobile nav if click is outside
                if (mainNav && mainNav.classList.contains(config.CSS_CLASSES.NAV_OPEN)) {
                    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                        mainNav.classList.remove(config.CSS_CLASSES.NAV_OPEN);
                        if (menuToggle) { // Ensure menuToggle exists before setting attribute
                            menuToggle.setAttribute('aria-expanded', 'false');
                        }
                    }
                }

                // Close open dropdowns if click is outside
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector(config.SELECTORS.DROPDOWN_CONTENT);
                    const trigger = dropdown.querySelector(config.SELECTORS.DROPDOWN_TRIGGER);
                    if (content && content.classList.contains(config.CSS_CLASSES.DROPDOWN_OPEN)) {
                        if (!dropdown.contains(event.target)) {
                            content.classList.remove(config.CSS_CLASSES.DROPDOWN_OPEN);
                            if (trigger) { // Ensure trigger exists
                                trigger.setAttribute('aria-expanded', 'false');
                            }
                        }
                    }
                });
            }
        });
    }

    function initializeNavigation() {
        const menuToggle = document.querySelector(config.SELECTORS.MENU_TOGGLE);
        const mainNav = document.querySelector(config.SELECTORS.MAIN_NAV_MENU);
        const dropdowns = document.querySelectorAll(config.SELECTORS.DROPDOWN);

        if (!menuToggle) {
            console.error("Menu toggle button (.menu-toggle) not found within #header-placeholder.");
        }
        if (!mainNav) {
            console.error("Main navigation menu (.main-navigation-menu) not found within #navigation-placeholder.");
        }
        // No error needed for dropdowns, as it might be empty if no dropdowns are used.

        initMenuToggle(config, mainNav, menuToggle);
        initDropdowns(config, dropdowns);
        initClickOutsideNav(config, mainNav, menuToggle, dropdowns);
    }

    // Accessibility enhancements

    function initScreenReaderAnnouncer(config) {
        // Announce page changes for screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');

        if (config && config.CSS_CLASSES && typeof config.CSS_CLASSES.SCREEN_READER_ONLY === 'string') {
            announcer.className = config.CSS_CLASSES.SCREEN_READER_ONLY;
        } else {
            announcer.className = 'sr-only'; // Default class if config is missing
            console.warn('Config issue: config.CSS_CLASSES.SCREEN_READER_ONLY is not defined. Using default "sr-only".');
        }
        // Ensure document.body exists before appending. Should be true within DOMContentLoaded.
        if (document.body) {
            document.body.appendChild(announcer);
        } else {
            console.error('document.body is not available when trying to append screen reader announcer.');
        }
    }

    function checkAccessibleLabels(config) {
        // Add keyboard navigation hints
        // Consider making selector configurable if it varies often
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
                const text = el.textContent || el.value || el.placeholder;
                if (!text || text.trim() === '') {
                    // Check if the element is hidden or inside a hidden element
                    if (el.offsetParent !== null) { // Basic check for visibility
                         console.warn('Interactive element without accessible label:', el);
                    }
                }
            }
        });
    }

    function initializeAccessibility() {
        initScreenReaderAnnouncer(config);
        checkAccessibleLabels(config);
    }

    // Initialize analytics (placeholder)
    function initializeAnalytics() {
        // This would be replaced with actual analytics code
        if (!config.ANALYTICS.DISABLED_HOSTNAMES.includes(window.location.hostname)) {
            console.log(config.ANALYTICS.CONSOLE_MESSAGE);
            // Example: Plausible, Umami, or similar privacy-respecting analytics
        }
    }

    // Utility: Screen reader only class .visually-hidden is now in style.css

    // Utility: Screen reader only class .visually-hidden is now in style.css

})();
