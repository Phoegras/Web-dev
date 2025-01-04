document
    .getElementById('resetPasswordButton')
    .addEventListener('click', async () => {
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword =
            document.getElementById('confirmPassword').value;
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        const token = urlParams.get('token');

        // Reset error and success messages
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');

        if (!newPassword) {
            errorMessage.innerText = 'Please enter your password!';
            errorMessage.classList.remove('hidden');
            return;
        }

        if (newPassword !== confirmPassword) {
            errorMessage.innerText = 'Passwords do not match!';
            errorMessage.classList.remove('hidden');
            return;
        }

        try {
            // Show loading spinner
            loadingSpinner.classList.remove('hidden');

            const response = await fetch('/auth/re-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    token: token,
                    password: newPassword,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                successMessage.innerText =
                    result.message ||
                    'Your password has been changed successfully.';
                successMessage.classList.remove('hidden');
            } else {
                errorMessage.innerText =
                    result.message || 'Failed to reset your password.';
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
