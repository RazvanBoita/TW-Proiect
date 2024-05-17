const { parse } = require('querystring'); 
const cookieHandler = require('../../utils/cookieHandler');
const UserService = require('../../services/userService');
const UserData = require('../../models/userData');
const crypto = require('crypto');

// Middleware function to check if user email and password exist
const checkCredentialsExist = async (req, res, next) => {
    let body = '';
    
    // Collect data from the request's readable stream
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        try {
            const { email, password } = parse(body);

            // Check if the user exists in the database based on the provided email
            const result = await UserService.getUser(email);

            if(!result)
            {
                // If user does not exist, respond with an error message
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Error at sql query' }));
            }
            
            // If the result length is 0, it means the query did not find the user
            if (result.length === 0)
            {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Invalid credentials' }));
            }

            const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
            if(hashedPassword !== result[0].password)
            {
                res.writeHead(401, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Forbidden!' }));
            }
            
            const userData = new UserData(result[0].idUser, result[0].name, result[0].email, result[0].isAdmin);
            const sessionId = cookieHandler.generateSessionId();
            cookieHandler.sessions.set(sessionId, userData);
            res.setHeader('Set-Cookie', 'sessionId=' + sessionId + '; HttpOnly; Max-Age:86400');  //1 day cookie session
            
            next();

        } catch (error) {
            // If an error occurs while checking the credentials, respond with an error message
            console.error('Error checking user credentials:', error);
            res.writeHead(500, 'Content-Type', 'text/plain');
            return res.end('Forbidden: ' + error);
        }
    });
};
module.exports = checkCredentialsExist;