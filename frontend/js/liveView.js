// Title
document.getElementById('quizz-question').addEventListener('input', (event)=>{
    document.getElementById('title').textContent  = event.target.value;
})
// Description
document.getElementById('description-area').addEventListener('input', (event)=>{
    document.getElementById('table-description-content').textContent  = event.target.value;
})
// Difficulties
document.getElementById('Easy').addEventListener('click', (event)=>{
    document.getElementById('difficulty-area').textContent ='Difficulty: ' + event.target.value;
})

document.getElementById('Medium').addEventListener('click', (event)=>{
    document.getElementById('difficulty-area').textContent ='Difficulty: ' + event.target.value;
})

document.getElementById('Hard').addEventListener('click', (event)=>{
    document.getElementById('difficulty-area').textContent ='Difficulty: ' + event.target.value;
})
// Categories
document.getElementById('category').addEventListener('change', function(event){
     const selectedOptions = Array.from(event.target.selectedOptions);

     const selectedValues = selectedOptions.map(option => option.value);

     document.getElementById('category-area').textContent = 'Category: ' + selectedValues.join(', ');
})

function updateLiveView(difficulty)
{
    document.getElementById("quizz-question").dispatchEvent(new Event('input'));
    document.getElementById('category').dispatchEvent(new Event('change'));
    document.getElementById(difficulty).dispatchEvent(new Event('click'));
    document.getElementById("description-area").dispatchEvent(new Event('input'));
    document.getElementById("answer-area").dispatchEvent(new Event('input'));
}