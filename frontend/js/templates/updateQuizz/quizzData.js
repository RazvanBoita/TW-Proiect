fetchQuizzData();
async function fetchQuizzData()
{
    const url = new URL(window.location.href);

    const id = url.searchParams.get('id');
    if(!id)
    {
        window.location.href = '/notFound';
        return;
    }
    try{
        const response = await fetch(`/api/quiz?id=${id}`); // Fetch quizz
        const data = await response.json();
        const quizzData = data.questionData;
        const categoryData = data.categoryData;
        
        if(!quizzData || !categoryData)
        { 
            window.location.href = '/notFound';
            return;
        }
        const difficulty = quizzData.difficulty;
        const quizzTitle = quizzData.title;
        const answer = quizzData.answer;
        const description = quizzData.description;
        const hint = quizzData.hint;
        
        const selectContainer = document.getElementById("category");
        for(let i = 0; i< categoryData.length; i++)
        {
            let found = false;
            for(let j=0;j<selectContainer.length;j++)
            {
                if(categoryData[i].type.toLowerCase() === selectContainer.options[j].value.toLowerCase())
                {
                    selectContainer.options[j].selected = true;
                    found=true;
                    break;
                }
                
            }
        }
        switch(difficulty)
        {
            case "Easy": 
            case "Medium": 
            case "Hard": document.getElementById(difficulty).checked = true; break;
            default: alert('Invalid difficulty!. Choose easy, medium or hard.');
        }

        document.getElementById("quizz-question").value=quizzTitle;
        document.getElementById("description-area").value = description;
        document.getElementById("answer-area").value=answer;
        document.getElementById("hint-area").value = hint;
        updateLiveView(difficulty);
    }
    catch(error)
    {
        console.error(error);
    }
}

