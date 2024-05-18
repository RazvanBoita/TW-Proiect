const dbConnection = require('../config/postgresDB');
const QuestionCategoryData = require('../models/questionCategoryData');

class QuestionCategoryService{

    static async insertQuestionCategory(idQuestion, idCategory){
        let questionCategoryData = null;
        try{
            const insertQuery = {
                text: 'INSERT INTO sql_tutoring."Question_Category" (id_question, id_category) VALUES ($1, $2) RETURNING id',
                values: [idQuestion, idCategory],
            };

            const result = await dbConnection.query(insertQuery);
            const id = result.rows[0].id;
            questionCategoryData = new QuestionCategoryData(id, idQuestion , idCategory);
        }
        catch(error){
            console.error('Error executing INSERT query for sql_tutoring."Question_Category" table:', error);
        }
        return questionCategoryData;
    }
}
module.exports = QuestionCategoryService;