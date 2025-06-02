VetPlanv3

# Veterans Info Website Development Plan v3

## Executive Summary
**Project Goal**: Create veterans.github.io, an authoritative informational website explaining Veterans' Preference in federal employment, featuring an interactive eligibility guide tool. All content must be sourced exclusively from the OPM Vet Guide for HR Professionals, meet WCAG 2.1 AA accessibility standards, and present a professional, trustworthy appearance.

**Key Deliverables**:
- Static website hosted on GitHub Pages
- Interactive decision-tree tool for eligibility guidance
- Comprehensive content covering all OPM guide topics
- Full accessibility compliance
- Privacy-respecting analytics
- Ongoing maintenance system

---

## Phase 1: Environment Setup & Repository Creation

### 1.1 Create GitHub Account
1. Navigate to [GitHub.com](https://github.com) and sign up
2. **Username**: `veterans` (critical for root URL)
   - If unavailable, use `veterans-preference-info` or similar
3. Verify email and complete profile setup

### 1.2 Install Development Tools

#### Visual Studio Code
1. Download from [code.visualstudio.com](https://code.visualstudio.com)
2. Install following your OS instructions
3. Install essential extensions:
   - **Live Server** (Ritwick Dey) - Local development
   - **Prettier** - Code formatting
   - **GitLens** - Enhanced Git integration
   - **axe Accessibility Linter** - Accessibility checking
   - **ESLint** - JavaScript linting
   - **HTML CSS Support** - Enhanced HTML/CSS editing

### 1.3 Create Website Repository
1. Log into GitHub as `veterans-info`
2. Click "+" → "New repository"
3. **Repository name**: `veterans-info.github.io` (exact naming required)
4. **Description**: "Official resource for Veterans' Preference in federal hiring, based on OPM guidance"
5. Set as **Public** repository
6. Initialize with README
7. Create repository

### 1.4 Clone and Configure
1. Copy repository HTTPS URL
2. In VS Code: `Ctrl/Cmd + Shift + P` → "Git: Clone"
3. Paste URL and select local directory
4. Open cloned repository

### 1.5 Enable GitHub Pages
1. Repository Settings → Pages
2. Source: "Deploy from a branch"
3. Branch: `main` / `(root)`
4. Save and note the URL: `https://veterans-info.github.io/`

---

## Phase 2: Foundation Development

### 2.1 File Structure
Create the following structure:
```
veterans-info.github.io/
├── index.html
├── style.css
├── script.js
├── tool.html
├── tool.js
├── sitemap.xml
├── robots.txt
├── accessibility-statement.html
├── privacy-policy.html
├── images/
│   └── (logos, icons if needed)
├── content/
│   ├── eligibility/
│   │   ├── basic-requirements.html
│   │   ├── character-of-discharge.html
│   │   └── documentation.html
│   ├── preference-types/
│   │   ├── 5-point.html
│   │   ├── 10-point.html
│   │   └── derivative.html
│   ├── special-authorities/
│   ├── rif-procedures/
│   └── faq.html
└── docs/
    ├── MAINTENANCE.md
    └── CHANGELOG.md
```

### 2.2 Homepage Template (index.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veterans' Preference Guide - Official Federal Employment Resource</title>
    <meta name="description" content="Comprehensive guide to Veterans' Preference in federal employment. Based on official OPM guidance. Includes eligibility requirements, preference types, and interactive assessment tool.">
    <meta name="keywords" content="veterans preference, federal employment, OPM, veteran hiring, 5-point preference, 10-point preference">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Veterans' Preference Guide">
    <meta property="og:description" content="Official resource for understanding Veterans' Preference in federal hiring">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://veterans-info.github.io/">
    
    <link rel="stylesheet" href="style.css">
    <link rel="canonical" href="https://veterans-info.github.io/">
    
    <!-- Preconnect to external domains -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
</head>
<body>
    <!-- Skip Navigation -->
    <a href="#main-content" class="skip-link">Skip to main content</a>
    
    <!-- Header -->
    <header role="banner">
        <div class="header-content">
            <h1>Veterans' Preference Guide</h1>
            <p class="tagline">Your Official Resource for Federal Employment Benefits</p>
        </div>
        
        <nav role="navigation" aria-label="Main navigation">
            <ul>
                <li><a href="/" aria-current="page">Home</a></li>
                <li class="dropdown">
                    <a href="#" aria-haspopup="true" aria-expanded="false">Eligibility</a>
                    <ul class="dropdown-content">
                        <li><a href="/content/eligibility/basic-requirements.html">Basic Requirements</a></li>
                        <li><a href="/content/eligibility/character-of-discharge.html">Character of Discharge</a></li>
                        <li><a href="/content/eligibility/documentation.html">Required Documents</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" aria-haspopup="true" aria-expanded="false">Preference Types</a>
                    <ul class="dropdown-content">
                        <li><a href="/content/preference-types/5-point.html">5-Point Preference</a></li>
                        <li><a href="/content/preference-types/10-point.html">10-Point Preference</a></li>
                        <li><a href="/content/preference-types/derivative.html">Derivative Preference</a></li>
                    </ul>
                </li>
                <li><a href="/tool.html">Interactive Guide</a></li>
                <li><a href="/content/faq.html">FAQ</a></li>
            </ul>
        </nav>
    </header>
    
    <!-- Main Content -->
    <main id="main-content" role="main">
        <section class="hero">
            <h2>Understanding Veterans' Preference in Federal Employment</h2>
            <p>This site provides comprehensive guidance on Veterans' Preference based on the official OPM Vet Guide for HR Professionals. Whether you're a veteran, family member, or HR professional, find the information you need to understand this important benefit.</p>
            <div class="cta-buttons">
                <a href="/tool.html" class="btn btn-primary">Start Interactive Guide</a>
                <a href="/content/eligibility/basic-requirements.html" class="btn btn-secondary">Learn About Eligibility</a>
            </div>
        </section>
        
        <section class="features">
            <h2>How We Can Help</h2>
            <div class="feature-grid">
                <article class="feature-card">
                    <h3>Determine Eligibility</h3>
                    <p>Learn about the requirements for Veterans' Preference and what documentation you'll need.</p>
                    <a href="/content/eligibility/basic-requirements.html" aria-label="Learn more about eligibility requirements">Learn More →</a>
                </article>
                
                <article class="feature-card">
                    <h3>Understand Preference Types</h3>
                    <p>Explore the different types of preference (5-point, 10-point, derivative) and how they apply.</p>
                    <a href="/content/preference-types/5-point.html" aria-label="Learn more about preference types">Explore Types →</a>
                </article>
                
                <article class="feature-card">
                    <h3>Use Our Interactive Tool</h3>
                    <p>Answer guided questions to help determine your potential preference eligibility and required documentation.</p>
                    <a href="/tool.html" aria-label="Start the interactive eligibility guide">Start Guide →</a>
                </article>
            </div>
        </section>
        
        <section class="disclaimer">
            <h2>Important Information</h2>
            <p>This website is for informational purposes only and does not constitute legal advice or official determination of eligibility. All information is based on the <a href="https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/" target="_blank" rel="noopener noreferrer">OPM Vet Guide for HR Professionals</a>. For official determinations, consult with your agency's HR department or a Veterans Service Officer.</p>
        </section>
    </main>
    
    <!-- Footer -->
    <footer role="contentinfo">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/sitemap.xml">Sitemap</a></li>
                    <li><a href="/accessibility-statement.html">Accessibility</a></li>
                    <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li><a href="https://www.opm.gov" target="_blank" rel="noopener noreferrer">OPM.gov</a></li>
                    <li><a href="https://www.va.gov" target="_blank" rel="noopener noreferrer">VA.gov</a></li>
                    <li><a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJOBS</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Contact</h3>
                <p>For site feedback: <a href="mailto:feedback@veterans-info.github.io">feedback@veterans-info.github.io</a></p>
                <p>For official inquiries: Contact your agency HR or VSO</p>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <span id="current-year"></span> Veterans Info. This is an unofficial informational resource.</p>
            <p>Last updated: <span id="last-updated">Loading...</span></p>
        </div>
    </footer>
    
    <script src="script.js"></script>
</body>
</html>
```

### 2.3 Enhanced Stylesheet (style.css)
```css
/* CSS Variables for Consistent Theming */
:root {
    --primary-color: #005ea2;
    --primary-dark: #003d73;
    --secondary-color: #0076d6;
    --success-color: #2e8540;
    --warning-color: #e66f2e;
    --error-color: #d83933;
    
    --text-primary: #212529;
    --text-secondary: #495057;
    --text-light: #6c757d;
    
    --bg-primary: #ffffff;
    --bg-secondary: #f8f9fa;
    --bg-tertiary: #e9ecef;
    
    --border-color: #dee2e6;
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.05);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07);
    
    --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    --font-mono: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", monospace;
    
    --radius-sm: 4px;
    --radius-md: 6px;
    --radius-lg: 8px;
    
    --transition-fast: 150ms ease-in-out;
    --transition-normal: 250ms ease-in-out;
}

