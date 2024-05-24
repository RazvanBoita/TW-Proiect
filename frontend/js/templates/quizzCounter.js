
let questionCounter;
let pageCounter;

fetchQuizzCounter();
async function fetchQuizzCounter() {
    try {
        const response = await fetch('/quizzCounter'); // Fetch quizzes from the first page
        const counterJSON = await response.json();
        document.getElementById("quizz-counter").innerHTML = displayQuizzCounter(counterJSON);
        document.getElementById("total-questions").innerHTML = questionCounter;
    } catch (error) {
        console.error('Error fetching quizz counter:', error);
    }
}
function displayQuizzCounter(counter) {
    const template = document.getElementById("template-quizz-counter");
    const templateHtml = template.innerHTML;
    const maxQuestionsPerPage = 10;

    questionCounter = counter[0]["count"];
    pageCounter = Math.floor(counter[0]["count"] / 10) + 1;
    let listHtml = templateHtml.replace(/{{counter}}/g, pageCounter);

  return listHtml;
}