document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const emailInput = document.getElementById('email');
    const queryTypeInputs = document.querySelectorAll('input[name="queryType"]');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');

    // Error message spans
    const firstNameError = document.getElementById('firstNameError');
    const lastNameError = document.getElementById('lastNameError');
    const emailError = document.getElementById('emailError');
    const queryTypeError = document.getElementById('queryTypeError');
    const messageError = document.getElementById('messageError');
    const consentError = document.getElementById('consentError');
    const formMessages = document.getElementById('form-messages');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        let isValid = validateForm();

        // Clear previous success/error messages
        formMessages.textContent = '';
        formMessages.className = 'form-messages'; // Reset classes

        if (isValid) {
            // Form is valid - show success message
            formMessages.textContent = 'Message Sent! Thanks for contacting us.';
            formMessages.classList.add('success');

            // In a real application, you would submit the form data here, e.g., using fetch()
            console.log('Form submitted successfully!');
            form.reset(); // Optional: Clear the form fields

            // Optional: Clear success message after a few seconds
            // setTimeout(() => {
            //    formMessages.textContent = '';
            //    formMessages.className = 'form-messages';
            // }, 5000);

        } else {
            // Form is invalid - indicate general error (optional, as individual errors are shown)
            // formMessages.textContent = 'Please fix the errors below.';
            // formMessages.classList.add('error');
            console.log('Form validation failed.');
        }
    });

    function validateForm() {
        let valid = true;

        // Clear previous errors
        clearErrors();

        // --- Validation Checks ---

        // First Name
        if (firstNameInput.value.trim() === '') {
            showError(firstNameInput, firstNameError, 'This field is required');
            valid = false;
        }

        // Last Name
        if (lastNameInput.value.trim() === '') {
            showError(lastNameInput, lastNameError, 'This field is required');
            valid = false;
        }

        // Email Address
        if (emailInput.value.trim() === '') {
            showError(emailInput, emailError, 'This field is required');
            valid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            valid = false;
        }

        // Query Type
        let queryTypeSelected = false;
        queryTypeInputs.forEach(input => {
            if (input.checked) {
                queryTypeSelected = true;
            }
        });
        if (!queryTypeSelected) {
            // Don't add input-error class to radio buttons themselves, just show message
             showError(null, queryTypeError, 'Please select a query type');
            valid = false;
        }

        // Message
        if (messageInput.value.trim() === '') {
            showError(messageInput, messageError, 'This field is required');
            valid = false;
        }

        // Consent Checkbox
        if (!consentInput.checked) {
             // Don't add input-error class to checkbox, just show message
             showError(null, consentError, 'You must consent to being contacted');
            valid = false;
        }

        return valid;
    }

    function showError(inputElement, errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block'; // Show the error message
        }
         if (inputElement) {
             inputElement.classList.add('input-error'); // Add error class to the input
         }
    }

    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(msg => {
            msg.textContent = '';
            msg.style.display = 'none'; // Hide the error message
        });

        const errorInputs = document.querySelectorAll('.input-error');
        errorInputs.forEach(input => {
            input.classList.remove('input-error'); // Remove error class
        });

        // Clear general form messages too
        formMessages.textContent = '';
        formMessages.className = 'form-messages';
    }

    // Basic email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // --- Optional: Real-time validation feedback (on blur) ---
    // You could add event listeners to inputs for the 'blur' event
    // to provide feedback as the user moves out of a field.
    // Example for first name:
    /*
    firstNameInput.addEventListener('blur', () => {
        if (firstNameInput.value.trim() === '') {
            showError(firstNameInput, firstNameError, 'This field is required');
        } else {
            clearErrorForInput(firstNameInput, firstNameError); // Need a function to clear single error
        }
    });
    // Add similar listeners for other fields as needed.
    // Remember to create a clearErrorForInput function.
    */
    function clearErrorForInput(inputElement, errorElement) {
         if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
         }
        if (inputElement) {
            inputElement.classList.remove('input-error');
        }
    }


});