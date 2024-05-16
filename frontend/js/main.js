// js/main.js
fetch('/data')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    // Assuming `data` is an object with a `username` field
    const username = data.username;

    // Update the content of the <h2> element with the username
    const h2Element = document.querySelector('main h2');
    h2Element.textContent = `Welcome, ${username}!`;
  })
  .catch(error => {
    console.error('There was a problem with your fetch operation:', error);
  });
