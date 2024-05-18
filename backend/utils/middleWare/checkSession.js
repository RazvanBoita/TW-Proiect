const cookieHandler = require('../cookieHandler');
const Loader = require('../../loaders/Loader');
const fs = require('fs');

const checkSession = (req, res, next) => {
 
    // If the session is valid, go to next middleWare
    if(cookieHandler.checkSessionId(req))
    {
        next();
        return;
    }

    // Session is not valid
    Loader.redirect(req, res, 'login.html', '/login');
    
};

module.exports = checkSession;