/* Base Styles */
* {
    box-sizing: border-box;
}

body {
    margin: 0;
    padding: 0;
    font-family: var(--font-sans);
    font-size: 16px;
    line-height: 1.7;
    color: var(--text-primary);
    background-color: var(--bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* Typography */
h1, h2, h3, h4, h5, h6 {
    margin-top: 0;
    margin-bottom: 0.5em;
    font-weight: 600;
    line-height: 1.3;
}

h1 { font-size: 2.5rem; }
h2 { font-size: 2rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.25rem; }
h5 { font-size: 1.125rem; }
h6 { font-size: 1rem; }

p {
    margin-top: 0;
    margin-bottom: 1rem;
}

/* Links */
a {
    color: var(--primary-color);
    text-decoration: underline;
    transition: color var(--transition-fast);
}

a:hover {
    color: var(--primary-dark);
    text-decoration: underline;
}

a:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Skip Link */
.skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-color);
    color: white;
    padding: 8px 16px;
    text-decoration: none;
    border-radius: 0 0 var(--radius-sm) 0;
    transition: top var(--transition-normal);
    z-index: 10000;
}

.skip-link:focus {
    top: 0;
}

/* Header */
header {
    background: var(--bg-primary);
    border-bottom: 1px solid var(--border-color);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: var(--shadow-sm);
}

.header-content {
    text-align: center;
    padding: 1.5rem 1rem 1rem;
}

.header-content h1 {
    margin: 0;
    font-size: 2rem;
    color: var(--primary-color);
}

.tagline {
    margin: 0.25rem 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
}

/* Navigation */
nav ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
}

nav li {
    position: relative;
}

nav a {
    display: block;
    padding: 0.75rem 1.25rem;
    color: var(--text-primary);
    text-decoration: none;
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    font-weight: 500;
}

nav a:hover,
nav a:focus {
    background: var(--bg-tertiary);
    color: var(--primary-dark);
}

nav a[aria-current="page"] {
    background: var(--bg-secondary);
    color: var(--primary-color);
}

/* Dropdown Navigation */
.dropdown {
    position: relative;
}

.dropdown-content {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 200px;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-md);
    margin-top: 0.5rem;
}

.dropdown:hover .dropdown-content,
.dropdown:focus-within .dropdown-content {
    display: block;
}

