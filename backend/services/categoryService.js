const dbConnection = require('../config/postgresDB');
const CategoryData = require('../models/categoryData');

class CategoryService{
    
    static async getCategory(type)
    {
        let categoryData = null;
        try{
            const query = 'SELECT id FROM sql_tutoring."Category" WHERE type = ?';
            const result = await dbConnection.query(query, type);

            const categoryId = result[0][0].id;
            categoryData = new CategoryData(categoryId, type);
        }
        catch(error)
        {
            console.error('Error executing SELECT query for sql_tutoring."Category" table:', error);
        }
        return categoryData;
    }
    static async getAllCategories() {
        try {
            const results = await dbConnection.query('SELECT type FROM sql_tutoring."Category"');
            return results;
        } 
        catch (error) {
            throw error;
        }
    }
    static async getCategoriesAsHTML()
    {
        const result = await CategoryService.getAllCategories();
        if(result === null)
            return null;
        
        let categoriesList = result.rows;
        let categoriesHTML = categoriesList.map(element => {
            return { type: element.type };
        });
        return categoriesHTML;
    }
}
module.exports = CategoryService;