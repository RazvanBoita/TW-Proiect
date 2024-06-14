const dbConnection = require('../config/postgresDB');
const QuestionCategoryData = require('../models/questionCategoryData');
const CategoryService = require('../services/categoryService')

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
    static async updateQuestionCategories(idQuestion, categoriesName)
    {   
        const rowCount = await this.deleteQuestionCategories(idQuestion);
        if(rowCount === 0)
            return 0;
        
        const categoriesId = [];
        const promises = categoriesName.map(async (category) => {
            const categoryData = await CategoryService.getCategory(category);
            categoriesId.push(categoryData.id);
        });
        let rowsCount = 0;
        Promise.all(promises)
        .then(async () => {
            const insertValues = categoriesId.map((id, i) => `($1, $${i + 2})`).join(', ');
            const insertQuery = `INSERT INTO sql_tutoring."Question_Category" (id_question, id_category) VALUES ${insertValues};`;
            const result = await dbConnection.query(insertQuery, [idQuestion, ...categoriesId]);
            rowsCount = result.rowCount;
        })
        .catch((error) => {
            console.error('Error fetching category data:', error);
            rowsCount = 0;
        })
        return rowCount;
    }
    static async deleteQuestionCategories(idQuestion)
    {
        try{
            const insertQuery = {
                text: 'DELETE FROM sql_tutoring."Question_Category" WHERE id_question = $1',
                values: [idQuestion],
            };

            const result = await dbConnection.query(insertQuery);
            
            return result.rowCount;
        }
        catch(error){
            console.error('Error executing DELETE query for sql_tutoring."Question_Category" table:', error);
        }
        return 0;
    }
}
module.exports = QuestionCategoryService;