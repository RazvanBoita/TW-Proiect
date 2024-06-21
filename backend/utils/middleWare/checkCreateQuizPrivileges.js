const cookieHandler = require('../cookieHandler');
const Loader = require('../../loaders/Loader'); 
const checkCreateQuizPrivileges = (req, res, next) => {
 
    //Daca e admin sau daca a terminat quiz-ul
    if(cookieHandler.isUserAdmin(req) || cookieHandler.hasCompletedQuiz(req))
    {
        next();
        return;
    }

    // Not valid
    Loader.redirect(req, res, 'forbidden.html', '/forbidden');
    
};
module.exports = checkCreateQuizPrivileges;