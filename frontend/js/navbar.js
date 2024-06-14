document.addEventListener('DOMContentLoaded', async function() {
        try {
            const response = await fetch('/navbar.html'); 
            if(response.status === 404)
                return;
            const data = await response.text();
            document.getElementById("navbar").innerHTML = data;
    
        } catch (error) {
            console.error('Error fetching quizzes:', error);
            return;
        }
        const createQuizzButtonScript = document.createElement('script');
        createQuizzButtonScript.src = '../js/createQuizzButtonVisibility.js';
        createQuizzButtonScript.async = false;
        document.body.appendChild(createQuizzButtonScript);

        // Add the logout button script
        const logoutScript = document.createElement('script');
        logoutScript.src = '../js/logout.js';
        logoutScript.async = false;
        document.body.appendChild(logoutScript);
});
