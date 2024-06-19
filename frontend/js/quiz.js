
document.addEventListener('DOMContentLoaded', function() {
    let quizFinished = false;

    let start_date = 0;

    const thumbsUpIcon = document.querySelector('.thumbs-up');
    const thumbsDownIcon = document.querySelector('.thumbs-down');

    let vote = 0
    //0 inseamna fara vot, 1 inseamna like, 2 inseamna dislike
    thumbsUpIcon.addEventListener('click', function() {
        if(vote == 1){
            this.classList.remove('clicked')
            vote = 0
            console.log("Vote: " + vote);
            return
        }
        this.classList.toggle('clicked');
        thumbsDownIcon.classList.remove('clicked')
        if (this.classList.contains('clicked')) {
            vote = 1;
        } else {
            vote = 0;
        }
        console.log("Vote: " + vote);

    });

    thumbsDownIcon.addEventListener('click', function() {
        if(vote == 2){
            this.classList.remove('clicked')
            vote = 0
            console.log("Vote: " + vote);
            return
        }
        this.classList.toggle('clicked');
        thumbsUpIcon.classList.remove('clicked');
        if (this.classList.contains('clicked')) {
            vote = 2;
        } else {
            vote = 0;
        }
        console.log("Vote: " + vote);
    });




   let score = 0 
   let currQuestionId = 0
   let curr_hint = 'No hint found for this question'

   
   // Get the quizz id variable from the url if present
   const url = new URL(window.location.href);
   const quizzId = url.searchParams.get('id');
   let loadQuizzApi = './load-quiz';
   if(quizzId !== null)
        loadQuizzApi += `?id=${quizzId}`;

   fetch(loadQuizzApi)
   .then(response => response.json())
   .then(data => {
        if(data === null)
        {
            window.location.href = '/notFound';
        }
        console.log(data);
        const questionIndexSpan = document.querySelector('.question-index .sharp-number');
        const questionContent = document.querySelector('.question-content');
        const tableDescriptionContent = document.querySelector('#table-description-content');
        const difficulty = document.querySelector('.difficulty')
        const category = document.querySelector('.category')
        

        questionIndexSpan.innerText = data.currentQuestion;
        questionContent.innerText = data.questionContent;
        tableDescriptionContent.innerText = data.tableDescription;
        difficulty.innerText = 'Difficulty: Easy'
        category.innerText = `Category: ${data.category}`

        currQuestionId = data.questionId        
        chosenQuestionIds.push(data.questionId)
        start_date = data.start_date
        curr_hint = data.hint

        fetchComments(currQuestionId)
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



    let redirectFlag = 0
    submitButton.addEventListener('click', function() {
        console.log('User is trying to submit with index:  ' + currIdx);
        console.log(currQuestionId, chosenQuestionIds, score);
        currIdx++;
        
        if(currIdx<=12){
            const newUrl = window.location.origin + window.location.pathname;
            history.pushState({}, '', newUrl);
            fetch('/next-question', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ index: currIdx, pickedQuestions: chosenQuestionIds, isCorrect: isCorrect, vote:vote, currentQuestion: currQuestionId })
            })
            .then(response => response.json())
            .then(data => {
                if(data.message){
                    console.log(data.message);
                } else{
                    score += data.points
                    data.points = score
                    //update vote
                    updateQuestion(data, currIdx)
                }
            })
        } else{
            console.log("Am intrat in finish quiz");
            fetch('/finish-quiz', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({score: score, start_date: start_date})
            })
            .then(response => {
                
                if(response.ok){
                    redirectFlag = 1
                }
                return response.json()
            })
            .then(data => {
                if(redirectFlag){
                    quizFinished = true
                    window.location.href = '/finish-quiz'
                    //acolo tinem minte id-ul quizului tocmai facut
                    localStorage.setItem('encrypted', data)
                }
            })
        }
    });




    

    function updateQuestion(data, currentQuestionIndex){
        const questionContent = document.querySelector('.question-content');
        const tableDescriptionContent = document.querySelector('#table-description-content');
        const questionIndexSpan = document.querySelector('.question-index .sharp-number');
        const statusSpan = document.querySelector('.status');
        const consoleDiv = document.querySelector('.console');
        const sqlEditor = document.querySelector('#sql-editor');
        const scoreValue = document.querySelector('.score-value')
        const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;
        const thumbsUpIcon = document.querySelector('.thumbs-up');
        const thumbsDownIcon = document.querySelector('.thumbs-down');
        const difficulty = document.querySelector('.difficulty')
        const category = document.querySelector('.category')

        questionIndexSpan.innerText = currentQuestionIndex;
        questionContent.innerText = data.title;
        tableDescriptionContent.innerText = data.description;
        category.innerText = `Category: ${data.category}`

        thumbsDownIcon.classList.remove('clicked')
        thumbsUpIcon.classList.remove('clicked')
        statusSpan.innerText = 'Waiting...';
        statusSpan.style.color = 'violet';
        submitButton.disabled = true;
        submitButton.classList.add('disabled');
        isCorrect = false;
        statusCodeReceived = false;
        scoreValue.innerText = data.points
        vote = 0

        currQuestionId = data.id
        chosenQuestionIds.push(data.id)

        if(currIdx<=4){
            difficulty.innerText = 'Difficulty: Easy'
        } else if(currIdx<=8){
            difficulty.innerText = 'Difficulty: Medium'
        } else if(currIdx <= 12){
            difficulty.innerText = 'Difficulty: Hard'
        }

        if(currIdx == 12) submitButton.innerText = 'Submit & finish'

        curr_hint = data.hint

        consoleDiv.innerHTML = '<p>The results of your query will appear here!</p>';
        codeMirrorInstance.setValue('');
        fetchComments(currQuestionId)
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
            body: JSON.stringify({ sql: sqlContent, questionId: currQuestionId })
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


    
    function fetchComments(questionId) {
        fetch(`/comments?id=${questionId}`, {
            method: 'GET'
        })
        .then(response => response.json())
        .then(data => {
            renderComments(data)
        })
        .catch(error => {
            console.error('Error fetching comments:', error);
        });
    }

    function renderComments(comments){
        const container = document.querySelector('.comments-container');
        container.innerHTML = '';

        comments.forEach(comment => {
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';

            const contentDiv = document.createElement('div');
            contentDiv.className = 'comment-content';
            contentDiv.textContent = comment.description;
            commentElement.appendChild(contentDiv);

            const bottomDiv = document.createElement('div');
            bottomDiv.className = 'comment-bottom';

            const userDiv = document.createElement('div');
            userDiv.className = 'comment-user';
            const userIcon = document.createElement('ion-icon');
            userIcon.setAttribute('name', 'person-circle-outline');
            const usernameParagraph = document.createElement('p');
            usernameParagraph.className = 'comment-username';
            usernameParagraph.textContent = comment.idUser; // Assuming idUser is the username
            userDiv.appendChild(userIcon);
            userDiv.appendChild(usernameParagraph);
            bottomDiv.appendChild(userDiv);

            const dateParagraph = document.createElement('p');
            dateParagraph.className = 'comment-date';
            const createdAtDate = new Date(comment.createdAt).toLocaleDateString('en-US'); // Format the date
            dateParagraph.textContent = `Date: ${createdAtDate}`;
            bottomDiv.appendChild(dateParagraph);

            commentElement.appendChild(bottomDiv);

            container.appendChild(commentElement);
    });
    }


    function addComment(questionId, parentId, description){
        fetch(`/comments`, {
            method : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({questionId: questionId, parentId: parentId, description: description})
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            const commentSection = document.querySelector('.comments-container')
            commentSection.insertAdjacentHTML('beforeend', data)
        })
    }

    const addCommentBtn = document.querySelector(".comment-submit")
    const commentContent = document.querySelector(".comment-input")
    addCommentBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const parentId = -1
        const description = commentContent.value.trim();
        if(description){
            if(currQuestionId){
                addComment(currQuestionId, parentId, description)
                commentContent.value = '';
            } else{
                console.log("Can't add comment for question id null");
            }
        } else{
            console.log("Can't add epmty comment");
        }
    })




    const hintBtn = document.querySelector('.modify-color');
    let hintInserted = false;

    function insertHint() {
        if (!hintInserted) {
            const sqlEditor = document.querySelector('#sql-editor');
            const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;
            let currentContent = codeMirrorInstance.getValue();
            const hintComment = `-- Hint: ${curr_hint}\n`;

            currentContent = `${hintComment}${currentContent}`;
            codeMirrorInstance.setValue(currentContent);

            hintInserted = true;
        }
    }


    function removeHint() {
        if (hintInserted) {
            const sqlEditor = document.querySelector('#sql-editor');
            const codeMirrorInstance = sqlEditor.nextSibling.CodeMirror;
            let currentContent = codeMirrorInstance.getValue();
            const hintComment = `-- Hint: ${curr_hint}\n`;

            if (currentContent.startsWith(hintComment)) {
                currentContent = currentContent.slice(hintComment.length);
                codeMirrorInstance.setValue(currentContent);
            }

            hintInserted = false;
        }
    }

    hintBtn.addEventListener('mouseenter', insertHint);
    hintBtn.addEventListener('mouseleave', removeHint);

    hintBtn.addEventListener('touchstart', function(e) {
        insertHint();
        e.preventDefault();
    });
    hintBtn.addEventListener('touchend', function(e) {
        removeHint();
        e.preventDefault();
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
        if(!quizFinished){
            const confirmationMessage = 'Are you sure you want to leave this page?';
            (e || window.event).returnValue = confirmationMessage;
            return confirmationMessage; 
        }
    });
    function removeBeforeUnloadListener() {
        window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
});
