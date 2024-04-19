const dbConnection = require('../config/database'); // assuming dbConnection.js is the file containing the database connection

async function printAllData() {
    try {
        const [users, userFields] = await dbConnection.query('SELECT * FROM users');
        console.log('Users:');
        console.table(users);
    } catch (error) {
        console.error('Error printing data:', error.message);
    }
}

// Example usage:
printAllData();