const dbConnection = require('../config/database')

async function insertQuestion(id, title, content, category) {
    try {
        await dbConnection.query(
            'INSERT INTO quiz_questions (id, title, content, category) VALUES (?, ?, ?, ?)',
            [id, title, content, category]
        );
        console.log('Question inserted successfully:', title);
    } catch (error) {
        console.error('Error inserting question:', error.message);
    } finally {
        dbConnection.end();
    }
}

// Example usage:
// insertQuestion(1, 'Question 1', 'Ce faci?', 'Bine');

module.exports = insertQuestion