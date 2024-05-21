const cookieHandler = require('../cookieHandler');

const logoutUser = (req, res, next) => {
    //parsarea tokenului din header(care arata asa: Bearer {TOKEN})
    if(!cookieHandler.clearSessionId(req))
    {
        console.log('Error on logout! Session cookie not found.');
    }
    res.setHeader('Set-Cookie', 'sessionId=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT path=/'); // Delete cookie by setting an expired date
    next();
};

module.exports = logoutUser;