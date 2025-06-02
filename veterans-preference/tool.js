// Veterans' Preference Interactive Tool Logic
// This script is wrapped in an IIFE (Immediately Invoked Function Expression)
// to create a private scope, preventing naming conflicts with other scripts.
(function() {
    'use strict';

    const config = {
        DECISION_TREE_URL: 'decision-tree.json',
        SELECTORS: {
            TOOL_DISCLAIMER: '.tool-disclaimer',
            ACCEPT_DISCLAIMER_BUTTON: '#accept-disclaimer',
            TOOL_INTERFACE: '#tool-interface',
            QUESTION_AREA: '#question-area',
            ANSWERS_AREA: '#answers-area',
            RESULT_AREA: '#result-area',
            PROGRESS_BAR: '.progress-bar',
            CURRENT_STEP: '#current-step',
            TOTAL_STEPS: '#total-steps',
            BACK_BUTTON: '#back-button',
            RESTART_BUTTON: '#restart-button',
            PRINT_BUTTON: '#print-button',
            TOOL_CONTROLS: '.tool-controls',
            TOOL_PROGRESS: '.tool-progress',
        },
        INITIAL_QUESTION_ID: 'START',
        BUTTON_TEXT: {
            TOOL_UNAVAILABLE: 'Tool Unavailable',
            EXPLAIN_THIS: 'Explain this?',
        },
        CSS_CLASSES: {
            HELP_TEXT: 'help-text',
            EXPLANATION_TOGGLE: 'explanation-toggle',
            EXPLANATION_CONTENT: 'explanation-content',
            ANSWER_OPTION: 'answer-option',
            TOOL_RESULT: 'tool-result',
            RESULT_DOCUMENTS: 'result-documents',
            RESULT_DETAILS: 'result-details',
            RESULT_LINKS: 'result-links',
            TOOL_ERROR_MESSAGE: 'tool-error-message',
        },
        LINK_ATTRIBUTES: {
            TARGET_BLANK: '_blank',
            REL_NOOPENER_NOREFERRER: 'noopener noreferrer',
        },
        ERROR_MESSAGES: {
            INIT_ERROR_TITLE: 'Initialization Error',
            INIT_ERROR_MESSAGE: 'Could not load the decision tree data required for this tool to function.',
            INIT_ERROR_SUGGESTION: 'Please try refreshing the page. If the issue persists, the tool may be temporarily unavailable or there might be a network problem.',
            DECISION_TREE_NOT_LOADED: "Decision tree not loaded yet. Cannot start tool.",
            TOOL_LOADING: 'The tool is still loading. Please wait a moment and try again.',
            QUESTION_NOT_FOUND: 'An error occurred while trying to load the question. Please restart the tool to try again.',
            RESULT_NODE_NOT_FOUND: 'An error occurred while trying to determine the outcome. Please restart the tool.',
            UNEXPECTED_RESULT_ERROR: 'An unexpected error occurred while trying to display the result. Please restart the tool.',
            CRITICAL_ERROR_TITLE: 'Tool Error',
        },
        ARIA_ATTRIBUTES: {
            EXPANDED: 'aria-expanded',
            CONTROLS: 'aria-controls',
            VALUENOW: 'aria-valuenow',
        },
        DEFAULT_TOTAL_STEPS: 1,
        NEW_LINE_REGEX_GLOBAL: /\n\n/g,
        NEW_LINE_REGEX: /\n/g,
    };

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
     * Caches essential DOM elements for later use.
     * @param {object} config - The configuration object.
     * @param {object} elements - The global elements object to populate.
     */
    function cacheDOMElements(config, elements) {
        elements.disclaimer = document.querySelector(config.SELECTORS.TOOL_DISCLAIMER);
        elements.acceptButton = document.getElementById(config.SELECTORS.ACCEPT_DISCLAIMER_BUTTON.substring(1)); // getElementById doesn't need '#'
        elements.toolInterface = document.getElementById(config.SELECTORS.TOOL_INTERFACE.substring(1));
        elements.questionArea = document.getElementById(config.SELECTORS.QUESTION_AREA.substring(1));
        elements.answersArea = document.getElementById(config.SELECTORS.ANSWERS_AREA.substring(1));
        elements.resultArea = document.getElementById(config.SELECTORS.RESULT_AREA.substring(1));
        elements.progressBar = document.querySelector(config.SELECTORS.PROGRESS_BAR);
        elements.currentStep = document.getElementById(config.SELECTORS.CURRENT_STEP.substring(1));
        elements.totalSteps = document.getElementById(config.SELECTORS.TOTAL_STEPS.substring(1));
        elements.backButton = document.getElementById(config.SELECTORS.BACK_BUTTON.substring(1));
        elements.restartButton = document.getElementById(config.SELECTORS.RESTART_BUTTON.substring(1));
        elements.printButton = document.getElementById(config.SELECTORS.PRINT_BUTTON.substring(1));
    }

    /**
     * Fetches and parses the decision tree JSON.
     * @param {object} config - The configuration object.
     * @returns {Promise<object>} A promise that resolves with the decision tree data.
     * @throws {Error} If fetching or parsing fails.
     */
    async function fetchDecisionTree(config) {
        const response = await fetch(config.DECISION_TREE_URL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    }

    /**
     * Sets up event listeners for controls that are independent of the decision tree data.
     * @param {object} config - The configuration object.
     * @param {object} elements - The cached DOM elements.
     * @param {function} restartToolFn - Reference to the restartTool function.
     * @param {function} goBackFn - Reference to the goBack function.
     * @param {function} printResultsFn - Reference to the printResults function.
     */
    function setupInitialEventListeners(config, elements, restartToolFn, goBackFn, printResultsFn) {
        if (elements.restartButton) {
            elements.restartButton.addEventListener('click', restartToolFn);
        }
        if (elements.backButton) {
            elements.backButton.addEventListener('click', goBackFn);
        }
        if (elements.printButton) {
            elements.printButton.addEventListener('click', printResultsFn);
        }
        // Note: acceptButton listener is set up in init() after tree is loaded.
    }

    /**
     * Handles errors during the initialization process.
     * Displays an error message and disables the tool.
     * @param {object} config - The configuration object.
     * @param {object} elements - The cached DOM elements.
     * @param {Error} error - The error object.
     */
    function handleInitializationError(config, elements, error) {
        console.error('Error loading decision tree:', error);
        if (elements.questionArea) {
            elements.questionArea.innerHTML = `
                <div class="${config.CSS_CLASSES.TOOL_ERROR_MESSAGE}">
                    <h2>${config.ERROR_MESSAGES.INIT_ERROR_TITLE}</h2>
                    <p>${config.ERROR_MESSAGES.INIT_ERROR_MESSAGE}</p>
                    <p>${config.ERROR_MESSAGES.INIT_ERROR_SUGGESTION}</p>
                </div>`;
            elements.questionArea.style.display = 'block';
        }
        if (elements.answersArea) elements.answersArea.style.display = 'none';
        
        // Query for toolControls and toolProgress within this function scope
        // as they might not be cached in 'elements' if cacheDOMElements failed or wasn't called.
        const toolControls = document.querySelector(config.SELECTORS.TOOL_CONTROLS);
        if (toolControls) toolControls.style.display = 'none';
        
        const progressContainer = document.querySelector(config.SELECTORS.TOOL_PROGRESS);
        if (progressContainer) progressContainer.style.display = 'none';

        if (elements.acceptButton) {
            elements.acceptButton.disabled = true;
            elements.acceptButton.textContent = config.BUTTON_TEXT.TOOL_UNAVAILABLE;
        }
    }

    /**
     * Initializes the interactive tool.
     */
    async function init() {
        cacheDOMElements(config, elements);
        setupInitialEventListeners(config, elements, restartTool, goBack, printResults);

        try {
            vetPreferenceTree = await fetchDecisionTree(config);

            // Setup parts that depend on vetPreferenceTree
            if (elements.acceptButton) {
                // Ensure it's not disabled by a previous error, though unlikely if tree fetch succeeded.
                elements.acceptButton.disabled = false; 
                elements.acceptButton.textContent = document.getElementById(config.SELECTORS.ACCEPT_DISCLAIMER_BUTTON.substring(1)).textContent; // Reset text if it was changed
                elements.acceptButton.addEventListener('click', startTool);
            }

            state.totalSteps = countTotalSteps(vetPreferenceTree, config); // Pass config
            if (elements.totalSteps) {
                elements.totalSteps.textContent = state.totalSteps;
            }

        } catch (error) {
            handleInitializationError(config, elements, error);
            // No return needed here as handleInitializationError doesn't throw,
            // and further execution in init is not harmful.
        }
    }

    /**
     * Calculates the estimated total number of steps (questions) in the decision tree.
     * This function traverses the `vetPreferenceTree` from the 'START' node to find the
     * maximum depth, which is used as an estimate for the total steps in the progress bar.
     * If the tree is not loaded, it returns a default value.
     * @param {object} tree - The decision tree data.
     * @param {object} config - The configuration object.
     * @returns {number} The estimated maximum depth of the decision tree, or a default value.
     */
    function countTotalSteps(tree, config) { // Added config parameter
        if (!tree || Object.keys(tree).length === 0 || !tree[config.INITIAL_QUESTION_ID]) {
            return config.DEFAULT_TOTAL_STEPS; // Default to 1 if tree is empty or START node is missing
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

        return getMaxDepth(config.INITIAL_QUESTION_ID, tree, new Set());
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
            console.error(config.ERROR_MESSAGES.DECISION_TREE_NOT_LOADED);
            // Optionally, inform the user if the tool is still loading.
            if (elements.questionArea) {
                elements.questionArea.innerHTML = `<p>${config.ERROR_MESSAGES.TOOL_LOADING}</p>`;
            }
            return;
        }
        // Hide disclaimer and show the main tool interface.
        elements.disclaimer.style.display = 'none';
        elements.toolInterface.style.display = 'block';
        // Display the initial question.
        displayQuestion(config.INITIAL_QUESTION_ID);
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
            helpTextElement.className = config.CSS_CLASSES.HELP_TEXT; // Apply styling for help text.
            helpTextElement.textContent = question.helpText;
            questionElement.appendChild(helpTextElement);
        }

        // Add "Explain this?" feature if explanationText exists
        if (question.explanationText) {
            const explanationButton = document.createElement('button');
            explanationButton.className = config.CSS_CLASSES.EXPLANATION_TOGGLE;
            explanationButton.textContent = config.BUTTON_TEXT.EXPLAIN_THIS;
            explanationButton.setAttribute(config.ARIA_ATTRIBUTES.EXPANDED, 'false');

            const explanationId = `explanation-${question.id || Math.random().toString(36).substr(2, 9)}`;
            explanationButton.setAttribute(config.ARIA_ATTRIBUTES.CONTROLS, explanationId);

            const explanationDiv = document.createElement('div');
            explanationDiv.className = config.CSS_CLASSES.EXPLANATION_CONTENT;
            explanationDiv.id = explanationId;
            // Sanitize or carefully construct HTML if explanationText can contain HTML.
            // For simple text, textContent is safer. If HTML is needed, ensure it's from a trusted source.
            // Assuming explanationText is simple text or safe HTML for this implementation.
            explanationDiv.innerHTML = `<p>${question.explanationText.replace(config.NEW_LINE_REGEX_GLOBAL, '</p><p>').replace(config.NEW_LINE_REGEX, '<br>')}</p>`; // Basic formatting for newlines
            explanationDiv.style.display = 'none'; // Initially hidden

            explanationButton.addEventListener('click', () => {
                const isExpanded = explanationButton.getAttribute(config.ARIA_ATTRIBUTES.EXPANDED) === 'true';
                explanationButton.setAttribute(config.ARIA_ATTRIBUTES.EXPANDED, !isExpanded);
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
     * @param {function} handleAnswerFn - The function to call when the answer is selected.
     * @returns {HTMLButtonElement} A button element configured with the answer text and a click handler.
     */
    function createAnswerButton(answer, handleAnswerFn) {
        const button = document.createElement('button');
        button.className = config.CSS_CLASSES.ANSWER_OPTION; // Apply styling for answer buttons.
        button.textContent = answer.answerText; // Set the button text.
        // Set an event listener to handle the answer selection.
        button.addEventListener('click', () => handleAnswerFn(answer));
        return button; // Return the configured button.
    }

    /**
     * Renders the answer options for the current question.
     * @param {object} config - The configuration object.
     * @param {object} question - The current question object.
     * @param {HTMLElement} answersArea - The DOM element to append answer buttons to.
     * @param {function} handleAnswerFn - The function to call when an answer is selected.
     */
    function renderAnswerOptions(config, question, answersArea, handleAnswerFn) {
        question.answers.forEach(answer => {
            const answerButton = createAnswerButton(answer, handleAnswerFn); // Pass handleAnswerFn
            answersArea.appendChild(answerButton);
        });
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
            displayCriticalError(config.ERROR_MESSAGES.QUESTION_NOT_FOUND, config, elements); // Pass config and elements
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
        const questionElement = createQuestionElement(question); // createQuestionElement is already fine
        elements.questionArea.appendChild(questionElement);

        // Render answer options
        renderAnswerOptions(config, question, elements.answersArea, handleAnswer);

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
                    displayCriticalError(config.ERROR_MESSAGES.RESULT_NODE_NOT_FOUND, config, elements); // Pass config and elements
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
     * @param {object} config - The configuration object.
     * @param {object} elements - The cached DOM elements.
     */
    function displayCriticalError(userMessage, config, elements) { // Added config and elements parameters
        if (elements.questionArea) elements.questionArea.style.display = 'none';
        if (elements.answersArea) elements.answersArea.style.display = 'none';

        if (elements.resultArea) {
            elements.resultArea.innerHTML = `
                <div class="${config.CSS_CLASSES.TOOL_ERROR_MESSAGE}">
                    <h2>${config.ERROR_MESSAGES.CRITICAL_ERROR_TITLE}</h2>
                    <p>${userMessage}</p>
                </div>`;
            elements.resultArea.className = config.CSS_CLASSES.TOOL_RESULT; 
            elements.resultArea.style.display = 'block';
            elements.resultArea.focus(); // Set focus for accessibility.
        }

        // Manage visibility of control buttons
        if (elements.backButton) elements.backButton.style.display = 'none';
        if (elements.printButton) elements.printButton.style.display = 'none';
        // Keep restart button visible
        if (elements.restartButton) elements.restartButton.style.display = 'inline-block';
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
            documentsDiv.className = config.CSS_CLASSES.RESULT_DOCUMENTS; // Apply styling.
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
            additionalInfoDiv.className = config.CSS_CLASSES.RESULT_DETAILS; // Apply styling.
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
            linksDiv.className = config.CSS_CLASSES.RESULT_LINKS; // Apply styling.
            const h3Links = document.createElement('h3');
            h3Links.textContent = 'Official Resources:';
            linksDiv.appendChild(h3Links);
            const ulLinks = document.createElement('ul');
            result.opmLinks.forEach(link => { // Create list items with hyperlinks for each link.
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = link.url;
                a.textContent = link.text;
                a.target = config.LINK_ATTRIBUTES.TARGET_BLANK; // Open links in a new tab.
                a.rel = config.LINK_ATTRIBUTES.REL_NOOPENER_NOREFERRER; // Security best practice for external links.
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
            displayCriticalError(config.ERROR_MESSAGES.UNEXPECTED_RESULT_ERROR, config, elements); // Pass config and elements
            return;
        }

        // Hide question/answer areas, show result area and print button, hide back button.
        elements.questionArea.style.display = 'none';
        elements.answersArea.style.display = 'none';
        elements.resultArea.style.display = 'block';
        elements.printButton.style.display = 'inline-block';
        elements.backButton.style.display = 'none';

        // Clear previous result content and set class (type can be undefined, so handle that)
        elements.resultArea.innerHTML = ''; 
        elements.resultArea.className = config.CSS_CLASSES.TOOL_RESULT + (result.type ? ` ${result.type}` : '');


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
        const progressContainer = document.querySelector(config.SELECTORS.TOOL_PROGRESS);
        if (progressContainer) {
            progressContainer.setAttribute(config.ARIA_ATTRIBUTES.VALUENOW, progress);
        }
    }

    // Go back to previous question
    function goBack() {
        if (state.history.length > 0) {
            state.history.pop(); // Remove current
            const previousId = state.history.length > 0 ? state.history[state.history.length - 1] : config.INITIAL_QUESTION_ID;
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
        displayQuestion(config.INITIAL_QUESTION_ID);
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
