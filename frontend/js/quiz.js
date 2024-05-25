
document.addEventListener('DOMContentLoaded', function() {

    
   fetch('/load-quiz')
   .then(response => response.json())
   .then(data => {
        const questionIndexSpan = document.querySelector('.question-index .sharp-number');
        const questionContent = document.querySelector('.question-content');
        const tableDescriptionContent = document.querySelector('#table-description-content');

        questionIndexSpan.innerText = data.currentQuestion;
        questionContent.innerText = data.questionContent;
        tableDescriptionContent.innerText = data.tableDescription;

        // Store question ID in localStorage
        localStorage.setItem('currentQuestionId', data.questionId);
        chosenQuestionIds.push(data.questionId)
        localStorage.setItem('pickedQuestions', JSON.stringify(chosenQuestionIds))
    })
    .catch(error => {
        console.error('Error fetching quiz:', error);
    });

    let isCorrect = false;
    let statusCodeReceived = false;
    let currIdx = 1;
    let chosenQuestionIds = [];


    const submitButton = document.querySelector('.button-submit');
    submitButton.disabled = true;
    submitButton.classList.add('disabled');


    submitButton.addEventListener('click', function() {
        console.log('User is trying to submit with index:  ' + currIdx);
        currIdx++;
        fetch('/next-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ index: currIdx, pickedQuestions: localStorage.getItem('pickedQuestions') })
        })
        .then(response => response.json())
        .then(data => {
            if(data.message){
                console.log(data.message);
            } else{
                updateQuestion(data, currIdx)
            }
        })
    });


    function updateQuestion(data, currentQuestionIndex){
        const questionContent = document.querySelector('.question-content');
        const tableDescriptionContent = document.querySelector('#table-description-content');
        const questionIndexSpan = document.querySelector('.question-index .sharp-number');
        const statusSpan = document.querySelector('.status');
        const consoleDiv = document.querySelector('.console');
        const sqlEditor = document.querySelector('#sql-editor');
        const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;

        questionIndexSpan.innerText = currentQuestionIndex;
        questionContent.innerText = data.title;
        tableDescriptionContent.innerText = data.description;

        statusSpan.innerText = 'Waiting...';
        statusSpan.style.color = 'violet';
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
        isCorrect = false;
        statusCodeReceived = false;

        localStorage.setItem('currentQuestionId', data.id)
        chosenQuestionIds.push(data.id)
        localStorage.setItem('pickedQuestions', JSON.stringify(chosenQuestionIds))

        consoleDiv.innerHTML = '<p>The results of your query will appear here!</p>';
        codeMirrorInstance.setValue('');
    }

    const runButton = document.querySelector('.run-button');
    runButton.addEventListener('click', function() {
        const sqlEditor = document.querySelector('#sql-editor');
        const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;
        const sqlContent = codeMirrorInstance.getValue();
        console.log(sqlContent);

        fetch('/run-sql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sql: sqlContent, questionId: localStorage.getItem('currentQuestionId') })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Backend response:', data);
            const consoleDiv = document.querySelector('.console');
            const statusSpan = document.querySelector('.status');
            
            if (!isCorrect) {
                switch(data.statusCode) {
                    case 1:
                        statusSpan.innerText = 'Solved!';
                        statusSpan.style.color = 'lightgreen';
                        isCorrect = true; 
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
            if (!statusCodeReceived) {
                statusCodeReceived = true;
                submitButton.disabled = false;
                submitButton.classList.remove('disabled'); 
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });












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

    window.addEventListener('beforeunload', function (e) {
        const confirmationMessage = 'Are you sure you want to leave this page?';
        (e || window.event).returnValue = confirmationMessage;
        return confirmationMessage; 
    });
});
