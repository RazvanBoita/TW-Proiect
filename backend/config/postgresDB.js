const { Client } = require('pg');
require('dotenv').config();
const fs = require('fs');

const caCert = fs.readFileSync('backend/config/certificat.pem')

const dbConnection = new Client({
    connectionString: process.env.POSTGRES_URL,
    ssl: {
        ca: caCert
    }
});

// Connect to the database
dbConnection.connect()
  .then(() => {
    console.log('Connected to aiven database');
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

module.exports = dbConnection;