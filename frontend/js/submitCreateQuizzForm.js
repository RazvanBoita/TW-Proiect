document.getElementById('submit-button').addEventListener('click', function(){
    const form = document.getElementById('create-quiz-form');
    if (form.checkValidity()) {
        form.submit();
    } else {
        // Check first invalid field
        const firstInvalidField = form.querySelector(':invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        // Alert user
        alert('Please fill out all required fields.');
    }
})