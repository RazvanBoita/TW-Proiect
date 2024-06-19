document.addEventListener('DOMContentLoaded', (event) => {
    let countdownElement = document.getElementById('countdown');
    let countdown = 5;

    setInterval(() => {
        countdown--;
        countdownElement.textContent = countdown;

        if (countdown === 0) {
            window.location.href = '/'; //Il trimitem acasa cand s a terminat countdownul
        }
    }, 1000);
});
