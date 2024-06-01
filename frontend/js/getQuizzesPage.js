let pageIndex = 0;
let currentDifficulty = '';
let categoryId = '';

const prevButton = document.getElementById('prev');
prevButton.disabled = true;
prevButton.classList.add('disabled');

const nextButton = document.getElementById('next');
nextButton.classList.add('enabled');

document.getElementById('currentPage').innerHTML = pageIndex + 1;

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
    displayPage();
    changePreviousButtonState();
});

// Listener for previous button
nextButton.addEventListener('click', function(event){
    prevButton.disabled = false;
    prevButton.classList.add('enabled');
    prevButton.classList.remove('disabled');

    pageIndex++;
    displayPage();
    changeNextButtonState();
});

// Listener for difficulty select
document.getElementById("difficulty").addEventListener("change", function() {
    let selectElement = document.getElementById("difficulty");
    let selectedIndex = selectElement.selectedIndex;
    if(selectElement.options[selectedIndex].text === 'All')
    {
        currentDifficulty = '';
    }
    else
    {
        currentDifficulty = selectElement.options[selectedIndex].text;
    }

    pageIndex = 0;
    displayPage();
    fetchQuizzCounter();
});

// Listener for category select
document.getElementById("category").addEventListener("change", function() {
    let selectElement = document.getElementById("category");
    let selectedIndex = selectElement.selectedIndex;

    if(selectElement.options[selectedIndex].text === 'All')
        categoryId = '';
    else
        categoryId = selectElement.selectedIndex - 1;

    pageIndex = 0;
    displayPage();
    fetchQuizzCounter();
});

async function displayPage()
{
    try {
        const response = await fetch(`/quizzList?page=${pageIndex}&difficulty=${currentDifficulty}&categoryId=${categoryId}`); 
        const quizzesJSON = await response.json();
        document.getElementById("list").innerHTML = displayQuizzes(quizzesJSON);
        document.getElementById('currentPage').innerHTML = pageIndex + 1;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }

}