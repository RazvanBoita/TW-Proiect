const crypto = require('crypto');

function generateSessionId()
{
    return crypto.randomBytes(16).toString('base64');
}
function checkSessionId(req)
{
    const cookie = req.headers.cookie || '';
    if(!cookie.includes('sessionId'))
        return false;

    // ok, cookie is valid
    return true;
}

module.exports = {
    generateSessionId,
    checkSessionId
}