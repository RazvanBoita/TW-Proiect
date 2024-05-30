const dbConnection = require('../config/postgresDB')

async function terminate(){
    await dbConnection.query('ROLLBACK')
}

terminate()