const dbConnection = require('../config/postgresDB')
const QuestionData = require('../models/questionData');

class QuestionService{

    static async insertQuestion(title, difficulty, answer){
        let questionData = null;
        let counter = 0;
        try 
        {
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Question" (title, difficulty, answer, counter) VALUES ($1, $2, $3, $4) RETURNING id',
                values: [title, difficulty, answer, counter],
              };
            
            const result =  await dbConnection.query(insertQuery);
            const id = result.rows[0].id;
            questionData = new QuestionData(id, title, difficulty, answer, counter);
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

    static async fetchQuestion(){
        // fetch it from somewhere
        const tableDescription = "\n TABLE students\n\t\tid INTEGER PRIMARY KEY,\n\tfirstName VARCHAR(30) NOT NULL,\n\tlastName VARCHAR(30) NOT NULL"
        const formattedDescription = tableDescription.replace(/\t/, "    ")
        const data = {
            currentQuestion: 1,
            questionContent: "Given the following data definition, write a query that returns the number of students whose first name is John.",
            tableDescription: formattedDescription
        }
        return data
    }

    static async serveQuestion(){
        //data should be imported by another service
        const data = QuestionService.fetchQuestion()
        return data
    }
}

module.exports = QuestionService