const fs = require('fs');

function handleSignUpRequest(req, res) {
    switch(req.url) {
      case '/signUp':
        renderSignUpHTML(res);
        break;
      default:
        res.statusCode = 404;
        res.end();
        break;
    }
}
function renderSignUpHTML(res)
{
    const htmlPath = './views/';
    const filePath = htmlPath + 'signUp.html';

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

module.exports = {
    handleSignUpRequest
}