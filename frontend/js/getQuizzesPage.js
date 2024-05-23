let pageIndex = 0;

const prevButton = document.getElementById('prev');
prevButton.disabled = true;
prevButton.classList.add('disabled');

const nextButton = document.getElementById('next');
nextButton.classList.add('enabled');

document.getElementById('currentPage').innerHTML = pageIndex + 1;


prevButton.addEventListener('click', function(event) {
    nextButton.disabled = false;
    nextButton.classList.add('enabled');
    nextButton.classList.remove('disabled');

    pageIndex--;
    displayPage();
    console.log('prev');

    if(pageIndex === 0)
    {
        prevButton.disabled = true;
        prevButton.classList.add('disabled');
        prevButton.classList.remove('enabled');
        return;
    }

});

nextButton.addEventListener('click', function(event){
    prevButton.disabled = false;
    prevButton.classList.add('enabled');
    prevButton.classList.remove('disabled');

    pageIndex++;
    displayPage();
    console.log('next');

    if(pageIndex === pageCounter - 1)
    {
        nextButton.disabled = true;
        nextButton.classList.add('disabled');
        nextButton.classList.remove('enabled');
        return;
    }
});

async function displayPage()
{
    try {
        const response = await fetch(`/quizzList?page=${pageIndex}`); 
        const quizzesJSON = await response.json();
        document.getElementById("list").innerHTML = displayQuizzes(quizzesJSON);
        document.getElementById('currentPage').innerHTML = pageIndex + 1;
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }

}