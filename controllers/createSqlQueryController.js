const fs = require('fs');

const {displayPage} = require('../utils/createSqlQueryUtils/displayCreateSqlQueryPage');
const {processCreateSqlQuery} = require('../utils/createSqlQueryUtils/processCreateSqlQuery')

function handleSqlQueryRequest(req, res)
{
    let filePath = './views/createSqlQuery.html';
    switch(req.method)
    {
        case "GET":
            displayPage(req, res, filePath);           
        break;
        case "POST":
            processCreateSqlQuery(req, res);
        break;

    }
}

module.exports = {handleSqlQueryRequest}