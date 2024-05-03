const fs = require('fs');

function handleImportQuestionRequest(req, res)
{
    const cssPath = './js/';
    const filePath = cssPath + 'importQuestion.js';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(err);
            res.writeHead(500);
            res.end();
        } else {
            res.writeHead(200, { 'Content-Type': 'text/js' });
            res.end(data);
        }
    });
}

module.exports = {handleImportQuestionRequest}