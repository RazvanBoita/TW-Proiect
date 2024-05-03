const fs = require('fs');

function handleImportQuizzRequest(req, res)
{

    const cssPath = './views/';
    const filePath = cssPath + 'importQuizz.html';

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

module.exports = {handleImportQuizzRequest};