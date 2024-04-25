const fs = require('fs');
function handleLoginRequest(req, res) {
    switch(req.url) {
      case '/logIn':
        renderLogInHTML(res, req);
        break;
      case '/css/logIn.css':
        renderLogInCSS(res);
        break;
      default:
        res.statusCode = 404;
        res.end();
        break;
    }
}

function renderLogInHTML(res, req)
{
    const htmlPath = './views/';
    const filePath = htmlPath + 'logIn.html';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            
            //we check the req headers to see if we redirected the user to login (when the login failed)
            const wasRedirected = req.headers.referer && req.headers.referer.endsWith('/logIn');
            let modifiedHTML = data.toString();
            if(wasRedirected)
            {
                const errorMessage = '<p id="log-in-error">Email or password invalid!</p>';
                modifiedHTML = data.toString().replace('<!-- ERROR_MESSAGE -->', errorMessage);
            }

            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedHTML);
        }
    });
}
function renderLogInCSS(res)
{
    const cssPath = './css/';
    const filePath = cssPath + 'logIn.css';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(data);
        }
    });
}

module.exports={
    handleLoginRequest
}