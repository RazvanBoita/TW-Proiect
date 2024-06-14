async function onDelete(button)
{
    if(!confirm('Are you sure you want to delete this question?'))
        return;

    const questionId = button.id;
    const url = `/api/quiz?id=${questionId}`;
    try {
        const response = await fetch(url,  {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        const row = button.parentNode.parentNode;
        const table = row.parentNode;
        const rowIndex = row.rowIndex;
        table.deleteRow(rowIndex - 1);

        questionCounter--;
        document.getElementById("total-questions").innerHTML = questionCounter;

    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}