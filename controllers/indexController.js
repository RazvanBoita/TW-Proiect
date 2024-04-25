const fs = require('fs');
const url = require('url');
const qs = require('querystring');
const cookieHandler = require('../utils/cookieHandler');
const crypto = require('crypto');

const dbConnection  = require('../config/database'); 

function handleIndexRequest(req, res)
{
    const htmlPath = './views/';
    let filePath = htmlPath + 'index.html';

    switch(req.method)
    {
        case "POST":
            handleUserLogin(req, res).then((url)=>
            {
                filePath = htmlPath + url;
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.log(err);
                        res.writeHead(500);
                        res.end();
                    } else {
                        switch(url)
                        {
                            case 'logIn.html':
                              res.writeHead(301, {'Location': '/logIn'});
                              break;
                            default:
                              const sessionId = cookieHandler.generateSessionId();
                              res.setHeader('Set-Cookie', 'sessionId=' + sessionId + '; HttpOnly; Max-Age:86400'); //1 day cookie session
                              res.writeHead(200, {'Content-Type': 'text/html'});
                              break;
                        }
                        res.end(data);
                    }
                });      
            });
            break;
        case "GET":
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    console.log(err);
                    res.writeHead(500);
                    res.end();
                } else {
                    if(cookieHandler.checkSessionId(req))
                    {
                      res.writeHead(200, { 'Content-Type': 'text/html' });
                    }
                    else
                    {
                      res.writeHead(301, {'Location': '/logIn'});
                    } 
                    res.end(data);
                }
            });
            break;
    }
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
          const results = await dbConnection.query('SELECT email, password FROM users WHERE email = ?', formData.email);
          if (results[0].length === 0) {
            resolve('logIn.html');
          } else {
            const hashedPassword = crypto.createHash('sha256').update(formData.password).digest('hex');
            console.log(hashedPassword)
            if(hashedPassword !== results[0][0].password)
            {
                resolve('logIn.html');
            }
            else
                resolve('index.html');
          }
        } catch (error) {
          console.error('Error executing query:', error);
          resolve('logIn.html');
        }
      });
    });
  }

module.exports = {
    handleIndexRequest
}