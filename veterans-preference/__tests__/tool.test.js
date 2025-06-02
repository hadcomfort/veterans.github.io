// --- Test Setup ---

const HTML_FIXTURE = `
    <div class="tool-disclaimer">
        <h2>Important Notice</h2>
        <button id="accept-disclaimer">I Understand - Continue to Tool</button>
    </div>
    <div id="tool-interface" style="display: none;">
        <div class="tool-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
            <div class="progress-bar" style="width: 0%;"></div>
            <span class="progress-text">Step <span id="current-step">0</span> of <span id="total-steps">0</span></span>
        </div>
        <div id="question-area" class="tool-question" aria-live="polite" tabindex="-1"></div>
        <div id="answers-area" class="tool-answers" role="group" aria-label="Answer options"></div>
        <div id="result-area" class="tool-result" style="display: none;" aria-live="polite" tabindex="-1"></div>
        <div class="tool-controls">
            <button id="back-button" class="btn btn-secondary" style="display: none;">Back</button>
            <button id="restart-button" class="btn btn-secondary">Start Over</button>
            <button id="print-button" class="btn btn-secondary" style="display: none;">Print Results</button>
        </div>
    </div>
`;

// Mock decision tree
const MOCK_VET_PREFERENCE_TREE = {
    'START': {
        id: 'START',
        questionText: 'Are you seeking information for yourself?',
        answers: [
            { answerText: 'Yes', nextQuestionId: 'Q1' },
            { answerText: 'No (HR Prof)', resultOutcome: 'HR_INFO' }
        ]
    },
    'Q1': {
        id: 'Q1',
        questionText: 'What is your discharge type?',
        explanationText: 'Explanation for Q1',
        answers: [
            { answerText: 'Honorable', nextQuestionId: 'Q2' },
            { answerText: 'Dishonorable', resultOutcome: 'NOT_ELIGIBLE_DISCHARGE' }
        ]
    },
    'Q2': {
        id: 'Q2',
        questionText: 'Do you have a disability rating?',
        answers: [
            { answerText: 'Yes, 10%', resultOutcome: 'ELIGIBLE_10_PERCENT' },
            { answerText: 'No', resultOutcome: 'ELIGIBLE_5_POINT' }
        ]
    },
    'HR_INFO': { // Shared result node
        type: 'info',
        title: 'HR Professional Info',
        description: 'Resources for HR.',
    },
    'NOT_ELIGIBLE_DISCHARGE': {
        type: 'not-eligible',
        title: 'Not Eligible',
        description: 'Discharge type makes you ineligible.',
    },
    'ELIGIBLE_10_PERCENT': {
        type: 'eligible-10-point',
        title: 'Eligible - 10 Point',
        description: 'You appear eligible for 10-point preference.',
        requiredDocuments: ['DD-214', 'VA Letter'],
    },
    'ELIGIBLE_5_POINT': {
        type: 'eligible-5-point',
        title: 'Eligible - 5 Point',
        description: 'You appear eligible for 5-point preference.',
    }
};


// --- Test Environment Simulation ---
// In a real test setup (Jest, Mocha), these would be part of the framework/setup files.

let mockState, mockElements, mockVetPreferenceTreeInternal;

// Simulate functions exposed from tool.js IIFE for testing
// These would be the actual functions from tool.js if it were refactored for testability
let init, startTool, displayQuestion, handleAnswer, displayResult, goBack, restartTool;
let getState, getElements, setVetPreferenceTree, getVetPreferenceTree;
let countTotalSteps, createQuestionElement, createAnswerButton, createResultDetailsElement; // Utilities

