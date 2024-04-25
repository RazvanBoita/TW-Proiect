const dbConnection = require('../config/database');

async function insertAnswer(questionId, answer) {
    try {
        await dbConnection.query(
            'INSERT INTO quiz_answers (question_id, answer) VALUES (?, ?)',
            [questionId, answer]
        );
        console.log('Answer inserted successfully.');
    } catch (error) {
        console.error('Error inserting answer:', error.message);
    } finally {
        dbConnection.end();
    }
}

module.exports = insertAnswer
// Example usage:
// insertAnswer(1, "Salutareee oameni ");
