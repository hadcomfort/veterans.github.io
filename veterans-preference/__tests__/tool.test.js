// Basic DOM setup for tests
document.body.innerHTML = `
    <div class="tool-container">
        <div id="tool-interface">
            <div class="tool-progress" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar"></div>
                <span class="progress-text">Step <span id="current-step">1</span> of <span id="total-steps">10</span></span>
            </div>
            <div id="question-area" class="tool-question" aria-live="polite" tabindex="-1"></div>
            <div id="answers-area" class="tool-answers" role="group" aria-label="Answer options"></div>
            <div id="result-area" class="tool-result" style="display: none;" aria-live="polite" tabindex="-1"></div>
            <div class="tool-controls">
                <button id="back-button" class="btn btn-secondary" style="display: none;">← Previous Question</button>
                <button id="print-button" class="btn btn-secondary" style="display: none;">Print Results</button>
            </div>
        </div>
    </div>
`;

// Mock necessary elements and state from tool.js
// This is a simplified mock for testing displayResult.
// A more complete test setup would involve loading and executing tool.js in the test environment.
const elements = {
    questionArea: document.getElementById('question-area'),
    answersArea: document.getElementById('answers-area'),
    resultArea: document.getElementById('result-area'),
    printButton: document.getElementById('print-button'),
    backButton: document.getElementById('back-button'),
    progressBar: document.querySelector('.progress-bar'),
    currentStep: document.getElementById('current-step'),
    totalSteps: document.getElementById('total-steps')
};

const state = {
    currentQuestionId: null,
    history: [],
    answers: {},
    totalSteps: 10, // Mocked
    currentStep: 0  // Mocked
};

// Function to simulate updateProgress, simplified
function updateProgress() {
    const progress = (state.totalSteps > 0) ? (state.currentStep / state.totalSteps) * 100 : 0;
    if (elements.progressBar) elements.progressBar.style.width = `${progress}%`;
    if (elements.currentStep) elements.currentStep.textContent = state.currentStep;
    const progressContainer = document.querySelector('.tool-progress');
    if (progressContainer) {
        progressContainer.setAttribute('aria-valuenow', progress);
    }
}

// Function to simulate createResultDetailsElement, simplified for testing displayResult
function createResultDetailsElement(result) {
    const fragment = document.createDocumentFragment();
    if (result.requiredDocuments && result.requiredDocuments.length > 0) {
        const documentsDiv = document.createElement('div');
        documentsDiv.className = 'result-documents';
        const h3Docs = document.createElement('h3');
        h3Docs.textContent = 'Required Documents:';
        documentsDiv.appendChild(h3Docs);
        const ulDocs = document.createElement('ul');
        result.requiredDocuments.forEach(doc => {
            const li = document.createElement('li');
            li.textContent = doc;
            ulDocs.appendChild(li);
        });
        documentsDiv.appendChild(ulDocs);
        fragment.appendChild(documentsDiv);
    }
    if (result.additionalInfo && result.additionalInfo.length > 0) {
        const additionalInfoDiv = document.createElement('div');
        additionalInfoDiv.className = 'result-details';
        const h3Info = document.createElement('h3');
        h3Info.textContent = 'Additional Information:';
        additionalInfoDiv.appendChild(h3Info);
        const ulInfo = document.createElement('ul');
        result.additionalInfo.forEach(info => {
            const li = document.createElement('li');
            li.textContent = info;
            ulInfo.appendChild(li);
        });
        additionalInfoDiv.appendChild(ulInfo);
        fragment.appendChild(additionalInfoDiv);
    }
    if (result.opmLinks && result.opmLinks.length > 0) {
        const linksDiv = document.createElement('div');
        linksDiv.className = 'result-links';
        const h3Links = document.createElement('h3');
        h3Links.textContent = 'Official Resources:';
        linksDiv.appendChild(h3Links);
        const ulLinks = document.createElement('ul');
        result.opmLinks.forEach(link => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = link.url;
            a.textContent = link.text;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            li.appendChild(a);
            ulLinks.appendChild(li);
        });
        linksDiv.appendChild(ulLinks);
        fragment.appendChild(linksDiv);
    }
    return fragment;
}