function simulateToolJSExposure() {
    // This function would typically not exist. Instead, tool.js would export its functions.
    // For this exercise, we redefine the functions here, copying their structure from tool.js
    // and making them operate on mockState, mockElements, and mockVetPreferenceTreeInternal.

    mockState = {
        currentQuestionId: null, history: [], answers: {}, totalSteps: 0, currentStep: 0
    };
    mockElements = {}; // Will be populated by setupDOM and init

    // --- Copying simplified logic from tool.js ---
    // Utility functions (already tested in previous step, simplified here)
    _countTotalSteps = function(tree) {
        if (!tree || Object.keys(tree).length === 0 || !tree['START']) return 1;
        function getMaxDepth(nodeId, currentTree, visitedInPath) {
            if (visitedInPath.has(nodeId)) return 0;
            const node = currentTree[nodeId];
            if (!node || !node.answers) return 1;
            visitedInPath.add(nodeId);
            let maxChildDepth = 0;
            let hasNextQuestion = false;
            node.answers.forEach(answer => {
                if (answer.nextQuestionId) {
                    hasNextQuestion = true;
                    const depth = getMaxDepth(answer.nextQuestionId, currentTree, new Set(visitedInPath));
                    if (depth > maxChildDepth) maxChildDepth = depth;
                }
            });
            return hasNextQuestion ? (1 + maxChildDepth) : 1;
        }
        return getMaxDepth('START', tree, new Set());
    };
    _createQuestionElement = function(question) {
        const qe = document.createElement('div');
        let html = `<h2>${question.questionText}</h2>`;
        if(question.helpText) html += `<p class="help-text">${question.helpText}</p>`;
        if(question.explanationText) {
            const explanationId = `explanation-${question.id || 'temp'}`;
            html += `<button class="explanation-toggle" aria-expanded="false" aria-controls="${explanationId}">Explain this?</button><div class="explanation-content" id="${explanationId}" style="display:none;"><p>${question.explanationText.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>')}</p></div>`;
        }
        qe.innerHTML = html;
        // Add event listener for explanation toggle if present
        const toggleBtn = qe.querySelector('.explanation-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
                const content = qe.querySelector('.explanation-content');
                if (content) content.style.display = isExpanded ? 'none' : 'block';
            });
        }
        return qe;
    };
    _createAnswerButton = function(answer) {
        const btn = document.createElement('button');
        btn.className = 'answer-option';
        btn.textContent = answer.answerText;
        btn.onclick = () => _handleAnswer(answer); // Ensure it calls the test scope's handleAnswer
        return btn;
    };
     _createResultDetailsElement = function(result) {
        const fragment = document.createDocumentFragment();
        if (result.requiredDocuments && result.requiredDocuments.length > 0) {
            const el = document.createElement('div');
            el.innerHTML = `<h3>Required Documents:</h3><ul>${result.requiredDocuments.map(d => `<li>${d}</li>`).join('')}</ul>`;
            fragment.appendChild(el);
        }
        // Add other sections if present (additionalInfo, opmLinks)
        return fragment;
     };


    // Core functions (these are the ones we are primarily testing in this file)
    _init = async function(shouldFetchFail = false) { // Added parameter for fetch failure simulation
        mockElements.disclaimer = document.querySelector('.tool-disclaimer');
        mockElements.acceptButton = document.getElementById('accept-disclaimer');
        mockElements.toolInterface = document.getElementById('tool-interface');
        mockElements.questionArea = document.getElementById('question-area');
        mockElements.answersArea = document.getElementById('answers-area');
        mockElements.resultArea = document.getElementById('result-area');
        mockElements.progressBar = document.querySelector('.progress-bar');
        mockElements.currentStep = document.getElementById('current-step');
        mockElements.totalSteps = document.getElementById('total-steps');
        mockElements.backButton = document.getElementById('back-button');
        mockElements.restartButton = document.getElementById('restart-button');
        mockElements.printButton = document.getElementById('print-button');

        // Mock fetch
        try {
            // Simulate successful fetch by default for most tests
            // This mock fetch is very basic. A real test setup might use libraries like sinon or jest.mock.
             window.fetch = async (url) => { // Define within scope or ensure it's globally available and configurable
                if (url.endsWith('decision-tree.json')) {
                    if (shouldFetchFail || (window.fetch && window.fetch.shouldFail)) { // Check local param or global flag
                        throw new Error("Simulated fetch failure");
                    }
                    return {
                        ok: true,
                        json: async () => ({ ... (getVetPreferenceTree() || MOCK_VET_PREFERENCE_TREE) }) // Use pre-set tree or default mock
                    };
                }
                throw new Error(`Unhandled fetch URL: ${url}`);
            };

            const response = await window.fetch('veterans-preference/decision-tree.json');
            if (!response.ok) throw new Error("Fetch not ok");
            const fetchedTree = await response.json();
            setVetPreferenceTree(fetchedTree); // Ensure internal tree is set

            if (mockElements.acceptButton) mockElements.acceptButton.addEventListener('click', _startTool);
            mockState.totalSteps = _countTotalSteps(getVetPreferenceTree());
            if (mockElements.totalSteps) mockElements.totalSteps.textContent = mockState.totalSteps;

        } catch (error) {
            console.error('Mock init error:', error.message);
            if (mockElements.questionArea) mockElements.questionArea.innerHTML = `<div class="tool-error-message"><h2>Initialization Error</h2><p>Could not load data.</p></div>`;
            if (mockElements.acceptButton) {mockElements.acceptButton.disabled = true; mockElements.acceptButton.textContent = "Tool Unavailable";}
            const toolInterface = document.getElementById('tool-interface'); // Re-fetch as mockElements might not be fully populated
            if (toolInterface) toolInterface.style.display = 'none';
        }
        if (mockElements.restartButton) mockElements.restartButton.addEventListener('click', _restartTool);
        if (mockElements.backButton) mockElements.backButton.addEventListener('click', _goBack);
        if (mockElements.printButton) mockElements.printButton.addEventListener('click', () => { /* mock print */ });
    };

    _startTool = function() {
        if (Object.keys(getVetPreferenceTree() || {}).length === 0) {
             console.error("startTool: vetPreferenceTree not loaded."); return;
        }
        mockElements.disclaimer.style.display = 'none';
        mockElements.toolInterface.style.display = 'block';
        _displayQuestion('START');
    };

    _displayQuestion = function(questionId) {
        const tree = getVetPreferenceTree();
        const question = tree[questionId];
        if (!question) { console.error(`displayQuestion: Question ${questionId} not found.`); return; }
        mockState.currentQuestionId = questionId;
        // Ensure currentStep is incremented correctly only when moving forward.
        // This logic might need refinement if goBack() changes currentStep in a way that conflicts.
        // For simplicity, assuming goBack handles its own step logic.
        if (!mockState.history.includes(questionId) || mockState.history[mockState.history.length-1] !== questionId) {
             // Only increment if it's a new question in the sequence, not a refresh or back
        }
        // A simple increment might be okay if goBack resets it properly
        mockState.currentStep = (mockState.history.length === 0 && questionId === 'START') ? 1 : mockState.history.length + 1;
        mockState.currentStep = Math.min(mockState.currentStep, mockState.totalSteps);


        // DOM updates
        mockElements.questionArea.innerHTML = '';
        mockElements.questionArea.appendChild(_createQuestionElement(question));
        mockElements.answersArea.innerHTML = '';
        question.answers.forEach(ans => mockElements.answersArea.appendChild(_createAnswerButton(ans)));

        // Progress bar
        if (mockElements.progressBar && mockState.totalSteps > 0) mockElements.progressBar.style.width = `${(mockState.currentStep / mockState.totalSteps) * 100}%`;
        if (mockElements.currentStep) mockElements.currentStep.textContent = mockState.currentStep;

        mockElements.backButton.style.display = mockState.history.length > 0 ? 'inline-block' : 'none';
        mockElements.questionArea.focus();
    };

    _handleAnswer = function(answer) {
        // Ensure currentQuestionId is valid before pushing to history
        if(mockState.currentQuestionId) {
            mockState.answers[mockState.currentQuestionId] = answer.answerText;
            mockState.history.push(mockState.currentQuestionId);
        }

        if (answer.nextQuestionId) {
            _displayQuestion(answer.nextQuestionId);
        } else if (answer.resultOutcome) {
            const resultData = typeof answer.resultOutcome === 'string' ? getVetPreferenceTree()[answer.resultOutcome] : answer.resultOutcome;
            _displayResult(resultData);
        }
    };

    _displayResult = function(result) {
        if(!result) { console.error("displayResult: result is undefined"); return; }
        mockElements.questionArea.style.display = 'none';
        mockElements.answersArea.style.display = 'none';
        mockElements.resultArea.style.display = 'block';
        mockElements.resultArea.innerHTML = ''; // Clear previous results

        const titleEl = document.createElement('h2');
        titleEl.textContent = result.title;
        mockElements.resultArea.appendChild(titleEl);

        const descEl = document.createElement('p');
        descEl.textContent = result.description;
        mockElements.resultArea.appendChild(descEl);

        mockElements.resultArea.appendChild(_createResultDetailsElement(result));

        mockElements.printButton.style.display = 'inline-block';
        mockElements.backButton.style.display = 'none';
        mockState.currentStep = mockState.totalSteps;
        if (mockElements.progressBar && mockState.totalSteps > 0) mockElements.progressBar.style.width = '100%';
        if (mockElements.currentStep) mockElements.currentStep.textContent = mockState.currentStep;
        mockElements.resultArea.focus();
    };

    _goBack = function() {
        if (mockState.history.length > 0) {
            const previousQuestionIdInHistory = mockState.history.pop(); // This is the question we are going *from*
            const targetQuestionId = mockState.history.length > 0 ? mockState.history[mockState.history.length -1] : 'START';

            // If we pop the last item and history becomes empty, we are going back to START
            // currentStep should reflect the step number of the question we are now displaying.
            // If history is now empty, we are displaying START (step 1).
            // If history has items, its length is the number of *previous* questions. So current question is length + 1.
            mockState.currentStep = mockState.history.length + 1;

            _displayQuestion(targetQuestionId); // This will set currentQuestionId to targetQuestionId
                                             // and re-calculate currentStep based on history.
                                             // Let's adjust displayQuestion to correctly set currentStep on navigating back.
                                             // For now, displayQuestion will set currentStep to history.length + 1.
        }
    };
     _restartTool = function() {
        mockState.currentQuestionId = null;
        mockState.history = [];
        mockState.answers = {};
        mockState.currentStep = 0; // displayQuestion('START') will make it 1

        if(mockElements.questionArea) mockElements.questionArea.style.display = 'block';
        if(mockElements.answersArea) mockElements.answersArea.style.display = 'block';
        if(mockElements.resultArea) mockElements.resultArea.style.display = 'none';
        if(mockElements.printButton) mockElements.printButton.style.display = 'none';

        _displayQuestion('START');
    };


    // Exposed for tests
    init = _init;
    startTool = _startTool;
    displayQuestion = _displayQuestion;
    handleAnswer = _handleAnswer;
    displayResult = _displayResult;
    goBack = _goBack;
    restartTool = _restartTool;

    getState = () => mockState;
    getElements = () => mockElements;
    setVetPreferenceTree = (tree) => { mockVetPreferenceTreeInternal = tree; };
    getVetPreferenceTree = () => mockVetPreferenceTreeInternal;

    countTotalSteps = _countTotalSteps;
    createQuestionElement = _createQuestionElement;
    createAnswerButton = _createAnswerButton;
    createResultDetailsElement = _createResultDetailsElement;
}
simulateToolJSExposure();


