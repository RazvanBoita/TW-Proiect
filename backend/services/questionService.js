const dbConnection = require('../config/database')
const QuestionData = require('../models/questionData');

class QuestionService{

    static async insertQuestion(title, difficulty, answer){
        let questionData = null;
        let counter = 0;
        try 
        {
            const query = 'INSERT INTO sql_tutoring."Question" (title, difficulty, answer, counter) VALUES (?, ?, ?, ?)';
            const values = [title, difficulty, answer, counter];
            const result = await dbConnection.query(query, values);
            questionData = new QuestionData(result[0].insertId, title, difficulty, answer, counter);
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