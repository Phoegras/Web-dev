document
    .getElementById('registerForm')
    .addEventListener('submit', async (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmedPassword = document.getElementById('confirmed-password').value;
        const loadingSpinner = document.getElementById('loadingSpinner');
        const errorMessage = document.getElementById('error-message');

        errorMessage.classList.add('hidden');

        // Validate inputs
        if (!name || !email || !password) {
            errorMessage.innerText = 'Please fill in all fields!';
            errorMessage.classList.remove('hidden');
            return;
        }

        if (password != confirmedPassword) {
            errorMessage.innerText = 'Confirmed password does not match!';
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
                alert('Create new account successfully!');
                document.getElementById('registerForm').reset();
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
