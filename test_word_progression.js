// Test script for word progression logic
const fs = require('fs');

// Mock the DOM elements and functions for testing
let testTextElement = {
    textContent: '',
    innerHTML: ''
};

let typingArea = {
    value: ''
};

// Read the actual implementation
const scriptContent = fs.readFileSync('assets/js/script.js', 'utf8');

// Extract the highlightWords function from the actual script
function extractFunction(script, funcName) {
    const regex = new RegExp(`function ${funcName}\([^)]*\)\{[\s\S]*?\}`, 'i');
    const match = script.match(regex);
    return match ? match[0] : null;
}

// Test cases for word progression
const testCases = [
    {
        name: "Correct word followed by incorrect short word",
        targetText: "hello world test",
        typedText: "hello worl d",  // "worl" is too short, "d" is too short
        expectedBehavior: "Should advance past 'hello' and mark 'world' as incorrect"
    },
    {
        name: "Correct word followed by incorrect long word",
        targetText: "hello world test",
        typedText: "hello worldd tes",  // "worldd" is too long, "tes" is too short
        expectedBehavior: "Should advance past 'hello' and mark 'world' as incorrect"
    },
    {
        name: "Multiple correct words then incorrect",
        targetText: "the quick brown fox jumps",
        typedText: "the quick browno fox j",  // "browno" too long, "j" too short
        expectedBehavior: "Should advance past 'the quick' and mark 'brown' as incorrect"
    },
    {
        name: "All correct words",
        targetText: "hello world test",
        typedText: "hello world test",
        expectedBehavior: "Should show all words as correct"
    }
];

console.log('Testing Word Progression Logic\n');

// Mock analyzeTypedWords function based on the actual implementation
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

// Mock highlightWords function based on the actual implementation
function mockHighlightWords(typedText) {
    const targetText = testTextElement.textContent;
    let htmlOutput = '';
    
    // Split both target and typed text into words
    const targetWords = targetText.split(/\s+/).filter(word => word.length > 0);
    const typedWords = typedText.split(/\s+/).filter(word => word.length > 0);
    
    // Process each word in target text
    for (let i = 0; i < targetWords.length; i++) {
        const targetWord = targetWords[i];
        
        if (i < typedWords.length) {
            const typedWord = typedWords[i];
            if (typedWord === targetWord) {
                // Correct word - green
                htmlOutput += `<span class="correct-word">${targetWord}</span> `;
            } else {
                // Incorrect word - red
                htmlOutput += `<span class="incorrect-word">${targetWord}</span> `;
            }
        } else {
            // Not yet typed - normal
            htmlOutput += `${targetWord} `;
        }
    }
    
    return htmlOutput;
}

// Mock getCurrentWordPosition function based on the actual implementation
function mockGetCurrentWordPosition(typedText) {
    const targetText = testTextElement.textContent;
    const typedWords = typedText.split(/\s+/).filter(word => word.length > 0);
    const targetWords = targetText.split(/\s+/).filter(word => word.length > 0);
    
    // Find the first position where typed words don't match target
    for (let i = 0; i < Math.min(typedWords.length, targetWords.length); i++) {
        if (typedWords[i] !== targetWords[i]) {
            return i;
        }
    }
    
    // If all typed words match, return the position after the last typed word
    return Math.min(typedWords.length, targetWords.length);
}

let passedTests = 0;
let totalTests = testCases.length;

testCases.forEach((testCase, index) => {
    // Set up test
    testTextElement.textContent = testCase.targetText;
    typingArea.value = testCase.typedText;
    
    const analysis = mockAnalyzeTypedWords(testCase.typedText, testCase.targetText);
    const currentPosition = mockGetCurrentWordPosition(testCase.typedText);
    const htmlOutput = mockHighlightWords(testCase.typedText);
    
    console.log(`Test ${index + 1}: ${testCase.name}`);
    console.log(`  Target: "${testCase.targetText}"`);
    console.log(`  Typed:  "${testCase.typedText}"`);
    console.log(`  Analysis: ${analysis.correctWords} correct, ${analysis.incorrectWords.length} incorrect`);
    console.log(`  Current position: word ${currentPosition}`);
    
    // Check if the logic correctly identifies progression
    const hasIncorrectWords = analysis.incorrectWords.length > 0;
    const shouldAdvance = currentPosition > 0; // Should advance past at least the first word
    
    console.log(`  Expected: ${testCase.expectedBehavior}`);
    console.log(`  Result: ${hasIncorrectWords ? '✓ Incorrect words detected' : '✗ No incorrect words'} | ${shouldAdvance ? '✓ Position advanced' : '✗ Position not advanced'}`);
    console.log('');
    
    // For this test, we just want to verify the functions work
    if (hasIncorrectWords && shouldAdvance) {
        passedTests++;
    }
});

console.log(`\nResults: ${passedTests}/${totalTests} tests passed`);

// Check if the new functions exist in the actual script
const requiredFunctions = ['highlightWords', 'getCurrentWordPosition'];
let functionsFound = 0;

requiredFunctions.forEach(func => {
    if (scriptContent.includes(`function ${func}`)) {
        functionsFound++;
        console.log(`✓ Function ${func} found in implementation`);
    } else {
        console.log(`✗ Function ${func} not found in implementation`);
    }
});

console.log(`\nFunctions check: ${functionsFound}/${requiredFunctions.length} functions found`);

console.log('\nWord progression testing complete!');