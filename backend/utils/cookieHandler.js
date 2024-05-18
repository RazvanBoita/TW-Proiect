const crypto = require('crypto');

// Store sessions in memory. Warning! The session will be lost after changes(CTRL + S)
const sessions =new Map();

function generateSessionId()
{
    return crypto.randomBytes(16).toString('base64');
}
function checkSessionId(req)
{
    const cookie = req.headers.cookie || '';
    if(!cookie.includes('sessionId'))
        return false;

    const rawCookie = getRawCookie(req, 'sessionId=');
    if(!sessions.has(rawCookie))
    {
        return false;
    }
    // ok, cookie is valid
    return true;
}
function setSessionId(res, userData)
{
    const sessionId = generateSessionId();
    sessions.set(sessionId, userData);
    res.setHeader('Set-Cookie', 'sessionId=' + sessionId + '; HttpOnly; Max-Age:86400');  //1 day cookie session
}

function clearSessionId(req)
{
    const rawCookie = getRawCookie(req, 'sessionId=');
    if(!sessions.has(rawCookie))
    {
        return false;
    }
    sessions.delete(rawCookie);
    return true;
}

// Returns the actual cookie id(without the name of the cookie)
// The cookieName should be the name of the cookie, followed by = (ex: sessionId=)
function getRawCookie(req, cookieName)
{
    const cookie = req.headers.cookie || '';
    return cookie === '' ? cookie : cookie.split(cookieName)[1].trim();
}

function getUserData(req)
{
    const rawCookie = getRawCookie(req, 'sessionId=');
    return sessions.get(rawCookie);
}

function isUserAdmin(req)
{
    const userData = getUserData(req);
    return userData.isAdmin === 1 ? true : false;
}

module.exports = {
    generateSessionId,
    checkSessionId,
    clearSessionId,
    getRawCookie,
    getUserData,
    isUserAdmin,
    setSessionId,
    sessions
}