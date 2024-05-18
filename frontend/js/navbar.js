document.addEventListener('DOMContentLoaded', function() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            console.log('ok');
            document.getElementById('navbar').innerHTML = data;
        });
});