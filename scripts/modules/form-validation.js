/**
 * Form validation module
 * Handles form validation and submission
 */

export function initForms() {
    // Get all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // Add validation on submit
        form.addEventListener('submit', handleFormSubmit);
        
        // Add validation on input
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
        });
    });
    
    /**
     * Handle form submission
     * @param {Event} e - The submit event
     */
    function handleFormSubmit(e) {
        const form = e.target;
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        // Validate all inputs
        inputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        // If form is not valid, prevent submission
        if (!isValid) {
            e.preventDefault();
            return;
        }
        
        // If it's the contact form, handle it specially
        if (form.id === 'contactForm') {
            e.preventDefault();
            handleContactFormSubmit(form);
        }
    }
    
    /**
     * Validate a single input
     * @param {HTMLElement} input - The input element to validate
     * @returns {boolean} - Whether the input is valid
     */
    function validateInput(input) {
        // Skip inputs that are not required and empty
        if (!input.hasAttribute('required') && !input.value.trim()) {
            removeError(input);
            return true;
        }
        
        // Check for empty required fields
        if (input.hasAttribute('required') && !input.value.trim()) {
            showError(input, 'Ce champ est requis');
            return false;
        }
        
        // Validate email format
        if (input.type === 'email' && input.value.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(input.value.trim())) {
                showError(input, 'Veuillez entrer une adresse email valide');
                return false;
            }
        }
        
        // All validations passed
        removeError(input);
        return true;
    }
    
    /**
     * Show error message for an input
     * @param {HTMLElement} input - The input element
     * @param {string} message - The error message
     */
    function showError(input, message) {
        // Remove any existing error
        removeError(input);
        
        // Add error class to input
        input.classList.add('is-invalid');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'form-error';
        errorElement.textContent = message;
        
        // Insert error message after input
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }
    
    /**
     * Remove error message from an input
     * @param {HTMLElement} input - The input element
     */
    function removeError(input) {
        // Remove error class
        input.classList.remove('is-invalid');
        
        // Remove error message if it exists
        const errorElement = input.nextElementSibling;
        if (errorElement && errorElement.classList.contains('form-error')) {
            errorElement.remove();
        }
    }
    
    /**
     * Handle contact form submission
     * @param {HTMLFormElement} form - The contact form
     */
    function handleContactFormSubmit(form) {
        // Get form data
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());
        
        // Disable form elements during submission
        const submitButton = form.querySelector('button[type="submit"]');
        const formElements = form.querySelectorAll('input, textarea, select, button');
        
        formElements.forEach(element => {
            element.disabled = true;
        });
        
        if (submitButton) {
            submitButton.textContent = 'Envoi en cours...';
        }
        
        // Simulate form submission (replace with actual API call in production)
        setTimeout(() => {
            // Show success message
            const formContainer = form.parentElement;
            
            if (formContainer) {
                // Create success message
                const successMessage = document.createElement('div');
                successMessage.className = 'form-success-message';
                successMessage.innerHTML = `
                    <h3>Merci pour votre message !</h3>
                    <p>Nous vous répondrons dans les plus brefs délais.</p>
                `;
                
                // Replace form with success message
                formContainer.innerHTML = '';
                formContainer.appendChild(successMessage);
            }
        }, 1500);
    }
} 