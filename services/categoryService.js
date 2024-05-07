const dbConnection = require('../config/database');

class CategoryService{
    
    async getAllCategories() {
        try {
            const results = await dbConnection.query('SELECT type FROM Category');
            return results;
        } catch (error) {
            throw error;
        }
    }
}
module.exports = CategoryService;