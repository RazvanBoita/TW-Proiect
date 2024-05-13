const { createConnection } = require('mysql2');
const dotenv = require('dotenv').config();

const dbConnection = createConnection({
    host:process.env.DATABASE_ENDPOINT,
    port:process.env.DATABASE_PORT,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_SCHEMA,
})

dbConnection.connect(function(err){
    if(err)
        throw err;
    console.log("Connection successful!");
})

module.exports = dbConnection.promise();