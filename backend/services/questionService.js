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
    static async getPageQuestions(pageIndex, difficulty, categoryId)
    {
        const maxQuestions = 10;
        let queryText = 'SELECT q.* FROM sql_tutoring."Question" q ';
        let params = [];
        let index = 1;
        if(categoryId !== '')
        {
            queryText+=`JOIN sql_tutoring."Question_Category" qc ON q.id = qc.id_question JOIN sql_tutoring."Category" c ON qc.id_category = c.id AND c.id = $${index} `;
            params.push(categoryId);
            index++;
        }

        queryText+=`WHERE q.difficulty LIKE $${index} ORDER BY q.id LIMIT $${index + 1} OFFSET $${index + 2}`;
        params.push(difficulty);
        params.push(maxQuestions);
        params.push(pageIndex * maxQuestions);
        try{
            const selectQuery = {
                text: queryText,
                values: params,
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
    static async getQuestionsCounter(difficulty, categoryId)
    {
        let queryText = 'SELECT COUNT(*) FROM sql_tutoring."Question" q ';
        let params = [];
        let index = 1;
        if(categoryId !== '')
        {
            queryText+=`JOIN sql_tutoring."Question_Category" qc ON q.id = qc.id_question JOIN sql_tutoring."Category" c ON qc.id_category = c.id AND c.id = $${index} `;
            params.push(categoryId);
            index++;
        }

        queryText+=`WHERE q.difficulty like $${index}`;
        params.push(difficulty);
        try{
            const selectQuery = {
                text: queryText,
                values: params,
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