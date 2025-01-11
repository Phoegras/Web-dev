document
    .getElementById('signInForm')
    .addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const errorMessage = document.getElementById('error-message');
        const successMessage = document.getElementById('success-message');
        const loadingSpinner = document.getElementById('loadingSpinner');

        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
        loadingSpinner.classList.remove('hidden');

        try {
            const response = await fetch('/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = result.redirectTo;
            } else {
                errorMessage.innerText =
                    result.message || 'Login failed. Please try again.';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            console.error('Error during sign-in:', error);
            errorMessage.innerText =
                'An error occurred. Please try again later.';
            errorMessage.classList.remove('hidden');
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
