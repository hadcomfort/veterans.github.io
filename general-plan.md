**Project Goal:** Transform the existing "Veterans' Preference Guide" website into a broader "General Veterans Information" portal, while preserving the entire current Veterans' Preference section and its functionality. The new main homepage should adopt the existing visual style.

**Current Site Structure (Assume root directory for simplicity):**
* `index.html` (Current Veterans' Preference homepage)
* `style.css`
* `script.js`
* `tool.html`
* `tool.js`
* `tool-styles.css`
* `content/` (with all sub-pages like eligibility, preference-types, appendices, faq, etc.)
* `images/` (if any)
* Other root files: `sitemap.xml`, `robots.txt`, `accessibility-statement.html`, `privacy-policy.html`, `LICENSE`, `README.md`, `hrdocs.txt`, `notes.md`, `.gitignore`

**Tasks to Perform:**

1.  **Create a New Main Homepage (`index.html` at the root):**
    * **Filename:** `index.html` (This will replace the current `index.html`).
    * **Purpose:** This will be the new landing page for the general veterans information website.
    * **Styling:**
        * Link to the existing `style.css` for primary styling.
        * Ensure the new `index.html` has the same header and footer structure, look, and feel as the current `index.html` (the one that will be moved).
        * The `<head>` section should include appropriate meta tags (title, description, keywords) for a general veterans information portal.
    * **Content Sections (Placeholders are fine for now, I will populate the actual content later):**
        * **Hero Section:** Similar to the current `index.html` hero, but with a general veterans information focus.
            * Headline: e.g., "Your Comprehensive Guide to Veterans Information & Resources"
            * Tagline: e.g., "Find information on benefits, healthcare, education, employment, and more."
            * **Primary Call to Action (Button):** "Explore Veterans' Preference Guide" (linking to `veterans-preference/index.html`).
            * Secondary Call to Action (Button): e.g., "View All Resources" (linking to a future resources page, for now, can be `#`).
        * **Features/Key Information Areas (Below Hero):** Create a grid or list of sections. Examples:
            * "Veterans' Preference in Federal Employment" (This will be the most prominent, linking to `veterans-preference/index.html`).
            * "VA Healthcare Benefits" (Placeholder link: `#healthcare`)
            * "Education & Training Programs" (Placeholder link: `#education`)
            * "Housing Assistance" (Placeholder link: `#housing`)
            * "Mental Wellness Resources" (Placeholder link: `#wellness`)
            * "State-Specific Benefits" (Placeholder link: `#state-benefits`)
        * **Disclaimer:** Include the same "Important Information" disclaimer section as the current `index.html`.
    * **Navigation (in the `<header>` of the new `index.html`):**
        * Home (links to `/index.html` - this new page)
        * Veterans' Preference Guide (links to `/veterans-preference/index.html`)
        * Resources (Dropdown - placeholder links for now):
            * Healthcare (`#`)
            * Education (`#`)
            * Employment (`#`)
            * Housing (`#`)
        * FAQ (links to `/veterans-preference/content/faq.html` or a new general FAQ if desired. For now, link to existing preference FAQ).
        * About (Placeholder link: `#about`)
    * **Footer:** Replicate the existing footer content and links, ensuring "Quick Links" like Sitemap, Accessibility, Privacy Policy point to the root versions.

2.  **Relocate Existing Veterans' Preference Content:**
    * Create a new subdirectory named `veterans-preference` in the root.
    * **Move** the following files and folders *into* the `veterans-preference/` directory:
        * The *current* `index.html` (rename it if necessary, but it will serve as the homepage for the preference section, so `veterans-preference/index.html` is ideal).
        * The entire `content/` directory.
        * `tool.html`
        * `tool.js`
        * `tool-styles.css`
        * Any images specifically used only within the preference guide if they are not already in a shared `images/` folder.
    * **Do NOT move:**
        * The main `style.css` (it will be shared).
        * The main `script.js` (it will be shared, and if it needs to be split, we can address that later).
        * Root files like `sitemap.xml`, `robots.txt`, `accessibility-statement.html`, `privacy-policy.html`, `LICENSE`, `README.md`, `hrdocs.txt`, `notes.md`, `.gitignore`. These remain at the root.

3.  **Update Links and Paths within the Relocated `veterans-preference/` section:**
    * **Primary Navigation:**
        * In `veterans-preference/index.html` and all HTML files within `veterans-preference/content/`, update the main navigation links:
            * The "Home" link in their navigation should now point to the *new root* `index.html` (i.e., `../../index.html` if accessed from a deep content page, or `../index.html` if accessed from `veterans-preference/index.html`).
            * Links to "Eligibility," "Preference Types," "RIF Procedures," "Special Authorities," "Appendices," "Interactive Guide (tool.html)," and "FAQ" should now be relative to their new location within the `veterans-preference/` directory (e.g., from `veterans-preference/index.html`, a link to "Eligibility" might go to `content/eligibility/basic-requirements.html` or similar, which is correct as `content` is now *inside* `veterans-preference`). **Carefully check these relative paths.**
    * **CSS/JS Links:**
        * Ensure all HTML files within `veterans-preference/` correctly link to the shared `style.css` and `script.js` (which are now one level up, e.g., `../style.css`).
        * The `tool.html` within `veterans-preference/` should correctly link to `../style.css`, `../script.js`, and its own `tool-styles.css` (which is now in the same `veterans-preference/` directory).
    * **Breadcrumbs:** Update breadcrumb paths on all pages within `veterans-preference/content/` to reflect the new structure. The "Home" breadcrumb should point to the new root `index.html`.
    * **Image Paths:** If any images were moved, update their paths. If they are in a shared root `/images/` folder, paths will need to be adjusted (e.g., `../images/favicon.svg`).
    * **Canonical URLs:** Update canonical URLs in the `<head>` of all moved HTML files to reflect their new path (e.g., `https://veterans-info.github.io/veterans-preference/index.html`).

4.  **Update Root Support Files:**
    * **`sitemap.xml`:**
        * Add an entry for the new root `index.html`.
        * Update all existing `<loc>` entries to reflect the `veterans-preference/` path for those pages (e.g., `https://veterans-info.github.io/veterans-preference/tool.html`).
    * **`robots.txt`:** Ensure it still allows access and correctly points to the updated `sitemap.xml`.
    * **`accessibility-statement.html` & `privacy-policy.html`:** Update any internal navigation links (like "Home") in these files to point to the new root `index.html`.
    * **`README.md`:** Update the description and "How to Use This Guide" section to reflect the new two-tiered structure (General Info Portal -> Veterans' Preference Guide section).

**Important Constraints & Considerations:**

* **Preserve Existing Functionality:** The Veterans' Preference section, including the interactive tool, must function exactly as it did before the move, just under the new `/veterans-preference/` path.
* **Minimize File Modifications:** Only modify the files within the `veterans-preference/` directory to the extent necessary to correct paths for navigation, CSS, JS, and images. Do not change their content or layout otherwise.
* **Accessibility:** All new and modified pages must maintain WCAG 2.1 AA accessibility.
* **Relative Paths:** Use relative paths for links *within* the `veterans-preference` section as much as possible to maintain portability. Links from the root `index.html` *to* the preference section will be like `veterans-preference/index.html`. Links from within the preference section *back to the new root home* will be like `../index.html` or `../../index.html`.

**Deliverables:**

* A new root `index.html` file.
* A `veterans-preference/` directory containing all the original site's content, correctly repathed.
* Updated `sitemap.xml`.
* Updated navigation in all affected HTML files.

Please proceed carefully, ensuring all links are meticulously checked. Let me know if you have questions about any specific path adjustments.