// The displayResult function, copied from tool.js (with the fix applied)
// Ideally, this would be imported or made available through other means.
function displayResult(result) {
    if (!result) {
        console.error('Error: displayResult was called with an undefined result object.');
        // Simplified error display for test, real one is more complex
        elements.resultArea.innerHTML = '<p>Error displaying result.</p>';
        elements.resultArea.style.display = 'block';
        return;
    }

    elements.questionArea.style.display = 'none';
    elements.answersArea.style.display = 'none';
    elements.resultArea.style.display = 'block';
    elements.resultArea.innerHTML = '';

    elements.resultArea.className = `tool-result ${result.type || ''}`.trim();

    const titleElement = document.createElement('h2');
    titleElement.textContent = result.title;
    elements.resultArea.appendChild(titleElement);

    const descriptionElement = document.createElement('p');
    descriptionElement.textContent = result.description;
    elements.resultArea.appendChild(descriptionElement);

    const resultDetailsElement = createResultDetailsElement(result);
    elements.resultArea.appendChild(resultDetailsElement);

    elements.printButton.style.display = 'inline-block';
    elements.backButton.style.display = 'none';

    state.currentStep = state.totalSteps;
    updateProgress();

    elements.resultArea.focus();
}

// --- Tests for displayResult ---

describe('displayResult', () => {
    beforeEach(() => {
        // Reset DOM and state before each test
        elements.resultArea.innerHTML = '';
        elements.resultArea.style.display = 'none';
        elements.resultArea.className = 'tool-result';
        elements.questionArea.style.display = 'block';
        elements.answersArea.style.display = 'block';
        elements.printButton.style.display = 'none';
        elements.backButton.style.display = 'inline-block'; // Assuming it's visible before result
        state.currentStep = 1; // Reset step
        updateProgress();
    });

    test('should display title and description', () => {
        const mockResult = {
            type: 'info',
            title: 'Test Title',
            description: 'Test Description.'
        };
        displayResult(mockResult);
        expect(elements.resultArea.querySelector('h2').textContent).toBe('Test Title');
        expect(elements.resultArea.querySelector('p').textContent).toBe('Test Description.');
        expect(elements.resultArea.style.display).toBe('block');
    });

    test('should apply result type as a class to resultArea', () => {
        const mockResult = {
            type: 'eligible-5-point',
            title: '5-Point Eligible',
            description: 'You may be eligible.'
        };
        displayResult(mockResult);
        expect(elements.resultArea.classList.contains('eligible-5-point')).toBe(true);
        expect(elements.resultArea.classList.contains('tool-result')).toBe(true);
    });

    test('should display required documents if provided', () => {
        const mockResult = {
            type: 'info',
            title: 'Test Docs',
            description: 'Check documents.',
            requiredDocuments: ['Doc1', 'Doc2']
        };
        displayResult(mockResult);
        const documentsDiv = elements.resultArea.querySelector('.result-documents');
        expect(documentsDiv).not.toBeNull();
        expect(documentsDiv.querySelector('h3').textContent).toBe('Required Documents:');
        const docItems = documentsDiv.querySelectorAll('ul li');
        expect(docItems.length).toBe(2);
        expect(docItems[0].textContent).toBe('Doc1');
        expect(docItems[1].textContent).toBe('Doc2');
    });

    test('should display additional info if provided', () => {
        const mockResult = {
            type: 'info',
            title: 'Test Info',
            description: 'Check info.',
            additionalInfo: ['Info1', 'Info2']
        };
        displayResult(mockResult);
        const infoDiv = elements.resultArea.querySelector('.result-details');
        expect(infoDiv).not.toBeNull();
        expect(infoDiv.querySelector('h3').textContent).toBe('Additional Information:');
        const infoItems = infoDiv.querySelectorAll('ul li');
        expect(infoItems.length).toBe(2);
        expect(infoItems[0].textContent).toBe('Info1');
        expect(infoItems[1].textContent).toBe('Info2');
    });

    test('should display OPM links if provided', () => {
        const mockResult = {
            type: 'info',
            title: 'Test Links',
            description: 'Check links.',
            opmLinks: [{ text: 'OPM Link', url: 'http://opm.gov' }]
        };
        displayResult(mockResult);
        const linksDiv = elements.resultArea.querySelector('.result-links');
        expect(linksDiv).not.toBeNull();
        expect(linksDiv.querySelector('h3').textContent).toBe('Official Resources:');
        const linkItem = linksDiv.querySelector('ul li a');
        expect(linkItem.textContent).toBe('OPM Link');
        expect(linkItem.href).toBe('http://opm.gov/');
    });

    test('should hide question/answer areas and show print button', () => {
        const mockResult = { title: 'T', description: 'D' };
        displayResult(mockResult);
        expect(elements.questionArea.style.display).toBe('none');
        expect(elements.answersArea.style.display).toBe('none');
        expect(elements.printButton.style.display).toBe('inline-block');
        expect(elements.backButton.style.display).toBe('none');
    });

    test('should update progress to 100%', () => {
        state.totalSteps = 5; // Example total steps
        state.currentStep = 2; // Example current step
        updateProgress(); // Update to initial state

        const mockResult = { title: 'T', description: 'D' };
        displayResult(mockResult);

        expect(state.currentStep).toBe(state.totalSteps);
        expect(elements.progressBar.style.width).toBe('100%');
        expect(elements.currentStep.textContent).toBe(state.totalSteps.toString());
    });

    test('should handle result object without optional fields gracefully', () => {
        const mockResult = {
            type: 'minimal',
            title: 'Minimal Result',
            description: 'Only essential info.'
        };
        expect(() => displayResult(mockResult)).not.toThrow();
        expect(elements.resultArea.querySelector('h2').textContent).toBe('Minimal Result');
        expect(elements.resultArea.querySelector('p').textContent).toBe('Only essential info.');
        expect(elements.resultArea.querySelector('.result-documents')).toBeNull();
        expect(elements.resultArea.querySelector('.result-details')).toBeNull();
        expect(elements.resultArea.querySelector('.result-links')).toBeNull();
    });

    test('should handle result object with empty optional arrays gracefully', () => {
        const mockResult = {
            type: 'empty_arrays',
            title: 'Empty Arrays Test',
            description: 'Testing with empty arrays for optional fields.',
            requiredDocuments: [],
            additionalInfo: [],
            opmLinks: []
        };
        expect(() => displayResult(mockResult)).not.toThrow();
        expect(elements.resultArea.querySelector('h2').textContent).toBe('Empty Arrays Test');
        expect(elements.resultArea.querySelector('.result-documents')).toBeNull();
        expect(elements.resultArea.querySelector('.result-details')).toBeNull();
        expect(elements.resultArea.querySelector('.result-links')).toBeNull();
    });

    test('should correctly trim class names if result.type is empty or undefined', () => {
        const mockResultNoType = {
            title: 'No Type Test',
            description: 'Result without a type property.'
        };
        displayResult(mockResultNoType);
        expect(elements.resultArea.className).toBe('tool-result');

        const mockResultEmptyType = {
            type: '',
            title: 'Empty Type Test',
            description: 'Result with an empty type string.'
        };
        displayResult(mockResultEmptyType);
        expect(elements.resultArea.className).toBe('tool-result');
    });
});

