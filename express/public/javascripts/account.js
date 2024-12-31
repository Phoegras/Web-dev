document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('edit-button');
    const saveButton = document.getElementById('save-button');
    const viewMode = document.getElementById('view-mode');
    const editMode = document.getElementById('edit-mode');
    const nameInput = document.getElementById('name-input');
    const addressInput = document.getElementById('address-input');
    const phoneInput = document.getElementById('phone-input');
    const dateOfBirthInput = document.getElementById('dateofbirth-input');

    function autoResize() {
        this.style.height = 'auto';
        this.style.height = this.scrollHeight + 'px';
    }

    addressInput.addEventListener('input', autoResize);

    editButton.addEventListener('click', function (e) {
        e.preventDefault();

        viewMode.classList.add('hidden');
        editMode.classList.remove('hidden');

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

            editMode.classList.add('hidden');
            viewMode.classList.remove('hidden');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile. Please try again later ok?.');
        }
    });
});
