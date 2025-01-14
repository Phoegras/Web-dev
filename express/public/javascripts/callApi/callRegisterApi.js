document
    .getElementById('registerButton')
    .addEventListener('click', async () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const termsAccepted = document.getElementById('AcceptT&C').checked;
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('error-message');

        errorMessage.classList.add('hidden');

        // Validate inputs
        if (!name || !email || !password || !termsAccepted) {
            errorMessage.innerText =
                'Please fill in all fields and accept the Terms and Conditions.';
            errorMessage.classList.remove('hidden');
            return;
        }

        // Call API
        try {
            // loading spin animation
            loadingSpinner.classList.remove('hidden');

            const response = await fetch('/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                window.location.href = `/auth/register-success?email=${email}`;
            } else {
                errorMessage.innerText =
                    result.message || 'Failed.';
                errorMessage.classList.remove('hidden');
            }
        } catch (error) {
            errorMessage.innerText = 'An error occurred. Please try again.';
            errorMessage.classList.remove('hidden');
        } finally {
            loadingSpinner.classList.add('hidden');
        }
    });
