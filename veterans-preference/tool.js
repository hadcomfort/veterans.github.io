// Veterans' Preference Interactive Tool Logic
// This script is wrapped in an IIFE (Immediately Invoked Function Expression)
// to create a private scope, preventing naming conflicts with other scripts.
(function() {
    'use strict';

    // Manages the overall state of the interactive tool.
    const state = {
        currentQuestionId: null, // ID of the question currently displayed to the user.
        history: [],             // Array of question IDs, tracks the user's path through the tool for "back" functionality.
        answers: {},             // Object storing the user's answers, keyed by question ID.
        totalSteps: 0,           // Estimated total number of steps/questions to reach a conclusion.
        currentStep: 0           // Current step number the user is on, for progress tracking.
    };

    // Holds the decision tree data, loaded asynchronously from a JSON file.
    let vetPreferenceTree = {};

    // Caches frequently accessed DOM elements.
    let elements = {};

    /**
     * Initializes the interactive tool.
     * This function performs several key setup tasks:
     * 1. Caches essential DOM elements for later use.
     * 2. Asynchronously fetches the decision tree data from a JSON file.
     * 3. If data fetching is successful:
     *    - Stores the decision tree in `vetPreferenceTree`.
     *    - Sets up event listeners for UI elements that depend on the tree data (e.g., starting the tool).
     *    - Calculates the total number of steps for the progress bar.
     * 4. If data fetching fails:
     *    - Logs the error to the console.
     *    - Displays an error message to the user.
     *    - Disables the tool to prevent further interaction.
     * 5. Sets up event listeners for UI elements that do not depend on the tree data (e.g., restart, back, print).
     */
    async function init() {
        // Cache DOM elements for quick access.
        elements = {
            disclaimer: document.querySelector('.tool-disclaimer'),
            acceptButton: document.getElementById('accept-disclaimer'),
            toolInterface: document.getElementById('tool-interface'),
            questionArea: document.getElementById('question-area'),
            answersArea: document.getElementById('answers-area'),
            resultArea: document.getElementById('result-area'),
            progressBar: document.querySelector('.progress-bar'), // The progress bar element.
            currentStep: document.getElementById('current-step'),   // Element displaying the current step number.
            totalSteps: document.getElementById('total-steps'),     // Element displaying the total estimated steps.
            backButton: document.getElementById('back-button'),     // The "Back" button.
            restartButton: document.getElementById('restart-button'), // The "Restart" button.
            printButton: document.getElementById('print-button')     // The "Print" button.
        };

        // Asynchronously fetch the decision tree data.
        try {
            const response = await fetch('veterans-preference/decision-tree.json');
            if (!response.ok) {
                // Handle HTTP errors (e.g., 404 Not Found, 500 Server Error).
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            vetPreferenceTree = await response.json(); // Parse the JSON response.

            // Setup event listeners and perform initial calculations that depend on the decision tree.
            if (elements.acceptButton) {
                elements.acceptButton.addEventListener('click', startTool);
            }

            // Calculate and display the total number of steps for progress indication.
            state.totalSteps = countTotalSteps(vetPreferenceTree); // Pass the loaded tree
            if (elements.totalSteps) {
                elements.totalSteps.textContent = state.totalSteps;
            }

            // Placeholder for any other initializations that might depend on the loaded tree.

        } catch (error) {
            // Catch errors from fetch (e.g., network issues) or JSON parsing.
            console.error('Error loading decision tree:', error);
            // Inform the user that the tool cannot be loaded.
            if (elements.questionArea) {
                // Use a more structured error display
                elements.questionArea.innerHTML = `
                    <div class="tool-error-message">
                        <h2>Initialization Error</h2>
                        <p>Could not load the decision tree data required for this tool to function.</p>
                        <p>Please try refreshing the page. If the issue persists, the tool may be temporarily unavailable or there might be a network problem.</p>
                    </div>`;
                elements.questionArea.style.display = 'block'; // Ensure question area is visible for the error.
            }
            // Hide other parts of the tool interface that shouldn't be active.
            if (elements.answersArea) elements.answersArea.style.display = 'none';
            const toolControls = document.querySelector('.tool-controls'); // Specific selector if elements.toolControls is not defined yet or to be safe
            if (toolControls) toolControls.style.display = 'none';
            if (elements.progressBar) { // Assuming progressBar is the inner bar, hide its container
                const progressContainer = document.querySelector('.tool-progress');
                if (progressContainer) progressContainer.style.display = 'none';
            }


            // Disable the tool's start mechanism if data loading fails.
            if (elements.acceptButton) {
                elements.acceptButton.disabled = true;
                elements.acceptButton.textContent = 'Tool Unavailable';
            }
            return; // Halt further initialization as the tool is not functional.
        }

        // Setup event listeners for controls that are independent of the decision tree data.
        if (elements.restartButton) {
            elements.restartButton.addEventListener('click', restartTool);
        }

        if (elements.backButton) {
            elements.backButton.addEventListener('click', goBack);
        }

        if (elements.printButton) {
            elements.printButton.addEventListener('click', printResults);
        }
    }

    /**
     * Calculates the estimated total number of steps (questions) in the decision tree.
     * This function traverses the `vetPreferenceTree` from the 'START' node to find the
     * maximum depth, which is used as an estimate for the total steps in the progress bar.
     * If the tree is not loaded, it returns a default value.
     * @returns {number} The estimated maximum depth of the decision tree, or a default value.
     */
    function countTotalSteps(tree) {
        if (!tree || Object.keys(tree).length === 0 || !tree['START']) {
            return 1; // Default to 1 if tree is empty or START node is missing
        }

        /**
         * Recursive helper function to calculate the maximum depth from a given node.
         * @param {string} nodeId - The ID of the current node.
         * @param {object} currentTree - The decision tree.
         * @param {Set<string>} visitedInPath - Set of node IDs visited in the current path (to detect cycles).
         * @returns {number} The maximum depth from this node.
         */
        function getMaxDepth(nodeId, currentTree, visitedInPath) {
            // Cycle detection: if we've seen this node in the current path, stop.
            if (visitedInPath.has(nodeId)) {
                console.warn(`Circular reference detected in countTotalSteps at nodeId: ${nodeId}`);
                return 0; // Don't contribute to depth from this cyclic path.
            }

            const node = currentTree[nodeId];
            // If node doesn't exist or it's a malformed node without answers (and not a result implicitly)
            if (!node || !node.answers) {
                // This path ends here. If it were a question, it would count as 1.
                // If it's an outcome node (like sspEligibleOutcome referenced directly), it's not a question step.
                // However, the logic counts question steps. If a node has no answers leading to nextQuestionId,
                // it means this path ends after this question.
                return 1; // Current node is a step, but no further question steps from here.
            }

            // Add current node to path
            visitedInPath.add(nodeId);

            let maxChildDepth = 0;
            let hasNextQuestion = false;
            node.answers.forEach(answer => {
                if (answer.nextQuestionId) {
                    hasNextQuestion = true;
                    // Create a new Set for the recursive call to ensure visitedInPath is specific to each branch
                    const depth = getMaxDepth(answer.nextQuestionId, currentTree, new Set(visitedInPath));
                    if (depth > maxChildDepth) {
                        maxChildDepth = depth;
                    }
                }
                // If an answer leads directly to a resultOutcome, it doesn't add to depth of questions.
            });

            // If this node had answers, but none led to a nextQuestionId, it's effectively a leaf in terms of question depth.
            // It counts as 1 for itself.
            // If it has paths leading to further questions, add 1 (for current node) to the max depth found from its children.
            return hasNextQuestion ? (1 + maxChildDepth) : 1;
        }

        return getMaxDepth('START', tree, new Set());
    }

    /**
     * Starts the interactive tool.
     * This is typically called after the user accepts a disclaimer.
     * It hides the disclaimer and shows the main tool interface, then displays the first question.
     * It also checks if the decision tree has been loaded before proceeding.
     */
    function startTool() {
        // Ensure the decision tree is loaded before starting.
        if (Object.keys(vetPreferenceTree).length === 0) {
            console.error("Decision tree not loaded yet. Cannot start tool.");
            // Optionally, inform the user if the tool is still loading.
            if (elements.questionArea) {
                elements.questionArea.innerHTML = `<p>The tool is still loading. Please wait a moment and try again.</p>`;
            }
            return;
        }
        // Hide disclaimer and show the main tool interface.
        elements.disclaimer.style.display = 'none';
        elements.toolInterface.style.display = 'block';
        // Display the initial question.
        displayQuestion('START');
    }

    /**
     * Creates the HTML element for a given question.
     * @param {object} question - The question object from the decision tree.
     * @returns {HTMLElement} A div element containing the question's title and help text.
     */
    function createQuestionElement(question) {
        const questionElement = document.createElement('div');
        const questionTitle = document.createElement('h2');
        questionTitle.textContent = question.questionText; // Set the question text.
        questionElement.appendChild(questionTitle);

        // Add help text if available for the question.
        if (question.helpText) {
            const helpTextElement = document.createElement('p');
            helpTextElement.className = 'help-text'; // Apply styling for help text.
            helpTextElement.textContent = question.helpText;
            questionElement.appendChild(helpTextElement);
        }

        // Add "Explain this?" feature if explanationText exists
        if (question.explanationText) {
            const explanationButton = document.createElement('button');
            explanationButton.className = 'explanation-toggle';
            explanationButton.textContent = 'Explain this?';
            explanationButton.setAttribute('aria-expanded', 'false');

            const explanationId = `explanation-${question.id || Math.random().toString(36).substr(2, 9)}`;
            explanationButton.setAttribute('aria-controls', explanationId);

            const explanationDiv = document.createElement('div');
            explanationDiv.className = 'explanation-content';
            explanationDiv.id = explanationId;
            // Sanitize or carefully construct HTML if explanationText can contain HTML.
            // For simple text, textContent is safer. If HTML is needed, ensure it's from a trusted source.
            // Assuming explanationText is simple text or safe HTML for this implementation.
            explanationDiv.innerHTML = `<p>${question.explanationText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p>`; // Basic formatting for newlines
            explanationDiv.style.display = 'none'; // Initially hidden

            explanationButton.addEventListener('click', () => {
                const isExpanded = explanationButton.getAttribute('aria-expanded') === 'true';
                explanationButton.setAttribute('aria-expanded', !isExpanded);
                explanationDiv.style.display = isExpanded ? 'none' : 'block';
            });

            questionElement.appendChild(explanationButton);
            questionElement.appendChild(explanationDiv);
        }
        return questionElement; // Return the complete question element.
    }

    /**
     * Creates an HTML button element for a given answer.
     * @param {object} answer - The answer object from the decision tree.
     * @returns {HTMLButtonElement} A button element configured with the answer text and a click handler.
     */
    function createAnswerButton(answer) {
        const button = document.createElement('button');
        button.className = 'answer-option'; // Apply styling for answer buttons.
        button.textContent = answer.answerText; // Set the button text.
        // Set an event listener to handle the answer selection.
        // The `handleAnswer` function will be called with the specific answer object when clicked.
        button.addEventListener('click', () => handleAnswer(answer));
        return button; // Return the configured button.
    }

    /**
     * Displays a question and its possible answers to the user.
     * @param {string} questionId - The ID of the question to display from the `vetPreferenceTree`.
     */
    function displayQuestion(questionId) {
        const question = vetPreferenceTree[questionId]; // Retrieve the question object from the tree.

        // Error handling: if the question ID is invalid or not found.
        if (!question) {
            console.error(`Error: Question with ID "${questionId}" not found in decision tree.`);
            displayCriticalError(`An error occurred while trying to load the question. Please restart the tool to try again.`);
            return;
        }

        // Update the tool's state with the current question and step.
        state.currentQuestionId = questionId;
        // Increment current step, ensuring it doesn't exceed totalSteps.
        state.currentStep = Math.min(state.currentStep + 1, state.totalSteps);

        updateProgress(); // Update the visual progress bar.

        // Clear the question and answers areas before displaying new content.
        elements.questionArea.innerHTML = '';
        elements.answersArea.innerHTML = '';
        elements.resultArea.style.display = 'none'; // Ensure result area is hidden.

        // Create and display the question element.
        const questionElement = createQuestionElement(question);
        elements.questionArea.appendChild(questionElement);

        // Create and display buttons for each answer.
        question.answers.forEach(answer => {
            const answerButton = createAnswerButton(answer);
            elements.answersArea.appendChild(answerButton);
        });

        // Show or hide the "Back" button based on navigation history.
        elements.backButton.style.display = state.history.length > 0 ? 'inline-block' : 'none';

        // Set focus to the question area for screen reader announcements and keyboard navigation.
        elements.questionArea.focus();
    }

    /**
     * Handles the user's selection of an answer.
     * It records the answer, updates the navigation history, and then either
     * displays the next question or shows the final result based on the answer.
     * @param {object} answer - The answer object selected by the user.
     */
    function handleAnswer(answer) {
        // Record the user's answer for the current question.
        state.answers[state.currentQuestionId] = answer.answerText;
        // Add the current question to history to enable "back" navigation.
        state.history.push(state.currentQuestionId);

        // Determine the next step based on the selected answer.
        if (answer.nextQuestionId) {
            // If there's a next question, display it.
            displayQuestion(answer.nextQuestionId);
        } else if (answer.resultOutcome) {
            // If this answer leads to a result, display it.
            // The resultOutcome can be a direct object or a string ID referencing a shared outcome in vetPreferenceTree.
            if (typeof answer.resultOutcome === 'string') {
                const resultNodeId = answer.resultOutcome;
                const resultData = vetPreferenceTree[resultNodeId];
                if (!resultData) {
                    console.error(`Error: Result node with ID "${resultNodeId}" not found in decision tree.`);
                    displayCriticalError(`An error occurred while trying to determine the outcome. Please restart the tool.`);
                    return;
                }
                displayResult(resultData);
            } else {
                // If resultOutcome is an object, pass it directly.
                displayResult(answer.resultOutcome);
            }
        }
    }

    /**
     * Displays a critical error message to the user, typically when the tool cannot proceed.
     * @param {string} userMessage - The user-friendly message to display.
     */
    function displayCriticalError(userMessage) {
        elements.questionArea.style.display = 'none';
        elements.answersArea.style.display = 'none';

        elements.resultArea.innerHTML = `
            <div class="tool-error-message">
                <h2>Tool Error</h2>
                <p>${userMessage}</p>
            </div>`;
        elements.resultArea.className = 'tool-result'; // Reset class to default then add error specific if needed, or ensure error message class handles all styling.
                                                     // The .tool-error-message class should handle its own styling.
        elements.resultArea.style.display = 'block';

        // Manage visibility of control buttons
        if(elements.backButton) elements.backButton.style.display = 'none';
        if(elements.printButton) elements.printButton.style.display = 'none';
        // Keep restart button visible
        if(elements.restartButton) elements.restartButton.style.display = 'inline-block';

        elements.resultArea.focus(); // Set focus for accessibility.
    }

    /**
     * Creates an HTML fragment containing the detailed sections of a result (documents, info, links).
     * @param {object} result - The result object from the decision tree.
     * @returns {DocumentFragment} A document fragment with the formatted result details.
     */
    function createResultDetailsElement(result) {
        const fragment = document.createDocumentFragment(); // Use a fragment for efficient DOM manipulation.

        // Add "Required Documents" section if data exists.
        if (result.requiredDocuments && result.requiredDocuments.length > 0) {
            const documentsDiv = document.createElement('div');
            documentsDiv.className = 'result-documents'; // Apply styling.
            const h3Docs = document.createElement('h3');
            h3Docs.textContent = 'Required Documents:';
            documentsDiv.appendChild(h3Docs);
            const ulDocs = document.createElement('ul');
            result.requiredDocuments.forEach(doc => { // Create list items for each document.
                const li = document.createElement('li');
                li.textContent = doc;
                ulDocs.appendChild(li);
            });
            documentsDiv.appendChild(ulDocs);
            fragment.appendChild(documentsDiv); // Add this section to the fragment.
        }

        // Add "Additional Information" section if data exists.
        if (result.additionalInfo && result.additionalInfo.length > 0) {
            const additionalInfoDiv = document.createElement('div');
            additionalInfoDiv.className = 'result-details'; // Apply styling.
            const h3Info = document.createElement('h3');
            h3Info.textContent = 'Additional Information:';
            additionalInfoDiv.appendChild(h3Info);
            const ulInfo = document.createElement('ul');
            result.additionalInfo.forEach(info => { // Create list items for each piece of info.
                const li = document.createElement('li');
                li.textContent = info;
                ulInfo.appendChild(li);
            });
            additionalInfoDiv.appendChild(ulInfo);
            fragment.appendChild(additionalInfoDiv); // Add this section to the fragment.
        }

        // Add "Official Resources" (OPM Links) section if data exists.
        if (result.opmLinks && result.opmLinks.length > 0) {
            const linksDiv = document.createElement('div');
            linksDiv.className = 'result-links'; // Apply styling.
            const h3Links = document.createElement('h3');
            h3Links.textContent = 'Official Resources:';
            linksDiv.appendChild(h3Links);
            const ulLinks = document.createElement('ul');
            result.opmLinks.forEach(link => { // Create list items with hyperlinks for each link.
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.text;
                a.target = '_blank'; // Open links in a new tab.
                a.rel = 'noopener noreferrer'; // Security best practice for external links.
                li.appendChild(a);
                ulLinks.appendChild(li);
            });
            linksDiv.appendChild(ulLinks);
            fragment.appendChild(linksDiv); // Add this section to the fragment.
        }
        return fragment; // Return the populated document fragment.
    }

    /**
     * Displays the final result to the user.
     * This function is called when the user reaches an endpoint in the decision tree.
     * @param {object} result - The result object containing title, description, and other details.
     */
    function displayResult(result) {
        // Error handling: if the result object is invalid.
        // This can happen if a resultOutcome ID in the tree is mistyped or refers to a non-existent node.
        if (!result) {
            console.error('Error: displayResult was called with an undefined result object.', 'Current state:', state, 'Triggering answer:', state.answers[state.currentQuestionId]);
            displayCriticalError('An unexpected error occurred while trying to display the result. Please restart the tool.');
            return;
        }

        // Hide question and answer areas, show the result area.
            elements.questionArea.style.display = 'none';
            elements.answersArea.style.display = 'none';
            elements.printButton.style.display = 'inline-block'; // Show print button.
            elements.backButton.style.display = 'none'; // Hide back button on result screen.
        // The return; and the erroneous closing } were removed here.

        // Hide question and answer areas, show the result area.
        // The following lines are now reachable and will execute.
        elements.questionArea.style.display = 'none';
        elements.answersArea.style.display = 'none';
        elements.resultArea.style.display = 'block';
        elements.resultArea.innerHTML = ''; // Clear any previous result content.

        // Apply a CSS class based on the result type for specific styling (e.g., eligibility color-coding).
        elements.resultArea.className = `tool-result ${result.type}`;

        // Add the main title and description for the result.
        const titleElement = document.createElement('h2');
        titleElement.textContent = result.title;
        elements.resultArea.appendChild(titleElement);

        const descriptionElement = document.createElement('p');
        descriptionElement.textContent = result.description;
        elements.resultArea.appendChild(descriptionElement);

        // Create and append the detailed sections (documents, info, links) using the helper function.
        const resultDetailsElement = createResultDetailsElement(result);
        elements.resultArea.appendChild(resultDetailsElement);

        // Make the print button visible and hide the back button.
        elements.printButton.style.display = 'inline-block';
        elements.backButton.style.display = 'none';

        // Update progress to 100% as the user has reached a conclusion.
        state.currentStep = state.totalSteps;
        updateProgress();

        // Set focus to the result area for screen reader announcements.
        elements.resultArea.focus();
    }

    /**
     * Updates the visual progress bar based on the current step and total steps.
     * Also updates ARIA attributes for accessibility.
     */
    function updateProgress() {
        // Calculate progress percentage, ensuring totalSteps is not zero to avoid division by zero.
        const progress = (state.totalSteps > 0) ? (state.currentStep / state.totalSteps) * 100 : 0;
        elements.progressBar.style.width = `${progress}%`; // Set the width of the progress bar.
        elements.currentStep.textContent = state.currentStep; // Update current step number display.

        // Update ARIA attributes for screen readers.
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
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
