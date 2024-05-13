const dbConnection = require('../config/database');
const CategoryData = require('../models/categoryData');

class CategoryService{
    
    static async getCategory(type)
    {
        let categoryData = null;
        try{
            const query = 'SELECT id FROM Category WHERE type = ?';
            const result = await dbConnection.query(query, type);

            const categoryId = result[0][0].id;
            categoryData = new CategoryData(categoryId, type);
        }
        catch(error)
        {
            console.error('Error executing SELECT query for Category table:', error);
        }
        return categoryData;
    }
    static async getAllCategories() {
        try {
            const results = await dbConnection.query('SELECT type FROM Category');
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
        
        let categoriesList = result[0];
        let categoriesHTML='';
        categoriesList.forEach(element=>
        {
            categoriesHTML+=`<option value="${element.type}">${element.type}</option>`;
        });
        return categoriesHTML;
    }
}
module.exports = CategoryService;