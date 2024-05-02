const { handleLoginRequest } = require('../controllers/loginController');
const { handleVarsRequest } = require('../controllers/varsController');
const { handleBackgroundImageRequest } = require('../controllers/backgroundImageController');
const { handleSignUpRequest } = require('../controllers/signupController');
const { handleIndexRequest } = require('../controllers/indexController');
const { handleMenuRequest } = require('../controllers/menuController');

function handleUnauthentificatedRequests(req, res) {
   
    // If we found a request, exit the function(use return, not break in the first switch)
    switch (true) {
        // Global Requests
        case req.url === '/css/vars.css':
            handleVarsRequest(req, res);
            return true;
        case req.url === '/img/first.png':
            handleBackgroundImageRequest(req, res);
            return true;
        case req.url === '/css/menu.css':
            handleMenuRequest(req, res);
            return true;
        // Login Requests
        case req.url.includes('/logIn'):
            handleLoginRequest(req, res);
            return true;
        // Sign up Requests
        case req.url === '/signUp':
            handleSignUpRequest(req, res);
            return true;
        // Index Requests (this is a special case because the login/signup will redirect to the index and there will be no cookie generated then)
        case req.url === '/':
            handleIndexRequest(req, res);
            return true;
    }
    return false;
}

module.exports = {handleUnauthentificatedRequests}