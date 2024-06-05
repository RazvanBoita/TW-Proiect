

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
function displayQuizzes(quizzes) {
    const template = document.getElementById("template-list-quizzes");
    const templateHtml = template.innerHTML;

    let listHtml = "";
    const maxTitleSize = 60;

    for (key in quizzes) {
        let title = quizzes[key]["title"].substring(0,maxTitleSize);
        if(quizzes[key]["title"].length > maxTitleSize)
        {
            title += "...";
        }
        
        if(quizzes[key]["is_solved"])
        {
            listHtml += templateHtml.replace(/{{id}}/g, quizzes[key]["id"])
            .replace(/{{title}}/g, title)
            .replace(/{{rating}}/g, quizzes[key]["rating"])
            .replace(/{{difficulty}}/g, quizzes[key]["difficulty"])
            .replace(/{{status}}/g, '<svg class="w-6 h-6 text-gray-800 dark:text-white move-left" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="green" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 11.917 9.724 16.5 19 7.5"/></svg>');
        }
        else
        {
            listHtml += templateHtml.replace(/{{id}}/g, quizzes[key]["id"])
            .replace(/{{title}}/g, title)
            .replace(/{{rating}}/g, quizzes[key]["rating"])
            .replace(/{{difficulty}}/g, quizzes[key]["difficulty"])
            .replace(/{{status}}/g, '');
   
        }
       

    }

  return listHtml;
}
function displaySolvedCheckmark(quizzesJSON)
{

}