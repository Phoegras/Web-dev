document
    .getElementById('forgotPasswordButton')
    .addEventListener('click', async () => {
        const email = document.getElementById('email').value;
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');

        // Reset error and success messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        // Validate input
        if (!email) {
            errorMessage.innerText = 'Please enter your email address.';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Call API
        try {
            // Show loading spinner
            loadingSpinner.classList.remove('hidden');

            const response = await fetch('/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                successMessage.innerText =
                    result.message || 'Password reset link sent to your email.';
                successMessage.classList.remove('hidden');
            } else {
                errorMessage.innerText =
                    result.message || 'Failed to send password reset link.';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.innerText = 'An error occurred. Please try again.';
            errorMessage.classList.remove('hidden');
        } finally {
            // Hide loading spinner
            loadingSpinner.classList.add('hidden');
        }
    });
