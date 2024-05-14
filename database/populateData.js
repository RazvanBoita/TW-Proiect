const populateQuestions = require('./backend/utils/populateQuestions');
const populateAnswers = require('./backend/utils/populateAnswers');
const dbConnection = require('./config/database')

async function deleteAllAnswers() {
    try {
        await dbConnection.query('DELETE FROM quiz_answers');
    } catch (error) {
        console.error('Error deleting answers:', error.message);
        throw error;
    }
}


async function populateData() {
//         TO DO: Update the methods so it matches with the new tables
//    try {
//         await deleteAllAnswers()

//         console.log('Populating questions...');
//         await populateQuestions();

//         console.log('Populating answers...');
//         await populateAnswers();

//        console.log('Data population complete.');
//    } catch (error) {
//        console.error('Error populating data:', error.message);
//    }
}

populateData();