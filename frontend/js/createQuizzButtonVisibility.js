handleCreateQuizzButton();

async function handleCreateQuizzButton()
{
    const response = await fetch('createQuizzButton');
    const responseJSON = await response.json();
    
    if(!responseJSON.visibility)
        document.getElementById('create-quizz').style.display = 'none';
}