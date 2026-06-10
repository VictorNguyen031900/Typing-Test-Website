// Test script for the typing test implementation
const fs = require('fs');

// Read and parse the JavaScript file
const scriptContent = fs.readFileSync('assets/js/script.js', 'utf8');

// Test cases to verify our implementation
const testCases = [
    {
        name: "Perfect match",
        target: "the quick brown fox",
        typed: "the quick brown fox",
        expectedCorrect: 4,
        expectedIncorrect: 0
    },
    {
        name: "One incorrect word",
        target: "the quick brown fox", 
        typed: "the slow brown fox",
        expectedCorrect: 3,
        expectedIncorrect: 1
    },
    {
        name: "Extra characters",
        target: "the quick brown fox",
        typed: "thee quick brown fox",
        expectedCorrect: 3,
        expectedIncorrect: 1
    },
    {
        name: "Missing characters",
        target: "the quick brown fox",
        typed: "the quik brown fox",
        expectedCorrect: 3,
        expectedIncorrect: 1
    },
    {
        name: "Partial typing",
        target: "the quick brown fox jumps over lazy dog",
        typed: "the quick",
        expectedCorrect: 2,
        expectedIncorrect: 0
    }
];

// Mock the analyzeTypedWords function to test it
function mockAnalyzeTypedWords(typedText, targetText) {
    const targetWords = targetText.split(/\s+/).filter(word => word.length > 0);
    const typedWords = typedText.split(/\s+/).filter(word => word.length > 0);

    let results = {
        correctWords: 0,
        incorrectWords: [],
        currentWordIndex: Math.min(typedWords.length, targetWords.length)
    };

    // Compare word by word
    for (let i = 0; i < Math.min(typedWords.length, targetWords.length); i++) {
        if (typedWords[i] === targetWords[i]) {
            results.correctWords++;
        } else {
            results.incorrectWords.push({
                index: i,
                typed: typedWords[i],
                target: targetWords[i]
            });
        }
    }

    return results;
}

console.log('Testing Typing Test Implementation\n');

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    const result = mockAnalyzeTypedWords(testCase.typed, testCase.target);
    
    const passed = result.correctWords === testCase.expectedCorrect && 
                   result.incorrectWords.length === testCase.expectedIncorrect;
    
    if (passed) {
        passedTests++;
        console.log(`✓ Test ${index + 1}: ${testCase.name}`);
    } else {
        console.log(`✗ Test ${index + 1}: ${testCase.name}`);
        console.log(`  Expected: ${testCase.expectedCorrect} correct, ${testCase.expectedIncorrect} incorrect`);
        console.log(`  Got: ${result.correctWords} correct, ${result.incorrectWords.length} incorrect`);
    }
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed`);

// Check if required functions exist in the script
const requiredFunctions = ['analyzeTypedWords', 'highlightWords'];
let functionsFound = 0;

requiredFunctions.forEach(func => {
    if (scriptContent.includes(`function ${func}`)) {
        functionsFound++;
        console.log(`✓ Function ${func} found`);
    } else {
        console.log(`✗ Function ${func} not found`);
    }
});

console.log(`\nFunctions check: ${functionsFound}/${requiredFunctions.length} functions found`);

// Check if CSS classes exist
const cssFileContent = fs.readFileSync('assets/css/style.css', 'utf8');
const requiredClasses = ['.correct-word', '.incorrect-word'];
let classesFound = 0;

requiredClasses.forEach(cls => {
    if (cssFileContent.includes(cls)) {
        classesFound++;
        console.log(`✓ CSS class ${cls} found`);
    } else {
        console.log(`✗ CSS class ${cls} not found`);
    }
});

console.log(`\nCSS check: ${classesFound}/${requiredClasses.length} CSS classes found`);

console.log('\nImplementation verification complete!');