document.addEventListener('DOMContentLoaded', function () {
    // Elements for profile editing
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    const nameInput = document.getElementById('name-input');
    const addressInput = document.getElementById('address-input');
    const phoneInput = document.getElementById('phone-input');
    const dateOfBirthInput = document.getElementById('dateofbirth-input');

    // Elements for password change
    const changePasswordButton = document.getElementById('change-password-btn');
    const changePasswordSection = document.getElementById('change-password-section');
    const savePasswordButton = document.getElementById('save-password-btn');
    const oldPasswordInput = document.getElementById('old-password-input');
    const newPasswordInput = document.getElementById('new-password-input');
    const confirmPasswordInput = document.getElementById('confirm-password-input');

    // Elements for message
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');

    // Auto-resize textarea
    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    // Toggle visibility
    function toggleVisibility(hiddenElement, visibleElement) {
        hiddenElement.classList.add('hidden');
        visibleElement.classList.remove('hidden');
    }

    // Handle profile edit
    addressInput.addEventListener('input', autoResize);

    editButton.addEventListener('click', function (e) {
        e.preventDefault();
        toggleVisibility(viewMode, editMode);
        autoResize.call(addressInput);
    });

    saveButton.addEventListener('click', async function (e) {
        e.preventDefault();

        const name = nameInput.value;
        const address = addressInput.value;
        const phone = phoneInput.value;
        const dateOfBirth = dateOfBirthInput.value;

        try {
            const response = await fetch('/users/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, address, phone, dateOfBirth }),
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            viewMode.innerHTML = `
                <div id="view-mode">
                    <p class="text-lg font-semibold mb-2">${name}</p>
                    <ul class="list-none">
                        <li class="flex">
                            <i class="uil uil-map-marker text-lg me-2"></i>
                            <p class="text-slate-400">${address}</p>
                        </li>
                        <li class="flex mt-1">
                            <i class="uil uil-phone text-lg me-2"></i>
                            <p class="text-slate-400">${phone}</p>
                        </li>
                        <li class="flex mt-1">
                            <i class="uil uil-calendar-alt text-lg me-2"></i>
                            <p class="text-slate-400">${dateOfBirth}</p>
                        </li>
                    </ul>
                </div>
            `;

            toggleVisibility(editMode, viewMode);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again later.');
        }
    });

    // Handle password change
    changePasswordButton.addEventListener('click', function () {
        changePasswordSection.classList.toggle('hidden');
    });

    savePasswordButton.addEventListener('click', async function (e) {
        e.preventDefault();

        const oldPassword = oldPasswordInput.value;
        const newPassword = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (newPassword !== confirmPassword) {
            errorMessage.innerText = 'New password and confirm password do not match.';
            errorMessage.classList.remove('hidden');
            return;
        }

        try {
            const response = await fetch('/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Password changed successfully.');
                oldPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmPasswordInput.value = '';
                changePasswordSection.classList.add('hidden');
                errorMessage.classList.add('hidden');
                return;
            }

            errorMessage.innerText = result.message || 'Failed to change password';
            errorMessage.classList.remove('hidden');

        } catch (error) {
            console.error('Error changing password:', error);
            alert('Failed to change password. Please try again later.');
        }
    });

    // Handle avatar preview
    function previewAvatar(input) {
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e) {
                document.getElementById('avatarPreview').src = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    // Handle avatar form submission
    function submitForm() {
        const form = document.getElementById('avatarForm');
        form.submit();
    }

    // Expose avatar-related functions to global scope if necessary
    window.previewAvatar = previewAvatar;
    window.submitForm = submitForm;
});
