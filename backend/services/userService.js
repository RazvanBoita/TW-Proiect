const dbConnection = require('../config/postgresDB')

class UserService{
    async add(email, name, password, isAdmin){
        return UserService.addUser(email, name, password, isAdmin)
    }

    static async addUser(email, name, password, isAdmin){
        const insertQuery = {
            text: 'INSERT INTO sql_tutoring."User" (email, name, password, isAdmin) VALUES ($1, $2, $3, $4)',
            values: [email, name, password, isAdmin],
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
}

module.exports = UserService;