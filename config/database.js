const { createConnection } = require('mysql2');

const dbConnection = createConnection({
    host:"localhost",
    user:"alter_root",
    password:"1234",
    database:"sql_tutoring"
})

dbConnection.connect(function(err){
    if(err)
        throw err;
    console.log("Connection successful!");
})

module.exports = dbConnection.promise();