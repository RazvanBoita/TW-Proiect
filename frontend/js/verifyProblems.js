document.addEventListener("DOMContentLoaded", function() {
    fetch('/pending')
        .then(response => response.json())
        .then(data => {
            console.log("Got data: ", data);
            const main = document.querySelector('.pending-main');

            data.forEach(question => {
                const card = document.createElement('div');
                card.classList.add('pending-card');
                card.dataset.id = question.id;

                card.innerHTML = `
                    <span class="pending-id">${question.id}</span>
                    <p class="pending-difficulty"><span class="preface">Difficulty: </span>${question.difficulty}</p>
                    <p class="pending-categories"><span class="preface">Categories: </span>SELECT</p>
                    <p class="pending-title"><span class="preface">Title: </span>${question.title}</p>
                    <p class="pending-table-content"><span class="preface">Table: </span>${question.description}</p>
                    <p class="pending-answer"><span class="preface">Answer: </span>${question.answer}</p>
                    <p class="pending-hint"><span class="preface">Hint: </span>${question.hint}</p>
                    <div class="pending-buttons">
                        <button class="pending-approve pending-button" data-id="${question.id}">Approve</button>
                        <button class="pending-deny pending-button" data-id="${question.id}">Deny</button>
                    </div>
                `;

                main.appendChild(card);
            });

            main.addEventListener('click', function(event) {
                if (event.target.matches('.pending-approve, .pending-deny')) {
                    const button = event.target;
                    const questionId = button.dataset.id;
                    const action = button.classList.contains('pending-approve') ? 'approve' : 'deny';

                    const card = button.closest('.pending-card');
                    card.classList.add('removed');

                    fetch('/pending', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body : JSON.stringify({action: action, questionId: questionId})
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        // Remove the card from the DOM after the transition ends
                        card.addEventListener('transitionend', () => {
                            card.remove();
                        });
                    })
                    .catch(error => {
                        console.error(`Error performing ${action} action:`, error);
                        // If there is an error, remove the 'removed' class to show the card again
                        card.classList.remove('removed');
                    });
                }
            });
        })
        .catch(error => console.error('Error fetching pending questions:', error));
});
