const dbConnection = require('../config/database')

class QuizService{

    async insert(id, title, content, category){
        return QuizService.insertQuestion(id, title, content, category)
    }

    async delete(id){
        return QuizService.deleteByID(id)
    }

    static async insertQuestion(id, title, content, category){
        try {
            await dbConnection.query(
                'INSERT INTO quiz_questions (id, title, content, category) VALUES (?, ?, ?, ?)',
                [id, title, content, category]
            );
            console.log('Question inserted successfully:', title);
        } catch (error) {
            console.error('Error inserting question:', error.message);
        } finally{
            dbConnection.end()
        }
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

module.exports = new QuizService()