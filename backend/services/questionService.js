const dbConnection = require('../config/postgresDB')
const QuestionData = require('../models/questionData');

class QuestionService{

    static async insertQuestion(title, difficulty, answer, description){
        let questionData = null;
        let counter = 0;
        try 
        {
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Question" (title, difficulty, answer, counter, description) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                values: [title, difficulty, answer, counter, description],
              };
            
            const result =  await dbConnection.query(insertQuery);
            const id = result.rows[0].id;
            questionData = new QuestionData(id, title, difficulty, answer, counter, description, 0);
        }
         catch (error) {
            console.error('Error executing INSERT query for Question table:', error);
        }
        return questionData;
    }
    static async getAllQuestions()
    {
        const results = await dbConnection.query('SELECT * FROM sql_tutoring."Question"');
        const rows = results.rows;
        const questions = rows.map(element => {
            return { id: element.id, title: element.title, difficulty: element.difficulty, rating: element.rating };
        });
        return questions;
        
    }
    static async getPageQuestions(pageIndex)
    {
        const maxQuestions = 10;
        try{
            const selectQuery = {
                text: 'SELECT * FROM sql_tutoring."Question" ORDER BY id LIMIT $1 OFFSET $2',
                values: [maxQuestions, pageIndex * maxQuestions],
            }

            const result =  await dbConnection.query(selectQuery);
            const rows = result.rows;
            const questions = rows.map(element => {
            return { id: element.id, title: element.title, difficulty: element.difficulty, rating: element.rating };
            });
            return questions;
        }
        catch(error){
            console.error('Error executing SELECT LIMIT query for Question table:', error);
        }
    }
    static async getQuestionsCounter()
    {
        try{
            const selectQuery = {
                text: 'SELECT COUNT(*) FROM sql_tutoring."Question"',
            }
            const result =  await dbConnection.query(selectQuery);

            return result.rows;
        }
        catch(error){
            console.error('Error executing SELECT LIMIT query for Question table:', error);
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