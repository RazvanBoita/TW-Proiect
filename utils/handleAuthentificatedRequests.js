const { handleSqlQueryRequest } = require('../controllers/createSqlQueryController');
const { handleSqlQueryCSSRequest } = require('../controllers/createSqlQueryCSSController');
const { handleImportQuestionRequest } = require('../controllers/importQuestionController');
const { handleImportQuizzRequest } = require('../controllers/importQuizzController');

function handleAuthentificatedRequests(req, res) {
    switch (true) {
        // Create SQL Requests
        case req.url === '/createSqlQuery':
            handleSqlQueryRequest(req, res);
            break;
        case req.url === '/css/createQuery.css':
            handleSqlQueryCSSRequest(req, res);
            break;
        case req.url === '/js/importQuestion.js':
            handleImportQuestionRequest(req, res);
            break;
        case req.url === '/importQuizz':
            handleImportQuizzRequest(req, res);
            break;
        // Page not found!
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            break;
    }
}

module.exports = {handleAuthentificatedRequests}