const fs = require('fs');
const qs = require('querystring');
const cookieHandler = require('../utils/cookieHandler');
const crypto = require('crypto');
const UserData = require('../models/userData');
const dbConnection  = require('../config/database'); 


function processUserSignup(req, res, htmlPath, filePath)
{
    handleUserSignup(req, res)
    .then((userData) => {
        filePath = htmlPath + 'index.html';
        // Generate the cookie and add it in the map
        const sessionId = cookieHandler.generateSessionId();
        cookieHandler.sessions.set(sessionId, userData);
        res.setHeader('Set-Cookie', 'sessionId=' + sessionId + '; HttpOnly; Max-Age:86400'); //1 day cookie session
        res.writeHead(200, {'Content-Type': 'text/html'});

        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.log(err);
                res.writeHead(500);
                res.end();
            } else 
              {
                const username = `${userData.username}`;
                modifiedHTML = data.toString().replace('user', username);
                
                if(userData.isAdmin === 1)
                {
                    const createQueryButton = '<div class="navigation-button-div"><a class="navigation-button" href="createSqlQuery">Create Query</a></div>';
                    modifiedHTML = modifiedHTML.replace('<!--CREATE SQL QUERY-->', createQueryButton);
                }
                res.end(modifiedHTML);
              }
        });
    })     
    .catch((url) => {
        console.log('Catch', url);
        filePath = htmlPath + url;
        res.writeHead(302, {'Location': '/signUp'});
        res.end();
    });
}

function handleUserSignup(req, res) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try 
        {
            const selectResult = await dbConnection.query('SELECT * FROM User WHERE email = ?', formData.email);
            if (selectResult[0].length !== 0) {
                // User already exists!
                console.log('User already exists!');
                reject('signUp.html');
            } 
            else 
            {
                const hashedPassword = crypto.createHash('sha256').update(formData.password).digest('hex');
                const query = 'INSERT INTO User (email, name, password, isAdmin) VALUES (?, ?, ?, ?)';
                const values = [formData.email, formData.name, hashedPassword, 0];
                await dbConnection.query(query, values)
                .then(([result]) => {
                    let userData = new UserData(result.insertId, formData.name, formData.email, 0);
                    console.log('Insert successful!');
                    resolve(userData);
                })
                .catch((error)=>{
                    console.log('Insert failure! ' + error);
                    reject('signUp.html');
                });
            }  
        } catch (error) {
          console.error('Error executing query:', error);
          reject('signUp.html');
        }
      });
    });
}

module.exports = {processUserSignup};