.dropdown-content a {
    padding: 0.75rem 1rem;
    border-radius: 0;
}

.dropdown-content li:first-child a {
    border-radius: var(--radius-md) var(--radius-md) 0 0;
}

.dropdown-content li:last-child a {
    border-radius: 0 0 var(--radius-md) var(--radius-md);
}

/* Main Content */
main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

/* Sections */
section {
    margin-bottom: 3rem;
}

/* Hero Section */
.hero {
    text-align: center;
    padding: 2rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-lg);
    margin-bottom: 3rem;
}

.hero h2 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.cta-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1.5rem;
}

/* Buttons */
.btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.btn:focus {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-primary:hover {
    background: var(--primary-dark);
}

.btn-secondary {
    background: var(--bg-secondary);
    color: var(--primary-color);
    border: 2px solid var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
}

/* Feature Grid */
.feature-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
}

.feature-card {
    padding: 1.5rem;
    background: var(--bg-primary);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: all var(--transition-normal);
}

.feature-card:hover {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-md);
}

.feature-card h3 {
    color: var(--primary-color);
    margin-bottom: 0.75rem;
}

/* Disclaimer */
.disclaimer {
    background: #fff3cd;
    border: 1px solid #ffeaa7;
    border-radius: var(--radius-md);
    padding: 1.5rem;
    margin: 2rem 0;
}

.disclaimer h2 {
    color: #856404;
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
}

.disclaimer p {
    color: #856404;
    margin: 0;
}

/* Footer */
footer {
    background: var(--bg-secondary);
    border-top: 1px solid var(--border-color);
    margin-top: 4rem;
    padding: 2rem 1rem 1rem;
}

.footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
}

.footer-section h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-section li {
    margin-bottom: 0.5rem;
}

.footer-bottom {
    max-width: 1200px;
    margin: 2rem auto 0;
    padding-top: 2rem;
    border-top: 1px solid var(--border-color);
    text-align: center;
    color: var(--text-secondary);
    font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
    h1 { font-size: 2rem; }
    h2 { font-size: 1.5rem; }
    h3 { font-size: 1.25rem; }
    
    .header-content h1 {
        font-size: 1.5rem;
    }
    
    nav ul {
        flex-direction: column;
        padding: 1rem 0;
    }
    
    .dropdown-content {
        position: static;
        display: block;
        box-shadow: none;
        border: none;
        background: var(--bg-tertiary);
        margin: 0;
    }
    
    .cta-buttons {
        flex-direction: column;
    }
    
    .btn {
        width: 100%;
    }
}

@media (max-width: 480px) {
    .header-content h1 {
        font-size: 1.25rem;
    }
    
    main {
        padding: 1rem;
    }
    
    section {
        margin-bottom: 2rem;
    }
}

/* Print Styles */
@media print {
    header, footer {
        display: none;
    }
    
    main {
        max-width: 100%;
    }
    
    a {
        text-decoration: none;
        color: inherit;
    }
    
    a[href]:after {
        content: " (" attr(href) ")";
        font-size: 0.8em;
    }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
    :root {
        --primary-color: #0056b3;
        --bg-secondary: #f0f0f0;
        --border-color: #000000;
    }
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

### 2.4 Enhanced JavaScript Foundation (script.js)
```javascript
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
    function initializeLastUpdated() {
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            // This would be replaced with actual GitHub API call in production
            const lastUpdated = new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            lastUpdatedEl.textContent = lastUpdated;
        }
    }

    // Enhanced navigation functionality
    function initializeNavigation() {
        // Mobile menu toggle if implemented
        const menuToggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('nav ul');
        
        if (menuToggle && nav) {
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('active');
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
            });
        }

        // Dropdown keyboard navigation
        const dropdowns = document.querySelectorAll('.dropdown');
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('a');
            const content = dropdown.querySelector('.dropdown-content');
            
            if (trigger && content) {
                trigger.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const expanded = this.getAttribute('aria-expanded') === 'true';
                        this.setAttribute('aria-expanded', !expanded);
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

    // Utility: Screen reader only class
    const srOnlyStyle = document.createElement('style');
    srOnlyStyle.textContent = `
        .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border-width: 0;
        }
    `;
    document.head.appendChild(srOnlyStyle);

})();
```

---

## Phase 3: Interactive Tool Development

### 3.1 Tool HTML Structure (tool.html)
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Veterans' Preference Interactive Guide - Eligibility Assessment Tool</title>
    <meta name="description" content="Interactive tool to help determine Veterans' Preference eligibility and required documentation based on OPM guidelines.">
    <link rel="stylesheet" href="style.css">
    <link rel="stylesheet" href="tool-styles.css">
    <!-- Favicon (assuming from index.html structure, adjust if needed) -->
    <link rel="icon" type="image/svg+xml" href="/images/favicon.svg">
    <!-- Preconnect to external domains (assuming from index.html structure, adjust if needed) -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
