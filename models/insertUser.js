const dbConnection = require('../config/database');

async function insertUser(email, name, password, isAdmin) {
    try {
        const result = await dbConnection.query(
            'INSERT INTO users (email, name, password, isAdmin) VALUES (?, ?, ?, ?)',
            [email, name, password, isAdmin]
        );
        console.log('User inserted successfully:');
    } catch (error) {
        console.error('Error inserting user:', error.message);
    }
}

// Example usage:
// insertUser('example@example.com', 'John Doe', 'password123', false);

module.exports = insertUser