const http = require('http');
const cookieHandler = require('./utils/cookieHandler');

const { handleUnauthentificatedRequests } = require('./utils/handleUnauthentificatedRequests');
const { handleAuthentificatedRequests } = require('./utils/handleAuthentificatedRequests');

const server = http.createServer((req, res) =>{
    console.log(req.url);
     // This function will handle requests that do not need authentification session!
    if(handleUnauthentificatedRequests(req, res))
    {
        return;
    }
    // Verify if the cookie is valid
    if(!cookieHandler.checkSessionId(req))
    {
        // Cookie is not valid, redirect to login page
        res.writeHead(301, {'Location': '/logIn'});
        res.end();
        return;  
    }

    // This function will handle requests that need the user to be logged in
    handleAuthentificatedRequests(req, res);

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log('Server running on port ' + PORT));