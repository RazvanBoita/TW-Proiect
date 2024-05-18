const dbConnection = require('../config/postgresDB')
const QuestionData = require('../models/questionData');

class QuestionService{

    static async insertQuestion(title, difficulty, answer){
        let questionData = null;
        let counter = 0;
        try 
        {
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Question" (title, difficulty, answer, counter) VALUES ($1, $2, $3, $4) RETURNING id',
                values: [title, difficulty, answer, counter],
              };
            
            const result =  await dbConnection.query(insertQuery);
            const id = result.rows[0].id;
            questionData = new QuestionData(id, title, difficulty, answer, counter);
        }
         catch (error) {
            console.error('Error executing INSERT query for Question table:', error);
        }
        return questionData;
    }
    
    static async deleteByID(id){
        try {
            await dbConnection.query('DELETE FROM quiz_questions WHERE id = ?', [id]);
            console.log('Question removed successfully.');
        } catch (error) {
            console.error('Error removing question:', error.message);
        } finally {
            dbConnection.end();
        }
    }
}

module.exports = QuestionService