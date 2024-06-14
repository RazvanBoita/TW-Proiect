let pageCounter = 0;
let pageIndex = 0;

// List Logic
fetchSolvedQuizzes();
async function fetchSolvedQuizzes() {
    try {
        const response = await fetch(`/solvedQuizzesList?page=${pageIndex}`); // Fetch quizzes from the first page
        const quizzesJSON = await response.json();
        document.getElementById("list").innerHTML = displaySolvedQuizzes(quizzesJSON);
    } catch (error) {
        console.error('Error fetching solved quizz:', error);
    }
}
function displaySolvedQuizzes(quizzes) {
    const template = document.getElementById("template-problems-solved-list");
    const templateHtml = template.innerHTML;

    let listHtml = "";
    const maxTitleSize = 60;
    
    for (key in quizzes) {
        let title = quizzes[key]["title"].substring(0,maxTitleSize);
        if(quizzes[key]["title"].length > maxTitleSize)
        {
            title += "...";
        }
    const date = quizzes[key]["date"].split('T')[0];
    listHtml += templateHtml.replace(/{{id}}/g, quizzes[key]["id"])
                            .replace(/{{title}}/g, title)
                            .replace(/{{difficulty}}/g, quizzes[key]["difficulty"])
                            .replace(/{{date}}/g, date)
    }

  return listHtml;
}

// Previous and next button logic

const prevButton = document.getElementById('prev');
prevButton.disabled = true;
prevButton.classList.add('disabled');

const nextButton = document.getElementById('next');


function reset()
{
    pageIndex = 0;
    changeNextButtonState();
    changePreviousButtonState();
}
function changeNextButtonState()
{
    if(pageIndex >= pageCounter - 1)
    {
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
        nextButton.classList.remove('enabled');
    }
    else
    {
        nextButton.disabled = false;
        nextButton.classList.add('enabled');
        nextButton.classList.remove('disabled');
    }
}
function changePreviousButtonState()
{
    if(pageIndex === 0)
    {
        prevButton.disabled = true;
        prevButton.classList.add('disabled');
        prevButton.classList.remove('enabled');
        return;
    }
    else
    {
        prevButton.disabled = false;
        prevButton.classList.add('enabled');
        prevButton.classList.remove('disabled');
    }
}
// Listener for previous button
prevButton.addEventListener('click', function(event) {
    nextButton.disabled = false;
    nextButton.classList.add('enabled');
    nextButton.classList.remove('disabled');

    pageIndex--;
    fetchSolvedQuizzes();
    changePreviousButtonState();
});

// Listener for previous button
nextButton.addEventListener('click', function(event){
    prevButton.disabled = false;
    prevButton.classList.add('enabled');
    prevButton.classList.remove('disabled');

    pageIndex++;
    fetchSolvedQuizzes();
    changeNextButtonState();
});
