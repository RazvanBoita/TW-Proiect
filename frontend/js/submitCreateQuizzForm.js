document.getElementById('submit-button').addEventListener('click', function(){
    const form = document.getElementById('create-quiz-form');
    if (form.checkValidity()) {
        checkContinuity()
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

function checkContinuity(){
    fetch('/after-create-quiz', {
        method: "GET"
    })
    .then(res => res.json())
    .then(data => {
        if(data.resCode == "user"){
            window.location.href = '/going-home'
        }
    })
}