</head>
<body>
    <a href="#tool-content" class="skip-link">Skip to assessment tool</a>

    <!-- Header reused from index.html -->
    <header role="banner">
        <div class="header-content">
            <h1>Veterans' Preference Guide</h1>
            <p class="tagline">Your Official Resource for Federal Employment Benefits</p>
        </div>
        <nav role="navigation" aria-label="Main navigation">
            <ul>
                <li><a href="/">Home</a></li>
                <li class="dropdown">
                    <a href="#" aria-haspopup="true" aria-expanded="false">Eligibility</a>
                    <ul class="dropdown-content">
                        <li><a href="/content/eligibility/basic-requirements.html">Basic Requirements</a></li>
                        <li><a href="/content/eligibility/character-of-discharge.html">Character of Discharge</a></li>
                        <li><a href="/content/eligibility/documentation.html">Required Documents</a></li>
                    </ul>
                </li>
                <li class="dropdown">
                    <a href="#" aria-haspopup="true" aria-expanded="false">Preference Types</a>
                    <ul class="dropdown-content">
                        <li><a href="/content/preference-types/5-point.html">5-Point Preference</a></li>
                        <li><a href="/content/preference-types/10-point.html">10-Point Preference</a></li>
                        <li><a href="/content/preference-types/derivative.html">Derivative Preference</a></li>
                    </ul>
                </li>
                <li><a href="/tool.html" aria-current="page">Interactive Guide</a></li>
                <li><a href="/content/faq.html">FAQ</a></li>
            </ul>
        </nav>
    </header>
    <!-- End of reused header -->

    <main id="tool-content" role="main">
        <div class="tool-container">
            <h1>Veterans' Preference Interactive Guide</h1>

            <!-- Critical Disclaimer -->
            <div class="tool-disclaimer" role="alert">
                <h2>Important Notice</h2>
                <p><strong>This tool provides guidance based on the OPM Vet Guide for HR Professionals. It is for informational purposes only and is NOT an official determination of eligibility or a legal document.</strong></p>
                <p>Always refer to official OPM documentation and consult with your agency's HR department or a Veterans Service Officer for definitive determinations.</p>
                <button id="accept-disclaimer" class="btn btn-primary">I Understand - Continue to Tool</button>
            </div>

            <!-- Tool Interface (hidden until disclaimer accepted) -->
            <div id="tool-interface" style="display: none;">
                <!-- Progress Indicator -->
                <div class="tool-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                    <div class="progress-bar"></div>
                    <span class="progress-text">Step <span id="current-step">1</span> of <span id="total-steps">10</span></span>
                </div>

                <!-- Question Area -->
                <div id="question-area" class="tool-question">
                    <!-- Questions dynamically inserted here -->
                </div>

                <!-- Answer Area -->
                <div id="answers-area" class="tool-answers" role="radiogroup">
                    <!-- Answer options dynamically inserted here -->
                </div>

                <!-- Result Area -->
                <div id="result-area" class="tool-result" style="display: none;">
                    <!-- Results displayed here -->
                </div>

                <!-- Navigation Controls -->
                <div class="tool-controls">
                    <button id="back-button" class="btn btn-secondary" style="display: none;">← Previous Question</button>
                    <button id="restart-button" class="btn btn-secondary">Start Over</button>
                    <button id="print-button" class="btn btn-secondary" style="display: none;">Print Results</button>
                </div>
            </div>
            <!-- End of Tool Interface -->

            <!-- Help Section -->
            <aside class="tool-help">
                <h3>Need Help?</h3>
                <ul>
                    <li><a href="/content/faq.html">Frequently Asked Questions</a></li>
                    <li><a href="https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/" target="_blank" rel="noopener noreferrer">OPM Vet Guide</a></li>
                    <li>Contact your agency HR or a Veterans Service Officer for personalized assistance</li>
                </ul>
            </aside>
        </div>
    </main>

    <!-- Footer reused from index.html -->
    <footer role="contentinfo">
        <div class="footer-content">
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="/sitemap.xml">Sitemap</a></li>
                    <li><a href="/accessibility-statement.html">Accessibility</a></li>
                    <li><a href="/privacy-policy.html">Privacy Policy</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li><a href="https://www.opm.gov" target="_blank" rel="noopener noreferrer">OPM.gov</a></li>
                    <li><a href="https://www.va.gov" target="_blank" rel="noopener noreferrer">VA.gov</a></li>
                    <li><a href="https://www.usajobs.gov" target="_blank" rel="noopener noreferrer">USAJOBS</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h3>Contact</h3>
                <p>For site feedback: <a href="mailto:feedback@veterans-info.github.io">feedback@veterans-info.github.io</a></p>
                <p>For official inquiries: Contact your agency HR or VSO</p>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <span id="current-year"></span> Veterans Info. This is an unofficial informational resource.</p>
            <p>Last updated: <span id="last-updated">Loading...</span></p>
        </div>
    </footer>
    <!-- End of reused footer -->

    <script src="script.js"></script>
    <script src="tool.js"></script>
</body>
</html>
```

### 3.2 Tool-Specific Styles (tool-styles.css)
```css
/* Tool-specific styles */
.tool-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 2rem 1rem;
}

/* Disclaimer */
.tool-disclaimer {
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: var(--radius-md);
    padding: 2rem;
    margin-bottom: 2rem;
    text-align: center;
}

.tool-disclaimer h2 {
    color: #856404;
    margin-bottom: 1rem;
}

.tool-disclaimer p {
    color: #856404;
    margin-bottom: 1rem;
}

/* Progress Indicator */
.tool-progress {
    margin-bottom: 2rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-sm);
    padding: 0.5rem;
    position: relative;
}

.progress-bar {
    height: 8px;
    background: var(--primary-color);
    border-radius: var(--radius-sm);
    transition: width var(--transition-normal);
    width: 0%;
}

.progress-text {
    display: block;
    text-align: center;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: var(--text-secondary);
}

/* Question Area */
.tool-question {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
}

.tool-question h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary-color);
}

.tool-question p {
    margin-bottom: 0.5rem;
}

/* Answer Area */
.tool-answers {
    margin-bottom: 2rem;
}

