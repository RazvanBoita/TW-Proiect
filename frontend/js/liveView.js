// Title
document.getElementById('quizz-question').addEventListener('input', (event)=>{
    document.getElementById('title').textContent  = event.target.value;
})
// Description
document.getElementById('description-area').addEventListener('input', (event)=>{
    document.getElementById('table-description-content').textContent  = event.target.value;
})
// Difficulties
document.getElementById('easy').addEventListener('click', (event)=>{
    document.getElementById('difficulty-title').textContent ='Difficulty: ' + event.target.value;
})

document.getElementById('medium').addEventListener('click', (event)=>{
    document.getElementById('difficulty-title').textContent ='Difficulty: ' + event.target.value;
})

document.getElementById('hard').addEventListener('click', (event)=>{
    document.getElementById('difficulty-title').textContent ='Difficulty: ' + event.target.value;
})
// Categories
document.getElementById('category').addEventListener('change', function(event){
     const selectedOptions = Array.from(event.target.selectedOptions);

     const selectedValues = selectedOptions.map(option => option.value);

     const outputElement = document.getElementById('topics');
     outputElement.textContent = 'Topics: ' + selectedValues.join(', ');
})