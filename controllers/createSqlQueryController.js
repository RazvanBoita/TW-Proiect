const fs = require('fs');
const cookieHandler = require('../utils/cookieHandler');
function handleSqlQueryRequest(req, res)
{
    switch(req.method)
    {
        case "GET":
            let filePath = './views/createSqlQuery.html';
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

module.exports = {handleSqlQueryRequest}