function setupDOMAndTool(customTree) {
    document.body.innerHTML = HTML_FIXTURE;
    mockElements.disclaimer = document.querySelector('.tool-disclaimer');
    mockElements.acceptButton = document.getElementById('accept-disclaimer');
    mockElements.toolInterface = document.getElementById('tool-interface');
    mockElements.questionArea = document.getElementById('question-area');
    mockElements.answersArea = document.getElementById('answers-area');
    mockElements.resultArea = document.getElementById('result-area');
    mockElements.progressBar = document.querySelector('.progress-bar');
    mockElements.currentStep = document.getElementById('current-step');
    mockElements.totalSteps = document.getElementById('total-steps');
    mockElements.backButton = document.getElementById('back-button');
    mockElements.restartButton = document.getElementById('restart-button');
    mockElements.printButton = document.getElementById('print-button');

    setVetPreferenceTree(customTree || { ...MOCK_VET_PREFERENCE_TREE });

    // Reset state before each relevant test or group
    mockState.currentQuestionId = null;
    mockState.history = [];
    mockState.answers = {};
    mockState.currentStep = 0;
    mockState.totalSteps = 0;
}

// Basic assertion shim
function expect(actual) {
    const self = {
        toBe: (expected, message) => { if (actual !== expected) throw new Error(message || `Assert Fail: ${actual} !== ${expected}`); },
        toEqual: (expected, message) => { if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(message || `Assert Fail: ${JSON.stringify(actual)} !== ${JSON.stringify(expected)} (toEqual)`); },
        toBeTruthy: (message) => { if (!actual) throw new Error(message || `Assert Fail: ${actual} is not truthy`); },
        toBeNull: (message) => { if (actual !== null) throw new Error(message || `Assert Fail: ${actual} is not null`); },
        stringContaining: (substring, message) => { if (typeof actual !== 'string' || !actual.includes(substring)) throw new Error(message || `Assert Fail: "${actual}" does not contain "${substring}"`);},
        toBeGreaterThan: (expected, message) => { if (actual <= expected) throw new Error(message || `Assert Fail: ${actual} not > ${expected}`);}
    };
    return self;
}
const assert = {
    strictEqual: (a, e, m) => expect(a).toBe(e,m),
    deepStrictEqual: (a, e, m) => expect(a).toEqual(e,m),
    isTrue: (a, m) => expect(a).toBeTruthy(m),
    isNull: (a, m) => expect(a).toBeNull(m),
    include: (a, sub, m) => expect(a).stringContaining(sub,m),
    greaterThan: (a, e, m) => expect(a).toBeGreaterThan(e,m),
};