.answer-option {
    display: block;
    width: 100%;
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;
    background: var(--bg-primary);
    border: 2px solid var(--border-color);
    border-radius: var(--radius-md);
    text-align: left;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.answer-option:hover,
.answer-option:focus {
    border-color: var(--primary-color);
    background: var(--bg-secondary);
}

.answer-option:active {
    transform: translateY(1px);
}

/* Result Area */
.tool-result {
    padding: 2rem;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    margin-bottom: 2rem;
}

.tool-result.eligibile {
    border: 2px solid var(--success-color);
    background: #d4edda;
}

.tool-result.not-eligible {
    border: 2px solid var(--error-color);
    background: #f8d7da;
}

.tool-result.complex {
    border: 2px solid var(--warning-color);
    background: #fff3cd;
}

.tool-result h2 {
    margin-bottom: 1rem;
}

.result-details {
    margin: 1.5rem 0;
}

.result-details h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.result-documents {
    background: var(--bg-primary);
    padding: 1rem;
    border-radius: var(--radius-sm);
    margin: 1rem 0;
}

.result-documents ul {
    margin: 0.5rem 0 0 0;
    padding-left: 1.5rem;
}

/* Controls */
.tool-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
}

/* Help Section */
.tool-help {
    margin-top: 3rem;
    padding: 1.5rem;
    background: var(--bg-tertiary);
    border-radius: var(--radius-md);
}

.tool-help h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
}

.tool-help ul {
    list-style: none;
    padding: 0;
}

.tool-help li {
    margin-bottom: 0.5rem;
}

