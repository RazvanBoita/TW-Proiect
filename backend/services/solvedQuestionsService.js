const dbConnection = require('../config/postgresDB');
const LeaderboardService = require('./leaderboardService');

class SolvedQuestionsService{
    static async addQuestion(idQuestion, idUser, date)
    {
        const isSolved = await SolvedQuestionsService.isQuestionSolved(idQuestion, idUser);
        if(isSolved)
        {
            console.log("Question already solved!");
            return;
        }
        try{
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Solved_Questions" (id_question, id_user, date) VALUES ($1, $2, $3)',
                values: [idQuestion, idUser, date],
            }
            const result = await dbConnection.query(insertQuery);
            // Update the user solved questions counter from leaderboard table
            LeaderboardService.updateUserSolvedQuestions(idUser);

        }
        catch(error){
            console.log("Error at inserting into Solved_Questions table: " + error);
        }
    }
    static async getQuestionsSolvedByUserCounter(idUser, difficulty)
    {
        let queryText = '';
        let parameters = [];

        // Difficulty was specified, take into consideration
        if(difficulty)
        {
            queryText = 'SELECT COUNT(*) FROM sql_tutoring."Solved_Questions" sq JOIN sql_tutoring."Question" q ON sq.id_question = q.id WHERE sq.id_user = $1 AND q.difficulty LIKE $2';
            parameters = [idUser, difficulty];
        }
        else{
            queryText = 'SELECT COUNT(*) FROM sql_tutoring."Solved_Questions" WHERE id_user = $1';
            parameters = [idUser];
        }
        try{
            const selectQuery = {
                text: queryText,
                values: parameters,
            }
            const result = await dbConnection.query(selectQuery);
            return result.rows[0].count;
        }
        catch(error){
            console.log("Error at checking if question is solved in Solved_Questions table: " + error);
        }    
        return 0;
    }
    static async getQuestionsSolvedByUserData(idUser, pageIndex)
    {
        const maxQuestionsPerPage =5;
        const currentPage = maxQuestionsPerPage * pageIndex;
        try{
            const selectQuery = {
                text: 'SELECT q.id, q.title, q.difficulty, sq.date from sql_tutoring."Solved_Questions" sq JOIN sql_tutoring."Question" q ON sq.id_question = q.id WHERE sq.id_user = $1 ORDER BY sq.date DESC LIMIT $2 OFFSET $3;',
                values: [idUser, maxQuestionsPerPage, currentPage],
            }
            const result = await dbConnection.query(selectQuery);
            return result.rows;
        }
        catch(error){
            console.log("Error at checking if question is solved in Solved_Questions table: " + error);
        }    
        return null;
    }
    static async isQuestionSolved(idQuestion, idUser)
    {
        try{
            const selectQuery = {
                text: 'SELECT COUNT(*) FROM sql_tutoring."Solved_Questions" WHERE id_question = $1 and id_user = $2',
                values: [idQuestion, idUser],
            }
            const result = await dbConnection.query(selectQuery);
            return result.rows[0].count !== '0';
        }
        catch(error){
            console.log("Error at checking if question is solved in Solved_Questions table: " + error);
        }    
        return false;
    }
}

module.exports = SolvedQuestionsService;