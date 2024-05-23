
fetchCategories();
async function fetchCategories() {
    try {
        const response = await fetch('/categoryList'); // Fetch quizzes from the first page
        const quizzesJSON = await response.json();
        document.getElementById("category").innerHTML = displayCategories(quizzesJSON);
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}
function displayCategories(quizzes) {
    const template = document.getElementById("template-list-category");
    const templateHtml = template.innerHTML;

    let listHtml = "";

    for (key in quizzes) {
    listHtml += templateHtml.replace(/{{type}}/g, quizzes[key]["type"])
    }

  return listHtml;
}