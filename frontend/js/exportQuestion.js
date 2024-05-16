document.getElementById('export-button').addEventListener('click', function(event) {
    const optionsList = document.getElementsByClassName("option-text");
    const quizzTitle = document.getElementById("quizz-title");

    const data ={
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