

fetchQuizzes();
async function fetchQuizzes() {
    try {
        const response = await fetch('/quizzList'); // Fetch quizzes from the first page
        const quizzesJSON = await response.json();
        document.getElementById("list").innerHTML = displayQuizzes(quizzesJSON);
        redirectQuizzHandler();
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
        
    listHtml += templateHtml.replace(/{{id}}/g, quizzes[key]["id"])
                            .replace(/{{title}}/g, title)
                            .replace(/{{rating}}/g, quizzes[key]["rating"])
                            .replace(/{{difficulty}}/g, quizzes[key]["difficulty"])
    }

  return listHtml;
}