// --- Mock decision tree data for testing ---
const mockDecisionTree = {
    "START": {
        "id": "START",
        "questionText": "Are you seeking information for yourself or someone else?",
        "answers": [
            { "answerText": "For myself", "nextQuestionId": "VETERAN_STATUS" },
            { "answerText": "For a family member", "resultOutcome": { "title": "Family Info" } }
        ]
    },
    "VETERAN_STATUS": {
        "id": "VETERAN_STATUS",
        "questionText": "What is your current military service status?",
        "answers": [
            { "answerText": "Discharged", "resultOutcome": { "title": "Discharged Info" } }
        ]
    },
    // Minimal structure for countTotalSteps testing
    "COMPLEX_PATH_A": {
        "id": "COMPLEX_PATH_A",
        "questionText": "Path A Question 1",
        "answers": [{ "answerText": "Next", "nextQuestionId": "COMPLEX_PATH_B" }]
    },
    "COMPLEX_PATH_B": {
        "id": "COMPLEX_PATH_B",
        "questionText": "Path B Question 1",
        "answers": [{ "answerText": "End", "resultOutcome": { "title": "End of Path B" } }]
    }
};

// --- Mocks for functions from tool.js needed for initialization tests ---
// Redefine or ensure `elements` and `state` are available and resetable for these tests.
// Elements are already defined globally in this test file.
// State needs to be reset for some init tests.

let vetPreferenceTree = {}; // To be populated by mock fetch

// Mocked init function from tool.js (simplified for testing focus)
// Original init is async due to fetch.
async function initToolLogic() {
    // Reset state for a clean test run of init
    state.currentQuestionId = null;
    state.history = [];
    state.answers = {};
    state.totalSteps = 0;
    state.currentStep = 0;

    elements.acceptButton = document.createElement('button'); // Mock, not in initial DOM
    elements.acceptButton.id = 'accept-disclaimer';

    try {
        const response = await fetch('veterans-preference/decision-tree.json'); // This fetch will be mocked by Jest
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        vetPreferenceTree = await response.json();

        if (elements.acceptButton) {
            // elements.acceptButton.addEventListener('click', startTool); // startTool not being tested here
        }
        state.totalSteps = countTotalSteps(vetPreferenceTree);
        if (elements.totalSteps) {
            elements.totalSteps.textContent = state.totalSteps;
        }
        return true; // Indicate success
    } catch (error) {
        console.error('Error loading decision tree in test init:', error);
        if (elements.questionArea) {
            elements.questionArea.innerHTML = '<p>Error initializing tool for test.</p>';
        }
        if (elements.acceptButton) {
            elements.acceptButton.disabled = true;
        }
        return false; // Indicate failure
    }
}