// --- Test Suites ---

describe('Tool Initialization (init)', () => {
    beforeEach(() => {
        // Reset the global fetch mock behavior if needed
        delete window.fetch.shouldFail;
        setupDOMAndTool();
    });

    it('should populate DOM elements cache', async () => {
        await init();
        const elements = getElements();
        assert.isTrue(elements.questionArea instanceof HTMLElement, 'questionArea should be an element');
        assert.isTrue(elements.acceptButton instanceof HTMLElement, 'acceptButton should be an element');
    });

    it('should calculate and set totalSteps from the mock tree', async () => {
        await init();
        const state = getState();
        const expectedTotalSteps = countTotalSteps(getVetPreferenceTree());
        assert.strictEqual(state.totalSteps, expectedTotalSteps, `totalSteps should be ${expectedTotalSteps}`);
        assert.strictEqual(getElements().totalSteps.textContent, String(expectedTotalSteps), 'totalSteps textContent update');
    });

    it('should populate vetPreferenceTree on successful fetch', async () => {
        await init(); // Uses MOCK_VET_PREFERENCE_TREE by default via the mock fetch
        assert.deepStrictEqual(getVetPreferenceTree(), MOCK_VET_PREFERENCE_TREE, 'vetPreferenceTree should be populated');
    });

    it('should display error and disable tool on fetch failure', async () => {
        // window.fetch.shouldFail = true; // Set flag for mock fetch to fail
        setupDOMAndTool(); // Reset DOM before init
        await init(true); // Pass flag to make fetch fail

        const elements = getElements();
        assert.include(elements.questionArea.innerHTML, "Initialization Error", "Error message should be shown");
        assert.isTrue(elements.acceptButton.disabled, "Accept button should be disabled");

        // Check if toolInterface is hidden
        const toolInterface = document.getElementById('tool-interface');
        assert.strictEqual(toolInterface.style.display, "none", "Tool interface should be hidden on fetch failure");
        delete window.fetch.shouldFail;
    });
});

