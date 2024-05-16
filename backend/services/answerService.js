const dbConnection = require('../config/database')

class AnswerService{
    async insert(id, answer){
        return AnswerService.insertAnswer(id, answer)
    }

    async delete(id){
        return AnswerService.deleteByID(id)
    }

    async exists(id){
        return await AnswerService.existsByID(id)
    }

    //Aici cand fac un insert am grija mai intai sa verific cu functia exists() daca exista deja un raspuns
    static async insertAnswer(id, answer){
        try {
            await dbConnection.query(
                'INSERT INTO quiz_answers (question_id, answer) VALUES (?, ?)',
                [id, answer]
            );
            console.log('Answer inserted successfully.');
        } catch (error) {
            console.error('Error inserting answer:', error.message);
        } finally {
            dbConnection.end();
        }
    }

    static async deleteByID(id){
        try {
            await dbConnection.query('DELETE FROM quiz_answers WHERE question_id = ?', [id]);
            console.log('Answer removed successfully.');
        } catch (error) {
            console.error('Error removing answer:', error.message);
        } finally {
            dbConnection.end();
        }
    }

    static async existsByID(id){
        try {
            const [rows] = await dbConnection.query(
                'SELECT * FROM quiz_answers WHERE question_id = ? LIMIT 1',
                [id]
            );
            return rows.length > 0;
        } catch (error) {
            console.error('Error checking existing answer:', error.message);
            return false;
        } finally{
            dbConnection.end()
        }
    }
}

module.exports = new AnswerService()