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
}

export default ButtonHandler;
