const dbConnection = require('../config/database')

class UserService{
    async add(email, name, password, isAdmin){
        return UserService.addUser(email, name, password, isAdmin)
    }

    static async addUser(email, name, password, isAdmin){
        try {
            await dbConnection.query(
                'INSERT INTO User (email, name, password, isAdmin) VALUES (?, ?, ?, ?)',
                [email, name, password, isAdmin]
            );
            console.log('User inserted successfully:');
        } catch (error) {
            console.error('Error inserting user:', error.message);
        }
    }
    static async getUser(email)
    {
        try {
            const result = await dbConnection.query(
                'SELECT * FROM User WHERE email = ?', email
            );
            return result;

        } catch (error) {
            console.error('Error selecting user:', error.message);
        }

        return null;
    }
}

module.exports = UserService;