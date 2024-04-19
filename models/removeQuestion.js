const dbConnection = require('../config/database')

async function removeQuestion(id) {
    try {
        await dbConnection.query('DELETE FROM quiz_questions WHERE id = ?', [id]);
        console.log('Question removed successfully.');
    } catch (error) {
        console.error('Error removing question:', error.message);
    } finally {
        dbConnection.end();
    }
}


//Example usage
// removeQuestion(1)

module.exports = removeQuestion