// Mocked countTotalSteps function from tool.js
function countTotalSteps(tree) {
    if (!tree || Object.keys(tree).length === 0 || !tree['START']) {
        return 1;
    }
    function getMaxDepth(nodeId, currentTree, visitedInPath) {
        if (visitedInPath.has(nodeId)) {
            return 0;
        }
        const node = currentTree[nodeId];
        if (!node || !node.answers) {
            return 1;
        }
        visitedInPath.add(nodeId);
        let maxChildDepth = 0;
        let hasNextQuestion = false;
        node.answers.forEach(answer => {
            if (answer.nextQuestionId) {
                hasNextQuestion = true;
                const depth = getMaxDepth(answer.nextQuestionId, currentTree, new Set(visitedInPath));
                if (depth > maxChildDepth) {
                    maxChildDepth = depth;
                }
            }
        });
        return hasNextQuestion ? (1 + maxChildDepth) : 1;
    }
    return getMaxDepth('START', tree, new Set());
}


// --- Tests for Tool Initialization and Decision Tree Loading ---

describe('Tool Initialization and Decision Tree Loading', () => {
    beforeEach(() => {
        // Mock fetch before each test in this suite
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockDecisionTree),
            })
        );
        // Reset parts of the DOM that init might affect or look for
        elements.questionArea.innerHTML = '';
        if (elements.acceptButton) elements.acceptButton.disabled = false;
        vetPreferenceTree = {}; // Clear loaded tree
    });

    afterEach(() => {
        jest.restoreAllMocks(); // Restore fetch to its original state
    });

    test('should fetch and load decision-tree.json successfully', async () => {
        await initToolLogic();
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(fetch).toHaveBeenCalledWith('veterans-preference/decision-tree.json');
        expect(vetPreferenceTree).toEqual(mockDecisionTree);
    });

    test('should set initial state correctly after loading tree', async () => {
        await initToolLogic();
        // Default initial state (before starting the tool/first question)
        expect(state.currentQuestionId).toBeNull();
        expect(state.history).toEqual([]);
        expect(state.answers).toEqual({});
        // totalSteps is calculated by init
        expect(state.totalSteps).toBeGreaterThan(0);
    });

    test('countTotalSteps should calculate a plausible number of steps', () => {
        // Using the mockDecisionTree
        const steps = countTotalSteps(mockDecisionTree);
        // START -> VETERAN_STATUS = 2 steps in one path
        // START -> (Family Info outcome) = 1 step
        // Expected max depth for mockDecisionTree:
        // START (1) -> VETERAN_STATUS (1) = 2
        expect(steps).toBe(2);

        const moreComplexTree = { ...mockDecisionTree,
            "START": { ...mockDecisionTree.START, answers: [ ...mockDecisionTree.START.answers, { answerText: "Path A", nextQuestionId: "COMPLEX_PATH_A"}] }
        };
        // START (1) -> COMPLEX_PATH_A (1) -> COMPLEX_PATH_B (1) = 3
        expect(countTotalSteps(moreComplexTree)).toBe(3);
    });

    test('initToolLogic should handle fetch error gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
                status: 404, // Simulate a Not Found error
            })
        );
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const success = await initToolLogic();

        expect(success).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(elements.questionArea.innerHTML).toContain('Error initializing tool for test.');
        expect(elements.acceptButton.disabled).toBe(true);

        consoleErrorSpy.mockRestore();
    });

    test('initToolLogic should handle JSON parsing error gracefully', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.reject(new Error("JSON parsing failed")), // Simulate JSON parse error
            })
        );
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        const success = await initToolLogic();

        expect(success).toBe(false);
        expect(fetch).toHaveBeenCalledTimes(1);
        expect(elements.questionArea.innerHTML).toContain('Error initializing tool for test.');
        expect(elements.acceptButton.disabled).toBe(true);

        consoleErrorSpy.mockRestore();
    });
});

// Placeholder for describe block for decision tree loading and initial state (next plan step)
// describe('Tool Initialization and Decision Tree Loading', () => {
// });

// Note: To run these tests, a test runner like Jest is needed,
// and tool.js would need to be loaded or its functions made available to the test scope.
// The current setup directly includes the function being tested for simplicity in this environment.
console.log('Test file veterans-preference/__tests__/tool.test.js created/updated.');
console.log('To run these tests, you would typically use a JavaScript test runner like Jest.');
console.log('Ensure that the functions from tool.js (like displayResult, createResultDetailsElement, updateProgress) and its state/elements are accessible in the test environment.');
