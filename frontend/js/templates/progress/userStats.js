fetchUserStats();
async function fetchUserStats() {
    try {
        const response = await fetch('/userStats'); // Fetch problems progress
        const userStatsJSON = await response.json();
        document.getElementById('top-left').innerHTML = displayUserStats(userStatsJSON);
    } catch (error) {
        console.error('Error fetching user stats:', error);
    }
}
function displayUserStats(userStats) {
    const template = document.getElementById("template-user-stats");
    const templateHtml = template.innerHTML;
  
    const listHtml = templateHtml.replace(/{{Name}}/g, userStats.username)
                                 .replace(/{{highScore}}/g, userStats.highScore)
                                 .replace(/{{rank}}/g, userStats.rank)

  return listHtml;
}