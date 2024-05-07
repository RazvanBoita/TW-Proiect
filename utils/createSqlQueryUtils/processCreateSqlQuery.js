const fs = require('fs');
const qs = require('querystring');
const cookieHandler = require('../utils/cookieHandler');
const crypto = require('crypto');
const UserData = require('../models/userData');
const dbConnection  = require('../config/database'); 

function processCreateSqlQuery(req, res)
{

}
function handleCreateSqlQuery(req, res) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try 
        {
            const query = 'INSERT INTO Question (title, difficulty, answer, counter) VALUES (?, ?, ?, ?)';
            const values = [formData.quizz-question, formData.difficulty, formData.answer-area, 0];
            await dbConnection.query(query, values)
            .then(([result]) => {
                console.log('Insert successful!');
                resolve(result);
            })
            .catch((error)=>{
                console.log('Insert failure! ' + error);
                reject('index.html');
            });
            
        } catch (error) {
          console.error('Error executing query:', error);
          reject('index.html');
        }
      });
    });
}
module.exports = {processCreateSqlQuery}