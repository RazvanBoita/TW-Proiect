document.querySelector('.button-export').addEventListener('click', function(event) {
    const cerinta = document.querySelector('.question-content')
    const tableContent = document.getElementById('table-description-content')
    const category = document.querySelector('.category')
    const difficulty = document.querySelector('.difficulty')
    
    const data ={
        problem: cerinta.innerText,
        tableDescription: tableContent.innerText,
        category: category.innerText.split(':')[1].trim(),
        difficulty: difficulty.innerText.split(':')[1].trim()
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