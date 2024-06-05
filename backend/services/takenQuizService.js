const dbConnection = require('../config/postgresDB');

class TakenQuizService{
    static async insert(userId, score, start_date, end_date) {
        try {
            const query = {
                text: 'INSERT INTO sql_tutoring."taken_quizzes" (User_id, Score, Start_date, End_date) VALUES ($1, $2, $3, $4) RETURNING id',
                values: [userId, score, start_date, end_date],
            };
    
            const result = await dbConnection.query(query);
            if (result.rows.length > 0) {
                const insertedId = result.rows[0].id;
                return insertedId;
            } else {
                console.error('Failed to insert into Taken_quizzes table.');
            }
        } catch (error) {
            console.error('Error inserting into Taken_quizzes table:', error.message);
        }
    }
    static async getHighestScore(userId)
    {
        try {
            const query = {
                text: 'SELECT MAX(score) from sql_tutoring."taken_quizzes" WHERE user_id = $1',
                values: [userId],
            };
    
            const result = await dbConnection.query(query);
            if(result.rows[0].max === null)
                return 0;
            
            return result.rows[0].max;
        } catch (error) {
            console.error('Error inserting into Taken_quizzes table:', error.message);
        }
    }
}


module.exports = TakenQuizService