const fs = require('fs');

const cookieHandler = require('../utils/cookieHandler');
const {displayPage} = require('../utils/createSqlQueryUtils/displayCreateSqlQueryPage');
const {processCreateSqlQuery} = require('../utils/createSqlQueryUtils/processCreateSqlQuery')

function handleSqlQueryRequest(req, res)
{
    let filePath = './views/createSqlQuery.html';
    switch(req.method)
    {
        case "GET":
            if(cookieHandler.isUserAdmin(req))
                displayPage(req, res, filePath);     
            else
                redirectUserToMenu(req, res);

        break;
        case "POST":
            processCreateSqlQuery(req, res, filePath);
        break;

    }
}
function redirectUserToMenu(req, res)
{
    let filePath = './views/index.html';
    fs.readFile(filePath, (err, data) => {
        res.writeHead(302, { 'Location': '/' });
        res.end(data);
    });
}
module.exports = {handleSqlQueryRequest}