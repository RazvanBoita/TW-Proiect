document.addEventListener('DOMContentLoaded', function() {


    const encrypted = localStorage.getItem('encrypted');
    console.log("Sending: " + encrypted);

    if (!encrypted) {
        console.error('Encrypted value not found in local storage.');
        window.location.href = '/not-found';
        return;
    }


    fetch('/load-quiz-result', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ encrypted: encrypted })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Data received:', data);
        if (data.error) {
            console.error('Error:', data.error);
            return;
        }

        const scoreElement = document.querySelector('.score-result .sharp-number.red-color');
        scoreElement.textContent = data.score;

        const startDate = new Date(data.start_date);
        const endDate = new Date(data.end_date);
        const timeDifference = endDate - startDate;

        const hours = Math.floor(timeDifference / 3600000);
        const minutes = Math.floor((timeDifference % 3600000) / 60000);
        const seconds = Math.floor((timeDifference % 60000) / 1000);

        const timeSpent = `${hours}h ${minutes}m ${seconds}s`;

        const timeSpentElement = document.querySelector('.time-spent .sharp-number.green-color');
        timeSpentElement.textContent = timeSpent;

        localStorage.removeItem('encrypted')
    })
    .catch(error => console.error('Error fetching data:', error));

    document.querySelector('.create-quiz').addEventListener('click', function() {
        window.location.href = '/createQuiz';
    });

    document.querySelector('.go-home').addEventListener('click', function() {
        window.location.href = '/';
    });
});
