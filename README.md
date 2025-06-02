# General Veterans Information Portal & Veterans' Preference Guide

## Description
This website serves as a **General Veterans Information Portal**, with a primary focus on providing a comprehensive guide to **Veterans' Preference** in federal employment. It offers clear, accessible information based on the official **OPM Vet Guide for HR Professionals** to help veterans, their families, and HR personnel understand these important benefits.

## Table of Contents
- [How to Use This Site](#how-to-use-this-site)
- [Source of Information](#source-of-information)
- [Local Development Setup](#local-development-setup)
- [Contributing](#contributing)
- [License](#license)

## How to Use This Site
This website has several key components:

### General Veterans Information Portal
The main entry point, **index.html**, provides an overview of veteran resources and links to key areas like the **Veterans' Preference Guide** and other resource pages.

### Veterans' Preference Guide
Located in the **veterans-preference/** directory (**veterans-preference/index.html**), this guide is an in-depth resource for understanding **Veterans' Preference** in federal employment. It helps you find information on:
*   **Eligibility Requirements:** Details on who qualifies for **Veterans' Preference**, including character of discharge and necessary documentation.
*   **Types of Preference:** Explanations of the different preference categories (e.g., 5-point, 10-point, derivative).
*   **Interactive Assessment Tool:** An interactive tool (**tool.html**), driven by **decision-tree.json**, using a question-and-answer format to help users identify potential eligibility for **Veterans' Preference** and required documentation.
*   **Frequently Asked Questions (FAQ):** Answers to common questions about **Veterans' Preference**.
*   **Reduction in Force (RIF) Procedures:** Information on how **Veterans' Preference** applies during RIF scenarios.
*   **Special Appointing Authorities:** Details on special hiring authorities for veterans.
*   **Appendices:** Supplementary information on wars, campaigns, qualifying service, and the history of **Veterans' Preference**.

### Other Resources
The site also includes dedicated pages on various veteran topics, accessible from the main portal:
*   **all-resources.html**: A comprehensive list of available resources.
*   **healthcare.html**: Information on healthcare benefits and services.
*   **education.html**: Details on educational programs and assistance.
*   **employment.html**: Resources for veteran employment beyond federal preference.
*   **housing.html**: Information on housing assistance and programs.
*   **state-benefits.html**: Links and information on state-specific veteran benefits.

## Source of Information
The primary and definitive source for **Veterans' Preference** information is the official **OPM Vet Guide for HR Professionals** from the U.S. Office of Personnel Management (OPM). For the most current and authoritative guidance, always refer to the official OPM website: [**OPM Vet Guide for HR Professionals**](https://www.opm.gov/policy-data-oversight/veterans-services/vet-guide-for-hr-professionals/).

**hrdocs.txt** in this repository is a text version of this guide, included for convenience or historical context, but may not reflect the latest updates.

## Local Development Setup
To run this website locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/hadcomfort/veterans.github.io.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd veterans.github.io
    ```
3.  **Open the HTML files directly in your web browser:**
    *   Open **index.html** for the main portal.
    *   Open **veterans-preference/index.html** for the **Veterans' Preference Guide**.

No complex build steps or special dependencies are currently required.

## Contributing
Contributions to improve this guide are welcome. Our goal is to provide accurate, easy-to-understand information aligned with official OPM guidance.

*   Ensure contributions accurately reflect official OPM guidance (refer to the **OPM Vet Guide** as the primary source).
*   To contribute: fork the repository, create a new branch for your changes, and then submit a **pull request** for review.

We appreciate your help in making this resource valuable for our veterans.

## License
This project is licensed under the MIT License. See the **LICENSE** file for details.
