document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data;
        });
        
        // Add the logout button script
        var script = document.createElement('script');
        script.src = '../js/logout.js';
        script.async = false;
        document.body.appendChild(script);
});