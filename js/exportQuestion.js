document.getElementById('export-button').addEventListener('click', function(event) {
    const optionsList = document.getElementsByClassName("option-text");
    const quizzTitle = document.getElementById("quizz-title");

    let optionsData = [];
    for(let i=0;i<optionsList.length;i++)
    {
        optionsData.push(optionsList[i].textContent);
    }
    
    const data ={
        optionsList: optionsData,
        quizzTitle: quizzTitle.textContent,
    }
    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'data.json'; 

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
});