describe('startTool', () => {
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
    });

    it('should hide disclaimer and show tool interface', () => {
        startTool();
        const elements = getElements();
        assert.strictEqual(elements.disclaimer.style.display, 'none', 'Disclaimer hidden');
        assert.strictEqual(elements.toolInterface.style.display, 'block', 'Tool interface shown');
    });

    it('should call displayQuestion with START node ID', () => {
        startTool();
        assert.strictEqual(getState().currentQuestionId, 'START', 'currentQuestionId should be START');
    });
});

describe('displayQuestion', () => {
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
        getState().currentStep = 0; // Reset for accurate step count for the first question
    });

    it('should render question text and answer buttons', () => {
        displayQuestion('START');
        const elements = getElements();
        assert.include(elements.questionArea.innerHTML, MOCK_VET_PREFERENCE_TREE['START'].questionText, 'Question text rendered');
        const answerButtons = elements.answersArea.querySelectorAll('button.answer-option');
        assert.strictEqual(answerButtons.length, MOCK_VET_PREFERENCE_TREE['START'].answers.length, 'Correct number of answer buttons');
        assert.strictEqual(answerButtons[0].textContent, MOCK_VET_PREFERENCE_TREE['START'].answers[0].answerText, 'Answer button text correct');
    });

    it('should update state (currentQuestionId, currentStep)', () => {
        displayQuestion('Q1'); // This is the second question in a path
        const state = getState();
        assert.strictEqual(state.currentQuestionId, 'Q1', 'currentQuestionId updated');
        // After START (step 1), Q1 should be step 2
        assert.strictEqual(state.currentStep, 2, 'currentStep should be 2 for Q1 after START');
    });

    it('should update progress bar display', () => {
        displayQuestion('START'); // currentStep becomes 1
        const state = getState();
        const elements = getElements();
        const expectedProgress = (1 / state.totalSteps) * 100;
        assert.strictEqual(elements.progressBar.style.width, `${expectedProgress}%`, 'Progress bar width updated');
        assert.strictEqual(elements.currentStep.textContent, '1', 'Current step text updated');
    });
});

