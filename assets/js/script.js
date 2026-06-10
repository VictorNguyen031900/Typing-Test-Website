// Sample words for endless typing test
const wordList = [
    "the", "quick", "brown", "fox", "jumps", "over", "lazy", "dog",
    "programming", "art", "telling", "human", "being", "wants", "computer",
    "practice", "makes", "perfect", "purpose", "intention", "improve",
    "to", "be", "or", "not", "that", "is", "the", "question",
    "whether", "it", "is", "nobler", "in", "the", "mind", "to",
    "suffer", "slings", "arrows", "outrageous", "fortune"
];

const testTextElement = document.getElementById('test-text');
const typingArea = document.getElementById('typing-area');
const wpmElement = document.getElementById('wpm');
const timerElement = document.getElementById('timer');
const finalWpmElement = document.getElementById('final-wpm');
const specialCharsCheckbox = document.getElementById('special-chars');
const capitalizationCheckbox = document.getElementById('capitalization');
const resetBtn = document.getElementById('reset-btn');
const closeModalBtn = document.getElementById('close-modal');
const modal = document.getElementById('results-modal');

let startTime = null;
let countdownTimer = null;
let statsTimer = null;
let currentText = '';
let totalWordsTyped = 0;
let timeRemaining = 60; // 1 minute timer
let isTestActive = false;

function generateRandomWord() {
    const word = wordList[Math.floor(Math.random() * wordList.length)];
    let modifiedWord = word;
    
    if (specialCharsCheckbox.checked && Math.random() < 0.3) {
        const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*'];
        const char = specialChars[Math.floor(Math.random() * specialChars.length)];
        modifiedWord += char;
    }
    
    if (capitalizationCheckbox.checked && Math.random() < 0.1) { // Reduced probability
        modifiedWord = modifiedWord.charAt(0).toUpperCase() + modifiedWord.slice(1);
    }
    
    return modifiedWord;
}

function generateRandomSentence() {
    const sentenceLength = Math.floor(Math.random() * 8) + 3; // 3-10 words
    let sentence = '';
    
    for (let i = 0; i < sentenceLength; i++) {
        if (i > 0) {
            sentence += ' ';
        }
        sentence += generateRandomWord();
    }
    
    // Only add period if special characters is enabled
    return sentence + (specialCharsCheckbox.checked ? '.' : '');
}

function generateEndlessText() {
    const sentences = [];
    for (let i = 0; i < 15; i++) { // Generate more sentences for longer text
        sentences.push(generateRandomSentence());
    }
    return sentences.join(' ');
}

function startTest() {
    //currentText = generateEndlessText();
    //testTextElement.textContent = currentText;
    typingArea.value = '';
    
    startTime = new Date();
    wpmElement.textContent = '0';
    totalWordsTyped = 0;
    timeRemaining = 60;
    timerElement.textContent = '60s';
    
    // Start countdown immediately
    clearInterval(countdownTimer);
    countdownTimer = setInterval(updateCountdown, 1000);
    
    isTestActive = true;
}

function updateCountdown() {
    timeRemaining--;
    timerElement.textContent = `${timeRemaining}s`;
    
    if (timeRemaining <= 0) {
        clearInterval(countdownTimer);
        endTest();
    }
}

function endTest() {
    clearInterval(statsTimer);
    clearInterval(countdownTimer);
    statsTimer = null;
    countdownTimer = null;
    
    // Show final results
    const typedText = typingArea.value;
    const elapsedTime = (new Date() - startTime) / 1000;
    const correctWords = countCorrectWords(typedText);
    const finalWpm = Math.round((correctWords / elapsedTime) * 60);
    
    finalWpmElement.textContent = finalWpm;
    modal.style.display = 'flex';
    
    isTestActive = false;
}

function calculateStats() {
    const typedText = typingArea.value;
    
    if (typedText.trim() === '') {
        wpmElement.textContent = '0';
        return;
    }
    
    const wordsTyped = typedText.split(/\s+/).length;
    totalWordsTyped = wordsTyped;
    const elapsedTime = (new Date() - startTime) / 1000;
    
    // Only count correctly typed words toward WPM
    const correctWords = countCorrectWords(typedText);
    const wpm = Math.round((correctWords / elapsedTime) * 60);
    
    wpmElement.textContent = wpm;
    
    // Highlight incorrect characters
    highlightIncorrectChars(typedText);
}

function highlightIncorrectChars(typedText) {
    const targetText = testTextElement.textContent;
    let htmlOutput = '';
    
    for (let i = 0; i < targetText.length; i++) {
        if (i < typedText.length) {
            if (typedText[i] === targetText[i]) {
                htmlOutput += `<span style="color: #8be9fd;">${targetText[i]}</span>`;
            } else {
                htmlOutput += `<span class="incorrect-char">${targetText[i]}</span>`;
            }
        } else {
            htmlOutput += targetText[i];
        }
    }
    
    testTextElement.innerHTML = htmlOutput;
}

function countCorrectWords(typedText) {
    const targetText = testTextElement.textContent;
    let correctWordCount = 0;
    
    // Split both typed and target text into words
    const typedWords = typedText.split(/\s+/).filter(word => word.length > 0);
    const targetWords = targetText.split(/\s+/).filter(word => word.length > 0);
    
    // Count how many words are completely correct
    for (let i = 0; i < Math.min(typedWords.length, targetWords.length); i++) {
        if (typedWords[i] === targetWords[i]) {
            correctWordCount++;
        }
    }
    
    return correctWordCount;
}

function resetTest() {
    clearInterval(countdownTimer);
    clearInterval(statsTimer);
    countdownTimer = null;
    statsTimer = null;
    startTime = null;
    typingArea.value = '';
    testTextElement.textContent = '';
    wpmElement.textContent = '0';
    timerElement.textContent = '60s';
    timeRemaining = 60;
    totalWordsTyped = 0;
    
    // Regenerate text immediately
    currentText = generateEndlessText();
    testTextElement.textContent = currentText;
    
    isTestActive = false;
}

// Event listeners
typingArea.addEventListener('input', function() {
    if (!startTime && !isTestActive) {
        startTest();
        return; // Only start test, don't regenerate text
    }
    
    // Update stats every 100ms for smoother live calculation
    if (!statsTimer && isTestActive) {
        statsTimer = setInterval(calculateStats, 100);
    }
});

// Add event listeners for checkboxes to trigger reset
specialCharsCheckbox.addEventListener('change', function() {
    resetTest();
});

capitalizationCheckbox.addEventListener('change', function() {
    resetTest();
});

resetBtn.addEventListener('click', resetTest);
closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    resetTest();
});

// Initialize with empty text
currentText = generateEndlessText();
testTextElement.textContent = currentText;