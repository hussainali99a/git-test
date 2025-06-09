document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('text-input');
    const totalCharactersSpan = document.getElementById('total-characters');
    const wordCountSpan = document.getElementById('word-count');
    const sentenceCountSpan = document.getElementById('sentence-count');
    const excludeSpacesCheckbox = document.getElementById('exclude-spaces');
    const setCharacterLimitCheckbox = document.getElementById('set-character-limit');
    const characterLimitInput = document.getElementById('character-limit-input');
    const limitWarning = document.getElementById('limit-warning');
    const approxReadingTimeSpan = document.getElementById('approx-reading-time');
    const letterDensityCharts = document.getElementById('letter-density-charts');
    const showMoreLettersButton = document.getElementById('show-more-letters');
    const themeToggleButton = document.getElementById('theme-toggle');

    let characterLimit = 0;
    const commonReadingSpeedWPM = 200; // Words Per Minute

    // Function to analyze text
    function analyzeText() {
        const text = textInput.value;
        let charCount = text.length;

        if (excludeSpacesCheckbox.checked) {
            charCount = text.replace(/\s/g, '').length;
        }
        totalCharactersSpan.textContent = charCount;

        const words = text.match(/\b\w+\b/g) || [];
        wordCountSpan.textContent = words.length;

        // A more robust way to count sentences (handle abbreviations, etc.)
        const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
        sentenceCountSpan.textContent = sentences.length;

        // Reading Time
        const minutes = Math.ceil(words.length / commonReadingSpeedWPM);
        approxReadingTimeSpan.textContent = `${minutes} minute${minutes === 1 ? '' : 's'}`;

        // Character Limit Warning
        if (setCharacterLimitCheckbox.checked && characterLimit > 0) {
            if (charCount > characterLimit) {
                limitWarning.textContent = `Warning: Your text exceeds the character limit by ${charCount - characterLimit} characters.`;
                limitWarning.style.display = 'block';
            } else {
                limitWarning.style.display = 'none';
            }
        } else {
            limitWarning.style.display = 'none';
        }

        updateLetterDensity(text);
    }

    // Function to update letter density charts
    function updateLetterDensity(text) {
        const letterCounts = {};
        const cleanedText = text.toLowerCase().replace(/[^a-z]/g, ''); // Only English letters
        const totalLetters = cleanedText.length;

        for (const char of cleanedText) {
            letterCounts[char] = (letterCounts[char] || 0) + 1;
        }

        const sortedLetters = Object.entries(letterCounts).sort((a, b) => b[1] - a[1]);

        letterDensityCharts.innerHTML = ''; // Clear previous charts
        const displayLimit = showMoreLettersButton.dataset.expanded === 'true' ? sortedLetters.length : 5; // Show top 5 initially

        sortedLetters.slice(0, displayLimit).forEach(([letter, count]) => {
            const percentage = totalLetters > 0 ? ((count / totalLetters) * 100).toFixed(2) : 0;
            const barWidth = percentage; // Use percentage directly for width in CSS

            const item = document.createElement('div');
            item.classList.add('letter-density-item');
            item.innerHTML = `
                <span>${letter.toUpperCase()}</span>
                <div class="letter-density-bar" style="width: ${barWidth}%"></div>
                <span>${percentage}%</span>
            `;
            letterDensityCharts.appendChild(item);
        });

        showMoreLettersButton.style.display = sortedLetters.length > 5 ? 'block' : 'none';
    }

    // Event Listeners
    textInput.addEventListener('input', analyzeText);
    excludeSpacesCheckbox.addEventListener('change', analyzeText);

    setCharacterLimitCheckbox.addEventListener('change', () => {
        characterLimitInput.disabled = !setCharacterLimitCheckbox.checked;
        if (!setCharacterLimitCheckbox.checked) {
            characterLimitInput.value = '';
            characterLimit = 0;
        }
        analyzeText();
    });

    characterLimitInput.addEventListener('input', () => {
        characterLimit = parseInt(characterLimitInput.value) || 0;
        analyzeText();
    });

    showMoreLettersButton.addEventListener('click', () => {
        if (showMoreLettersButton.dataset.expanded === 'true') {
            showMoreLettersButton.dataset.expanded = 'false';
            showMoreLettersButton.textContent = 'See more';
        } else {
            showMoreLettersButton.dataset.expanded = 'true';
            showMoreLettersButton.textContent = 'See less';
        }
        analyzeText(); // Re-run analysis to re-render letter density
    });

    // Theme Switching
    themeToggleButton.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        // Optional: Store theme preference in localStorage
        if (document.body.classList.contains('light-theme')) {
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.setItem('theme', 'dark');
        }
    });

    // Load theme preference from localStorage on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    } else {
        document.body.classList.remove('light-theme'); // Ensure dark theme is default if no preference
    }

    // Initial analysis on page load
    analyzeText();
});