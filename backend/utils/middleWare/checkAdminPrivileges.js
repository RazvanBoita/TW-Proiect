const cookieHandler = require('../cookieHandler');
const Loader = require('../../loaders/Loader'); 
const checkAdminPrivileges = (req, res, next) => {
 
    // If the session is valid, go to next middleWare
    if(cookieHandler.isUserAdmin(req))
    {
        next();
        return;
    }

    // Session is not valid
    Loader.redirect(req, res, 'forbidden.html', '/forbidden');
    
};
module.exports = checkAdminPrivileges;