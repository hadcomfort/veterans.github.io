// Main site JavaScript
(function() {
    'use strict';

    // DOM Content Loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeYear();
        initializeLastUpdated();
        initializeNavigation();
        initializeAccessibility();
        initializeAnalytics();
        loadHTMLSnippets(); // Added call
    });

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
                const response = await fetch('https://api.github.com/repos/hadcomfort/veterans.github.io/commits?per_page=1');
                if (!response.ok) {
                    throw new Error(`GitHub API error: ${response.status}`);
                }
                const commits = await response.json();
                if (commits && commits.length > 0) {
                    const lastCommitDate = new Date(commits[0].commit.committer.date);
                    lastUpdatedEl.textContent = lastCommitDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                } else {
                    lastUpdatedEl.textContent = 'Could not retrieve';
                }
            } catch (error) {
                console.error('Error fetching last updated date:', error);
                lastUpdatedEl.textContent = 'Error loading date';
            }
        }
    }

    // Enhanced navigation functionality
    function initializeNavigation() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mainNav = document.querySelector('.main-navigation-menu'); // Use ID for main nav UL

        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                const isExpanded = mainNav.classList.toggle('nav-open');
                this.setAttribute('aria-expanded', isExpanded);
            });
        }

        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a[aria-haspopup="true"]'); // More specific selector
            const content = dropdown.querySelector('.dropdown-content');

            if (trigger && content) {
                trigger.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) { // Mobile/touch behavior
                        e.preventDefault(); // Prevent navigation for parent link

                        const isExpanded = this.getAttribute('aria-expanded') === 'true';

                        // Close other open dropdowns on mobile
                        if (!isExpanded) { // If about to open this one
                            dropdowns.forEach(otherDropdown => {
                                if (otherDropdown !== dropdown) {
                                    otherDropdown.querySelector('a[aria-haspopup="true"]').setAttribute('aria-expanded', 'false');
                                    otherDropdown.querySelector('.dropdown-content').classList.remove('dropdown-open');
                                }
                            });
                        }

                        this.setAttribute('aria-expanded', !isExpanded);
                        content.classList.toggle('dropdown-open');
                    }
                    // Desktop hover is handled by CSS, but ensure aria-expanded is correct if JS interacts
                    // For desktop, if we want click instead of hover, logic would go here
                });
            }
        });

        // Close menu/dropdowns when clicking outside
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768) {
                // Close mobile nav if click is outside
                if (mainNav && mainNav.classList.contains('nav-open')) {
                    if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                        mainNav.classList.remove('nav-open');
                        menuToggle.setAttribute('aria-expanded', 'false');
                    }
                }

                // Close open dropdowns if click is outside
                dropdowns.forEach(dropdown => {
                    const content = dropdown.querySelector('.dropdown-content');
                    const trigger = dropdown.querySelector('a[aria-haspopup="true"]');
                    if (content && content.classList.contains('dropdown-open')) {
                        if (!dropdown.contains(event.target)) {
                            content.classList.remove('dropdown-open');
                            trigger.setAttribute('aria-expanded', 'false');
                        }
                    }
                });
            }
        });
    }

    // Accessibility enhancements
    function initializeAccessibility() {
        // Announce page changes for screen readers
        const announcer = document.createElement('div');
        announcer.setAttribute('role', 'status');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        document.body.appendChild(announcer);

        // Add keyboard navigation hints
        const interactiveElements = document.querySelectorAll('a, button, input, select, textarea');
        interactiveElements.forEach(el => {
            if (!el.getAttribute('aria-label') && !el.getAttribute('aria-labelledby')) {
                const text = el.textContent || el.value || el.placeholder;
                if (!text || text.trim() === '') {
                    console.warn('Interactive element without accessible label:', el);
                }
            }
        });
    }

    // Initialize analytics (placeholder)
    function initializeAnalytics() {
        // This would be replaced with actual analytics code
        if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
            console.log('Analytics would initialize here');
            // Example: Plausible, Umami, or similar privacy-respecting analytics
        }
    }

    // Utility: Screen reader only class .visually-hidden is now in style.css

    // Function to load HTML snippets
    async function loadHTMLSnippets() {
        try {
            const response = await fetch('header.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch header.html: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById('header-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error('Placeholder #header-placeholder not found.');
            }
        } catch (error) {
            console.error('Error loading header.html:', error);
        }

        try {
            const response = await fetch('navigation.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch navigation.html: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById('navigation-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error('Placeholder #navigation-placeholder not found.');
            }
        } catch (error) {
            console.error('Error loading navigation.html:', error);
        }

        try {
            const response = await fetch('footer.html');
            if (!response.ok) {
                throw new Error(`Failed to fetch footer.html: ${response.status}`);
            }
            const html = await response.text();
            const placeholder = document.getElementById('footer-placeholder');
            if (placeholder) {
                placeholder.innerHTML = html;
            } else {
                console.error('Placeholder #footer-placeholder not found.');
            }
        } catch (error) {
            console.error('Error loading footer.html:', error);
        }
    }
})();
