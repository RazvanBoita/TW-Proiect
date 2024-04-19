const dbConnection = require('../config/database')
const {questions: questions} = require('./questionsSIanswers')



async function populateQuestions() {
    try {
        await dbConnection.query('DELETE FROM quiz_questions');

        const insertQuery = 'INSERT INTO quiz_questions (id, title, content, category, difficulty, hint) VALUES (?, ?, ?, ?, ?, ?)';
        for (const question of questions) {
            await dbConnection.query(insertQuery, [
                question.id,
                question.title,
                question.content,
                question.category,
                question.difficulty,
                question.hint
            ]);
        }

        console.log('All questions inserted successfully.');
    } catch (error) {
        console.error('Error populating questions:', error.message);
    }
}

module.exports = populateQuestions

// populateQuestions();
