

fetchQuizzes();
async function fetchQuizzes() {
    try {
        const response = await fetch('/quizzList'); // Fetch quizzes from the first page
        const quizzesJSON = await response.json();
        document.getElementById("list").innerHTML = displayQuizzes(quizzesJSON);

    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}
function displayQuizzes(quizzesJSON) {
    const template = document.getElementById("template-list-quizzes");
    const templateHtml = template.innerHTML;

    let listHtml = "";
    const maxTitleSize = 60;
    const isUserAdmin = quizzesJSON.isUserAdmin;
    const quizzes = quizzesJSON.questions;
    for (key in quizzes) {
        let title = quizzes[key]["title"].substring(0,maxTitleSize);
        if(quizzes[key]["title"].length > maxTitleSize)
        {
            title += "...";
        }
        
        let statusSvg = '<svg class="w-6 h-6 text-gray-800 dark:text-white move-left" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11.917 9.724 16.5 19 7.5"/></svg>';
        let status = quizzes[key]["is_solved"] ? statusSvg : '';
        let buttonVisibility = isUserAdmin ? '' : 'none';

        listHtml += templateHtml.replace(/{{id}}/g, quizzes[key]["id"])
                                .replace(/{{title}}/g, title)
                                .replace(/{{rating}}/g, quizzes[key]["rating"])
                                .replace(/{{difficulty}}/g, quizzes[key]["difficulty"])
                                .replace(/{{status}}/g, status)
                                .replace(/{{buttonVisibility}}/g, buttonVisibility);
    }

  return listHtml;
}
function displaySolvedCheckmark(quizzesJSON)
{

}