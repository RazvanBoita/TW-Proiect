document.getElementById('update-button').addEventListener('click', async function(event){
    event.preventDefault(); 

    const form = document.getElementById('update-quiz-form');
    if (!form.checkValidity()) {
        // Check first invalid field
        const firstInvalidField = form.querySelector(':invalid');
        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        // Alert user
        alert('Please fill out all required fields.');
        return;
    }

    const url = new URL(window.location.href);

    const id = url.searchParams.get('id');
    const formData = new FormData(form);
    const data = {};

    data['id'] = id;
    formData.forEach((value, key) => {
        if (data[key]) {
            if (!Array.isArray(data[key])) {
                data[key] = [data[key]];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    });

    // Form is valid, send an put request with the form data in the body
    try{
        const response = await fetch(`/api/quiz?id=${id}`,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const status = await response.json();
        alert(status.message);
    }
    catch(error)
    {
        console.log('Error at updating the response: ', error);
    }

})