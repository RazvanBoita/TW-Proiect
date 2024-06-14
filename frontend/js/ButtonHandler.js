class ButtonHandler {
    static signupSubmit(event) {
        event.preventDefault();

        const form = document.getElementById('signup-form');
        const passwordField = document.getElementById('password');
        const confirmPasswordField = document.getElementById('confirm-password');
        const passwordGroup = document.getElementById('password-field');
        const confirmGroup = document.getElementById('confirm-password-field');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data['confirm-password']) {
            passwordGroup.classList.add('input-error');
            passwordField.classList.add('input-error');
            confirmPasswordField.classList.add('input-error');
            confirmGroup.classList.add('input-error');
            confirmPasswordField.focus();
            return;
        } else {
            passwordGroup.classList.remove('input-error');
            passwordField.classList.remove('input-error');
            confirmPasswordField.classList.remove('input-error');
            confirmGroup.classList.remove('input-error');
            const errorMessage = document.getElementById('error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        }

        delete data['confirm-password'];

        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/verifyEmail';
            } else {
                // Handle other status codes if needed
                console.error('Error:', response.status);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    static loginSubmit(event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const data = {
            email: email,
            password: password
        };
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            const errorMessage = document.getElementById('error-message');
            
            const showError = (message) => {
                errorMessage.style.display = 'none';
                errorMessage.textContent = message;
                setTimeout(() => {
                    errorMessage.style.display = 'block';
                }, 50);
            };

            if (data.resCode === 1) {
                window.location.href = '/';
            } else if (data.resCode === 2) {
                showError('🚩 User does not exist. Please sign up.');
            } else if (data.resCode === 3) {
                showError('🚩 Invalid credentials. Please try again.');
            } else {
                showError('🚩 An unknown error occurred. Please try again.');
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            const errorMessage = document.getElementById('error-message');
            errorMessage.style.display = 'none'; 
            errorMessage.textContent = 'An error occurred while processing your request. Please try again.';
            setTimeout(() => {
                errorMessage.style.display = 'block';
            }, 50);
        });
    }

    static recoverPass(event){
        event.preventDefault()
        const email = document.getElementById('email').value;
        fetch('/recover', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        })
        .then(response => response.json())
        .then(data => {
            let resCode = data.resCode
            console.log(resCode);
        })
        .catch(error => {
            console.error('Error recovering password:', error.message);
        });
    }

    static resetPass(event) {
        event.preventDefault();

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match. Please enter matching passwords.');
            return;
        }

        const body = JSON.stringify({ password });

        fetch('/recover/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to reset password');
            }
            return response.json();
        })
        .then(data => {
            const result = data.result
            if(result == 1){
                console.log("Updated pass successfully!");
            }
            else{
                console.log("Error occured");
            }
        })
        .catch(error => {
            console.error('Error resetting password:', error);
        });
    }
}

export default ButtonHandler;
