document.getElementById('import-button').addEventListener('change', function(event) {
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
            
            const quizzTitle = jsonData.quizz_title;
            const optionsList = jsonData.options;
            const correctAnswears = jsonData.correct_answears;

            if(quizzTitle === null || optionsList === null || correctAnswears === null)
            {
                alert('Title, options or correct answears are invalid!');
                return;
            }
            if(optionsList.length != 4 || correctAnswears.length != 4)
            {
                alert('Options or correct answears do not have 4 elements!');
                return;
            }

            for(let i=0;i<optionsList.length;i++)
            {
                if(correctAnswears[i] === false)
                    continue;
                if(correctAnswears[i] === true)
                {
                    let checkbox = document.getElementById("correct-answear-" + i);
                    checkbox.checked = true;
                    continue;
                }
                alert('Invalid answear');
                return;
            }
            for(let i=0;i<optionsList.length;i++)
            {
                if(typeof optionsList[i] !== 'string')
                {
                    for(let i=0;i<optionsList.length;i++)
                    {
                        document.getElementById("correct-answear-" + i).checked = false;
                    }   
                    alert('Invalid option ' + i);
                    return;
                }
            
                let option = document.getElementById("option-" + i);
                option.value = optionsList[i];
            }
            document.getElementById("quizz-question").value=quizzTitle;
        } catch (error) {
            console.error('Error parsing JSON:', error);
            alert('Invalid JSON file selected. Please select a valid JSON file.');
        }
};
    reader.readAsText(file); 
});