describe('handleAnswer', () => {
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
        displayQuestion('START');
    });

    it('should navigate to next question and update history', () => {
        const answer = MOCK_VET_PREFERENCE_TREE['START'].answers[0]; // Leads to Q1
        handleAnswer(answer);
        const state = getState();
        assert.strictEqual(state.currentQuestionId, 'Q1', 'Navigated to Q1');
        assert.deepStrictEqual(state.history, ['START'], 'History updated with START');
    });

    it('should navigate to a result outcome', () => {
        const answer = MOCK_VET_PREFERENCE_TREE['START'].answers[1]; // Leads to HR_INFO result
        handleAnswer(answer);
        const elements = getElements();
        assert.include(elements.resultArea.innerHTML, MOCK_VET_PREFERENCE_TREE['HR_INFO'].title, 'Result title displayed');
        assert.strictEqual(elements.resultArea.style.display, 'block', 'Result area shown');
    });
});

describe('displayResult', () => {
    let resultNode;
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
        resultNode = MOCK_VET_PREFERENCE_TREE['ELIGIBLE_10_PERCENT'];
        getState().currentStep = countTotalSteps(getVetPreferenceTree()) -1; // Simulate being on last question
        displayResult(resultNode);
    });

    it('should render result title and description', () => {
        const elements = getElements();
        assert.include(elements.resultArea.innerHTML, resultNode.title, 'Result title rendered');
        assert.include(elements.resultArea.innerHTML, resultNode.description, 'Result description rendered');
    });

    it('should hide question/answer areas and show result area', () => {
        const elements = getElements();
        assert.strictEqual(elements.questionArea.style.display, 'none', 'Question area hidden');
        assert.strictEqual(elements.answersArea.style.display, 'none', 'Answers area hidden');
        assert.strictEqual(elements.resultArea.style.display, 'block', 'Result area shown');
    });

    it('should make print button visible', () => {
        assert.strictEqual(getElements().printButton.style.display, 'inline-block', 'Print button visible');
    });

    it('should update progress bar to 100%', () => {
        const state = getState();
        const elements = getElements();
        assert.strictEqual(state.currentStep, state.totalSteps, 'Current step is total steps');
        assert.strictEqual(elements.progressBar.style.width, '100%', 'Progress bar at 100%');
        assert.strictEqual(elements.currentStep.textContent, String(state.totalSteps), 'Progress text shows total steps');
    });
});

