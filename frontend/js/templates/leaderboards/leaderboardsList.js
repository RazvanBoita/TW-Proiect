fetchLeaderboardsList();
async function fetchLeaderboardsList() {
    try {
        const response = await fetch(`/leaderboardsList`); // Fetch leaderboards list
        const leaderboardsJSON = await response.json();
        document.getElementById("list").innerHTML = displayLeaderboardsList(leaderboardsJSON);
    } catch (error) {
        console.error('Error fetching solved quizz:', error);
    }
}
function displayLeaderboardsList(leaderboards) {
    const template = document.getElementById("template-leaderboards");
    const templateHtml = template.innerHTML;
    console.log(leaderboards);
    let listHtml = '';
    
    let counter = 1;
    for (leaderboard in leaderboards) {
       
        listHtml += templateHtml.replace(/{{rank}}/g, counter++ + '.')
                            .replace(/{{name}}/g, leaderboards[leaderboard]["name"])
                            .replace(/{{problems}}/g, leaderboards[leaderboard]["problems"])
                            .replace(/{{highScore}}/g, leaderboards[leaderboard]["highscore"]);
    }

  return listHtml;
}