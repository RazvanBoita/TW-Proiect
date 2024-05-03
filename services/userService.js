const dbConnection = require('../config/database')

class UserService{
    async add(email, name, password, isAdmin){
        return UserService.addUser(email, name, password, isAdmin)
    }

    static async addUser(email, name, password, isAdmin){
        try {
            await dbConnection.query(
                'INSERT INTO users (email, name, password, isAdmin) VALUES (?, ?, ?, ?)',
                [email, name, password, isAdmin]
            );
            console.log('User inserted successfully:');
        } catch (error) {
            console.error('Error inserting user:', error.message);
        } finally{
            dbConnection.end()
        }
    }
}

module.exports = new UserService()