document.getElementById('input-json').addEventListener('change', function(event) {
    const file = event.target.files[0]; 
    if (!file) 
    {
        console.log('No file selected.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        try {
            const jsonData = JSON.parse(content); 
            console.log('JSON file selected:', jsonData);

            const difficulty = jsonData.difficulty;
            const category = jsonData.category.split(',').map(cat => cat.trim()); // Split and trim the category string
            const quizzTitle = jsonData.quizz_title;
            const answer = jsonData.answer;
            const description = jsonData.description;

            if(quizzTitle === null || answer === null || category === null || difficulty === null || description === null)
            {
                alert('Title, answer or category are invalid!');
                return;
            }
            if(category.length === 0)
            {
                alert('Category must contain an element!');
                return;
            }
            
            const selectContainer = document.getElementById("category");

            for(let i = 0; i< category.length; i++)
            {
                let found = false;
                for(let j=0;j<selectContainer.length;j++)
                {
                    if(category[i].toLowerCase() === selectContainer.options[j].value.toLowerCase())
                    {
                        selectContainer.options[j].selected = true;
                        found=true;
                        break;
                    }
                }
                if(!found)
                {
                    alert('Category ' + category[i] + ' does not exist!');
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
            if(answer == undefined){
                document.getElementById("answer-area").value = '';    
            }else{
                document.getElementById("answer-area").value=answer;
            }

            updateLiveView(difficulty);
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Invalid JSON file selected. Please select a valid JSON file.');
        }
    };
    reader.readAsText(file); 
});
