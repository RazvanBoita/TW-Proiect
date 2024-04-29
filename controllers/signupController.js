const fs = require('fs');

function handleSignUpRequest(req, res) {
    switch(req.url) {
      case '/signUp':
        renderSignUpHTML(req, res);
        break;
      default:
        res.statusCode = 404;
        res.end();
        break;
    }
}
function renderSignUpHTML(req, res)
{
    const htmlPath = './views/';
    const filePath = htmlPath + 'signUp.html';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            const wasRedirected = req.headers.referer && req.headers.referer.endsWith('/signUp');
            let modifiedHTML = data.toString();
            if(wasRedirected)
            {
                const errorMessage = '<p id="account-exists-error">An account with this email already exists!</p>';
                modifiedHTML = data.toString().replace('<!-- ERROR_MESSAGE -->', errorMessage);
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(modifiedHTML);
        }
    });
}

module.exports = {
    handleSignUpRequest
}