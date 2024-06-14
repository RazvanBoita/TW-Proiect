
fetchProblemsProgress();
async function fetchProblemsProgress() {
    try {
        const response = await fetch('/problemsProgress'); // Fetch problems progress
        const problemsProgressJSON = await response.json();
        document.getElementById('top-right').innerHTML = displayProblemsProgress(problemsProgressJSON);
        updateSliders(problemsProgressJSON);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}
function displayProblemsProgress(problemsData) {
    const template = document.getElementById("template-problems-progress");
    const templateHtml = template.innerHTML;
  
    if(problemsData.allProblemsSolvedCounter > 5)
    {
        pageCounter = Math.ceil(problemsData.allProblemsSolvedCounter / 5);
        nextButton.classList.add('enabled');
    }
    else{
        pageCounter = 0;
        nextButton.classList.add('disabled');
        nextButton.disabled = true;
    }
    const listHtml = templateHtml.replace(/{{allProblems}}/g, problemsData.allProblemsCounter)
                               .replace(/{{allEasyProblems}}/g, problemsData.easyProblemsCounter)
                               .replace(/{{allMediumProblems}}/g, problemsData.mediumProblemsCounter)
                               .replace(/{{allHardProblems}}/g, problemsData.hardProblemsCounter)
                               .replace(/{{problemsSolved}}/g, problemsData.allProblemsSolvedCounter)
                               .replace(/{{easyProblemsSolved}}/g, problemsData.easyProblemsSolvedCounter)
                               .replace(/{{mediumProblemsSolved}}/g, problemsData.mediumProblemsSolvedCounter)
                               .replace(/{{hardProblemsSolved}}/g, problemsData.hardProblemsSolvedCounter)

  return listHtml;
}
function updateSliders(problemsData)
{
    const easyFillPercentage = problemsData.easyProblemsSolvedCounter / problemsData.easyProblemsCounter * 100;
    const mediumFillPercentage = problemsData.mediumProblemsSolvedCounter / problemsData.mediumProblemsCounter * 100;
    const hardFillPercentage = problemsData.hardProblemsSolvedCounter / problemsData.hardProblemsCounter * 100;
    document.getElementById("easy-bar-fill").style.width = `${easyFillPercentage}%`;
    document.getElementById("medium-bar-fill").style.width = `${mediumFillPercentage}%`;
    document.getElementById("hard-bar-fill").style.width = `${hardFillPercentage}%`;
}