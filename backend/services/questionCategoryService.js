const dbConnection = require('../config/database');
const QuestionCategoryData = require('../models/questionCategoryData');

class QuestionCategoryService{

    static async insertQuestionCategory(idQuestion, idCategory){
        let questionCategoryData = null;

        const query = 'INSERT INTO Question_Category (idQuestion, idCategory) VALUES (?, ?)';
        const values = [idQuestion, idCategory]; 
        try{
            const result = await dbConnection.query(query, values);
            const id = result[0].insertId;
            questionCategoryData = new QuestionCategoryData(id, idQuestion , idCategory);
        }
        catch(error){
            console.error('Error executing INSERT query for Question_Category table:', error);
        }
        return questionCategoryData;
    }
}
module.exports = QuestionCategoryService;