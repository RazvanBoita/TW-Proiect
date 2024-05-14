const dbConnection = require('../config/database');
const { answers: answers } = require('./questionsSIanswers');

async function populateAnswers() {
    try {
        await dbConnection.query('DELETE FROM quiz_answers');

        const insertQuery = 'INSERT INTO quiz_answers (question_id, answer) VALUES (?, ?)';
        for (const answer of answers) {
            await dbConnection.query(insertQuery, [
                answer.questionId,
                answer.answer
            ]);
        }

        console.log('All answers inserted successfully.');
    } catch (error) {
        console.error('Error populating answers:', error.message);
    } finally {
        dbConnection.end();
    }
}

module.exports = populateAnswers;