const fs = require('fs');
const qs = require('querystring');
const cookieHandler = require('../utils/cookieHandler');
const crypto = require('crypto');
const UserData = require('../models/userData');
const dbConnection  = require('../config/database'); 

const { processUserLogin } = require('../utils/processUserLogin');
const { processUserSignup } = require('../utils/processUserSignup.js')

function handleIndexRequest(req, res)
{
    const htmlPath = './views/';
    let filePath = htmlPath + 'index.html';
    // Check method type
    switch(req.method)
    {
        case "POST":
            // Check who sent the method
            const requestPage = req.headers.referer;
            const pageName = requestPage.substring(requestPage.lastIndexOf('/') + 1);
            switch(pageName)
            {
                case 'logIn':
                  processUserLogin(req, res, htmlPath, filePath);
                break;
                case 'signUp':
                  processUserSignup(req, res, htmlPath, filePath);
                break;
                default:
                  console.log('none!');
                break;
            }
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
                    // Get data from cookie so we can display the username
                    const rawCookie = cookieHandler.getRawCookie(req, 'sessionId=');
                    const userData = cookieHandler.sessions.get(rawCookie);
                    const username = userData.username;
                    modifiedHTML = data.toString().replace('user', username);
                    res.end(modifiedHTML);
                  }
                  else
                  {
                    res.writeHead(301, {'Location': '/logIn'});
                    res.end(data);
                  } 
              }
          });
      break;
    }
}

module.exports = {
    handleIndexRequest
}