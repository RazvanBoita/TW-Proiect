const dbConnection = require('../config/postgresDB')

class LeaderboardService{
    static async updateUserSolvedQuestions(userId)
    {
        // Check if user exists in the leaderboard
        const isUserInLeaderboard = await this.isUserInLeaderboard(userId);
        if(!isUserInLeaderboard)
        {
            this.insertUser(userId);
            return;
        }

        // User exists, update it
        try{
            const updateQuery = {
                text: 'UPDATE sql_tutoring."Leaderboard" SET solved_questions = solved_questions + 1 WHERE id_user = $1',
                values: [userId],
            }
            const result = await dbConnection.query(updateQuery);

        }
        catch(error){
            console.log("Error at selecting Leaderboard table: " + error);
        }
        
    }
    static async isUserInLeaderboard(userId)
    {
        try{
            const selectQuery = {
                text: 'SELECT COUNT(*) FROM sql_tutoring."Leaderboard" WHERE id_user = $1',
                values: [userId],
            }
            const result = await dbConnection.query(selectQuery);
            return parseInt(result.rows[0].count) !== 0;

        }
        catch(error){
            console.log("Error at selecting Leaderboard table: " + error);
        }
    }
    static async insertUser(userId)
    {
        try{
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Leaderboard" (id_user, solved_questions) VALUES ($1, $2);',
                values: [userId, 1],
            }
            const result = await dbConnection.query(insertQuery);

        }
        catch(error){
            console.log("Error at selecting Leaderboard table: " + error);
        }
    }
    static async getUserRank(userId)
    {
        try{
            const selectQuery = {
                text: 'SELECT id_user rank FROM (SELECT id_user, RANK() OVER (ORDER BY solved_questions DESC) AS rank FROM sql_tutoring."Leaderboard" ) ranked_users WHERE id_user = $1',
                values: [userId],
            }
            const result = await dbConnection.query(selectQuery);
            return result.rows[0].rank;

        }
        catch(error){
            console.log("Error at selecting Leaderboard table: " + error);
        }
    }
    static async getTopUsers(userId, limit)
    {
        try{
            const selectQuery = {
                text: 'SELECT u.name, l.solved_questions as problems, (SELECT MAX(score) FROM sql_tutoring."taken_quizzes" WHERE user_id = u.id) as highScore FROM sql_tutoring."Leaderboard" l JOIN sql_tutoring."User" u ON l.id_user = u.id ORDER BY problems DESC, highScore DESC LIMIT $1',
                values: [limit],
            }
            const result = await dbConnection.query(selectQuery);
            return result.rows;

        }
        catch(error){
            console.log("Error at selecting Leaderboard table: " + error);
        }
    }
   
}

module.exports = LeaderboardService;