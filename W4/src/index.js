
        // Function to validate number inputs
        function validateNumber(inputId) {
            const inputField = document.getElementById(inputId);
            const value = inputField.value;
            const notification = document.getElementById('notification');

            if (isNaN(value) || value === '') {
                notification.innerHTML = `Please enter a valid number for ${inputId === 'first-num' ? 'First' : 'Second'} Number`;
                inputField.classList.add('border-red-500');
                return false;
            } else {
                notification.innerHTML = ''; // Clear any previous error messages
                inputField.classList.remove('border-red-500');
                return true;
            }
        }

        // Calculate function
        function calculate(event) {
            event.preventDefault(); // Prevent form submission and page reload

            const firstNumber = parseFloat(document.getElementById('first-num').value);
            const secondNumber = parseFloat(document.getElementById('second-num').value);
            const result = document.getElementById('result');
            const notification = document.getElementById('notification');
            const operation = document.querySelector('input[name="opr"]:checked');

            // Validate both numbers
            const firstIsValid = validateNumber('first-num');
            const secondIsValid = validateNumber('second-num');

            if (!firstIsValid || !secondIsValid) {
                result.innerHTML = '';
                notification.innerHTML = `Please enter a valid number for ${!firstIsValid === true ? 'First' : 'Second'} Number`;
                return;
            }

            // Check if an operation is selected
            if (!operation) {
                notification.innerHTML = "Please select an operation!";
                result.innerHTML = '';
                return;
            }

            // Perform the selected operation
            let calculatedResult;
            switch (operation.value) {
                case 'add':
                    calculatedResult = firstNumber + secondNumber;
                    break;
                case 'subtract':
                    calculatedResult = firstNumber - secondNumber;
                    break;
                case 'multiply':
                    calculatedResult = firstNumber * secondNumber;
                    break;
                case 'divide':
                    if (secondNumber === 0) {
                        notification.innerHTML = "Division by zero is not allowed!";
                        result.innerHTML = '';
                        return;
                    }
                    calculatedResult = firstNumber / secondNumber;
                    break;
            }

            // Display the result and clear notifications
            result.innerHTML = calculatedResult;
            notification.innerHTML = "Calculation successful!";
        }