function redirectQuizzHandler()
{
    return;
    document.querySelectorAll('a[href="/quiz"]').forEach(link => {
    
        link.addEventListener('click', function(event) {
          event.preventDefault(); 
          const id = this.id;
            
          console.log(id);
          fetch(`/quiz`, {
            method: 'GET',
            headers: {
              'quizz-id': `${id}` // Set your custom header
            }
          })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.text(); // or response.json() if the server returns JSON
          })
          .then(data => {
            console.log(data); // Handle the response here (e.g., update the page content)
          })
          .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
          });
        });
      });
}