describe('goBack', () => {
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
        // START (step 1, history []) -> Q1 (step 2, history [START])
        handleAnswer(MOCK_VET_PREFERENCE_TREE['START'].answers[0]);
    });

    it('should navigate to the previous question from history', () => {
        goBack(); // Go back from Q1 to START
        assert.strictEqual(getState().currentQuestionId, 'START', 'Navigated back to START');
        assert.strictEqual(getState().history.length, 0, "History should be empty after going back to START");
    });

    it('should update currentStep correctly when going back', () => {
        // Currently at Q1, currentStep = 2, history = ['START']
        goBack(); // Go back to START
        // displayQuestion('START') will set currentStep to history.length (0) + 1 = 1
        assert.strictEqual(getState().currentStep, 1, 'currentStep should be 1 for START');
    });

    it('should not go back further if at START node (history is empty)', () => {
        goBack(); // Back to START, history is now empty
        assert.strictEqual(getState().currentQuestionId, 'START');

        goBack(); // Try to go back from START
        assert.strictEqual(getState().currentQuestionId, 'START', 'Should remain on START');
        assert.strictEqual(getState().currentStep, 1, 'currentStep should remain 1');
    });
});

describe('restartTool', () => {
    beforeEach(async () => {
        setupDOMAndTool();
        await init();
        handleAnswer(MOCK_VET_PREFERENCE_TREE['START'].answers[0]);
        handleAnswer(MOCK_VET_PREFERENCE_TREE['Q1'].answers[1]);
    });

    it('should reset state variables and display START question', () => {
        restartTool();
        const state = getState();
        assert.strictEqual(state.currentQuestionId, 'START', 'currentQuestionId reset to START');
        assert.deepStrictEqual(state.history, [], 'History emptied');
        assert.deepStrictEqual(state.answers, {}, 'Answers emptied');
        assert.strictEqual(state.currentStep, 1, 'currentStep reset to 1 (for START question)');
        assert.include(getElements().questionArea.innerHTML, MOCK_VET_PREFERENCE_TREE['START'].questionText, 'START question displayed');
    });

    it('should reset UI elements (result area, print button)', () => {
        restartTool();
        const elements = getElements();
        assert.strictEqual(elements.resultArea.style.display, 'none', 'Result area hidden');
        assert.strictEqual(elements.printButton.style.display, 'none', 'Print button hidden');
        assert.strictEqual(elements.questionArea.style.display, 'block', 'Question area shown');
    });
});

console.log("Core logic mock test suite finished. Check for assertion errors if any were thrown.");
// End of tool.test.js
