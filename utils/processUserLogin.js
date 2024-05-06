const fs = require('fs');
const qs = require('querystring');
const cookieHandler = require('../utils/cookieHandler');
const crypto = require('crypto');
const UserData = require('../models/userData');
const dbConnection  = require('../config/database'); 


function processUserLogin(req, res, htmlPath, filePath)
{
    handleUserLogin(req, res)
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
                res.end(modifiedHTML);
              }
        });
    })     
    .catch((url) => {
        console.log('Catch', url);
        filePath = htmlPath + url;
        res.writeHead(302, {'Location': '/logIn'});
        res.end();
    });
}

function handleUserLogin(req, res) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', async () => {
        let formData = qs.parse(body);
        
        try {
          const results = await dbConnection.query('SELECT * FROM User WHERE email = ?', formData.email);
          if (results[0].length === 0) {
            reject('logIn.html');
          } else {
            const hashedPassword = crypto.createHash('sha256').update(formData.password).digest('hex');
            if(hashedPassword !== results[0][0].password)
            {
              reject('logIn.html');
            }
            else
            {
              let userData = new UserData(results[0][0].idUser, results[0][0].name, results[0][0].email);
              resolve(userData);
            }
          }
        } catch (error) {
          console.error('Error executing query:', error);
          reject('logIn.html');
        }
      });
    });
}

module.exports = {processUserLogin};