document.addEventListener('DOMContentLoaded', function() {
    let isCorrect = false; // Flag to track if the status is already marked as correct
    let statusCodeReceived = false; // Flag to track if statusCode has been received

    // Function to handle 'Submit & next' button click
    const submitButton = document.querySelector('.button-submit');
    submitButton.disabled = true; // Disable the button initially
    submitButton.classList.add('disabled'); // Add the disabled class
    submitButton.addEventListener('click', function() {
        console.log('User is trying to submit');
    });

    // Function to handle 'Run' button click and log CodeMirror content
    const runButton = document.querySelector('.run-button');
    runButton.addEventListener('click', function() {
        const sqlEditor = document.querySelector('#sql-editor');
        const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;
        const sqlContent = codeMirrorInstance.getValue();
        console.log(sqlContent);

        // Send the SQL content to the backend
        fetch('/run-sql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: sqlContent })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Backend response:', data);
            // Display the message in the console div
            const consoleDiv = document.querySelector('.console');
            const statusSpan = document.querySelector('.status');
            
            // Update status message and color based on statusCode
            if (!isCorrect) {
                switch(data.statusCode) {
                    case 1:
                        statusSpan.innerText = 'Solved!';
                        statusSpan.style.color = 'lightgreen';
                        isCorrect = true; // Set the flag to true
                        break;
                    case 2:
                        statusSpan.innerText = 'Wrong...';
                        statusSpan.style.color = 'red';
                        break;
                    case 3:
                        statusSpan.innerText = 'Waiting...';
                        statusSpan.style.color = 'violet';
                        break;
                    default:
                        statusSpan.innerText = 'Unknown status';
                        statusSpan.style.color = 'black';
                }
            }
            
            consoleDiv.innerHTML = `<p>${data.message}</p>`;
            // Enable the submit button if a statusCode has been received
            if (!statusCodeReceived) {
                statusCodeReceived = true;
                submitButton.disabled = false;
                submitButton.classList.remove('disabled'); // Remove the disabled class
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Function to adjust the container height
    function adjustContainerHeight() {
        const navbarHeight = document.querySelector('header').offsetHeight;
        const wholeContainer = document.querySelector('.whole-container');
        wholeContainer.style.height = `calc(100vh - ${navbarHeight}px)`;
    }

    window.addEventListener('load', adjustContainerHeight);
    window.addEventListener('resize', adjustContainerHeight);

    window.addEventListener('load', function() {
        CodeMirror.fromTextArea(document.getElementById('sql-editor'), {
            mode: "text/x-sql",
            theme: "material",
            lineNumbers: true,
            matchBrackets: true,
            autoCloseBrackets: true
        });
    });
});
