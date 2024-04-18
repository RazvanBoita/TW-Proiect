const http = require('http');
const { handleLoginRequest } = require('./controllers/loginController');
const { handleVarsRequest } = require('./controllers/varsController');
const { handleBackgroundImageRequest } = require('./controllers/backgroundImageController');
const { handleSignUpRequest } = require('./controllers/signupController');
const { handleIndexRequest } = require('./controllers/indexController');
const { handleMenuRequest } = require('./controllers/menuController');

const server = http.createServer((req, res) =>{
    switch(true) {
        case req.url === '/css/vars.css':
            handleVarsRequest(req, res);
            break;
        case req.url === '/img/first.png':
            handleBackgroundImageRequest(req, res);
            break;
        case req.url === '/css/menu.css':
            handleMenuRequest(req, res);
            break;
        case req.url.includes('/logIn'):
            handleLoginRequest(req, res);
            break;
        case req.url === '/signUp':
            handleSignUpRequest(req, res);
            break;
        case req.url === '/':
            handleIndexRequest(req, res);
            break;
        default:
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end('<h1>404 Not Found</h1>');
            break;
      }

});

const PORT = process.env.PORT || 5000;
server.listen(PORT, ()=>console.log('Server running on port ' + PORT));