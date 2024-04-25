const dbConnection = require('../config/database');

async function removeAnswer(answerId) {
    try {
        await dbConnection.query('DELETE FROM quiz_answers WHERE idAnswer = ?', [answerId]);
        console.log('Answer removed successfully.');
    } catch (error) {
        console.error('Error removing answer:', error.message);
    } finally {
        dbConnection.end();
    }
}

//Example usage
// removeAnswer(3);

module.exports = removeAnswer