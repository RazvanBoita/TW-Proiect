document.addEventListener('DOMContentLoaded', () => {
  // Select all the buttons with the class 'card-btn'
  const buttons = document.querySelectorAll('.card-btn');
  
  // Add event listener for each button
  buttons[0].addEventListener('click', () => {
      window.location.href = '/login';
  });
  
  buttons[1].addEventListener('click', () => {
      window.location.href = '/quiz';
  });
  
  buttons[2].addEventListener('click', () => {
      window.location.href = '/quizzes';
  });
  
  buttons[3].addEventListener('click', () => {
      window.location.href = '/progress';
  });
  
  buttons[4].addEventListener('click', () => {
      window.location.href = '/review';
  });
});