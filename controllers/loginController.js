const fs = require('fs');
function handleLoginRequest(req, res) {
    switch(req.url) {
      case '/logIn':
        renderLogInHTML(res);
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

function renderLogInHTML(res)
{
    const htmlPath = './views/';
    const filePath = htmlPath + 'logIn.html';

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