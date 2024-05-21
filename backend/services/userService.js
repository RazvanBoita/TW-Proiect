const dbConnection = require('../config/postgresDB')

class UserService{
    async add(email, name, password){
        return UserService.addUser(email, name, password)
    }

    static async addUser(email, name, password){
        const insertQuery = {
            text: 'INSERT INTO sql_tutoring."User" (email, name, password, "isAdmin", "verifiedEmail") VALUES ($1, $2, $3, $4, $5)',
            values: [email, name, password, 0, 0],
          };
        try {
            await dbConnection.query(insertQuery);
            console.log('User inserted successfully:');
        } catch (error) {
            console.error('Error inserting user:', error.message);
        }
    }

    static async getUser(email)
    {
        const selectQuery = {
            text: 'SELECT * FROM sql_tutoring."User" WHERE email = $1',
            values: [email],
          };
        try {
            const result = await dbConnection.query(selectQuery);
            return result.rows;

        } catch (error) {
            console.error('Error selecting user:', error.message);
        }

        return null;
    }

    static async verifyUser(email) {
        const updateQuery = {
            text: 'UPDATE sql_tutoring."User" SET "verifiedEmail" = 1 WHERE email = $1',
            values: [email],
        };
    
        try {
            await dbConnection.query(updateQuery);
            console.log('User verified successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error verifying user:', error.message);
            return { success: false, error: error.message };
        }
    }

    static async deleteUser(email){
        const deleteQuery = {
            text: 'DELETE FROM sql_tutoring."User" WHERE email = $1',
            values: [email],
        };
    
        try {
            await dbConnection.query(deleteQuery);
            console.log('User deleted successfully.');
            return { success: true };
        } catch (error) {
            console.error('Error deleting user:', error.message);
            return { success: false, error: error.message };
        }    
    }
}

module.exports = UserService;