/* Print Styles */
@media print {
    .tool-controls,
    .tool-help,
    .tool-progress,
    .tool-disclaimer button {
        display: none !important;
    }
    
    .tool-result {
        border: 1px solid #000;
        break-inside: avoid;
    }
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .tool-container {
        padding: 1rem;
    }
    
    .tool-disclaimer {
        padding: 1rem;
    }
    
    .answer-option {
        padding: 0.75rem 1rem;
        font-size: 0.9rem;
    }
}
```

### 3.3 Interactive Tool Logic (tool.js)
```javascript
// Veterans' Preference Interactive Tool Logic
(function() {
    'use strict';

    // State management
    const state = {
        currentQuestionId: null,
        history: [],
        answers: {},
        totalSteps: 0,
        currentStep: 0
    };

    // Decision tree structure
    const vetPreferenceTree = {
        'START': {
            id: 'START',
            questionText: 'Are you seeking information about Veterans\' Preference for yourself or someone else?',
            answers: [
                {
                    answerText: 'For myself (I am a veteran or current service member)',
                    nextQuestionId: 'VETERAN_STATUS'
                },
                {
                    answerText: 'For a family member',
                    nextQuestionId: 'FAMILY_RELATIONSHIP'
                },
                {
                    answerText: 'I am an HR professional seeking general information',
                    resultOutcome: {
                        type: 'info',
                        title: 'HR Professional Resources',
                        description: 'As an HR professional, you have access to comprehensive resources.',
                        additionalInfo: [
                            'Review the complete OPM Vet Guide for HR Professionals',
                            'Consult agency-specific policies',
                            'Contact OPM for specific case guidance'
                        ],
                        opmLinks: [
                            {
                                text: 'OPM Vet Guide for HR Professionals',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/'
                            }
                        ]
                    }
                }
            ]
        },
        
        'VETERAN_STATUS': {
            id: 'VETERAN_STATUS',
            questionText: 'What is your current military service status?',
            answers: [
                {
                    answerText: 'Discharged/Separated veteran',
                    nextQuestionId: 'DISCHARGE_TYPE'
                },
                {
                    answerText: 'Current active duty service member',
                    nextQuestionId: 'ACTIVE_DUTY_STATUS'
                },
                {
                    answerText: 'Retired military',
                    nextQuestionId: 'RETIREMENT_TYPE'
                },
                {
                    answerText: 'Current Reserve or National Guard member',
                    nextQuestionId: 'RESERVE_STATUS'
                }
            ]
        },
        
        'DISCHARGE_TYPE': {
            id: 'DISCHARGE_TYPE',
            questionText: 'What type of discharge did you receive from military service?',
            helpText: 'Your discharge characterization is shown on your DD-214 or equivalent discharge documentation.',
            answers: [
                {
                    answerText: 'Honorable',
                    nextQuestionId: 'SERVICE_DATES'
                },
                {
                    answerText: 'General (Under Honorable Conditions)',
                    nextQuestionId: 'SERVICE_DATES'
                },
                {
                    answerText: 'Other Than Honorable (OTH)',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Veterans\' Preference requires an honorable or general discharge.',
                        additionalInfo: [
                            'You may be able to upgrade your discharge through a military discharge review board',
                            'Some VA benefits may still be available depending on the circumstances'
                        ],
                        opmLinks: [
                            {
                                text: 'Character of Discharge Requirements',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#discharge'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Bad Conduct or Dishonorable',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Veterans\' Preference is not available with a bad conduct or dishonorable discharge.',
                        additionalInfo: [
                            'Discharge upgrades may be possible in limited circumstances',
                            'Consult with a Veterans Service Organization for assistance'
                        ]
                    }
                },
                {
                    answerText: 'Uncharacterized or Entry Level Separation',
                    nextQuestionId: 'ENTRY_LEVEL_SERVICE'
                }
            ]
        },
        
        'SERVICE_DATES': {
            id: 'SERVICE_DATES',
            questionText: 'When did you serve on active duty?',
            helpText: 'Select all periods that apply to your service.',
            multiSelect: true,
            answers: [
                {
                    answerText: 'During a war, campaign, or expedition',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Served at least 180 consecutive days, any part after 9/11/80',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Only during peacetime before 9/11/80',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Veterans\' Preference',
                        description: 'Peacetime service before September 11, 1980 does not qualify for Veterans\' Preference unless you have a service-connected disability.',
                        additionalInfo: [
                            'You may qualify if you have a service-connected disability',
                            'Consider applying for VA disability compensation if you have service-related conditions'
                        ]
                    }
                },
                {
                    answerText: 'Gulf War (8/2/90 to 1/2/92)',
                    nextQuestionId: 'DISABILITY_STATUS'
                },
                {
                    answerText: 'Operation Enduring Freedom/Operation Iraqi Freedom',
                    nextQuestionId: 'DISABILITY_STATUS'
                }
            ]
        },
        
        'DISABILITY_STATUS': {
            id: 'DISABILITY_STATUS',
            questionText: 'Do you have a service-connected disability?',
            helpText: 'A service-connected disability is one that the VA has determined was caused or aggravated by your military service.',
            answers: [
                {
                    answerText: 'Yes, rated 30% or more',
                    nextQuestionId: 'DISABILITY_TYPE_30'
                },
                {
                    answerText: 'Yes, rated 10% or more but less than 30%',
                    resultOutcome: {
                        type: 'eligible-10-point',
                        title: '10-Point Preference Eligible (CP)',
                        description: 'You appear to be eligible for 10-point compensable preference.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation',
                            'VA letter showing disability percentage',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            {
                                text: '10-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#10point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Yes, but less than 10%',
                    resultOutcome: {
                        type: 'eligible-5-point',
                        title: '5-Point Preference Eligible (TP)',
                        description: 'You appear to be eligible for 5-point preference based on your military service.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation'
                        ],
                        opmLinks: [
                            {
                                text: '5-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#5point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'No service-connected disability',
                    resultOutcome: {
                        type: 'eligible-5-point',
                        title: '5-Point Preference Eligible (TP)',
                        description: 'Based on your qualifying military service, you appear to be eligible for 5-point preference.',
                        requiredDocuments: [
                            'DD-214 or equivalent discharge documentation'
                        ],
                        opmLinks: [
                            {
                                text: '5-Point Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#5point'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Purple Heart recipient',
                    resultOutcome: {
                        type: 'eligible-10-point',
                        title: '10-Point Preference Eligible (CPS)',
                        description: 'As a Purple Heart recipient, you are eligible for 10-point preference.',
                        requiredDocuments: [
                            'DD-214 showing Purple Heart award',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        opmLinks: [
                            {
                                text: '10-Point Preference for Purple Heart',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#purpleheart'
                            }
                        ]
                    }
                }
            ]
        },
        
        'FAMILY_RELATIONSHIP': {
            id: 'FAMILY_RELATIONSHIP',
            questionText: 'What is your relationship to the veteran?',
            helpText: 'Certain family members may be eligible for "derivative preference" based on the veteran\'s service.',
            answers: [
                {
                    answerText: 'Spouse',
                    nextQuestionId: 'SPOUSE_ELIGIBILITY'
                },
                {
                    answerText: 'Mother',
                    nextQuestionId: 'MOTHER_ELIGIBILITY'
                },
                {
                    answerText: 'Child',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference',
                        description: 'Children of veterans are not eligible for derivative preference. Only spouses and mothers of certain veterans qualify.',
                        additionalInfo: [
                            'The veteran themselves may be eligible for preference',
                            'Other veteran family benefits may be available through VA'
                        ]
                    }
                },
                {
                    answerText: 'Other family member',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference',
                        description: 'Only spouses and mothers of certain disabled or deceased veterans are eligible for derivative preference.',
                        additionalInfo: [
                            'The veteran themselves should apply for their own preference',
                            'Check with VA for other family member benefits'
                        ]
                    }
                }
            ]
        },
        
        'SPOUSE_ELIGIBILITY': {
            id: 'SPOUSE_ELIGIBILITY',
            questionText: 'What is the veteran\'s current status?',
            helpText: 'Spouses may be eligible for derivative preference under specific circumstances.',
            answers: [
                {
                    answerText: 'Living veteran with 100% service-connected disability',
                    nextQuestionId: 'SPOUSE_UNEMPLOYABILITY'
                },
                {
                    answerText: 'Deceased veteran (died in service or from service-connected disability)',
                    resultOutcome: {
                        type: 'eligible-10-point-derivative',
                        title: '10-Point Derivative Preference Eligible (XP)',
                        description: 'As the spouse of a deceased veteran, you may be eligible for 10-point derivative preference.',
                        requiredDocuments: [
                            'Marriage certificate',
                            'Veteran\'s death certificate',
                            'Documentation showing death was service-connected',
                            'SF-15 Application for 10-Point Veteran Preference'
                        ],
                        additionalInfo: [
                            'You remain eligible unless you remarry',
                            'Contact VA for survivor benefits information'
                        ],
                        opmLinks: [
                            {
                                text: 'Derivative Preference Information',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/#derivative'
                            }
                        ]
                    }
                },
                {
                    answerText: 'Living veteran with less than 100% disability',
                    resultOutcome: {
                        type: 'not-eligible',
                        title: 'Not Eligible for Derivative Preference',
                        description: 'Spouses of living veterans are only eligible if the veteran has a 100% permanent and total disability.',
                        additionalInfo: [
                            'The veteran themselves may be eligible for preference',
                            'Check if the veteran\'s disability rating may increase'
                        ]
                    }
                },
                {
                    answerText: 'Missing in action or prisoner of war',
                    resultOutcome: {
                        type: 'complex',
                        title: 'Complex Eligibility Scenario',
                        description: 'Spouses of MIA/POW service members may have special eligibility.',
                        additionalInfo: [
                            'Contact your agency HR for specific guidance',
                            'Special hiring authorities may apply',
                            'Consult with a Veterans Service Officer'
                        ],
                        opmLinks: [
                            {
                                text: 'Special Circumstances',
                                url: 'https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/'
                            }
                        ]
                    }
                }
            ]
        }
        
        // Additional nodes would continue here...
    };

    // DOM elements
    let elements = {};

    // Initialize the tool
    function init() {
        // Get DOM elements
        elements = {
            disclaimer: document.querySelector('.tool-disclaimer'),
            acceptButton: document.getElementById('accept-disclaimer'),
            toolInterface: document.getElementById('tool-interface'),
            questionArea: document.getElementById('question-area'),
            answersArea: document.getElementById('answers-area'),
            resultArea: document.getElementById('result-area'),
            progressBar: document.querySelector('.progress-bar'),
            currentStep: document.getElementById('current-step'),
            totalSteps: document.getElementById('total-steps'),
            backButton: document.getElementById('back-button'),
            restartButton: document.getElementById('restart-button'),
            printButton: document.getElementById('print-button')
        };

        // Set up event listeners
        if (elements.acceptButton) {
            elements.acceptButton.addEventListener('click', startTool);
        }
        
        if (elements.restartButton) {
            elements.restartButton.addEventListener('click', restartTool);
        }
        
        if (elements.backButton) {
            elements.backButton.addEventListener('click', goBack);
        }
        
        if (elements.printButton) {
            elements.printButton.addEventListener('click', printResults);
        }

        // Calculate total steps
        state.totalSteps = countTotalSteps();
        if (elements.totalSteps) {
            elements.totalSteps.textContent = state.totalSteps;
        }
    }

    // Count total possible steps in the tree
    function countTotalSteps() {
        // Simple approximation - would be refined based on actual tree complexity
        return 10;
    }

    // Start the tool after accepting disclaimer
    function startTool() {
        elements.disclaimer.style.display = 'none';
        elements.toolInterface.style.display = 'block';
        displayQuestion('START');
    }

    // Display a question
    function displayQuestion(questionId) {
        const question = vetPreferenceTree[questionId];
        if (!question) {
            console.error('Question not found:', questionId);
            return;
        }

        // Update state
        state.currentQuestionId = questionId;
        state.currentStep = Math.min(state.currentStep + 1, state.totalSteps);
        
        // Update progress
        updateProgress();
        
        // Clear previous content
        elements.questionArea.innerHTML = '';
        elements.answersArea.innerHTML = '';
        elements.resultArea.style.display = 'none';
        
        // Display question
        const questionHTML = `
            <h2>${question.questionText}</h2>
            ${question.helpText ? `<p class="help-text">${question.helpText}</p>` : ''}
        `;
        elements.questionArea.innerHTML = questionHTML;
        
        // Display answers
        question.answers.forEach((answer, index) => {
            const button = document.createElement('button');
            button.className = 'answer-option';
            button.textContent = answer.answerText;
            button.setAttribute('data-answer-index', index);
            button.addEventListener('click', () => handleAnswer(answer));
            elements.answersArea.appendChild(button);
        });
        
        // Update navigation
        elements.backButton.style.display = state.history.length > 0 ? 'inline-block' : 'none';
    }

    // Handle answer selection
    function handleAnswer(answer) {
        // Save answer
        state.answers[state.currentQuestionId] = answer.answerText;
        state.history.push(state.currentQuestionId);
        
        if (answer.nextQuestionId) {
            displayQuestion(answer.nextQuestionId);
        } else if (answer.resultOutcome) {
            displayResult(answer.resultOutcome);
        }
    }

    // Display result
    function displayResult(result) {
        elements.questionArea.style.display = 'none';
        elements.answersArea.style.display = 'none';
        elements.resultArea.style.display = 'block';
        
        // Apply result type styling
        elements.resultArea.className = `tool-result ${result.type}`;
        
        // Build result HTML
        let resultHTML = `
            <h2>${result.title}</h2>
            <p>${result.description}</p>
        `;
        
        if (result.requiredDocuments && result.requiredDocuments.length > 0) {
            resultHTML += `
                <div class="result-documents">
                    <h3>Required Documents:</h3>
                    <ul>
                        ${result.requiredDocuments.map(doc => `<li>${doc}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (result.additionalInfo && result.additionalInfo.length > 0) {
            resultHTML += `
                <div class="result-details">
                    <h3>Additional Information:</h3>
                    <ul>
                        ${result.additionalInfo.map(info => `<li>${info}</li>`).join('')}
                    </ul>
                </div>
            `;
        }
        
        if (result.opmLinks && result.opmLinks.length > 0) {
            resultHTML += `
                <div class="result-links">
                    <h3>Official Resources:</h3>
                    <ul>
                        ${result.opmLinks.map(link => 
                            `<li><a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.text}</a></li>`
                        ).join('')}
                    </ul>
                </div>
            `;
        }
        
        elements.resultArea.innerHTML = resultHTML;
        elements.printButton.style.display = 'inline-block';
        elements.backButton.style.display = 'none';
        
        // Update progress to 100%
        state.currentStep = state.totalSteps;
        updateProgress();
    }

    // Update progress bar
    function updateProgress() {
        const progress = (state.currentStep / state.totalSteps) * 100;
        elements.progressBar.style.width = `${progress}%`;
        elements.currentStep.textContent = state.currentStep;
        
        // Update ARIA attributes
        const progressContainer = document.querySelector('.tool-progress');
        if (progressContainer) {
            progressContainer.setAttribute('aria-valuenow', progress);
        }
    }

    // Go back to previous question
    function goBack() {
        if (state.history.length > 0) {
            state.history.pop(); // Remove current
            const previousId = state.history.length > 0 ? state.history[state.history.length - 1] : 'START';
            state.currentStep = Math.max(1, state.currentStep - 2); // Adjust for re-display
            displayQuestion(previousId);
        }
    }

    // Restart the tool
    function restartTool() {
        // Reset state
        state.currentQuestionId = null;
        state.history = [];
        state.answers = {};
        state.currentStep = 0;
        
        // Reset UI
        elements.questionArea.style.display = 'block';
        elements.answersArea.style.display = 'block';
        elements.resultArea.style.display = 'none';
        elements.printButton.style.display = 'none';
        
        // Start over
        displayQuestion('START');
    }

    // Print results
    function printResults() {
        window.print();
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', init);

})();
```

---

## Phase 4: Content Development & Testing

### 4.1 Content Creation Process

1. **Content Mapping**
   - Create detailed outline from OPM guide
   - Map each section to website pages
   - Identify cross-references and relationships

2. **Page Template**
   ```html
   <!-- Example: content/eligibility/basic-requirements.html -->
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <title>Basic Eligibility Requirements - Veterans' Preference Guide</title>
       <!-- Include standard meta tags and styles -->
   </head>
   <body>
       <!-- Include standard header -->
       
       <main>
           <article>
               <h1>Basic Eligibility Requirements</h1>
               
               <nav class="breadcrumb" aria-label="Breadcrumb">
                   <ol>
                       <li><a href="/">Home</a></li>
                       <li><a href="/content/eligibility/">Eligibility</a></li>
                       <li aria-current="page">Basic Requirements</li>
                   </ol>
               </nav>
               
               <section>
                   <h2>Overview</h2>
                   <p>Content based on OPM guide section X.X</p>
               </section>
               
               <!-- Additional sections -->
               
               <aside class="citation">
                   <h3>Source</h3>
                   <p>This information is based on the <a href="[specific-opm-link]">OPM Vet Guide, Chapter X</a></p>
               </aside>
           </article>
       </main>
       
       <!-- Include standard footer -->
   </body>
   </html>
   ```

3. **Content Review Checklist**
   - [ ] Accuracy verified against OPM guide
   - [ ] Plain language review completed
   - [ ] Citations properly formatted
   - [ ] Links tested and working
   - [ ] Accessibility requirements met
   - [ ] Mobile responsiveness verified

### 4.2 Testing Protocol

1. **Accessibility Testing**
   - WAVE tool analysis
   - axe browser extension
   - Keyboard navigation test
   - Screen reader testing (NVDA/JAWS)
   - Color contrast verification

2. **Browser Testing**
   - Chrome (latest)
   - Firefox (latest)
   - Safari (latest)
   - Edge (latest)
   - Mobile browsers

3. **Performance Testing**
   - Page load times < 3 seconds
   - Lighthouse audit score > 90
   - No broken links
   - Images optimized

---

## Phase 5: Deployment & Launch

### 5.1 Pre-Launch Checklist

- [ ] All content pages completed and reviewed
- [ ] Interactive tool fully tested
- [ ] Accessibility audit passed
- [ ] Analytics configured
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] 404 page created
- [ ] SSL certificate verified (GitHub Pages provides)
- [ ] Meta tags and SEO elements in place
- [ ] Print styles tested
- [ ] Mobile responsiveness verified

### 5.2 Launch Process

1. **Soft Launch**
   - Deploy to GitHub Pages
   - Internal testing period (1 week)
   - Fix any identified issues

2. **Public Launch**
   - Announce availability
   - Monitor analytics
   - Collect initial feedback

3. **Post-Launch (Week 1)**
   - Daily monitoring
   - Address urgent issues
   - Document feedback

---

## Phase 6: Maintenance & Continuous Improvement

### 6.1 Maintenance Schedule

#### Daily (First Month)
- Monitor site availability
- Check for reported issues

#### Weekly
- Review analytics data
- Backup repository
- Check for new feedback

#### Monthly
- Content accuracy review
- OPM guide update check
- Performance audit
- Accessibility spot checks

#### Quarterly
- Comprehensive link check
- Full accessibility audit
- Content strategy review
- Update documentation

#### Annually
- Complete content review
- Technology stack evaluation
- User survey (if implemented)
- Strategic planning

### 6.2 Documentation Standards

1. **CHANGELOG.md Format**
   ```markdown
   # Changelog
   
   ## [1.1.0] - 2024-XX-XX
   ### Added
   - New FAQ section
   - Print functionality for tool results
   
   ### Changed
   - Updated navigation structure
   - Improved mobile responsiveness
   
   ### Fixed
   - Accessibility issues in tool
   - Broken links to OPM resources
   ```

2. **MAINTENANCE.md**
   - Document all maintenance procedures
   - Include troubleshooting guide
   - List common issues and solutions

### 6.3 Future Enhancement Roadmap

1. **Phase 1 Enhancements (Months 1-3)**
   - User feedback integration
   - Additional FAQ content
   - Tool refinements based on usage

2. **Phase 2 Enhancements (Months 4-6)**
   - Advanced search functionality
   - Downloadable PDF guides
   - Video tutorials (if resources allow)

3. **Phase 3 Enhancements (Months 7-12)**
   - Multi-language support evaluation
   - Progressive Web App features
   - API integration possibilities

---

## Appendices

### A. Technical Resources
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [OPM Vet Guide](https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/)

### B. Contact Information
- **Technical Issues**: Create GitHub issue
- **Content Questions**: Reference OPM guide
- **Accessibility Concerns**: feedback@veterans-info.github.io

### C. Emergency Procedures
1. **Site Down**: Check GitHub status, verify repository settings
2. **Security Issue**: Immediately remove sensitive content, contact GitHub support
3. **Legal Concern**: Add disclaimer, consult appropriate authorities

---

*This plan is a living document and should be updated as the project evolves.*
