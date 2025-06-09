document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const passwordDisplay = document.getElementById('passwordDisplay');
    const charLengthSlider = document.getElementById('charLengthSlider');
    const charLengthNumber = document.getElementById('charLengthNumber');
    const copyBtn = document.getElementById('copyBtn');
    const copyFeedback = document.querySelector('.copy-feedback');
    const generateBtn = document.getElementById('generateBtn');
    
    const includeUppercaseEl = document.getElementById('includeUppercase');
    const includeLowercaseEl = document.getElementById('includeLowercase');
    const includeNumbersEl = document.getElementById('includeNumbers');
    const includeSymbolsEl = document.getElementById('includeSymbols');
    
    const strengthText = document.getElementById('strengthText');
    const strengthBars = document.querySelectorAll('.strength-bars .bar');
    
    const options = [includeUppercaseEl, includeLowercaseEl, includeNumbersEl, includeSymbolsEl];

    // Character Sets
    const charSets = {
        uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        lowercase: 'abcdefghijklmnopqrstuvwxyz',
        numbers: '0123456789',
        symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-='
    };

    // --- FUNCTIONS ---

    // Update slider background fill
    const updateSliderBackground = () => {
        const value = (charLengthSlider.value - charLengthSlider.min) / (charLengthSlider.max - charLengthSlider.min) * 100;
        charLengthSlider.style.background = `linear-gradient(to right, var(--clr-accent) ${value}%, var(--clr-surface-dark) ${value}%)`;
    };
    
    // Update character length display
    const updateCharLengthDisplay = () => {
        charLengthNumber.textContent = charLengthSlider.value;
        updateSliderBackground();
    };

    // Calculate password strength
    const calculateStrength = () => {
        let strength = 0;
        if (charLengthSlider.value >= 8) strength++;
        if (charLengthSlider.value >= 12) strength++;
        
        let checkedCount = 0;
        options.forEach(option => {
            if (option.checked) checkedCount++;
        });

        strength += checkedCount;
        
        // Update UI based on strength score
        strengthText.textContent = '';
        strengthBars.forEach(bar => bar.className = 'bar');
        
        if (checkedCount === 0) {
            strengthText.textContent = '';
            return;
        }

        if (strength <= 2) {
            strengthText.textContent = 'WEAK';
            for (let i = 0; i < 2; i++) strengthBars[i].classList.add('weak');
        } else if (strength === 3) {
            strengthText.textContent = 'MEDIUM';
            for (let i = 0; i < 3; i++) strengthBars[i].classList.add('medium');
        } else if (strength === 4) {
            strengthText.textContent = 'STRONG';
            for (let i = 0; i < 4; i++) strengthBars[i].classList.add('strong');
        } else {
            strengthText.textContent = 'VERY STRONG';
            strengthBars.forEach(bar => bar.classList.add('very-strong'));
        }
    };
    
    // Generate Password
    const generatePassword = () => {
        const length = charLengthSlider.value;
        let characterPool = '';
        let password = [];
        
        const selectedOptions = [
            { el: includeUppercaseEl, set: charSets.uppercase },
            { el: includeLowercaseEl, set: charSets.lowercase },
            { el: includeNumbersEl, set: charSets.numbers },
            { el: includeSymbolsEl, set: charSets.symbols }
        ].filter(opt => opt.el.checked);
        
        if (selectedOptions.length === 0) {
            passwordDisplay.value = '';
            calculateStrength();
            return;
        }

        // Build character pool and ensure at least one char from each selected set
        selectedOptions.forEach(option => {
            characterPool += option.set;
            password.push(option.set[Math.floor(Math.random() * option.set.length)]);
        });
        
        // Fill the rest of the password
        for (let i = password.length; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characterPool.length);
            password.push(characterPool[randomIndex]);
        }
        
        // Shuffle the password array to avoid predictable patterns
        for (let i = password.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [password[i], password[j]] = [password[j], password[i]]; // Swap
        }
        
        passwordDisplay.value = password.join('');
        calculateStrength();
    };

    // Copy to Clipboard
    const copyToClipboard = async () => {
        if (!passwordDisplay.value) return;
        
        try {
            await navigator.clipboard.writeText(passwordDisplay.value);
            copyFeedback.classList.add('visible');
            setTimeout(() => {
                copyFeedback.classList.remove('visible');
            }, 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy password.');
        }
    };

    // --- EVENT LISTENERS ---
    charLengthSlider.addEventListener('input', updateCharLengthDisplay);
    
    options.forEach(option => {
        option.addEventListener('change', calculateStrength);
    });

    generateBtn.addEventListener('click', generatePassword);
    copyBtn.addEventListener('click', copyToClipboard);

    // --- INITIALIZATION ---
    updateCharLengthDisplay();
    generatePassword();
});