const fs = require('fs');
const url = require('url');
const qs = require('querystring');

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
                        res.writeHead(200, { 'Content-Type': 'text/html' });
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
                    res.writeHead(200, { 'Content-Type': 'text/html' });
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
          //de schimbat cu prisma
          const results = await dbConnection.query('SELECT email, password FROM users WHERE email = ?', formData.email);
          if (results[0].length === 0) {
            resolve('logIn.html');
          } else {
            if(results[0][0].password !== formData.password)
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